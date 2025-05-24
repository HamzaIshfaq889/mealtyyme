"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";

import { router } from "expo-router";

import BottomSheet from "@gorhom/bottom-sheet";

import { useSelector } from "react-redux";

import {
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ScrollView,
} from "react-native";
import {
  SearchIcon,
  SlidersHorizontal,
  ArrowLeft,
  ChefHat,
  Crown,
  ChevronRight,
} from "lucide-react-native";

import { useRecipesQuery } from "@/redux/queries/recipes/useRecipeQuery";

import {
  capitalizeFirstLetter,
  checkisProUser,
  checkisSubscriptionCanceled,
} from "@/utils";

import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

import Filters from "./filters";
import RecipesBySearch from "./recipesBySearch";
import RecipesByFilters from "./recipesByFilters";
import ProFeaturesCard from "./proFeaturesCard";
import ProSubscribeModal from "@/components/ui/modals/proModal";
import { useModal } from "@/hooks/useModal";

import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  runOnJS,
} from "react-native-reanimated";

import { RecipeSkeletonItem } from "../Skeletons";

const Search = () => {
  const scheme = useColorScheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollY = useSharedValue(0);
  const isScrolling = useSharedValue(false);
  const lastScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      scrollY.value = withSpring(currentScrollY, {
        damping: 20,
        stiffness: 200,
        mass: 0.3,
        velocity: 0.5,
      });
      lastScrollY.value = currentScrollY;
    },
    onBeginDrag: () => {
      isScrolling.value = true;
    },
    onEndDrag: () => {
      isScrolling.value = false;
    },
  });

  const ingredientCardAnimatedStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [0, 20],
      [1, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity: progress,
      transform: [
        {
          translateY: interpolate(
            progress,
            [0, 1],
            [-8, 0],
            Extrapolation.CLAMP
          ),
        },
      ],
      height: interpolate(progress, [0, 1], [0, 80], Extrapolation.CLAMP),
      marginBottom: interpolate(progress, [0, 1], [0, 24], Extrapolation.CLAMP),
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    };
  });

  const [isFiltersApplied, setIsFiltersApplied] = useState(false);
  const diet_preferences = useSelector(
    (state: any) =>
      state.auth.loginResponseType.customer_details?.diet_preferences
  );

  const [tempCategoriesIds, setTempCategoriesIds] = useState<number[]>([]);
  const [tempCusinesIds, setTempCuisinesIds] = useState<number[]>([]);
  const [tempDietIds, setTempDietIds] = useState<number[]>([
    ...diet_preferences,
  ]);
  const [tempProtein, setTempProtein] = useState([0, 500]);
  const [tempFat, setTempFat] = useState([0, 100]);
  const [tempCarbs, setTempCarbs] = useState([0, 700]);
  const [tempCalories, setTempCalories] = useState([0, 700]);
  const [tempReadyInMinutes, setTempReadyInMinutes] = useState([0, 700]);

  const [categoriesIds, setCategoriesIds] = useState<number[]>([]);
  const [cusinesIds, setCuisinesIds] = useState<number[]>([]);
  // const [dietIds, setDietIds] = useState<number[]>([]);
  const [dietIds, setDietIds] = useState<number[]>([...diet_preferences]);
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
  const isSubscriptionCanceled = checkisSubscriptionCanceled(status);

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
    setDietIds([...diet_preferences]);
    setTempDietIds([...diet_preferences]);

    setCategoriesIds([]);
    setCuisinesIds([]);
    setProtien([0, 1000]);
    setCarbs([0, 700]);
    setFat([0, 100]);
    setCalories([0, 2000]);
    setReadyInMinutes([0, 300]);

    setTempCategoriesIds([]);
    setTempCuisinesIds([]);
    setTempProtein([0, 1000]);
    setTempCarbs([0, 700]);
    setTempFat([0, 100]);
    setTempCalories([0, 2000]);
    setTempReadyInMinutes([0, 300]);

    setIsFiltersApplied(false);
    bottomSheetRef.current?.close();
  };

  // Add debounced search with cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(inputValue);
    }, 200);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const {
    isVisible: showProModal,
    showModal,
    hideModal,
    backdropAnim,
    modalAnim,
  } = useModal();

  const handleUpgrade = () => {
    hideModal();
    const timeoutId = setTimeout(() => {
      if (isSubscriptionCanceled) {
        router.push("/(protected)/(nested)/manage-subscription");
      } else {
        router.push("/(protected)/(nested)/buy-subscription");
      }
    }, 100);

    // Cleanup timeout if component unmounts
    return () => clearTimeout(timeoutId);
  };

  return (
    <>
      <View className="w-full h-full bg-background">
        <View className="px-5 pt-16 pb-5 relative">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft
                width={30}
                height={30}
                color={scheme === "dark" ? "#fff" : "#000"}
              />
            </TouchableOpacity>
            <Text className="text-foreground text-2xl font-semibold ml-4">
              Search
            </Text>
            <View style={{ width: 30 }} />
          </View>

          <View className="flex flex-row items-center justify-between mt-2.5">
            <View className="basis-4/5">
              <Input className="my-3.5 bg-foreground">
                <InputSlot className="ml-1">
                  <InputIcon
                    className="!w-6 !h-6 text-primary"
                    as={SearchIcon}
                  />
                </InputSlot>
                <InputField
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChangeText={setSearchValue}
                />
              </Input>
            </View>

            <Pressable
              onPress={() =>
                isProUser ? bottomSheetRef.current?.snapToIndex(1) : showModal()
              }
              className={`flex items-center px-3.5 py-4 rounded-2xl ${
                isProUser ? "bg-secondary" : "bg-secondary"
              } relative`}
            >
              <SlidersHorizontal color={isProUser ? "#fff" : "#fff"} />
              {!isProUser && (
                <View className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-2">
                  <Crown size={18} strokeWidth={2} color={"#fff"} />
                </View>
              )}
            </Pressable>
          </View>
        </View>

        <View className="relative">
          <Animated.View style={ingredientCardAnimatedStyle}>
            <TouchableOpacity
              className="mx-6 p-3 flex flex-row items-center justify-between border border-input rounded-lg bg-background"
              onPress={() =>
                router.push("/(protected)/(nested)/ingredient-based-search")
              }
            >
              <View className="flex flex-row items-center gap-3">
                <ChefHat
                  color={scheme === "dark" ? "#fff" : "#000"}
                  size={30}
                />
                <Text className="font-medium text-base font-sofia text-primary w-64">
                  Find Recipies based on what you already have at home
                </Text>
              </View>
              <ChevronRight color={"#EE8427"} size={28} />
            </TouchableOpacity>
          </Animated.View>

          {!!searchValue || isFiltersApplied ? (
            <Animated.FlatList
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingTop: 104, paddingBottom: 100 }}
              data={flattenedRecipes}
              keyExtractor={(item) => item?.id.toString()}
              renderItem={({ item: recipe, index }) => (
                <RecipesBySearch
                  flattenedRecipes={[recipe]}
                  searchValue={searchValue}
                  isLoading={recipesLoading}
                  handleLoadMore={handleLoadMore}
                  isFetchingNextPage={isFetchingNextPage}
                  hasNextPage={hasNextPage}
                />
              )}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
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
          ) : (
            <Animated.ScrollView
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 104, paddingBottom: 100 }}
            >
              <RecipesByFilters />
            </Animated.ScrollView>
          )}
        </View>

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

        {showProModal && (
          <ProSubscribeModal
            visible={showProModal}
            hideModal={hideModal}
            backdropAnim={backdropAnim}
            modalAnim={modalAnim}
          >
            <ProFeaturesCard
              handleNonPro={handleUpgrade}
              handleLater={hideModal}
            />
          </ProSubscribeModal>
        )}
      </View>
    </>
  );
};

export default Search;
