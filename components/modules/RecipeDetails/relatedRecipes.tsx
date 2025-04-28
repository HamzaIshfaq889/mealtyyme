import React, { useMemo, useState } from "react";

import {
  FlatList,
  Image,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Recipe } from "@/lib/types/recipe";

import { truncateChars } from "@/utils";
import { useRecipesQuery } from "@/redux/queries/recipes/useRecipeQuery";
import { Clock, Flame } from "lucide-react-native";
import { router } from "expo-router";

const favouritesData = [
  {
    id: 1,
    name: "Sunny Egg & Toast Avocado",
    image: require("@/assets/svgs/Sun.svg"),
  },
  {
    id: 2,
    name: "Sunny Egg & Toast Avocado",
    image: require("@/assets/svgs/Sun.svg"),
  },
  {
    id: 3,
    name: "Sunny Egg & Toast Avocado",
    image: require("@/assets/svgs/Sun.svg"),
  },
  {
    id: 4,
    name: "Sunny Egg & Toast Avocado",
    image: require("@/assets/svgs/Sun.svg"),
  },
  {
    id: 5,
    name: "Sunny Egg & Toast Avocado",
    image: require("@/assets/svgs/Sun.svg"),
  },
  {
    id: 6,
    name: "Sunny Egg & Toast Avocado",
    image: require("@/assets/svgs/Sun.svg"),
  },
];

type RelatedRecipesProps = {
  recipe: Recipe | undefined;
};
const RelatedRecipes = ({ recipe }: RelatedRecipesProps) => {
  const dishTypeIds = recipe?.dish_types.map((dish) => dish.id);
  const scheme = useColorScheme();

  const [searchValue, setSearchValue] = useState("");
  const [categoriesIds, setCategoriesIds] = useState<number[]>(
    dishTypeIds ? dishTypeIds : []
  );
  const [cusinesIds, setCusinesIds] = useState<number[]>([]);
  const [dietIds, setDietIds] = useState<number[]>([]);
  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(1000);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useRecipesQuery(
    searchValue,
    categoriesIds,
    cusinesIds,
    dietIds,
    low,
    high
  );

  const flattenedRecipes = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data]
  );

  return (
    <>
      <View className="flex flex-row justify-between items-center">
        <Text className="px-7 text-primary font-bold text-xl leading-7 mb-1">
          Related Recipes
        </Text>
      </View>
      <View className="flex flex-row flex-wrap">
        <FlatList
          data={flattenedRecipes}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Pressable
              className={`${index === 0 ? "ml-7" : "ml-1"} mr-3 py-4`}
              onPress={() => router.push(`/recipe/${item?.id}` as const)}
            >
              <View
                className="flex flex-col bg-background rounded-2xl w-64 p-3 !h-[230px]"
                style={{
                  boxShadow:
                    scheme === "dark"
                      ? "0px 2px 12px 0px rgba(0,0,0,0.4)"
                      : "0px 2px 12px 0px rgba(0,0,0,0.2)",
                }}
              >
                <View className="relative mb-4">
                  <Image
                    source={{ uri: item.image_url }}
                    className="h-36 w-full rounded-xl bg-gray-300"
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
                    <Text className="text-muted">
                      {" "}
                      {Math.ceil(item.calories)} Kcal
                    </Text>
                  </View>
                  <View className="bg-muted p-0.5" />
                  <View className="flex flex-row items-center gap-1">
                    <Clock color="#96a1b0" size={16} />
                    <Text className="text-muted text-sm">
                      {item.ready_in_minutes}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    </>
  );
};

export default RelatedRecipes;
