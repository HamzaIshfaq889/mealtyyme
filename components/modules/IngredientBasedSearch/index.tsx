import { Button, ButtonText } from "@/components/ui/button";
import { capitalizeWords } from "@/utils";
import { router } from "expo-router";
import { ArrowLeft, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { ScrollView } from "react-native-gesture-handler";

// Ingredient type
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

// Dummy dataset
const dummyIngredients: Ingredient[] = [
  {
    ingredient: {
      id: 1,
      spoonacular_id: 101,
      name: "Tomato",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 2,
    unit: "pieces",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 2,
      spoonacular_id: 102,
      name: "Cheese",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 100,
    unit: "grams",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 3,
      spoonacular_id: 103,
      name: "Basil",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 5,
    unit: "leaves",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 4,
      spoonacular_id: 104,
      name: "Garlic",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 3,
    unit: "cloves",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 5,
      spoonacular_id: 105,
      name: "Onion",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 1,
    unit: "piece",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 6,
      spoonacular_id: 106,
      name: "Olive Oil",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 2,
    unit: "tbsp",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 7,
      spoonacular_id: 107,
      name: "Salt",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 1,
    unit: "tsp",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 8,
      spoonacular_id: 108,
      name: "Black Pepper",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 0.5,
    unit: "tsp",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 9,
      spoonacular_id: 109,
      name: "Mushroom",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 150,
    unit: "grams",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 10,
      spoonacular_id: 110,
      name: "Chicken Breast",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 200,
    unit: "grams",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 11,
      spoonacular_id: 111,
      name: "Milk",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 1,
    unit: "cup",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 12,
      spoonacular_id: 112,
      name: "Egg",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 2,
    unit: "pieces",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 13,
      spoonacular_id: 113,
      name: "Butter",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 1,
    unit: "tbsp",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 14,
      spoonacular_id: 114,
      name: "Carrot",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 1,
    unit: "piece",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 15,
      spoonacular_id: 115,
      name: "Potato",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 2,
    unit: "pieces",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 16,
      spoonacular_id: 116,
      name: "Cumin",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 1,
    unit: "tsp",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 17,
      spoonacular_id: 117,
      name: "Paprika",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 1,
    unit: "tsp",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 18,
      spoonacular_id: 118,
      name: "Spinach",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 1,
    unit: "cup",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 19,
      spoonacular_id: 119,
      name: "Rice",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 100,
    unit: "grams",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
  {
    ingredient: {
      id: 20,
      spoonacular_id: 120,
      name: "Yogurt",
      created_at: "2024-01-01",
      created_by: 1,
    },
    amount: 0.5,
    unit: "cup",
    created_at: "2024-01-01",
    created_by: 1,
    recipe_id: 10,
  },
];

const IngredientBasedSearch = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const [selectedItem, setSelectedItem] = useState<Ingredient | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const handleAddIngredient = () => {
    if (
      selectedItem &&
      !ingredients.some((i) => i.ingredient.id === selectedItem.ingredient.id)
    ) {
      setIngredients((prev) => [...prev, selectedItem]);
      setSelectedItem(null);
    }
  };

  const handleRemoveIngredient = (id: number) => {
    setIngredients((prev) => prev.filter((item) => item.ingredient.id !== id));
  };

  const handleFindRecipes = () => {
    if (!ingredients?.length) return;

    const encodedIngredients = encodeURIComponent(JSON.stringify(ingredients));

    router.push(
      `/(protected)/(nested)/find-recipe?ingredients=${encodedIngredients}`
    );
  };

  console.log(ingredients);

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
          closeOnBlur={true}
          closeOnSubmit={false}
          initialValue={{ id: "1" }}
          inputHeight={55}
          containerStyle={{
            borderRadius: 16, // outermost wrapper
            overflow: "hidden", // ensures children respect the border radius
          }}
          inputContainerStyle={{
            borderRadius: 16, // input container wrapper
            borderWidth: 2,
            borderColor: isDarkMode ? "#fff" : "#000",
            backgroundColor: isDarkMode ? "#000" : "#fff",
          }}
          textInputProps={{
            placeholder: "Type to find ingredient...",
            placeholderTextColor: isDarkMode ? "#aaa" : "#666",
            style: {
              paddingHorizontal: 10,
            },
          }}
          onSelectItem={(item) => {
            const matched = dummyIngredients.find(
              (i) => i.ingredient.id.toString() === item?.id
            );
            setSelectedItem(matched ?? null);
          }}
          dataSet={dummyIngredients.map((item) => ({
            id: item.ingredient.id.toString(),
            title: item.ingredient.name,
          }))}
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
        {ingredients.map((item, index) => (
          <View
            key={index}
            className={`rounded-2xl ${
              index === ingredients?.length - 1 ? "mb-6" : "mb-6"
            } ${isDarkMode && "bg-[#1D232B]"}`}
            style={{
              boxShadow: !isDarkMode ? "0px 2px 12px 0px rgba(0,0,0,0.05)" : "",
            }}
          >
            <View className="px-5 py-4">
              <View className="flex flex-row justify-between">
                <View className="flex flex-col gap-3">
                  <Text className="text-foreground text-xl font-medium leading-6">
                    {capitalizeWords(item?.ingredient?.name)}
                  </Text>
                  {/* <Text className="text-muted text-sm">
                    {Math.ceil(item?.amount)} {item?.unit}
                  </Text> */}
                </View>
                <TouchableOpacity
                  className="ml-4"
                  onPress={() => handleRemoveIngredient(item?.ingredient?.id)}
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
          className={`${!ingredients.length && "!bg-muted"}`}
        >
          <ButtonText>Find me a recipe</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default IngredientBasedSearch;
