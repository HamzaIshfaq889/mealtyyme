import React, { useState, useRef, useCallback, useMemo } from "react";

import SelectDropdown from "react-native-select-dropdown";

import { router } from "expo-router";

import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  SearchIcon,
  ChevronDown,
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
} from "@gorhom/bottom-sheet";

import Slider from "rn-range-slider";
import Thumb from "@/components/ui/slider/Thumb";
import Label from "@/components/ui/slider/Label";
import Rail from "@/components/ui/slider/Rail";
import RailSelected from "@/components/ui/slider/RailSelected";
import Notch from "@/components/ui/slider/Notch";

const options = ["Categories", "Ingredients"];

const categories = [
  { id: "1", name: "Relax Dinner" },
  { id: "2", name: "Kids Favourite" },
  { id: "3", name: "Family Meals" },
  { id: "4", name: "Quick Bites" },
  { id: "5", name: "Relax Dinner" },
  { id: "6", name: "Kids Favourite" },
  { id: "7", name: "Family Meals" },
  { id: "8", name: "Quick Bites" },
];

const savedRecipies = [
  {
    id: 1,
    recipiesImage: "",
    name: " Easy homemade beef burger",
    chef: "James spader",
  },
  {
    id: 2,
    recipiesImage: "",
    name: " Easy homemade beef burger",
    chef: "James spader",
  },
  {
    id: 3,
    recipiesImage: "",
    name: " Easy homemade beef burger",
    chef: "James spader",
  },
];

const recipesType = ["Salad", "Egg", "Cakes", "Chicken", "Meals", "Vegetable"];
const Search = () => {
  const scheme = useColorScheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selected, setSelected] = useState(options[0]);
  const [low, setLow] = useState<number>(25);
  const [high, setHigh] = useState<number>(75);

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

  return (
    <>
      <View className="bg-background w-full h-full">
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
        <View className="pl-6 mb-6">
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item, index }) => {
              const isFirstItem = index === 0;
              return isFirstItem ? (
                <>
                  <SelectDropdown
                    data={options}
                    defaultValue={selected}
                    onSelect={(selectedItem) => {
                      setSelected(selectedItem);
                    }}
                    renderButton={(selectedItem, isOpened) => (
                      <View className="flex-row items-center gap-4 px-6 py-2 bg-secondary rounded-full">
                        <Text className="flex-1 text-lg leading-6 font-semibold text-primary">
                          {selectedItem || "Select"}
                        </Text>
                        {isOpened ? (
                          <ChevronDown color="#fff" size={22} />
                        ) : (
                          <ChevronDown color="#fff" size={22} />
                        )}
                      </View>
                    )}
                    renderItem={(selectedItem, item, isSelected) => {
                      return (
                        <View
                          className={`px-4 py-2 ${
                            isSelected ? "bg-secondary" : "bg-accent "
                          }`}
                        >
                          <Text
                            className={`text-lg text-black ${
                              isSelected
                                ? "!text-background"
                                : "text-foreground"
                            }`}
                          >
                            {selectedItem}
                          </Text>
                        </View>
                      );
                    }}
                    dropdownStyle={{
                      borderRadius: 18,
                      backgroundColor: "#f1f3f5",
                      marginTop: -25,
                    }}
                    showsVerticalScrollIndicator={false}
                  />
                  <View className="h-[80%] bg-secondary w-0.5 ml-4 mt-2"></View>
                  <Button
                    action="secondary"
                    className={`rounded-full ml-4 px-10 py-2 bg-accent
                                        `}
                  >
                    <ButtonText
                      className={`text-base leading-6 !text-primary font-semibold`}
                    >
                      {item.name}
                    </ButtonText>
                  </Button>
                </>
              ) : (
                <Button
                  action="secondary"
                  className={`rounded-full px-10 py-2 bg-accent`}
                >
                  <ButtonText
                    className={`text-base leading-6 !text-primary font-semibold`}
                  >
                    {item.name}
                  </ButtonText>
                </Button>
              );
            }}
          />
        </View>
        <View className="px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-foreground">
              Popular Recipes
            </Text>
            <Pressable>
              <Text className="text-secondary pr-5 font-bold">View All</Text>
            </Pressable>
          </View>
          <View className="mt-3 space-y-10">
            {savedRecipies.map((recipe) => {
              return (
                <View
                  className="flex flex-row justify-between items-center py-5 px-3 rounded-2xl mb-5"
                  style={{
                    boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
                  }}
                  key={recipe?.id}
                >
                  <View className="flex flex-row gap-4">
                    {/* Will be replavce by image if the recipie */}
                    <View className="w-24 h-[80px] rounded-2xl bg-gray3"></View>
                    <View className="flex flex-col justify-between max-w-40">
                      <Text className="font-bold text-lg mb-1 leading-6 text-primary">
                        {recipe?.name}
                      </Text>
                      <View className="flex flex-row gap-2">
                        <View className="bg-gray3 w-1 h-1 p-3.5 rounded-full"></View>
                        <Text className="text-muted text-base ">
                          {recipe?.chef}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="mr-2 p-0.5 bg-secondary rounded-md">
                    <ArrowRight color="#fff" size={22} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          backdropComponent={BottomSheetBackdrop}
          enablePanDownToClose={true}
          enableContentPanningGesture={false}
          enableHandlePanningGesture={true}
          onChange={(index) => {
            if (index === -1 || index === 0) {
              bottomSheetRef.current?.close();
            }
          }}
        >
          <View className="bg-background w-full h-full">
            <Text className="font-bold text-2xl leading-8 text-foreground text-center mb-4 mt-8">
              Filter
            </Text>
            <Text className="text-xl font-bold text-foreground px-6 mb-6">
              Category
            </Text>

            <View className="mb-6">
              <BottomSheetFlatList
                data={categories}
                keyExtractor={(item) => item.id}
                horizontal
                contentContainerStyle={{ gap: 12, paddingLeft: 24 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Button
                    action="secondary"
                    className={`rounded-full px-10 py-2 bg-gray4`}
                  >
                    <ButtonText
                      className={`!text-lg leading-6 !text-primary !font-medium`}
                    >
                      {item.name}
                    </ButtonText>
                  </Button>
                )}
              />
            </View>

            <View className="px-6 mb-6">
              <Text className="text-xl font-bold text-foreground mb-6">
                Recipe Type
              </Text>

              <View className="flex flex-row flex-wrap justify-between ">
                {recipesType?.map((rec, index) => {
                  const isSelected = selectedIndexes.includes(index);

                  return (
                    <TouchableOpacity
                      key={index}
                      className={`basis-[31%] rounded-full bg-gray4 py-3 px-3 flex items-center justify-center mb-4 ${
                        isSelected ? "bg-secondary" : "bg-gray4"
                      }`}
                      onPress={() => handleSelection(index)}
                    >
                      <Text
                        className={`text-center text-foreground leading-6 font-medium ${
                          isSelected ? "!text-background" : "!text-foreground"
                        }`}
                      >
                        {rec}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
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
                max={300}
                step={1}
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
              <Button action="secondary" className="mb-3 !h-20">
                <ButtonText>Apply Filters</ButtonText>
              </Button>
              <Button className="bg-background">
                <ButtonText className="!text-secondary">
                  Clear Filters
                </ButtonText>
              </Button>
            </View>
          </View>
        </BottomSheet>
      </View>
    </>
  );
};

export default Search;
