import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { FeaturedRecipeSketon } from "../Skeletons";
import { convertMinutesToTimeLabel, truncateChars } from "@/utils";
import { Clock, Flame } from "lucide-react-native";
import { router } from "expo-router";

import { useRecipesQuery } from "@/redux/queries/recipes/useRecipeQuery";

const GlutenFreeDiets = () => {
  const { data, isLoading } = useRecipesQuery({
    dietIds: [1],
  });

  const recipes = data?.pages?.[0]?.results ?? [];

  return (
    <>
      <View className="flex flex-row justify-between">
        <Text className="text-foreground font-bold text-xl leading-5 pl-7 mb-4">
          Gluten Free Diets
        </Text>
      </View>

      <View>
        {isLoading ? (
          <FlatList
            horizontal
            data={Array.from({ length: 3 })}
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            renderItem={({ index }) => (
              <FeaturedRecipeSketon
                style={{
                  width: 220,
                  height: 220,
                  marginRight: 16,
                  marginLeft: index === 0 ? 28 : 0,
                  borderRadius: 32,
                }}
              />
            )}
          />
        ) : (
          <FlatList
            data={recipes}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Pressable
                className={`${
                  index === 0 ? "ml-7 " : "ml-1"
                } mr-3 p-4 bg-card rounded-2xl !w-[220px]`}
                onPress={() => router.push(`/recipe/${item?.id}` as const)}
              >
                <View className="flex flex-col">
                  <View className="relative mb-4">
                    <Image
                      source={{ uri: item.image_url }}
                      className="h-40 w-full rounded-2xl bg-gray-300"
                      resizeMode="cover"
                    />
                  </View>

                  <Text className="text-foreground font-bold text-base leading-5 mb-3">
                    {truncateChars(item?.title, 35)}
                    {/* {item?.title} */}
                  </Text>

                  <View className="flex flex-row items-center gap-2 mt-auto">
                    <View className="flex flex-row items-center gap-0.5">
                      <Flame color="#96a1b0" size={20} />
                      <Text className="text-muted"> {item.calories} Kcal</Text>
                    </View>
                    <View className="bg-muted p-0.5" />
                    <View className="flex flex-row items-center gap-1">
                      <Clock color="#96a1b0" size={16} />
                      <Text className="text-muted text-sm">
                        {convertMinutesToTimeLabel(item.ready_in_minutes)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </>
  );
};

export default GlutenFreeDiets;
