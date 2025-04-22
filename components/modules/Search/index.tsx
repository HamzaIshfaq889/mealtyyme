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
} from "lucide-react-native";

import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import BottomSheet from "@gorhom/bottom-sheet";

import { RecipeSkeletonItem } from "../Skeletons";
import Filters from "./filters";
import { truncateChars } from "@/utils";

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
        <View className="px-6 pt-16 pb-5">
          <View className="flex flex-row justify-between items-center mb-8">
            <TouchableOpacity onPress={() => router.push("/(tabs)/Home")}>
              <ArrowLeft
                width={30}
                height={30}
                color={scheme === "dark" ? "#fff" : "#000"}
              />
            </TouchableOpacity>
            <Text className="block font-bold text-2xl text-foreground">
              Search
            </Text>
            <Text></Text>
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
            <Text className="text-xl font-bold text-foreground">
              {totalRecipes}
            </Text>
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
                    className="flex flex-row justify-between items-center py-5 px-3 rounded-2xl mb-5 bg-background"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <View className="flex flex-row gap-4">
                      <Image
                        source={{ uri: recipe?.image_url }}
                        className="w-24 h-[80px] rounded-2xl"
                      />
                      <View className="flex flex-col justify-between max-w-60">
                        <Text className="font-bold text-lg mb-1 leading-6 text-primary">
                          {truncateChars(recipe?.title, 25)}
                        </Text>
                        <View className="flex flex-row gap-2">
                          <Image
                            source={{ uri: recipe?.created_by.image_url }}
                            className="w-6 h-6 rounded-full"
                          />
                          <Text className="text-muted text-base ">
                            {recipe?.created_by.first_name}{" "}
                            {recipe?.created_by.last_name}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="mr-2 p-0.5 bg-secondary rounded-md">
                      <ArrowRight color="#fff" size={22} />
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
          refetch={refetch}
        />
      </View>
    </>
  );
};

export default Search;
