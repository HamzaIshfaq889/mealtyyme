import React, { RefObject, useCallback, useMemo, useState } from "react";

import { Text, useColorScheme, View } from "react-native";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import {
  useCategoriesQuery,
  useCuisinesQuery,
  useDietsQuery,
} from "@/redux/queries/recipes/useStaticFilter";

import { capitalizeWords } from "@/utils";

import Slider from "rn-range-slider";
import { ButtonText, Button } from "@/components/ui/button";
import Rail from "@/components/ui/slider/Rail";
import RailSelected from "@/components/ui/slider/RailSelected";
import Label from "@/components/ui/slider/Label";
import Notch from "@/components/ui/slider/Notch";
import Thumb from "@/components/ui/slider/Thumb";

type FilterProps = {
  bottomSheetRef: RefObject<BottomSheet>;
  categoriesIds: number[];
  setCategoriesIds: React.Dispatch<React.SetStateAction<number[]>>;
  cusinesIds: number[];
  setCuisinesIds: React.Dispatch<React.SetStateAction<number[]>>;
  dietIds: number[];
  setDietIds: React.Dispatch<React.SetStateAction<number[]>>;
  refetch: any;
};

const Filters = ({
  bottomSheetRef,
  categoriesIds,
  cusinesIds,
  dietIds,
  setCategoriesIds,
  setCuisinesIds,
  setDietIds,
  refetch,
}: FilterProps) => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const snapPoints = useMemo(() => ["90%"], []);
  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(1000);

  // Slider callbacks
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value: any) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const renderThumb = useCallback(
    (name: "high" | "low") => <Thumb name={name} />,
    []
  );

  const { data: cuisines = [] } = useCuisinesQuery();
  const { data: diets = [] } = useDietsQuery();
  const { data: categories = [] } = useCategoriesQuery();

  const handleValueChange = useCallback((low: number, high: number) => {
    setLow(low);
    setHigh(high);
  }, []);

  const toggleCategory = useCallback((id: number) => {
    setCategoriesIds((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  }, []);

  const toggleCuisines = useCallback((id: number) => {
    setCuisinesIds((prev) =>
      prev.includes(id)
        ? prev.filter((cuisineId) => cuisineId !== id)
        : [...prev, id]
    );
  }, []);

  const toggleDiets = useCallback((id: number) => {
    setDietIds((prev) =>
      prev.includes(id) ? prev.filter((dietId) => dietId !== id) : [...prev, id]
    );
  }, []);

  const handleApplyFilters = useCallback(() => {
    bottomSheetRef.current?.close();
    refetch();
  }, []);

  const clearFilters = useCallback(() => {
    setCategoriesIds([]);
    setCuisinesIds([]);
    setDietIds([]);
    bottomSheetRef.current?.close();
    refetch();
    // setLow(25);
    // setHigh(75);
  }, []);

  return (
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
        if (index === -1) {
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
          Cuisines
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
                  onPress={() => toggleCuisines(item.id)}
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

        <View className="px-6 flex flex-row w-full space-x-4 gap-2">
          <View className="flex-shrink">
            <Button onPress={clearFilters} className="w-full">
              <ButtonText className="!text-secondary">Clear Filters</ButtonText>
            </Button>
          </View>
          <View className="flex-shrink">
            <Button
              action="secondary"
              className="w-full"
              onPress={handleApplyFilters}
            >
              <ButtonText>Apply Filters</ButtonText>
            </Button>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default Filters;
