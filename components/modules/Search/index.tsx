"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useRecipesQuery } from "@/redux/queries/recipes/useRecipeQuery";

import { router } from "expo-router";

import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Image,
} from "react-native";
import {
  SearchIcon,
  ArrowRight,
  SlidersHorizontal,
  ArrowLeft,
  Clock,
  Flame,
  Star,
} from "lucide-react-native";

import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import BottomSheet from "@gorhom/bottom-sheet";

import { RecipeSkeletonItem } from "../Skeletons";
import Filters from "./filters";

const Search = () => {
  const scheme = useColorScheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(1000);
  const [categoriesIds, setCategoriesIds] = useState<number[]>([]);
  const [cusinesIds, setCuisinesIds] = useState<number[]>([]);
  const [dietIds, setDietIds] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [protien, setProtien] = useState([0, 500]);
  const [fat, setFat] = useState([0, 100]);
  const [carbs, setCarbs] = useState([0, 700]);

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
    protien,
    fat,
    carbs,
    low,
    high
  );

  const flattenedRecipes = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (data?.pages?.[0]?.total) {
      setTotalRecipes(data.pages[0].total);
    }
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <>
      <View className="w-full h-full">
        <View className="px-6 pt-16 pb-5 relative">
          <TouchableOpacity
            onPress={() => router.push("/(protected)/(tabs)")}
            className="absolute left-6 top-16"
          >
            <ArrowLeft
              width={30}
              height={30}
              color={scheme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <View className="flex items-center">
            <Text className="font-bold text-2xl text-foreground">Search</Text>
          </View>
          <View className="flex flex-row items-center justify-between gap-2.5">
            <Input className="basis-4/5 my-3.5">
              <InputSlot className="ml-1">
                <InputIcon className="!w-6 !h-6 text-primary" as={SearchIcon} />
              </InputSlot>
              <InputField
                type="text"
                placeholder="Search..."
                value={inputValue}
                onChangeText={setInputValue}
              />
            </Input>

            <Pressable
              onPress={() => bottomSheetRef.current?.snapToIndex(1)}
              className="bg-secondary flex items-center px-5 py-5 rounded-2xl"
            >
              <SlidersHorizontal color="#fff" />
            </Pressable>
          </View>
        </View>

        <View className="px-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-foreground">Recipes</Text>
            {/* <Text className="text-xl font-bold text-foreground">
              {totalRecipes}
            </Text> */}
          </View>

          {searchValue && flattenedRecipes.length === 0 && !isLoading ? (
            <View className="flex flex-col justify-center items-center p-4 mt-10">
              <Text className="text-2xl font-semibold text-center text-primary">
                No recipes found for "{searchValue}"
              </Text>
              <Text className="text-center mt-2 text-primary">
                Try adjusting your search or filters
              </Text>
            </View>
          ) : isLoading ? (
            <View className="mt-3 space-y-6">
              {[1, 2, 3, 4].map((item) => {
                return <RecipeSkeletonItem key={item} />;
              })}
            </View>
          ) : flattenedRecipes.length === 0 ? (
            <Text className="text-xl text-foreground text-center mt-10 px-6">
              No recipes Found with these filters.Please Update filters
            </Text>
          ) : (
            <FlatList
              data={flattenedRecipes}
              keyExtractor={(item) => item?.id.toString()}
              contentContainerStyle={{
                paddingHorizontal: 2,
                paddingBottom: 400,
              }}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.4}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: recipe }) => (
                <Pressable
                  onPress={() => router.push(`/recipe/${recipe.id}` as const)}
                >
                  <View
                    className="flex flex-row justify-between items-center p-4 rounded-2xl mb-5 bg-background"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.05,
                      shadowRadius: 6,
                      elevation: 3,
                    }}
                  >
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
                            {recipe?.title}
                          </Text>

                          <View className="flex flex-row items-center gap-2 mb-2">
                            <Image
                              source={{ uri: recipe?.created_by.image_url }}
                              className="w-5 h-5 rounded-full"
                            />
                            <Text className="text-muted text-sm">
                              {recipe?.created_by.first_name}{" "}
                              {recipe?.created_by.last_name}
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

                    <View className="ml-2 p-2 bg-secondary rounded-full">
                      <ArrowRight color="#fff" size={18} />
                    </View>
                  </View>
                </Pressable>
              )}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <View className="mt-3 space-y-6">
                    {[1, 2].map((item) => (
                      <RecipeSkeletonItem key={`footer-skeleton-${item}`} />
                    ))}
                  </View>
                ) : null
              }
            />
          )}
        </View>

        <Filters
          bottomSheetRef={bottomSheetRef}
          categoriesIds={categoriesIds}
          setCategoriesIds={setCategoriesIds}
          cusinesIds={cusinesIds}
          setCuisinesIds={setCuisinesIds}
          dietIds={dietIds}
          setDietIds={setDietIds}
          protien={protien}
          setProtien={setProtien}
          fat={fat}
          setFat={setFat}
          carbs={carbs}
          setCarbs={setCarbs}
        />
      </View>
    </>
  );
};

export default Search;
