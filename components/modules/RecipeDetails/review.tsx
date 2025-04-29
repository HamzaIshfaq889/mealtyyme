import React from "react";
import { Image, useColorScheme, View } from "react-native";
import { Text } from "react-native";

import Stars from "@/assets/svgs/star.svg";
import { ScrollView } from "react-native-gesture-handler";
import { Recipe } from "@/lib/types/recipe";
import { Star } from "lucide-react-native";

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
      className="pt-6 px-6 h-80 mt-8 rounded-3xl bg-accent"
      showsVerticalScrollIndicator={false}
      style={{
        boxShadow: isDarkTheme
          ? "0px 2px 12px 0px rgba(0,0,0,0.4)"
          : "0px 2px 12px 0px rgba(0,0,0,0.1)",
      }}
    >
      <Text className="text-primary font-bold text-2xl leading-6 mb-4">
        Review
      </Text>

      {review.map((rev, index) => {
        return (
          <View
            key={index}
            className={`${index == review.length - 1 ? "mb-12" : " mb-5"}`}
          >
            <View className="flex flex-row justify-between items-center mb-5">
              <View className="flex flex-row gap-4">
                <Image
                  source={require("@/assets/images/review-person1.png")}
                  className="w-14 h-14"
                />
                <View>
                  <Text className="font-semibold text-base leading-5 mb-1.5 text-primary">
                    {rev.user?.first_name || "N/A"}
                  </Text>
                  <Text className="text-muted text-base">
                    {rev?.created_at.split("T")[0]}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row gap-0.5">
                <Star fill="#e8b015" size={20} />
                {[...Array(rev.rating - 1)].map((_, index) => (
                  <Star
                    key={index}
                    fill={"#e8b015"}
                    stroke="#e8b015"
                    size={20}
                  />
                ))}
              </View>
            </View>
            <Text className="leading-6 font-semibold text-lg text-primary mb-4">
              {rev?.review_text}
            </Text>

            {index !== review.length - 1 && (
              <View className="w-full h-[2px] bg-accent"></View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Review;
