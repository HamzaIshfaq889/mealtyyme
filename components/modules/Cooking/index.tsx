import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { router } from "expo-router";

import {
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { stopCooking } from "@/redux/slices/recipies";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { ArrowLeft, Logs, Pause, Play, Plus } from "lucide-react-native";

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

const Cooking = () => {
  const dispatch = useDispatch();
  const currentRecipe: Recipe = useSelector(
    (state: any) => state.recipe.cookingRecipe
  );

  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const bottomSheetRef = useRef<BottomSheet>(null);
  const reviewBottomSheetRef = useRef<BottomSheet>(null);

  const [showTimerModal, setShowTimerModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [isTimerComplete, setIsTimerComplete] = useState(true);
  const [key, setKey] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [isAllStepsComplete, setISAllStepsComplete] = useState(false);

  const progress = (currentStep / currentRecipe?.instructions.length) * 100;

  const toggleTimer = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNextStep = () => {
    if (currentStep < currentRecipe?.instructions.length) {
      setCurrentStep(currentStep + 1);
      return;
    }
    setISAllStepsComplete(true);
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStopCooking = () => { 
    dispatch(stopCooking());
    router.push("/(protected)/(tabs)");
  };

  return (
    <View className="flex flex-col w-full h-full px-9 py-16 bg-background">
      <View className="flex flex-row justify-between items-center mb-12">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="flex-1 mx-4 font-bold text-2xl text-foreground w-48"
          >
            {currentRecipe?.title}
          </Text>
        </View>

        <Pressable onPress={() => bottomSheetRef.current?.snapToIndex(2)}>
          <Logs color={isDarkMode ? "#fff" : "#000"} />
        </Pressable>
      </View>

      {!isAllStepsComplete && (
        <View>
          <Step step={currentRecipe?.instructions[currentStep - 1]} />
        </View>
      )}

      {isAllStepsComplete && (
        <StepCompleted reviewBottomSheetRef={reviewBottomSheetRef} />
      )}

      <View className="mt-auto">
        {!isAllStepsComplete && (
          <View>
            {!isTimerComplete && (
              <View className="mb-10 mx-auto">
                <CountdownCircleTimer
                  key={key}
                  isPlaying={isPlaying}
                  duration={duration * 60}
                  colors={["#00C3FF"] as any}
                  strokeWidth={8}
                  onComplete={() => {
                    setIsTimerComplete(true);
                  }}
                >
                  {({ remainingTime }) => {
                    const minutes = Math.floor(remainingTime / 60);
                    const seconds = remainingTime % 60;
                    const formattedTime = `${minutes}:${seconds
                      .toString()
                      .padStart(2, "0")}`;
                    return (
                      <View className="flex flex-col items-center gap-3">
                        {!isPlaying ? (
                          <Pressable
                            onPress={toggleTimer}
                            className="bg-foreground p-2.5 flex justify-center items-center rounded-full"
                          >
                            <Play
                              color={scheme === "dark" ? "#000" : "#fff"}
                              size={30}
                            />
                          </Pressable>
                        ) : (
                          <Pressable
                            onPress={toggleTimer}
                            className="bg-foreground p-2.5 flex justify-center items-center rounded-full"
                          >
                            <Pause
                              color={scheme === "dark" ? "#000" : "#fff"}
                              size={30}
                              onPress={toggleTimer}
                            />
                          </Pressable>
                        )}
                        <Text className="text-xl text-primary">
                          {formattedTime}
                        </Text>
                      </View>
                    );
                  }}
                </CountdownCircleTimer>
              </View>
            )}

            {isTimerComplete && (
              <View className="mb-6 mx-auto">
                <Button
                  action="secondary"
                  className="h-16 bg-background w-48"
                  onPress={() => setShowTimerModal(true)}
                >
                  <View className="flex flex-row items-center justify-center gap-2 w-8 h-8 p-2 rounded-full bg-secondary">
                    <Plus color="#fff" />
                  </View>
                  <ButtonText className="!text-foreground font-medium">
                    Add Timer
                  </ButtonText>
                </Button>
              </View>
            )}
          </View>
        )}

        <View className="flex flex-row justify-between items-center mb-4">
          <Text className="font-bold text-secondary leaidng-5 text-lg">
            Step
          </Text>
          <Text className="font-bold text-secondary leaidng-5 text-lg">{`${currentStep} of ${currentRecipe?.instructions?.length}`}</Text>
        </View>

        <View>
          <Slider
            size="lg"
            orientation="horizontal"
            isDisabled={false}
            isReversed={false}
            value={progress}
            className="mb-4"
          >
            <SliderTrack className="!h-3">
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </View>

        {!isAllStepsComplete ? (
          <View className="flex flex-row gap-2">
            <Button
              action="muted"
              className="basis-1/2 h-16"
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
              <ButtonText>Next Step</ButtonText>
            </Button>
          </View>
        ) : (
          <View>
            <Button
              action="secondary"
              className="w-full h-16"
              onPress={handleStopCooking}
            >
              <ButtonText>Complete Cooking</ButtonText>
            </Button>
          </View>
        )}
      </View>

      {/* Rendering modal and bottomsheet */}
      {showTimerModal && (
        <AddTimerModal
          setIsTimerComplete={setIsTimerComplete}
          setIsPlaying={setIsPlaying}
          setDuration={setDuration}
          showTimerModal={showTimerModal}
          setShowTimerModal={setShowTimerModal}
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["20%", "50%", "80%"]}
        backdropComponent={BottomSheetBackdrop}
        handleStyle={{
          backgroundColor: isDarkMode ? "#1f242a" : "#fff",
        }}
        handleIndicatorStyle={{
          backgroundColor: isDarkMode ? "#888" : "#ccc",
        }}
        onChange={(index) => {
          if (index === -1 || index === 0) {
            bottomSheetRef.current?.close();
          }
        }}
      >
        <BottomSheetScrollView>
          <AllSteps steps={currentRecipe?.instructions} />
        </BottomSheetScrollView>
      </BottomSheet>

      <BottomSheet
        ref={reviewBottomSheetRef}
        index={-1}
        snapPoints={["20%", "50%", "80%"]}
        backdropComponent={BottomSheetBackdrop}
        onChange={(index) => {
          if (index === -1 || index === 0) {
            reviewBottomSheetRef.current?.close();
          }
        }}
        handleStyle={{
          backgroundColor: isDarkMode ? "#1f242a" : "#fff",
        }}
        handleIndicatorStyle={{
          backgroundColor: isDarkMode ? "#888" : "#ccc",
        }}
      >
        <BottomSheetView>
          <Review
            currentRecipeId={currentRecipe?.id}
            bottomSheetRef={reviewBottomSheetRef}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default Cooking;
