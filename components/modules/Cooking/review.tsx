import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import StarEmpty from "@/assets/svgs/star-empty.svg";
import StarReview from "@/assets/svgs/star-review.svg";
import { Button, ButtonText } from "@/components/ui/button";
import { Star } from "lucide-react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { addReview } from "@/services/recipesAPI";

type ReviewProps = {
  currentRecipeId: number;
  bottomSheetRef: React.RefObject<BottomSheet>;
};

const Review = ({ currentRecipeId, bottomSheetRef }: ReviewProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Changed to single index
  const [starRating, setStarRating] = useState<number>(0);

  console.log("id", currentRecipeId);

  const handleSelection = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(null); // Deselect if same button is clicked
    } else {
      setSelectedIndex(index); // Select new button
    }
    handleRate(); // Trigger the review submission automatically when text is selected
  };

  const handleStarRating = (rating: number) => {
    setStarRating(rating);
  };

  const handleRate = async () => {
    try {
      // Get the selected tag text if any
      const reviewText =
        selectedIndex !== null ? buttons[selectedIndex] : undefined;
      console.log("Rating:", currentRecipeId);
      // Call the API to submit the review
      await addReview({
        recipeId: currentRecipeId,
        rating: starRating,
        reviewText: reviewText,
      });

      console.log("Review submitted successfully");
      console.log("Rating:", starRating);
      console.log("Tag:", reviewText || "None");

      // Close the bottom sheet
      bottomSheetRef.current?.close();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
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
    <View className="flex flex-col w-full h-full py-4 px-6 bg-background">
      <Text className="font-bold text-2xl leading-8 text-foreground text-center mb-4 mt-8">
        Rate Recipe
      </Text>

      {/* Star Review Component */}
      <View className="flex flex-row justify-center gap-1.5 mt-5">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <TouchableOpacity
            key={starIndex}
            onPress={() => handleStarRating(starIndex)}
          >
            {starIndex <= starRating ? (
              <Star fill={"#e8b015"} stroke={"#e8b015"} />
            ) : (
              <Star fill={"transparent"} stroke={"#e8b015"} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Buttons for additional reviews */}
      <View className="flex flex-row flex-wrap gap-4 mt-12">
        {buttons?.map((btn, index) => {
          const isSelected = selectedIndex === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelection(index)}
            >
              <View className="mb-2">
                <Text
                  className={`font-bold leading-6 py-4 px-6 rounded-2xl ${
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
    </View>
  );
};

export default Review;
