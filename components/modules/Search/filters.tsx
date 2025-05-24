import React, { RefObject, useCallback, useMemo, useState } from "react";

import {
  Pressable,
  Text,
  useColorScheme,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
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
import { ChevronDown, ChevronUp } from "lucide-react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Portal } from "@gorhom/portal";

type FilterProps = {
  bottomSheetRef: RefObject<BottomSheet>;
  categoriesIds: number[];
  setCategoriesIds: React.Dispatch<React.SetStateAction<number[]>>;
  cusinesIds: number[];
  setCuisinesIds: React.Dispatch<React.SetStateAction<number[]>>;
  dietIds: number[];
  setDietIds: React.Dispatch<React.SetStateAction<number[]>>;
  protien: number[];
  setProtien: React.Dispatch<React.SetStateAction<number[]>>;
  fat: number[];
  setFat: React.Dispatch<React.SetStateAction<number[]>>;
  carbs: number[];
  setCarbs: React.Dispatch<React.SetStateAction<number[]>>;
  calories: number[];
  readyInMinutes: number[];
  setReadyInMinutes: React.Dispatch<React.SetStateAction<number[]>>;
  setCalories: React.Dispatch<React.SetStateAction<number[]>>;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
};

const Filters = ({
  bottomSheetRef,
  categoriesIds,
  cusinesIds,
  dietIds,
  setCategoriesIds,
  setCuisinesIds,
  setDietIds,
  protien,
  setProtien,
  fat,
  setFat,
  carbs,
  setCarbs,
  calories,
  setCalories,
  handleApplyFilters,
  readyInMinutes,
  setReadyInMinutes,
  handleClearFilters,
}: FilterProps) => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const snapPoints = useMemo(() => ["90%"], []);

  // Slider callbacks
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value: any) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const renderThumb = useCallback(
    (name: "high" | "low") => <Thumb name={name} />,
    []
  );

  const [isOpen, setIsOpen] = useState(false);

  const { data: cuisines = [] } = useCuisinesQuery();
  const { data: diets = [] } = useDietsQuery();
  const { data: categories = [] } = useCategoriesQuery();

  const toggleCategory = useCallback(
    (id: number) => {
      setCategoriesIds((prev) =>
        prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
      );
    },
    [categoriesIds]
  );

  const toggleCuisines = useCallback(
    (id: number) => {
      setCuisinesIds((prev) =>
        prev.includes(id)
          ? prev.filter((cuisineId) => cuisineId !== id)
          : [...prev, id]
      );
    },
    [cusinesIds]
  );

  const toggleDiets = useCallback(
    (id: number) => {
      setDietIds((prev) =>
        prev.includes(id)
          ? prev.filter((dietId) => dietId !== id)
          : [...prev, id]
      );
    },
    [dietIds]
  );

  const handleProtienChange = useCallback(
    (low: number, high: number) => {
      setProtien([low, high]);
    },
    [protien[0], protien[1]]
  );

  const handleFatChange = useCallback(
    (low: number, high: number) => {
      setFat([low, high]);
    },
    [fat[0], fat[1]]
  );

  const handleCarbsChange = useCallback(
    (low: number, high: number) => {
      setCarbs([low, high]);
    },
    [carbs[0], carbs[1]]
  );

  const handleCaloriesChange = useCallback(
    (low: number, high: number) => {
      setCalories([low, high]);
    },
    [calories[0], calories[1]]
  );

  const handleMinutesChange = useCallback(
    (low: number, high: number) => {
      setReadyInMinutes([low, high]);
    },
    [readyInMinutes[0], readyInMinutes[1]]
  );

  const clearFilters = useCallback(() => {
    setCategoriesIds([]);
    setCuisinesIds([]);
    setDietIds([]);
    setProtien([0, 1000]);
    setCarbs([0, 700]);
    setFat([0, 100]);
    setCalories([0, 2000]);

    bottomSheetRef.current?.close();
  }, [categoriesIds, cusinesIds, dietIds, protien]);

  return (
    <Portal hostName="root-host">
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={BottomSheetBackdrop}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={true}
        handleStyle={{
          backgroundColor: isDarkMode ? "#1c1c1c" : "#fdf8f4",
          borderWidth: 0,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDarkMode ? "#888" : "#ccc",
        }}
        onChange={(index) => {
          if (index === 0) {
            bottomSheetRef.current?.close();
          }
        }}
      >
        <SafeAreaView style={{ flex: 1 }} className="bg-background">
          <ScrollView
            className="flex flex-col w-full h-full pt-4"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
    
          >
            <Text className="font-bold text-2xl leading-8 text-foreground text-center mb-3 mt-2.5">
              Filter
            </Text>
            <Text className="text-xl font-bold text-foreground px-6 mb-2.5">
              Category
            </Text>
            <View className="mb-4">
              <BottomSheetFlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                  gap: 12,
                  paddingHorizontal: 24,
                  paddingVertical: 16,
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = categoriesIds.includes(item.id);
                  return (
                    <Button
                      action="secondary"
                      onPress={() => toggleCategory(item.id)}
                      className={`w-full rounded-full px-2.5 !h-12 justify-start ${
                        isSelected ? "bg-secondary" : "bg-card"
                      }`}
                    >
                      <ButtonText
                        className={`!text-base leading-6 ${
                          isSelected ? "!text-white" : "!text-foreground"
                        } !font-medium`}
                      >
                        {capitalizeWords(item.name)}
                      </ButtonText>
                    </Button>
                  );
                }}
              />
            </View>

            <Text className="text-xl font-bold text-foreground px-6 mb-2.5">
              Cuisines
            </Text>

            <View className="mb-4">
              <BottomSheetFlatList
                data={cuisines}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                  gap: 12,
                  paddingHorizontal: 24,
                  paddingVertical: 16,
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = cusinesIds.includes(item.id);
                  return (
                    <Button
                      action="secondary"
                      onPress={() => toggleCuisines(item.id)}
                      className={`rounded-full px-2.5 !h-11 ${
                        isSelected ? "bg-secondary" : "bg-card"
                      }`}
                    >
                      <ButtonText
                        className={`!text-base leading-6 ${
                          isSelected ? "!text-white" : "!text-foreground"
                        } !font-medium`}
                      >
                        {capitalizeWords(item.name)}
                      </ButtonText>
                    </Button>
                  );
                }}
              />
            </View>

            <Text className="text-xl font-bold text-foreground px-6 mb-2.5">
              Diets
            </Text>

            <View className="mb-4">
              <BottomSheetFlatList
                data={diets}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                  gap: 12,
                  paddingHorizontal: 24,
                  paddingVertical: 16,
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = dietIds.includes(item.id);
                  return (
                    <Button
                      action="secondary"
                      onPress={() => toggleDiets(item.id)}
                      className={`rounded-full px-2.5 !h-11 ${
                        isSelected ? "bg-secondary" : "bg-card"
                      }`}
                    >
                      <ButtonText
                        className={`!text-base leading-6 ${
                          isSelected ? "!text-white" : "!text-foreground"
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
              <Pressable
                className="flex flex-row justify-between items-center py-4 border-t border-muted/40"
                onPress={() => setIsOpen(!isOpen)}
              >
                <Text className="text-lg font-semibold text-foreground">
                  Advanced Filters
                </Text>
                {isOpen ? (
                  <ChevronUp size={30} color="gray" />
                ) : (
                  <ChevronDown size={30} color="gray" />
                )}
              </Pressable>

              {isOpen && (
                <View className="mt-4">
                  <View className="mb-6">
                    <View className="flex flex-row justify-between mb-2">
                      <Text className="text-base font-medium text-foreground">
                        Protein Range
                      </Text>
                      <Text className="text-sm text-foreground">{`${protien[0]}-${protien[1]} g`}</Text>
                    </View>

                    <Slider
                      min={0}
                      max={500}
                      step={10}
                      floatingLabel
                      renderThumb={renderThumb}
                      renderRail={renderRail}
                      renderRailSelected={renderRailSelected}
                      renderLabel={renderLabel}
                      renderNotch={renderNotch}
                      onValueChanged={handleProtienChange}
                    />
                  </View>

                  <View className="mb-6">
                    <View className="flex flex-row justify-between mb-2">
                      <Text className="text-base font-medium text-foreground">
                        Fat Range
                      </Text>
                      <Text className="text-sm text-foreground">{`${fat[0]}-${fat[1]} g`}</Text>
                    </View>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      onValueChanged={handleFatChange}
                      floatingLabel
                      renderThumb={renderThumb}
                      renderRail={renderRail}
                      renderRailSelected={renderRailSelected}
                      renderLabel={renderLabel}
                      renderNotch={renderNotch}
                    />
                  </View>

                  <View className="mb-6">
                    <View className="flex flex-row justify-between mb-2">
                      <Text className="text-base font-medium text-foreground">
                        Carbs Range
                      </Text>
                      <Text className="text-sm text-foreground">{`${carbs[0]}-${carbs[1]} g`}</Text>
                    </View>
                    <Slider
                      min={0}
                      max={700}
                      step={10}
                      onValueChanged={handleCarbsChange}
                      floatingLabel
                      renderThumb={renderThumb}
                      renderRail={renderRail}
                      renderRailSelected={renderRailSelected}
                      renderLabel={renderLabel}
                      renderNotch={renderNotch}
                    />
                  </View>

                  <View className="mb-6">
                    <View className="flex flex-row justify-between mb-2">
                      <Text className="text-base font-medium text-foreground">
                        Calories Range
                      </Text>
                      <Text className="text-sm text-foreground">{`${calories[0]}-${calories[1]} g`}</Text>
                    </View>
                    <Slider
                      min={0}
                      max={2000}
                      step={10}
                      onValueChanged={handleCaloriesChange}
                      floatingLabel
                      renderThumb={renderThumb}
                      renderRail={renderRail}
                      renderRailSelected={renderRailSelected}
                      renderLabel={renderLabel}
                      renderNotch={renderNotch}
                    />
                  </View>

                  <View className="mb-6">
                    <View className="flex flex-row justify-between mb-2">
                      <Text className="text-base font-medium text-foreground">
                        Minutes Range
                      </Text>
                      <Text className="text-sm text-foreground">{`${readyInMinutes[0]}-${readyInMinutes[1]} minutes`}</Text>
                    </View>
                    <Slider
                      min={0}
                      max={300}
                      step={10}
                      onValueChanged={handleMinutesChange}
                      floatingLabel
                      renderThumb={renderThumb}
                      renderRail={renderRail}
                      renderRailSelected={renderRailSelected}
                      renderLabel={renderLabel}
                      renderNotch={renderNotch}
                    />
                  </View>
                </View>
              )}
            </View>

            <View className="mx-6">
              <View className="flex-shrink">
                <Button
                  action="secondary"
                  className="w-full"
                  onPress={handleApplyFilters}
                >
                  <ButtonText className="!text-white">Apply Filters</ButtonText>
                </Button>
              </View>
            </View>
            <View className="mx-6 text-center mt-8 mb-16">
              <TouchableOpacity onPress={handleClearFilters}>
                <Text className="font-semibold text-xl text-center text-secondary">
                  Clear Filters
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </BottomSheet>
    </Portal>
  );
};

export default Filters;
