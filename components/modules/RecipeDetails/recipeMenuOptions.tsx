import React, { useState } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";

import { Bookmark, Cookie, ShoppingCart, Soup } from "lucide-react-native";

import MealSchedule from "../modals/MealSchedule";
import SaveCookbook from "../modals/SaveCookbook";
import { SafeAreaView } from "react-native-safe-area-context";

const RecipeMenuOptions = () => {
  const [showMealScheduleModal, setShowMealScheduleModal] = useState(false);
  const [showSaveCookbookModal, setShowSaveCookbookModal] = useState(false);
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <SafeAreaView className="flex flex-col w-full h-full pl-7 bg-background">
      <View>
        <Pressable
          className="flex flex-row items-center mb-11 gap-4"
          onPress={() => setShowMealScheduleModal(true)}
        >
          <Soup color={isDark ? "#fff" : "#000"} size={25} />
          <Text className="text-foreground/80 text-lg font-medium">
            Meal Planning
          </Text>
        </Pressable>
        <MealSchedule
          showMealScheduleModal={showMealScheduleModal}
          setShowMealScheduleModal={setShowMealScheduleModal}
        />
        {/* <Pressable className="flex flex-row items-center mb-11 gap-4">
          <Bookmark color={isDark ? "#fff" : "#000"} size={25} />
          <Text className="!text-foreground/80 text-lg font-medium">
            Save for later
          </Text>
        </Pressable> */}
        <Pressable
          className="flex flex-row items-center mb-11 gap-4"
          onPress={() => setShowSaveCookbookModal(true)}
        >
          <Cookie color={isDark ? "#fff" : "#000"} size={25} />
          <Text className="text-foreground/80 text-lg font-medium">
            Save for cookbook
          </Text>
        </Pressable>
        <SaveCookbook
          showSaveCookbookModal={showSaveCookbookModal}
          setShowSaveCookbookModal={setShowSaveCookbookModal}
        />
        {/* <Pressable className="flex flex-row items-center mb-11 gap-4">
          <ShoppingCart color={isDark ? "#fff" : "#000"} size={25} />
          <Text className="text-foreground/80 text-lg font-medium">
            Add to grocerylist
          </Text>
        </Pressable> */}
      </View>
    </SafeAreaView>
  );
};

export default RecipeMenuOptions;
