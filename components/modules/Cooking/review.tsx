import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import StarEmpty from "@/assets/svgs/star-empty.svg";
import StarReview from "@/assets/svgs/star-review.svg";
import { Button, ButtonText } from "@/components/ui/button";

const Review = () => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const handleSelection = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const handleRate = () => {
    console.log("will handle");
  };

  const buttons = [
    "Easy and tasty",
    "A bit bland",
    "Flexitarian",
    "Paleo",
    "Vegetarian",
    "Pescatarian",
    "Vegan",
  ];
  return (
    <View className="flex flex-col w-full h-full py-4 px-6">
      <Text className="font-bold text-2xl leading-8 text-foreground text-center mb-4 mt-8">
        Rate Recipes
      </Text>
      <View className="flex flex-row justify-center gap-1.5 mt-5">
        <StarReview />
        <StarReview />
        <StarReview />
        <StarReview />
        <StarEmpty />
      </View>
      <View className="flex flex-row flex-wrap gap-4 mt-12">
        {buttons?.map((btn, index) => {
          const isSelected = selectedIndexes.includes(index);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelection(index)}
            >
              <View className="mb-2">
                <Text
                  className={` font-bold leading-6 py-4 px-6 rounded-2xl ${
                    isSelected
                      ? "text-background bg-secondary"
                      : "text-foreground bg-background border-2 border-primary/65"
                  }`}
                >
                  {btn}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <View className="mt-auto">
        <Button action="secondary" className="w-full h-16" onPress={handleRate}>
          <ButtonText>Rate</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default Review;
