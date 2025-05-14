import { Button, ButtonText } from "@/components/ui/button";
import { useIngredientsQuery } from "@/redux/queries/recipes/useStaticFilter";
import { capitalizeWords } from "@/utils";
import { router } from "expo-router";
import {
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  Trash2,
  Utensils,
} from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
  Layout,
} from "react-native-reanimated";
import React, { useRef, useState, useEffect } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import {
  AutocompleteDropdown,
  IAutocompleteDropdownRef,
} from "react-native-autocomplete-dropdown";
import { ScrollView } from "react-native-gesture-handler";
import { Ingredient } from "@/lib/types/recipe";

const IngredientBasedSearch = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const [selectedItem, setSelectedItem] = useState<
    Ingredient["ingredient"] | null
  >(null);
  const [addedIngredients, setAddedIngredients] = useState<
    Ingredient["ingredient"][]
  >([]);
  const [searchText, setSearchText] = useState("");
  const dropdownController = useRef<IAutocompleteDropdownRef>(null);

  const { data: response, isLoading } = useIngredientsQuery({
    search: searchText,
  });
  const fetchedIngredients = response?.results || [];

  useEffect(() => {
    if (shouldOpenDropdown && fetchedIngredients.length > 0) {
      dropdownController.current?.open();
      setShouldOpenDropdown(false); // prevent it from opening again
    }
  }, [fetchedIngredients]);

  const handleAddIngredient = () => {
    if (!selectedItem || addedIngredients.some((i) => i.id === selectedItem.id))
      return;
    setAddedIngredients((prev) => [...prev, selectedItem]);
    setSelectedItem(null);
    setSearchText("");
  };

  const handleRemoveIngredient = (id: number) => {
    setAddedIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFindRecipes = () => {
    if (!addedIngredients.length) return;
    const encodedIngredients = encodeURIComponent(
      JSON.stringify(addedIngredients)
    );
    router.push(
      `/(protected)/(nested)/find-recipe?ingredients=${encodedIngredients}`
    );
  };

  const [shouldOpenDropdown, setShouldOpenDropdown] = useState(true);

  return (
    <View className="w-full h-full px-6 pt-20 pb-6 flex flex-col relative">
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(500)}
        className="flex-row items-center mb-6"
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft
            width={30}
            height={30}
            color={isDarkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <Text className="text-foreground text-2xl font-semibold ml-2">
          What's in your kitchen?
        </Text>
      </Animated.View>

      {/* Search */}
      <Animated.View
        entering={FadeIn.delay(200).duration(500)}
        className="mb-6"
      >
        <AutocompleteDropdown
          clearOnFocus={false}
          closeOnBlur={false}
          closeOnSubmit={false}
          inputHeight={60}
          useFilter={false}
          controller={(controller) => {
            dropdownController.current = controller;
          }}
          containerStyle={{
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 8,
            shadowColor: isDarkMode ? "#fff" : "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          inputContainerStyle={{
            borderRadius: 16,
            borderWidth: 2,
            borderColor: isDarkMode ? "#fff" : "#000",
            backgroundColor: isDarkMode ? "#000" : "#fff",
            paddingHorizontal: 12,
          }}
          textInputProps={{
            placeholder: "Search for ingredients...",
            placeholderTextColor: isDarkMode ? "#aaa" : "#666",
            style: {
              color: isDarkMode ? "#fff" : "#000",
              paddingHorizontal: 10,
              fontSize: 16,
              fontFamily: "Inter-Medium",
            },
            onChangeText: (text) => {
              setSearchText(text);
              setShouldOpenDropdown(true);
            },
            value: searchText,
            onFocus: () => {
              if (shouldOpenDropdown) {
                dropdownController.current?.open();
              }
            },
          }}
          onSelectItem={(item) => {
            const matched = fetchedIngredients.find(
              (i) => i.id.toString() === item?.id
            );
            if (!matched) return;

            const alreadyAdded = addedIngredients.some(
              (i) => i.id === matched.id
            );
            if (alreadyAdded) return;

            setAddedIngredients((prev) => [...prev, matched]);
            setSearchText("");
            setShouldOpenDropdown(false);
            dropdownController.current?.clear();
          }}
          loading={isLoading}
          dataSet={fetchedIngredients.map((item) => ({
            id: item.id.toString(),
            title: capitalizeWords(item.name),
          }))}
          suggestionsListTextStyle={{
            color: isDarkMode ? "#fff" : "#000",
            fontFamily: "Inter-Regular",
          }}
          suggestionsListContainerStyle={{
            backgroundColor: isDarkMode ? "#1D232B" : "#fff",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isDarkMode ? "#333" : "#eee",
            marginTop: 8,
            maxHeight: 300,
          }}
          renderItem={(item, isSelected) => (
            <View
              className="px-4 py-3"
              style={{
                backgroundColor: isSelected
                  ? isDarkMode
                    ? "#2A3441"
                    : "#f5f5f5"
                  : "transparent",
                borderBottomWidth: 1,
                borderBottomColor: isDarkMode ? "#333" : "#eee",
              }}
            >
              <Text
                style={{
                  color: isDarkMode ? "#fff" : "#000",
                  fontSize: 15,
                  fontFamily: isSelected ? "Inter-SemiBold" : "Inter-Regular",
                }}
              >
                {item.title}
              </Text>
            </View>
          )}
          emptyResultText="No ingredients found"
          EmptyResultComponent={
            <View className="p-4 items-center">
              <Text
                className={`text-center py-4 text-base ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
                style={{ fontFamily: "Inter-Medium" }}
              >
                No ingredients match your search
              </Text>
            </View>
          }
          rightButtonsContainerStyle={{
            right: 8,
            backgroundColor: "transparent",
          }}
        />
        <Text className="text-foreground/60 text-xs ml-2 mt-1">
          Search for ingredients to add to your list
        </Text>
      </Animated.View>

      {/* Ingredient List */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-foreground font-medium text-lg">
            Your Ingredients
          </Text>
          {addedIngredients.length > 0 && (
            <Text className="text-foreground/60 text-sm">
              {addedIngredients.length}{" "}
              {addedIngredients.length === 1 ? "item" : "items"}
            </Text>
          )}
        </View>

        <ScrollView
          className="px-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {addedIngredients.length === 0 ? (
            <Animated.View
              entering={FadeIn}
              className="items-center justify-center py-8"
            >
              <Text className="text-foreground/50 text-base text-center">
                Add ingredients to get started
              </Text>
            </Animated.View>
          ) : (
            addedIngredients.map((item, index) => (
              <Animated.View
                entering={SlideInRight.delay(index * 100)}
                exiting={SlideOutRight}
                layout={Layout.springify()}
                key={item.id}
                className={`rounded-2xl mb-4 ${
                  isDarkMode ? "bg-[#1D232B]" : "bg-foreground/5"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 12,
                  elevation: 3,
                }}
              >
                <View className="px-5 py-4">
                  <View className="flex flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-full bg-foreground/10 items-center justify-center mr-3">
                        <Utensils
                          size={18}
                          color={isDarkMode ? "#fff" : "#000"}
                        />
                      </View>
                      <Text className="text-foreground text-lg font-medium">
                        {capitalizeWords(item?.name)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="p-2 rounded-full bg-foreground/10"
                      onPress={() => handleRemoveIngredient(item?.id)}
                    >
                      <Trash2 size={18} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Bottom Button */}
      <Animated.View entering={FadeIn.delay(500)} className="mt-4 mb-4">
        <TouchableOpacity
          onPress={handleFindRecipes}
          disabled={!addedIngredients.length}
          className={`rounded-xl ${
            !addedIngredients.length ? "!bg-muted" : "bg-secondary"
          } h-14 flex-row items-center justify-center`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Text
            className={`font-semibold text-lg ${
              !addedIngredients.length ? "text-foreground/50" : "text-white"
            }`}
          >
            Find Recipes
          </Text>
          {addedIngredients.length > 0 && (
            <ChevronRight size={20} color="#fff" className="ml-2" />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default IngredientBasedSearch;
