import React, { useEffect, useState } from "react";

import { Clock } from "lucide-react-native";

import { HStack } from "@/components/ui/hstack";

import { Text, View, FlatList, Image, Pressable } from "react-native";
import { getRecipes } from "@/services/recipesAPI";
import { Recipe } from "@/lib/types/recipe";

const FeaturedRecipes = ({
  onSelectRecipe,
}: {
  onSelectRecipe?: (id: string) => void; // Modify the function type to accept the id
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <Text className="text-center mt-4">Loading featured recipes...</Text>
    );
  }

  return (
    <>
      <Text className="text-foreground font-bold text-xl leading-5">
        Featured
      </Text>
      <View className="max-h-max mt-1 mb-8">
        <FlatList
          horizontal
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          renderItem={({ item }) => (
            <Pressable
              className="mr-4"
              onPress={() => onSelectRecipe?.(item.id.toString())}
            >
              <View className="bg-secondary rounded-2xl p-4 w-[260px]">
                <Image
                  source={{ uri: item.image_url }}
                  resizeMode="cover"
                  className="h-[100px] w-full mb-2"
                />
                <Text className="text-background font-semibold text-lg leading-5">
                  {item.title}
                </Text>
                <HStack className="justify-between items-center mt-1">
                  <View className="flex flex-row gap-1 items-center">
                    <View className="bg-[#C4C4C4] p-2.5 rounded-full border border-background" />
                    <Text className="text-background/75 text-sm leading-6">
                      {item.created_by}
                    </Text>
                  </View>
                  <HStack className="items-center gap-1.5">
                    <Clock color="white" size={14} />
                    <Text className="text-background/80 text-sm">
                      {item.ready_in_minutes}
                    </Text>
                  </HStack>
                </HStack>
              </View>
            </Pressable>
          )}
        />
      </View>
    </>
  );
};

export default FeaturedRecipes;
