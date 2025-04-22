import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";

import SelectDropdown from "react-native-select-dropdown";

import { router } from "expo-router";

import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  SearchIcon,
  ArrowRight,
  SlidersHorizontal,
  ArrowLeft,
} from "lucide-react-native";

import Svg1 from "@/assets/svgs/arrow-left.svg";

import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import Slider from "rn-range-slider";
import Thumb from "@/components/ui/slider/Thumb";
import Label from "@/components/ui/slider/Label";
import Rail from "@/components/ui/slider/Rail";
import RailSelected from "@/components/ui/slider/RailSelected";
import Notch from "@/components/ui/slider/Notch";
import {
  getCategories,
  getCusines,
  getDiets,
  getFeaturedRecipes,
  searchRecipes,
} from "@/services/recipesAPI";
import { Categories, Cuisine, Diet, Recipe } from "@/lib/types/recipe";
import { capitalizeWords } from "@/utils";

const options = ["Categories", "Ingredients"];

const recipesType = ["Salad", "Egg", "Cakes", "Chicken", "Meals", "Vegetable"];
const Search = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [diets, setDiets] = useState<Diet[]>([]);

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const [selected, setSelected] = useState(options[0]);
  const [low, setLow] = useState<number>(25);
  const [high, setHigh] = useState<number>(75);

  ///API Settigns
  const [page, setPage] = useState(1);
  const [categoriesIds, setCategoriesIds] = useState<number[]>([]);
  const [cusinesIds, setCuisnesIds] = useState<number[]>([]);
  const [dietIds, setDietIds] = useState<number[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value: any) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const renderThumb = useCallback(
    (name: "high" | "low") => <Thumb name={name} />,
    []
  );

  const handleValueChange = useCallback((low: number, high: number) => {
    setLow(low);
    setHigh(high);
  }, []);

  const snapPoints = useMemo(() => ["80%"], []);

  const handleSelection = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const fetchRecipes = async (page: number) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const { results, total } = await searchRecipes(
        categoriesIds,
        page,
        searchValue,
        cusinesIds,
        low,
        high,
        dietIds
      );

      if (results.length === 0) {
        setHasMore(false);
      } else {
        setRecipes((prev) => (page === 1 ? results : [...prev, ...results]));
        setPage(page);
        setTotalRecipes(total);
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRecipes(1);
  }, []);

  useEffect(() => {
    setRecipes([]);
    setPage(1);
    setHasMore(true);
    fetchRecipes(1);
  }, [searchValue]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        console.log(categories.length);
      } catch (err: any) {
        setError(err.message || "Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const data = await getCusines();
        setCuisines(data);
      } catch (err: any) {
        setError(err.message || "Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCuisines();
  }, []);

  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const data = await getDiets();
        setDiets(data);
      } catch (err: any) {
        setError(err.message || "Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchDiets();
  }, []);

  ///Categories
  const toggleCategory = (id: number) => {
    setCategoriesIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // Remove if already selected
          : [...prev, id] // Add if not selected
    );
  };

  ///Cuisines
  const toggleCusines = (id: number) => {
    setCuisnesIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // Remove if already selected
          : [...prev, id] // Add if not selected
    );
  };

  ///Diets
  const toggleDiets = (id: number) => {
    setDietIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // Remove if already selected
          : [...prev, id] // Add if not selected
    );
  };

  const handleApplyFilters = () => {
    setHasMore(true);
    setRecipes([]);
    setPage(1);
    fetchRecipes(1);
  };

  return (
    <>
      <View className=" w-full h-full">
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
                value={searchValue}
                onChangeText={(text) => setSearchValue(text)}
              />
            </Input>

            <Pressable
              onPress={() => bottomSheetRef.current?.snapToIndex(1)} // opens at 50%
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
          <FlatList
            data={recipes}
            keyExtractor={(item) => item?.id.toString()}
            contentContainerStyle={{
              paddingHorizontal: 2,
              paddingBottom: 100,
            }}
            onEndReached={() => {
              if (!loading && hasMore) {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchRecipes(nextPage);
              }
            }}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: recipe }) => (
              <View
                className="flex flex-row justify-between items-center py-5 px-3 rounded-2xl mb-5 bg-background"
                style={{
                  boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
                }}
              >
                <View className="flex flex-row gap-4">
                  <Image
                    source={{ uri: recipe?.image_url }}
                    className="w-24 h-[80px] rounded-2xl"
                  />
                  <View className="flex flex-col justify-between max-w-40">
                    <Text className="font-bold text-lg mb-1 leading-6 text-primary">
                      {recipe?.title}
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
            )}
            ListFooterComponent={
              loading ? <ActivityIndicator size="small" /> : null
            }
          />
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          backdropComponent={BottomSheetBackdrop}
          enablePanDownToClose={true}
          enableContentPanningGesture={false}
          enableHandlePanningGesture={true}
          handleStyle={{
            backgroundColor: isDarkMode ? "#1f242a" : "#fff",
            borderWidth: 0,
          }}
          handleIndicatorStyle={{
            backgroundColor: isDarkMode ? "#888" : "#ccc",
          }}
          onChange={(index) => {
            if (index === -1 || index === 0) {
              bottomSheetRef.current?.close();
            }
          }}
        >
          <BottomSheetScrollView className="w-full h-full bg-background">
            <Text className="font-bold text-2xl leading-8 text-foreground text-center mb-4 mt-4">
              Filter
            </Text>
            <Text className="text-xl font-bold text-foreground px-6 mb-6">
              Category
            </Text>

            <View className="mb-6">
              <BottomSheetFlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                contentContainerStyle={{
                  gap: 12,
                  paddingLeft: 24,
                  flexGrow: 1,
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = categoriesIds.includes(item.id);
                  return (
                    <Button
                      action="secondary"
                      onPress={() => toggleCategory(item.id)}
                      className={`rounded-full px-10 py-2 ${
                        isSelected ? "bg-secondary" : "bg-gray4"
                      }`}
                    >
                      <ButtonText
                        className={`!text-lg leading-6 ${
                          isSelected ? "!text-white" : "!text-primary"
                        } !font-medium`}
                      >
                        {capitalizeWords(item.name)}
                      </ButtonText>
                    </Button>
                  );
                }}
              />
            </View>

            <Text className="text-xl font-bold text-foreground px-6 mb-6">
              Cusines
            </Text>

            <View className="mb-6">
              <BottomSheetFlatList
                data={cuisines}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                contentContainerStyle={{ gap: 12, paddingLeft: 24 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = cusinesIds.includes(item.id);
                  return (
                    <Button
                      action="secondary"
                      onPress={() => toggleCusines(item.id)}
                      className={`rounded-full px-10 py-2 ${
                        isSelected ? "bg-secondary" : "bg-gray4"
                      }`}
                    >
                      <ButtonText
                        className={`!text-lg leading-6 ${
                          isSelected ? "!text-white" : "!text-primary"
                        } !font-medium`}
                      >
                        {capitalizeWords(item.name)}
                      </ButtonText>
                    </Button>
                  );
                }}
              />
            </View>

            <Text className="text-xl font-bold text-foreground px-6 mb-6">
              Diets
            </Text>

            <View className="mb-6">
              <BottomSheetFlatList
                data={diets}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                contentContainerStyle={{ gap: 12, paddingLeft: 24 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = dietIds.includes(item.id);
                  return (
                    <Button
                      action="secondary"
                      onPress={() => toggleDiets(item.id)}
                      className={`rounded-full px-10 py-2 ${
                        isSelected ? "bg-secondary" : "bg-gray4"
                      }`}
                    >
                      <ButtonText
                        className={`!text-lg leading-6 ${
                          isSelected ? "!text-white" : "!text-primary"
                        } !font-medium`}
                      >
                        {capitalizeWords(item.name)}
                      </ButtonText>
                    </Button>
                  );
                }}
              />
            </View>

            <View className="px-6 mb-10">
              <View className="flex flex-row justify-between items-center mb-8">
                <Text className="text-xl font-bold text-foreground">
                  Calories Range
                </Text>
                <Text className="text-foreground text-lg">{`${low}-${high} KCal`}</Text>
              </View>
              <Slider
                min={0}
                max={1000}
                step={10}
                floatingLabel
                renderThumb={renderThumb}
                renderRail={renderRail}
                renderRailSelected={renderRailSelected}
                renderLabel={renderLabel}
                renderNotch={renderNotch}
                onValueChanged={handleValueChange}
              />
            </View>

            <View className="px-6">
              <Button
                action="secondary"
                className="mb-3 !h-20"
                onPress={handleApplyFilters}
              >
                <ButtonText>Apply Filters</ButtonText>
              </Button>

              <Button className="mb-10 !h-20">
                <ButtonText className="!text-secondary">
                  Clear Filters
                </ButtonText>
              </Button>
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </>
  );
};

export default Search;
