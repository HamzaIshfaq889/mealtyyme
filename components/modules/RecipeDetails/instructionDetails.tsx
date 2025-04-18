import { router } from "expo-router";
import React from "react";

import { Pressable, Text, View } from "react-native";

const InstructionDetails = () => {
  const recipeSteps = [
    {
      step: 1,
      instruction:
        "Bake the tortilla strips: Coat a baking sheet with nonstick spray. Cut the tortillas into strips, drizzle with oil, and sprinkle with salt and pepper. Toss to coat, and bake at 425 degrees F until golden",
    },
    {
      step: 2,
      instruction:
        "In a medium skillet, heat the olive oil over medium heat. Add the mushrooms and cook, stirring only occasionally, until they begin to brown and soften, 3 to 4 minutes.",
    },
    {
      step: 3,
      instruction:
        "Stir in the walnuts and lightly toast for 1 to 2 minutes. Stir in the tamari and the chili powder.",
    },
    {
      step: 4,
      instruction:
        "Add the balsamic vinegar and stir again. Remove from the heat and season with salt and pepper to taste.",
    },
    {
      step: 5,
      instruction:
        "Assemble the salad with romaine lettuce, cabbage, black beans, radishes, tomatoes, avocado, jalapeños.",
    },
    {
      step: 6,
      instruction:
        "Drizzle with olive oil and sprinkle with sea salt. Serve with lime wedges and extra dressing on the side.",
    },
  ];

  return (
    <>
      <View className="flex flex-row justify-between mt-5">
        <View>
          <Text className="text-primary font-bold text-xl leading-5 mb-1">
            Instructions
          </Text>
        </View>
        <Pressable>
          <Text className="text-muted pr-5 font-bold">12 Steps</Text>
        </Pressable>
      </View>
      {recipeSteps.map((recipe, index) => {
        return (
          <View
            className="mt-10 flex flex-row items-start gap-4 p-5 rounded-2xl"
            style={{
              boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.2)",
            }}
            key={index}
          >
            <View className="bg-accent py-1.5 px-4 rounded-lg">
              <Text className="text-secondary font-bold text-2xl">
                {recipe.step}
              </Text>
            </View>
            <Text className="text-primary font-medium pr-16 leading-6">
              {recipe?.instruction}
            </Text>
          </View>
        );
      })}
    </>
  );
};

export default InstructionDetails;
