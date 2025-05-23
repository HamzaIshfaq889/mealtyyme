import React, { useState } from "react";

import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

import { Star } from "lucide-react-native";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { addReview } from "@/services/recipesAPI";
import { ReviewButtons } from "@/utils";
import Toast from "react-native-toast-message";

type ReviewProps = {
  currentRecipeId: number;
  bottomSheetRef: React.RefObject<BottomSheet>;
};

const Review = ({ currentRecipeId, bottomSheetRef }: ReviewProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [starRating, setStarRating] = useState<number>(0);
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const handleSelection = (index: number) => {
    const newIndex = selectedIndex === index ? null : index;
    setSelectedIndex(newIndex);
    handleRate(newIndex);
  };

  const handleStarRating = (rating: number) => {
    setStarRating(rating);
  };

  const handleRate = async (index: number | null) => {
    try {
      const reviewText = index !== null ? ReviewButtons[index] : undefined;

      if (!reviewText || !starRating) {
        Toast.show({
          type: "error",
          text1: "Please select text and rating to add review!",
        });
        return;
      }

      console.log("aaaa", reviewText, currentRecipeId, starRating);

      await addReview({
        recipeId: currentRecipeId,
        rating: starRating,
        reviewText,
      });

      bottomSheetRef.current?.close();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={["20%", "50%", "80%"]}
      handleStyle={{
        backgroundColor: isDarkMode ? "#1c1c1c" : "#fdf8f4",
        borderWidth: 0,
      }}
      handleIndicatorStyle={{
        backgroundColor: isDarkMode ? "#888" : "#ccc",
      }}
      backdropComponent={BottomSheetBackdrop}
      enablePanDownToClose
    >
      <BottomSheetView>
        <View className="flex flex-col w-full h-full py-4 px-6 bg-background">
          <Text className="font-bold text-2xl leading-8 text-foreground text-center mb-4 mt-8">
            Rate Recipe
          </Text>

          <View className="flex flex-row justify-center gap-1.5 mt-5">
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <TouchableOpacity
                key={starIndex}
                onPress={() => handleStarRating(starIndex)}
              >
                {starIndex <= starRating ? (
                  <Star fill={"#e8b015"} stroke={"#e8b015"} size={30} />
                ) : (
                  <Star fill={"transparent"} stroke={"#e8b015"} size={30} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex flex-row flex-wrap gap-4 mt-12">
            {ReviewButtons?.map((btn, index) => {
              const isSelected = selectedIndex === index;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelection(index)}
                >
                  <View className="mb-2">
                    <Text
                      className={`font-bold leading-6 py-4 px-6 rounded-2xl bg-card  ${
                        isSelected
                          ? "text-white bg-secondary"
                          : "text-foreground bg-background border border-accent"
                      }`}
                    >
                      {btn}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default Review;
