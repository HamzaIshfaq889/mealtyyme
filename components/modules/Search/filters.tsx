import React, { RefObject, useCallback, useMemo, useState } from "react";

import {
  Pressable,
  Text,
  useColorScheme,
  View,
  ScrollView,
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

  const [isOpen, setIsOpen] = useState(false);

  const { data: cuisines = [] } = useCuisinesQuery();
  const { data: diets = [] } = useDietsQuery();
  const { data: categories = [] } = useCategoriesQuery();

  const handleValueChange = useCallback(
    (low: number, high: number) => {
      setLow(low);
      setHigh(high);
    },
    [low, high]
  );

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

  const handleApplyFilters = useCallback(() => {
    console.log("hello there");
    bottomSheetRef.current?.close();
  }, [bottomSheetRef?.current]);

  const clearFilters = useCallback(() => {
    setCategoriesIds([]);
    setCuisinesIds([]);
    setDietIds([]);
    setLow(0);
    setHigh(1000);
    setProtien([0, 1000]);
    setCarbs([0, 700]);
    setFat([0, 100]);

    bottomSheetRef.current?.close();
  }, [categoriesIds, cusinesIds, dietIds, low, high, protien]);

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
      <SafeAreaView style={{ flex: 1 }} className="bg-background">
        <ScrollView className="w-full h-full ">
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

          <View className="px-6 mb-10">
            <Pressable
              className="flex flex-row justify-between items-center py-4 border-t border-foreground"
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
                {/* First Slider */}
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

                {/* Second Slider */}
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

                {/* Third Slider */}
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
              </View>
            )}
          </View>

          <View className="px-6 flex flex-row w-full space-x-4 gap-2 pb-10">
            <View className="flex-shrink">
              <Button onPress={clearFilters} className="w-full">
                <ButtonText className="!text-secondary">
                  Clear Filters
                </ButtonText>
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
        </ScrollView>
      </SafeAreaView>
    </BottomSheet>
  );
};

export default Filters;
