import React from "react";
import { Image, View } from "react-native";
import { Text } from "react-native";

import Stars from "@/assets/svgs/star.svg";
import { ScrollView } from "react-native-gesture-handler";

const Review = () => {
  const ReviewDetails = [
    {
      id: 1,
      name: "Daisy Murphy",
      date: "July, 23 2023",
      reviewText: "Easy and Tasty",
    },
    {
      id: 2,
      name: "Maiki",
      date: "July, 23 2023",
      reviewText: "Kid-approved",
    },
  ];

  return (
    <ScrollView
      className="py-6 px-7 h-80 rounded-3xl"
      style={{
        boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
      }}
    >
      <Text className="text-primary font-bold text-2xl leading-6 mb-4">
        Review
      </Text>

      {ReviewDetails.map((review, index) => {
        return (
          <View
            key={index}
            className={`${index == ReviewDetails.length - 1 ? "" : " mb-5"}`}
          >
            <View className="flex flex-row justify-between items-center mb-5">
              <View className="flex flex-row gap-4">
                <Image
                  source={require("@/assets/images/review-person1.png")}
                  className="w-14 h-14"
                />
                <View>
                  <Text className="font-semibold text-base leading-5 mb-1.5 text-primary">
                    {review.name}
                  </Text>
                  <Text className="text-muted text-sm">{review.date}</Text>
                </View>
              </View>

              <View className="flex flex-row gap-0.5">
                <Stars />
              </View>
            </View>
            <Text className="leading-6 font-semibold text-lg text-primary mb-4">
              {review.reviewText}
            </Text>

            {index !== ReviewDetails.length - 1 && (
              <View className="w-full h-[2px] bg-accent"></View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Review;
