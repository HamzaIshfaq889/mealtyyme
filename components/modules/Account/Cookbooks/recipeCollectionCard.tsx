import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FilePenLine, Trash } from "lucide-react-native";
import { router } from "expo-router";

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
      className="w-[48%] bg-card px-3.5 py-6 rounded-3xl mb-4"
      onPress={() =>
        router.push({
          pathname: `/(protected)/(nested)/cookbookRecipes` as any,
          params: {
            recipes: JSON.stringify([recipes]),
          },
        })
      }
    >
      <View className="flex flex-row items-center justify-between">
        <Image
          source={{ uri: imageUrl }}
          className="w-16 h-16 rounded-md"
          resizeMode="cover"
        />

        <View className="flex flex-row gap-3">
          <FilePenLine color="#ee8427" size={23} onPress={() => onEdit(id)} />
          <Trash color="#ee8427" size={23} onPress={() => onDelete(id)} />
        </View>
      </View>

      <View>
        <Text className="text-foreground font-semibold text-xl mt-7 mb-1">
          {title}
        </Text>
        <Text className="text-muted text-base font-medium">{recipeCount}</Text>
      </View>
    </TouchableOpacity>
  );
}
