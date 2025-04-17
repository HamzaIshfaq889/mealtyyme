import React, { useEffect, useRef } from "react";

import { Text, View } from "react-native";

import Dish from "@/assets/svgs/Dish.svg";
import Confetti from "@/assets/svgs/confetti.svg";
import ConfettiRight from "@/assets/svgs/confetti-right.svg";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

type StepCompletedProps = {
  reviewBottomSheetRef: any;
};

const StepCompleted = ({ reviewBottomSheetRef }: StepCompletedProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    reviewBottomSheetRef.current?.snapToIndex(2);
  }, []);

  return (
    <View className="absolute flex flex-row justify-center items-center py-40 left-0 right-0 top-[12%]">
      <View className="flex flex-col items-center">
        <Dish />
        <View className="mt-10">
          <Text className="text-center text-foreground font-bold text-3xl">
            Hurray!
          </Text>
          <Text className="text-lg text-primary/85 max-w-60 text-center mt-4">
            All steps are completed. Enjoy your meal!
          </Text>
        </View>
      </View>
      <View className="absolute left-0">
        <Confetti />
      </View>
      <View className="absolute right-0">
        <ConfettiRight />
      </View>
    </View>
  );
};

export default StepCompleted;
