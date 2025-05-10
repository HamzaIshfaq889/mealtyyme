"use client";

import { useState, useRef, useCallback, useMemo } from "react";

import { router } from "expo-router";

import BottomSheet from "@gorhom/bottom-sheet";

import { useSelector } from "react-redux";

import {
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  SearchIcon,
  SlidersHorizontal,
  ArrowLeft,
} from "lucide-react-native";

import { useRecipesQuery } from "@/redux/queries/recipes/useRecipeQuery";

import { checkisProUser } from "@/utils";

import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

import Filters from "./filters";
import RecipesBySearch from "./recipesBySearch";
import RecipesByFilters from "./recipesByFilters";

const Search = () => {
  const scheme = useColorScheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);

  const [tempCategoriesIds, setTempCategoriesIds] = useState<number[]>([]);
  const [tempCusinesIds, setTempCuisinesIds] = useState<number[]>([]);
  const [tempDietIds, setTempDietIds] = useState<number[]>([]);
  const [tempProtein, setTempProtein] = useState([0, 500]);
  const [tempFat, setTempFat] = useState([0, 100]);
  const [tempCarbs, setTempCarbs] = useState([0, 700]);
  const [tempCalories, setTempCalories] = useState([0, 700]);
  const [tempReadyInMinutes, setTempReadyInMinutes] = useState([0, 700]);

  const [categoriesIds, setCategoriesIds] = useState<number[]>([]);
  const [cusinesIds, setCuisinesIds] = useState<number[]>([]);
  const [dietIds, setDietIds] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [protien, setProtien] = useState([0, 500]);
  const [fat, setFat] = useState([0, 100]);
  const [carbs, setCarbs] = useState([0, 700]);
  const [calories, setCalories] = useState([0, 2000]);
  const [readyInMinutes, setReadyInMinutes] = useState([0, 300]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: recipesLoading,
    refetch,
  } = useRecipesQuery({
    searchValue,
    categoryIds: categoriesIds,
    cuisineIds: cusinesIds,
    dietIds,
    protein: protien,
    fat,
    carbs,
    calories,
    readyInMinutes,
  });

  const flattenedRecipes = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data]
  );

  const status = useSelector(
    (state: any) =>
      state.auth.loginResponseType.customer_details?.subscription?.status
  );
  const isProUser = checkisProUser(status);

  const handleApplyFilters = useCallback(() => {
    setCategoriesIds(tempCategoriesIds);
    setCuisinesIds(tempCusinesIds);
    setDietIds(tempDietIds);
    setProtien(tempProtein);
    setFat(tempFat);
    setCarbs(tempCarbs);
    setCalories(tempCalories);
    setReadyInMinutes(tempReadyInMinutes);

    setIsFiltersApplied(true);
    bottomSheetRef.current?.close();
    refetch();
  }, [bottomSheetRef?.current]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleClearFilters = () => {
    setCategoriesIds([]);
    setCuisinesIds([]);
    setDietIds([]);
    setProtien([0, 1000]);
    setCarbs([0, 700]);
    setFat([0, 100]);
    setCalories([0, 2000]);
    setReadyInMinutes([0, 300]);

    setTempCategoriesIds([]);
    setTempCuisinesIds([]);
    setTempDietIds([]);
    setTempProtein([0, 1000]);
    setTempCarbs([0, 700]);
    setTempFat([0, 100]);
    setTempCalories([0, 2000]);
    setTempReadyInMinutes([0, 300]);

    setIsFiltersApplied(false);
    bottomSheetRef.current?.close();
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setSearchValue(searchValue);
  //   }, 200);

  //   return () => clearTimeout(timer);
  // }, [searchValue]);

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
          <View className="flex flex-row items-center justify-between mt-2.5">
            <Input className={`${isProUser ? "basis-4/5" : "w-full"} my-3.5`}>
              <InputSlot className="ml-1">
                <InputIcon className="!w-6 !h-6 text-primary" as={SearchIcon} />
              </InputSlot>
              <InputField
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChangeText={setSearchValue}
              />
            </Input>

            {isProUser ? (
              <Pressable
                onPress={() => bottomSheetRef.current?.snapToIndex(1)}
                className="bg-secondary flex items-center px-3.5 py-4 rounded-2xl"
              >
                <SlidersHorizontal color="#fff" />
              </Pressable>
            ) : null}
          </View>
        </View>

        {(!!searchValue || isFiltersApplied) && (
          <RecipesBySearch
            flattenedRecipes={flattenedRecipes}
            searchValue={searchValue}
            isLoading={recipesLoading}
            handleLoadMore={handleLoadMore}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}

        {!searchValue && <RecipesByFilters />}

        <Filters
          bottomSheetRef={bottomSheetRef as any}
          categoriesIds={tempCategoriesIds}
          setCategoriesIds={setTempCategoriesIds}
          cusinesIds={tempCusinesIds}
          setCuisinesIds={setTempCuisinesIds}
          dietIds={tempDietIds}
          setDietIds={setTempDietIds}
          protien={tempProtein}
          setProtien={setTempProtein}
          fat={tempFat}
          setFat={setTempFat}
          carbs={tempCarbs}
          setCarbs={setTempCarbs}
          handleApplyFilters={handleApplyFilters}
          calories={tempCalories}
          setCalories={setTempCalories}
          readyInMinutes={tempReadyInMinutes}
          setReadyInMinutes={setTempReadyInMinutes}
          handleClearFilters={handleClearFilters}
        />
      </View>
    </>
  );
};

export default Search;
