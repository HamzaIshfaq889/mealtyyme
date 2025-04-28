import React from "react";

import { Clock, Flame, Heart } from "lucide-react-native";
import { Image, Text, useColorScheme, View } from "react-native";
import { Recipe } from "@/lib/types/recipe";
import { truncateChars } from "@/utils";

type RecipeItemT = {
  recipeItem: Recipe;
};

const RecipeCard = ({ recipeItem }: RecipeItemT) => {
  const scheme = useColorScheme();

  return (
    <View
      className="bg-background rounded-2xl w-64 h-60 p-3"
      style={{
        boxShadow:
          scheme === "dark"
            ? "0px 2px 12px 0px rgba(0,0,0,0.4)"
            : "0px 2px 12px 0px rgba(0,0,0,0.2)",
      }}
    >
      <View className="relative mb-4">
        <Image
          source={{ uri: recipeItem.image_url }}
          className="h-36 w-full rounded-xl bg-gray-300"
          resizeMode="cover"
        />
        <View className="absolute top-2 right-2 bg-background rounded-md p-1.5">
          <Heart color={scheme === "dark" ? "#fff" : "#000"} size={16} />
        </View>
      </View>
      <Text className="text-foreground font-bold text-base leading-5 mb-3">
        {truncateChars(recipeItem?.title, 22)}
      </Text>

      <View className="flex flex-row items-center gap-2">
        <View className="flex flex-row items-center gap-0.5">
          <Flame color="#96a1b0" size={20} />
          <Text className="text-muted">
            {recipeItem?.nutrition?.calories || "N/A"}
          </Text>
        </View>
        <View className="bg-muted p-0.5 rounded-full"></View>
        <View className="flex flex-row items-center gap-1">
          <Clock color="#96a1b0" size={16} />
          <Text className="text-muted text-sm">
            {recipeItem?.ready_in_minutes || "N/A"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RecipeCard;
