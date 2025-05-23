import React from "react";
import { ArrowRight, Clock, Flame, Star, Trash } from "lucide-react-native";

import { Image, Text, TouchableOpacity, View } from "react-native";
import { Recipe } from "@/lib/types/recipe";
import { router } from "expo-router";

type HorizontalRecipeCardProps = {
  recipe: Recipe;
  showDelete?: boolean;
  onDelete?: (id: number) => void;
};

const HorizontalRecipeCard = ({
  recipe,
  showDelete,
  onDelete,
}: HorizontalRecipeCardProps) => {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/recipe/${recipe?.id}` as const)}
    >
      <View className="flex flex-row justify-between items-center p-4 rounded-2xl mb-5 bg-card">
        <View className="flex flex-row gap-4 flex-1">
          <View className="relative">
            <Image
              source={{ uri: recipe?.image_url }}
              className="w-24 h-24 rounded-xl"
              resizeMode="cover"
            />
            {recipe?.is_featured && (
              <View className="absolute top-1 right-1 bg-yellow-400 p-1 rounded-full">
                <Star color="#fff" size={14} />
              </View>
            )}
          </View>

          <View className="flex flex-col justify-between flex-1">
            <View>
              <Text
                className="font-bold text-lg mb-1 text-primary"
                numberOfLines={1}
              >
                {recipe?.title || "N/A"}
              </Text>

              <View className="flex flex-row items-center gap-2 mb-2">
                <Image
                  source={{ uri: recipe?.created_by.image_url }}
                  className="w-5 h-5 rounded-full"
                />
                <Text className="text-secondary text-sm font-semibold">
                  {recipe?.created_by.first_name} {recipe?.created_by.last_name}
                </Text>
              </View>
            </View>

            <View className="flex flex-row gap-3">
              <View className="flex flex-row items-center gap-1">
                <Clock color="#6b7280" size={16} />
                <Text className="text-muted text-sm">
                  {recipe?.ready_in_minutes} min
                </Text>
              </View>

              <View className="flex flex-row items-center gap-1">
                <Flame color="#6b7280" size={16} />
                <Text className="text-muted text-sm">
                  {Math.ceil(recipe?.calories)} Kcal
                </Text>
              </View>
            </View>
          </View>
        </View>

        {showDelete && onDelete ? (
          <Trash
            color="#ee8427"
            size={30}
            onPress={() => onDelete(recipe?.id)}
          />
        ) : (
          <View className="ml-2 p-2 bg-secondary rounded-full">
            <ArrowRight color="#fff" size={18} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default HorizontalRecipeCard;
