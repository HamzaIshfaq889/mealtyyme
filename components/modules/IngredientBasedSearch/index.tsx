import { Button, ButtonText } from "@/components/ui/button";
import { useIngredientsQuery } from "@/redux/queries/recipes/useStaticFilter";
import { capitalizeWords } from "@/utils";
import { router } from "expo-router";
import { ArrowLeft, Trash2 } from "lucide-react-native";
import React, { useRef, useState, useEffect } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import {
  AutocompleteDropdown,
  IAutocompleteDropdownRef,
} from "react-native-autocomplete-dropdown";
import { ScrollView } from "react-native-gesture-handler";

export type Ingredient = {
  ingredient: {
    id: number;
    spoonacular_id: number;
    name: string;
    created_at: string;
    created_by: number;
  };
  amount: number;
  unit: string;
  created_at: string;
  created_by: number;
  recipe_id: number;
};

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
    if (fetchedIngredients.length > 0) {
      dropdownController.current?.open();
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

  return (
    <View className="w-full h-full px-6 py-16 flex flex-col relative">
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft
            width={30}
            height={30}
            color={isDarkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>
      </View>

      <View>
        <Text className="font-bold text-2xl text-foreground mb-1.5">
          What’s in your Kitchen?
        </Text>
        <Text className="text-foreground/90 leading-6">
          Enter your ingredients
        </Text>
      </View>

      <View className="my-4">
        <AutocompleteDropdown
          clearOnFocus={false}
          closeOnBlur={false}
          closeOnSubmit={false}
          inputHeight={55}
          useFilter={false}
          controller={(controller) => {
            dropdownController.current = controller;
          }}
          containerStyle={{
            borderRadius: 16,
            overflow: "hidden",
          }}
          inputContainerStyle={{
            borderRadius: 16,
            borderWidth: 2,
            borderColor: isDarkMode ? "#fff" : "#000",
            backgroundColor: isDarkMode ? "#000" : "#fff",
          }}
          textInputProps={{
            placeholder: "Type to find ingredient...",
            placeholderTextColor: isDarkMode ? "#aaa" : "#666",
            style: {
              color: isDarkMode ? "#fff" : "#000",
              paddingHorizontal: 10,
            },
            onChangeText: setSearchText,
            value: searchText,
          }}
          onSelectItem={(item) => {
            const matched = fetchedIngredients.find(
              (i) => i.id.toString() === item?.id
            );
            setSelectedItem(matched ?? null);
          }}
          loading={isLoading}
          dataSet={fetchedIngredients.map((item) => ({
            id: item.id.toString(),
            title: capitalizeWords(item.name),
          }))}
          suggestionsListTextStyle={{
            color: isDarkMode ? "#fff" : "#000",
          }}
          suggestionsListContainerStyle={{
            backgroundColor: isDarkMode ? "#1D232B" : "#fff",
          }}
          renderItem={(item) => (
            <Text
              className="p-3"
              style={{ color: isDarkMode ? "#fff" : "#000" }}
            >
              {item.title}
            </Text>
          )}
          emptyResultText="No ingredients found"
          EmptyResultComponent={
            <View>
              <Text
                className={`text-white text-center p-2 text-lg ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                No Ingredients Found
              </Text>
            </View>
          }
        />
      </View>

      <Button
        disabled={!selectedItem}
        onPress={handleAddIngredient}
        className={`${!selectedItem && "bg-muted"}`}
      >
        <ButtonText>Add Ingredient</ButtonText>
      </Button>

      <ScrollView className="mt-6 px-1.5">
        {addedIngredients.map((item, index) => (
          <View
            key={index}
            className={`rounded-2xl mb-6 ${isDarkMode && "bg-[#1D232B]"}`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <View className="px-5 py-4">
              <View className="flex flex-row justify-between">
                <View className="flex flex-col gap-3">
                  <Text className="text-foreground text-xl font-medium leading-6">
                    {capitalizeWords(item?.name)}
                  </Text>
                </View>
                <TouchableOpacity
                  className="ml-4"
                  onPress={() => handleRemoveIngredient(item?.id)}
                >
                  <Trash2 size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="mt-auto">
        <Button
          action="secondary"
          onPress={handleFindRecipes}
          className={`${!addedIngredients.length && "!bg-muted"}`}
        >
          <ButtonText>Find me a recipe</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default IngredientBasedSearch;
