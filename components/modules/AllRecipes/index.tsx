import { capitalizeFirstLetter, checkisProUser } from "@/utils";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { RecipeSkeletonItem } from "../Skeletons";
import { router } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CrownIcon,
  Flame,
  SlidersHorizontal,
  Star,
} from "lucide-react-native";
import { useSelector } from "react-redux";
import Filters from "../Search/filters";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRecipesQuery } from "@/redux/queries/recipes/useRecipeQuery";
import { useModal } from "@/hooks/useModal";
import ProSubscribeModal from "@/components/ui/modals/proModal";
import ProFeaturesCard from "../Search/proFeaturesCard";

type QueryOptions = {
  dietIds?: number[];
  categoryIds?: number[];
  cuisineIds?: number[];
};

type AllRecipesProps = {
  queryOptions: QueryOptions;
};

const AllRecipes = ({ queryOptions }: AllRecipesProps) => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const [hasFiltered, setHasFiltered] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

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
  const [protien, setProtien] = useState([0, 500]);
  const [fat, setFat] = useState([0, 100]);
  const [carbs, setCarbs] = useState([0, 700]);
  const [calories, setCalories] = useState([0, 700]);
  const [readyInMinutes, setReadyInMinutes] = useState([0, 700]);

  const status = useSelector(
    (state: any) =>
      state.auth.loginResponseType.customer_details?.subscription?.status
  );
  const isProUser = checkisProUser(status);

  const effectiveQueryOptions = useMemo(() => {
    if (!hasFiltered) {
      return queryOptions;
    }

    return {
      categoryIds: categoriesIds.length > 0 ? categoriesIds : undefined,
      cuisineIds: cusinesIds.length > 0 ? cusinesIds : undefined,
      dietIds: dietIds.length > 0 ? dietIds : undefined,
      protein: protien,
      fat,
      carbs,
      calories,
      readyInMinutes,
    };
  }, [
    hasFiltered,
    categoriesIds,
    cusinesIds,
    dietIds,
    protien,
    fat,
    carbs,
    calories,
    queryOptions,
    readyInMinutes,
  ]);

  const {
    isVisible: showProModal,
    showModal,
    hideModal,
    backdropAnim,
    modalAnim,
  } = useModal();

  const handleUpgrade = () => {
    hideModal();
    setTimeout(() => {
      router.push("/(protected)/(nested)/buy-subscription");
    }, 100);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useRecipesQuery(effectiveQueryOptions);
  const flattenedRecipes = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleApplyFilters = useCallback(() => {
    setCategoriesIds(tempCategoriesIds);
    setCuisinesIds(tempCusinesIds);
    setDietIds(tempDietIds);
    setProtien(tempProtein);
    setFat(tempFat);
    setCarbs(tempCarbs);
    setCalories(tempCalories);
    setReadyInMinutes(tempReadyInMinutes);

    setHasFiltered(true);
    bottomSheetRef.current?.close();
  }, [bottomSheetRef?.current]);

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

    bottomSheetRef.current?.close();
  };

  const handleOpenFilter = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  useEffect(() => {
    if (queryOptions?.categoryIds?.length) {
      setTempCategoriesIds(queryOptions.categoryIds);
    }
    if (queryOptions?.cuisineIds?.length) {
      setTempCuisinesIds(queryOptions.cuisineIds);
    }
    if (queryOptions?.dietIds?.length) {
      setTempDietIds(queryOptions.dietIds);
    }

    // optionally handle macros too
  }, [queryOptions]);

  if (isLoading) {
    return (
      <View className="pt-20 px-6 pb-4 space-y-6">
        <View>
          <View className="flex flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft color="#FFF" size={24} />
            </TouchableOpacity>
            <Text className="text-foreground text-2xl font-semibold">
              {capitalizeFirstLetter("Recipes")}
            </Text>
          </View>
          {[1, 2, 3, 4, 5].map((item) => {
            return <RecipeSkeletonItem key={item} />;
          })}
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg font-medium">
          Failed to load recipes.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View className="pt-20 px-5 pb-4">
        <View className="flex flex-row justify-between items-center mb-6">
          <View className="flex flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft color="#FFF" size={24} />
            </TouchableOpacity>
            <Text className="text-foreground text-2xl font-semibold">
              {capitalizeFirstLetter("Recipes")}
            </Text>
          </View>

          <Pressable
            onPress={() => (isProUser ? handleOpenFilter() : showModal())}
            className={`flex items-center px-3.5 py-4 rounded-2xl ${
              isProUser ? "bg-secondary" : "bg-secondary"
            } relative`}
          >
            <SlidersHorizontal color={isProUser ? "#fff" : "#fff"} />
            {!isProUser && (
              <View className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-2">
                <CrownIcon size={18} strokeWidth={2} color={"#fff"} />
              </View>
            )}
          </Pressable>
        </View>
        {flattenedRecipes.length === 0 ? (
          <View className="w-full h-full">
            <Text className="text-xl text-foreground text-center mt-10 px-6">
              No recipes Found.
            </Text>
          </View>
        ) : (
          <FlatList
            data={flattenedRecipes}
            keyExtractor={(item) => item?.id.toString()}
            contentContainerStyle={{
              paddingHorizontal: 2,
              paddingBottom: 200,
            }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: recipe }) => (
              <TouchableOpacity
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
              </TouchableOpacity>
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

      {/* Pro Upgrade Modal */}
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
  );
};

export default AllRecipes;
