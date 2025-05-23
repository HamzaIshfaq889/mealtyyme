import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FilePenLine, Trash } from "lucide-react-native";
import { router } from "expo-router";
import { capitalizeFirstLetter } from "@/utils";

type RecipeCollectionCardProps = {
  id: number;
  title: string;
  recipeCount: number;
  imageUrl: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  recipes: number[];
};

export default function RecipeCollectionCard({
  id,
  imageUrl,
  onDelete,
  onEdit,
  recipeCount,
  title,
  recipes,
}: RecipeCollectionCardProps) {
  return (
    <TouchableOpacity
      className="w-[48%] bg-card px-3.5 pt-6 pb-4 rounded-3xl mb-4"
      onPress={() =>
        router.push({
          pathname: `/(protected)/(nested)/cookbookRecipes` as any,
          params: {
            recipes: JSON.stringify(recipes),
            cookbookId: id,
            cookbookName: title,
            cookBookImage: imageUrl,
          },
        })
      }
    >
      <View className="flex flex-row items-center justify-between">
        <Image
          source={{ uri: imageUrl }}
          className="w-[72px] h-[72px] rounded-md"
          resizeMode="cover"
        />

        <View className="flex flex-row gap-5">
          <FilePenLine color="#ee8427" size={24} onPress={() => onEdit(id)} />
          <Trash color="#ee8427" size={24} onPress={() => onDelete(id)} />
        </View>
      </View>

      <View>
        <Text className="text-foreground font-semibold text-xl mt-4 mb-1">
          {capitalizeFirstLetter(title)}
        </Text>
        <Text className="text-muted text-sm font-medium">
          {recipeCount} Recipes
        </Text>
      </View>
    </TouchableOpacity>
  );
}
