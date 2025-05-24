import React, { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  Text,
  useColorScheme,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import {
  ArrowRight,
  BookmarkIcon,
  CircleUserRound,
  HeartIcon,
  Import,
  Settings,
  UserPen,
  UtensilsIcon,
} from "lucide-react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Button, ButtonText } from "@/components/ui/button";
import Cookbooks from "./Cookbooks";
import Savedrecipes from "./SavedRecipes";
import { useSelector } from "react-redux";
import { LoginResponseTypes } from "@/lib/types";
import MyRecipes from "./MyRecipes";

const Account = () => {
  const scheme = useColorScheme();
  const [currentTab, setCurrentTab] = useState("cookbooks");

  // Create separate shared values for each tab's animation
  const cookbooksScale = useSharedValue(1.05);
  const cookbooksFlex = useSharedValue(1);

  const savedRecipesScale = useSharedValue(1);
  const savedRecipesFlex = useSharedValue(0.7);

  const myRecipesScale = useSharedValue(1);
  const myRecipesFlex = useSharedValue(0.7);

  const auth: LoginResponseTypes = useSelector(
    (state: any) => state.auth.loginResponseType
  );

  useFocusEffect(
    useCallback(() => {
      // Reset to cookbooks tab when screen is focused
      handleTabPress("cookbooks");
    }, [])
  );

  const handleTabPress = (tab: React.SetStateAction<string>) => {
    setCurrentTab(tab);

    // Animate all tabs based on the selected tab
    if (tab === "cookbooks") {
      cookbooksScale.value = withSpring(1.05, { damping: 15 });
      cookbooksFlex.value = withSpring(1, { damping: 15 });

      savedRecipesScale.value = withSpring(1, { damping: 15 });
      savedRecipesFlex.value = withSpring(0.7, { damping: 15 });

      myRecipesScale.value = withSpring(1, { damping: 15 });
      myRecipesFlex.value = withSpring(0.7, { damping: 15 });
    } else if (tab === "savedrecipes") {
      cookbooksScale.value = withSpring(1, { damping: 15 });
      cookbooksFlex.value = withSpring(0.7, { damping: 15 });

      savedRecipesScale.value = withSpring(1.05, { damping: 15 });
      savedRecipesFlex.value = withSpring(1, { damping: 15 });

      myRecipesScale.value = withSpring(1, { damping: 15 });
      myRecipesFlex.value = withSpring(0.7, { damping: 15 });
    } else if (tab === "myrecipes") {
      cookbooksScale.value = withSpring(1, { damping: 15 });
      cookbooksFlex.value = withSpring(0.7, { damping: 15 });

      savedRecipesScale.value = withSpring(1, { damping: 15 });
      savedRecipesFlex.value = withSpring(0.7, { damping: 15 });

      myRecipesScale.value = withSpring(1.05, { damping: 15 });
      myRecipesFlex.value = withSpring(1, { damping: 15 });
    }
  };

  // Create animated styles for each tab
  const cookbooksStyle = useAnimatedStyle(() => {
    return {
      flex: cookbooksFlex.value,
      transform: [{ scale: cookbooksScale.value }],
    };
  });

  const savedRecipesStyle = useAnimatedStyle(() => {
    return {
      flex: savedRecipesFlex.value,
      transform: [{ scale: savedRecipesScale.value }],
    };
  });

  const myRecipesStyle = useAnimatedStyle(() => {
    return {
      flex: myRecipesFlex.value,
      transform: [{ scale: myRecipesScale.value }],
    };
  });

  return (
    <View className="w-full h-full py-16 bg-background">
      <View className="flex flex-row justify-between items-center px-6">
        <View style={{ width: 30 }} />
        <Text className="font-bold text-2xl text-primary">Account</Text>
        <Pressable
          onPress={() => router.push("/(protected)/(nested)/settings")}
        >
          <Settings color={scheme === "dark" ? "#fff" : "#000"} size={26} />
        </Pressable>
      </View>

      <View className="flex flex-row justify-between items-center py-4 mb-5 mt-12 rounded-3xl mx-4  px-6 bg-card">
        <View
          className={`flex flex-row items-center ${
            auth?.avatar_url ? "gap-4" : "gap-4"
          }`}
        >
          {auth?.image_url ? (
            <Image
              source={{ uri: auth?.image_url }}
              className="w-16 h-16 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <CircleUserRound
              size={36}
              strokeWidth={1}
              color={scheme === "dark" ? "#fff" : "#000"}
            />
          )}

          <View>
            <Text className="font-bold text-xl leading-5 mb-0.5 text-primary">
              {auth?.first_name || "User"}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex flex-row bg-card px-2  py-1 rounded-full mb-4 mx-4 shadow-sm items-center h-16">
        {/* Cookbooks Tab */}
        <Animated.View style={cookbooksStyle}>
          <Button
            className={`rounded-full h-full flex-row items-center justify-center ${
              currentTab === "cookbooks" ? "bg-secondary" : "bg-transparent"
            }`}
            onPress={() => handleTabPress("cookbooks")}
          >
            <BookmarkIcon
              className={`w-4 h-4 ${currentTab === "cookbooks" && " mr-2"}`}
              color={currentTab === "cookbooks" ? "#fff" : "#7CA982"}
            />
            {currentTab === "cookbooks" && (
              <ButtonText
                className="!text-white font-semibold !text-sm"
                size="xl"
              >
                Cookbooks
              </ButtonText>
            )}
          </Button>
        </Animated.View>

        {/* Saved Recipes Tab */}
        <Animated.View style={savedRecipesStyle}>
          <Button
            className={`rounded-full h-full flex-row items-center justify-center ${
              currentTab === "savedrecipes" ? "bg-secondary" : "bg-transparent"
            }`}
            onPress={() => handleTabPress("savedrecipes")}
          >
            <HeartIcon
              className={`w-4 h-4 ${currentTab === "savedrecipes" && "mr-2"}`}
              color={currentTab === "savedrecipes" ? "#fff" : "#7CA982"}
            />
            {currentTab === "savedrecipes" && (
              <ButtonText className="!text-white font-semibold !text-sm">
                Saved
              </ButtonText>
            )}
          </Button>
        </Animated.View>

        {/* My Recipes Tab */}
        <Animated.View style={myRecipesStyle}>
          <Button
            className={`rounded-full h-full flex-row items-center justify-center ${
              currentTab === "myrecipes" ? "bg-secondary" : "bg-transparent"
            }`}
            onPress={() => handleTabPress("myrecipes")}
          >
            <UtensilsIcon
              className={`w-4 h-4 ${currentTab === "myrecipes" && "mr-2"}`}
              color={currentTab === "myrecipes" ? "#fff" : "#7CA982"}
            />

            {currentTab === "myrecipes" && (
              <ButtonText className="!text-white font-semibold !text-sm">
                My Recipes
              </ButtonText>
            )}
          </Button>
        </Animated.View>
      </View>

      {currentTab === "cookbooks" ? (
        <ScrollView>
          <Cookbooks activeTab={currentTab} />
        </ScrollView>
      ) : currentTab === "savedrecipes" ? (
        <ScrollView>
          <Savedrecipes />
        </ScrollView>
      ) : (
        <>
          <MyRecipes />

          <View className="px-6 mb-10 bg-none py-12">
            {Platform?.OS === "ios" ? (
              <Button
                className="w-full !rounded-3xl !bg-primary"
                onPress={() =>
                  router.push("/(protected)/(nested)/scrape-recipe")
                }
                action="secondary"
              >
                <ButtonText>Find Recipes using URL</ButtonText>
              </Button>
            ) : (
              <Button
                className="w-full h-16"
                onPress={() =>
                  router.push("/(protected)/(nested)/scrape-recipe")
                }
                action="card"
              >
                <ButtonText>Find Recipes using URL</ButtonText>
              </Button>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default Account;
