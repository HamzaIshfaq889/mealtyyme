// Cooking.tsx
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { stopCooking } from "@/redux/slices/recipies";
import BottomSheet from "@gorhom/bottom-sheet";
import { ArrowLeft, Logs } from "lucide-react-native";
import { Recipe } from "@/lib/types/recipe";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Slider,
  SliderThumb,
  SliderTrack,
  SliderFilledTrack,
} from "@/components/ui/slider";
import Step from "./step";
import AllSteps from "./allSteps";
import StepCompleted from "./stepCompleted";
import Review from "./review";
import AddTimerModal from "./addTimerModal";
import {
  clearCookingRecipe,
  clearStepTimers,
  loadStepTimers,
  saveCookingPrivacy,
  saveStepTimers,
} from "@/utils/storage/cookingStorage";

type TimerState = {
  duration: number;
  startTime: number;
  pausedSecs: number;
  isPlaying: boolean;
  isComplete: boolean;
  key: number;
};

const Cooking = () => {
  const dispatch = useDispatch();
  const currentRecipe: Recipe = useSelector(
    (state: any) => state?.recipe?.cookingRecipe
  );
  const isPrivateRecipe: boolean = useSelector(
    (state: any) => state?.recipe?.isCookingPrivate
  );
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const stepsBottomSheetRef = useRef<BottomSheet>(null);
  const reviewBottomSheetRef = useRef<BottomSheet>(null);

  const [stepTimers, setStepTimers] = useState<Record<number, TimerState>>({});
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isAllStepsComplete, setISAllStepsComplete] = useState(false);
  const [timersLoading, setTimersLoading] = useState(true);

  const customerId = useSelector(
    (state: any) => state?.auth?.loginResponseType?.customer_details?.id
  );

  useEffect(() => {
    setTimersLoading(true);
    loadStepTimers(customerId)
      .then((saved) => {
        setStepTimers(saved);
      })
      .finally(() => {
        setTimersLoading(false);
      });
  }, []);

  useEffect(() => {
    saveStepTimers(customerId, stepTimers);
  }, [stepTimers]);

  // Ensure a TimerState exists when switching to a new step
  useEffect(() => {
    if (!stepTimers[currentStep]) {
      setStepTimers((prev) => ({
        ...prev,
        [currentStep]: {
          duration: 0,
          startTime: 0,
          pausedSecs: 0,
          isPlaying: false,
          isComplete: false,
          key: Date.now(),
        },
      }));
    }
  }, [currentStep]);

  const progress = (currentStep / currentRecipe?.instructions?.length) * 100;

  const handleNextStep = () => {
    if (currentStep < currentRecipe?.instructions?.length) {
      setCurrentStep((s) => s + 1);
    } else {
      setISAllStepsComplete(true);
    }
  };
  const handleBackStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };
  const handleStopCooking = async () => {
    router.push("/(protected)/(tabs)");

    dispatch(stopCooking());
    await clearCookingRecipe(customerId);
    await saveCookingPrivacy(customerId, false);
    await clearStepTimers(customerId);
  };

  const updateTimer = (updates: Partial<TimerState>) => {
    setStepTimers((prev) => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        ...updates,
      },
    }));
  };

  // toggle play/pause and accumulate pausedSecs
  const handleToggle = () => {
    const t = stepTimers[currentStep];
    if (!t) return;
    if (t?.isPlaying) {
      const elapsed = (Date.now() - t?.startTime) / 1000;
      updateTimer({
        isPlaying: false,
        pausedSecs: t?.pausedSecs + elapsed,
      });
    } else {
      updateTimer({
        isPlaying: true,
        startTime: Date.now(),
      });
    }
  };

  return (
    <>
      <View className="flex flex-col w-full h-full px-9 pt-16 pb-4 bg-background">
        {/* Header */}
        <View className="flex flex-row justify-between items-center mb-12">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft
              width={30}
              height={30}
              color={isDarkMode ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="flex-1 mx-4 font-bold text-2xl text-foreground w-48"
          >
            {currentRecipe?.title}
          </Text>
          <Pressable
            onPress={() => stepsBottomSheetRef.current?.snapToIndex(1)}
          >
            <Logs color={isDarkMode ? "#fff" : "#000"} />
          </Pressable>
        </View>

        <ScrollView>
          {!isAllStepsComplete ? (
            <Step
              step={currentRecipe?.instructions[currentStep - 1]}
              timer={stepTimers[currentStep]!}
              onToggle={handleToggle}
              onComplete={() =>
                updateTimer({ isComplete: true, duration: 0, key: Date.now() })
              }
              onAdd={() => {
                if (!timersLoading) {
                  setShowTimerModal(true);
                }
              }}
            />
          ) : (
            <StepCompleted reviewBottomSheetRef={reviewBottomSheetRef} />
          )}
        </ScrollView>

        <View className="mt-auto pb-6">
          <Text className="font-bold text-secondary text-lg mb-2">
            Step {currentStep} of {currentRecipe?.instructions?.length}
          </Text>
          <Slider size="lg" value={progress} className="mb-4">
            <SliderTrack className="!h-3">
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          {!isAllStepsComplete ? (
            <View className="flex flex-row gap-2">
              <Button
                action="muted"
                className="basis-1/2 h-16 bg-accent"
                onPress={handleBackStep}
                disabled={currentStep === 1}
              >
                <ButtonText>Back</ButtonText>
              </Button>
              <Button
                action="secondary"
                className="basis-1/2 h-16"
                onPress={handleNextStep}
              >
                <ButtonText className="!text-white">Next Step</ButtonText>
              </Button>
            </View>
          ) : (
            <Button
              action="secondary"
              className="w-full h-16"
              onPress={handleStopCooking}
            >
              <ButtonText className="!text-white">Complete Cooking</ButtonText>
            </Button>
          )}
        </View>
      </View>

      {showTimerModal && (
        <AddTimerModal
          showTimerModal={showTimerModal}
          setShowTimerModal={setShowTimerModal}
          setDuration={(min, startTs) =>
            updateTimer({
              duration: min,
              startTime: startTs,
              pausedSecs: 0,
              isPlaying: true,
              isComplete: false,
              key: Date.now(),
            })
          }
        />
      )}

      <AllSteps
        steps={currentRecipe?.instructions}
        bottomSheetRef={stepsBottomSheetRef as any}
      />

      {!isPrivateRecipe && (
        <Review
          currentRecipeId={currentRecipe?.id}
          bottomSheetRef={reviewBottomSheetRef as any}
        />
      )}
    </>
  );
};

export default Cooking;
