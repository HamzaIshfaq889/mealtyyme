// step.tsx
import React, { useEffect, useState } from "react";
import { Instruction } from "@/lib/types/recipe";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { Pause, Play, Plus } from "lucide-react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Button, ButtonText } from "@/components/ui/button";
import { convertMinutesToTimeLabel, humanizeMinuteSecond } from "@/utils";

type StepProps = {
  step: Instruction;
  timer: {
    duration: number;
    startTime: number;
    pausedSecs: number;
    isPlaying: boolean;
    isComplete: boolean;
    key: number;
  };
  onToggle: () => void;
  onComplete: () => void;
  onAdd: () => void;
};

const Step = ({ step, timer, onToggle, onComplete, onAdd }: StepProps) => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  // compute remaining seconds whenever we render
  const [remaining, setRemaining] = useState<number>(timer?.duration * 60);

  useEffect(() => {
    const updateRemaining = () => {
      const now = Date.now();
      const elapsedSinceStart = timer?.isPlaying
        ? (now - timer?.startTime) / 1000
        : 0;
      const totalElapsed = timer?.pausedSecs + elapsedSinceStart;
      const rem = Math.max(timer?.duration * 60 - totalElapsed, 0);
      setRemaining(rem);
    };

    // update immediately
    updateRemaining();

    let interval: number | undefined;
    if (timer?.isPlaying && !timer.isComplete) {
      interval = setInterval(updateRemaining, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    timer?.duration,
    timer?.startTime,
    timer?.pausedSecs,
    timer?.isPlaying,
    timer?.isComplete,
  ]);

  return (
    <View>
      <Text className="text-center font-bold text-xl mb-8 text-foreground">
        Step {step?.step_number}
      </Text>
      <Text className="text-lg mb-6 text-foreground">{step?.step_text}</Text>

      {/* show countdown if it's been set and not complete */}
      {timer?.duration > 0 && !timer?.isComplete ? (
        <View className="mb-10 mx-auto">
          <CountdownCircleTimer
            key={timer?.key}
            // feed it the *current* remaining seconds as the duration
            duration={remaining}
            isPlaying={false /* we drive it manually with remaining */}
            initialRemainingTime={remaining}
            colors={["#00C3FF"] as any}
            strokeWidth={8}
            onComplete={() => {
              onComplete();
              return { shouldRepeat: false };
            }}
          >
            {() => {
              const min = Math.floor(remaining / 60);
              const sec = Math.floor(remaining % 60);
              const fmt = `${min}:${sec.toString().padStart(2, "0")}`;
              return (
                <View className="items-center">
                  <Pressable
                    onPress={onToggle}
                    className="bg-foreground p-3 rounded-full mb-2"
                  >
                    {timer?.isPlaying ? (
                      <Pause color={isDark ? "#000" : "#fff"} size={24} />
                    ) : (
                      <Play color={isDark ? "#000" : "#fff"} size={24} />
                    )}
                  </Pressable>
                  {/* <Text className="text-xl text-primary">{fmt}</Text> */}
                  <Text className="text-xl text-primary">
                    {humanizeMinuteSecond(fmt)}
                  </Text>
                </View>
              );
            }}
          </CountdownCircleTimer>
        </View>
      ) : (
        <View className="mb-6 mx-auto">
          <Button action="secondary" className="h-16 w-48" onPress={onAdd}>
            <Plus color="#fff" />
            <ButtonText className="!text-white">Add Timer</ButtonText>
          </Button>
        </View>
      )}
    </View>
  );
};

export default Step;
