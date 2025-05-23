import React from "react";
import { Image, useColorScheme, View } from "react-native";
import { Text } from "react-native";

import Stars from "@/assets/svgs/star.svg";
import { ScrollView } from "react-native-gesture-handler";
import { Recipe } from "@/lib/types/recipe";
import { CircleUserRound, Star } from "lucide-react-native";

type ReviewProps = {
  review: Recipe["reviews"];
};

const Review = ({ review }: ReviewProps) => {
  const scheme = useColorScheme();
  const isDarkTheme = scheme === "dark";

  // const ReviewDetails = [
  //   {
  //     id: 1,
  //     name: "Daisy Murphy",
  //     date: "July, 23 2023",
  //     reviewText: "Easy and Tasty",
  //   },
  //   {
  //     id: 2,
  //     name: "Maiki",
  //     date: "July, 23 2023",
  //     reviewText: "Kid-approved",
  //   },
  //   {
  //     id: 3,
  //     name: "Daisy Murphy",
  //     date: "July, 23 2023",
  //     reviewText: "Easy and Tasty",
  //   },
  //   {
  //     id: 4,
  //     name: "Maiki",
  //     date: "July, 23 2023",
  //     reviewText: "Kid-approved",
  //   },
  //   {
  //     id: 5,
  //     name: "Daisy Murphy",
  //     date: "July, 23 2023",
  //     reviewText: "Easy and Tasty",
  //   },
  //   {
  //     id: 6,
  //     name: "Maiki",
  //     date: "July, 23 2023",
  //     reviewText: "Kid-approved",
  //   },
  // ];

  return (
    <ScrollView
      className="pt-6 px-6 h-80 mt-8 rounded-3xl bg-card"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-primary font-bold text-2xl leading-14 mb-4">
        Reviews
      </Text>

      {review.map((rev, index) => {
        return (
          <View
            key={index}
            className={`pb-6 border-b border-accent/10 hover:border-accent/30 transition-all duration-300 ease-in-out`}
          >
            {/* Header with user info and rating */}
            <View className="flex flex-row justify-between items-start mb-1">
              {/* User Section */}
              <View className="flex flex-row gap-3 items-center">
                {rev?.user.image_url ? (
                  <Image
                    source={{ uri: rev?.user?.image_url }}
                    className="w-12 h-12 rounded-full shadow-md"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="p-2 rounded-full bg-secondary/10">
                    <CircleUserRound
                      size={32}
                      strokeWidth={1.5}
                      color={scheme === "dark" ? "#fff" : "#000"}
                    />
                  </View>
                )}

                <View className="ml-1">
                  <Text className="font-medium text-lg text-primary">
                    {rev?.user.first_name || "Anonymous User"}
                  </Text>
                </View>
              </View>

              {/* Star Rating */}
              <View className="flex flex-row gap-1 items-center bg-accent/5 px-2 py-1 mt-2 rounded-full">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    fill={i < rev.rating ? "#e8b015" : "transparent"}
                    stroke={i < rev.rating ? "#e8b015" : "#e8b015"}
                    size={18}
                  />
                ))}
                <Text className="ml-1 text-sm font-medium text-foreground">
                  {rev.rating.toFixed(1)}
                </Text>
              </View>
            </View>

            {/* Review Text */}
            <Text className="text-primary/90 leading-relaxed text-base mb-4">
              {rev?.review_text}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Review;
