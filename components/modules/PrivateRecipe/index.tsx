import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { router } from "expo-router";
import LottieView from "lottie-react-native";

import { ArrowLeft, ChevronRight, Clock, Star } from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
  Layout,
  Easing,
} from "react-native-reanimated";

import { savePrivateRecipe, scrapeRecipe } from "@/services/privateRecipe";
import { PrivateRecipe } from "@/lib/types/privateRecipe";

import { Input, InputField } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { checkisProUser } from "@/utils";
import FouroFour from "../../../assets/svgs/404recipe.svg";

const ScrapeRecipe = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [recipe, setRecipe] = useState<PrivateRecipe | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLimitError, setIsLimitError] = useState(false);
  const status = useSelector(
    (state: any) =>
      state.auth.loginResponseType.customer_details?.subscription?.status
  );
  const isProUser = checkisProUser(status);

  // Add refs for Lottie animations
  const loadingAnimationRef = useRef<LottieView>(null);
  const limitAnimationRef = useRef<LottieView>(null);
  const cookingAnimationRef = useRef<LottieView>(null);
  const loginAnimationRef = useRef<LottieView>(null);

  // Cleanup function
  useEffect(() => {
    return () => {
      // Stop all animations
      loadingAnimationRef.current?.reset();
      limitAnimationRef.current?.reset();
      cookingAnimationRef.current?.reset();
      loginAnimationRef.current?.reset();

      // Clear all state
      setIsLoading(false);
      setIsAdding(false);
      setWebsiteUrl("");
      setRecipe(null);
      setErrorMessage(null);
      setIsLimitError(false);
    };
  }, []);

  const isValidUrl = (url: string) => {
    const pattern = /^(https?:\/\/)?([a-z\d-]+\.)+[a-z]{2,6}(:\d+)?(\/.*)?$/i;
    return pattern.test(url);
  };

  const handlePressSave = async () => {
    setIsAdding(true);
    try {
      const savedRecipes = await savePrivateRecipe(recipe);
      router.back();
      setRecipe(null);
    } catch (error: any) {
      Alert.alert(
        "Something went wronf",
        error.message || "An unexpected error occurred."
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleIconPress = async () => {
    if (!websiteUrl.trim()) {
      Alert.alert("Error", "Please enter a website URL.");
      return;
    }

    if (!isValidUrl(websiteUrl)) {
      Alert.alert("Invalid URL", "Please enter a valid website URL.");
      return;
    }

    setIsLoading(true);
    try {
      const recipes = await scrapeRecipe(websiteUrl);
      const firstRecipe = recipes[0];

      setRecipe(firstRecipe); // ✅ Set in state
      setErrorMessage(null);
      setIsLimitError(false);
      console.log("Scraped Recipe:", firstRecipe);
    } catch (error: any) {
      console.log("Error details:", error); // Add detailed error logging

      // Handle Axios error format
      if (error.message?.includes("403") || error.response?.status === 403) {
        setErrorMessage(
          "You have reached your limit for importing recipes this month. Please try again next month."
        );
        setIsLimitError(true);
      } else {
        setErrorMessage(error.message || "An unexpected error occurred.");
        setIsLimitError(false);
      }
    } finally {
      setIsLoading(false);
    }
  };
  interface FadeInOutTextProps {
    text: string;
    fadeDuration: number; // Duration for fade-in/fade-out
  }

  const FadeInOutText: React.FC<FadeInOutTextProps> = ({
    text,
    fadeDuration,
  }) => {
    return (
      <Animated.View
        entering={FadeIn.duration(fadeDuration).easing(Easing.ease)} // Fade in with specified duration
        exiting={FadeOut.duration(fadeDuration).easing(Easing.ease)} // Fade out with specified duration
        layout={Layout.springify()}
      >
        <Text style={{ fontSize: 18, color: "#333", marginTop: 10 }}>
          {text}
        </Text>
      </Animated.View>
    );
  };
  const fadeDuration = 1000;
  const slideDuration = 1000;
  return (
    <View className="flex-1 px-6 pt-16 pb-6 bg-background">
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(500)}
        className="flex-row items-center mb-8"
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft
            width={28}
            height={28}
            color={isDarkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <Text className="text-foreground text-xl font-semibold flex-1">
          Import your recipes
        </Text>
      </Animated.View>

      <Text className="text-muted text-sm">
        Just paste the link and we'll pull the recipe for you fast, easy and
        accurate.
      </Text>

      {/* Search Input */}
      <View className="flex-row items-center rounded-full py-2">
        <Input className="flex-1">
          <InputField
            type="text"
            value={websiteUrl}
            onChangeText={setWebsiteUrl}
            placeholder="Paste recipe url..."
            className="text-sm text-foreground"
            placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
          />
        </Input>
        <TouchableOpacity
          className={`ml-2 rounded-full p-3 ${
            isLoading ? "bg-gray-400" : "bg-secondary"
          }`}
          onPress={handleIconPress}
          disabled={isLoading}
        >
          <ChevronRight color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      <View className="items-center justify-center flex-1 w-full">
        {isLoading ? (
          <LottieView
            ref={loadingAnimationRef}
            source={require("../../../assets/lottie/loading.json")}
            autoPlay
            loop
            style={{ width: 300, height: 300 }}
          />
        ) : errorMessage ? (
          isLimitError ? (
            <View className="items-center justify-center p-4">
              <LottieView
                ref={limitAnimationRef}
                source={require("../../../assets/lottie/limit.json")}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
              <Text className="text-muted text-center mt-4">
                Oh no! It seem's like you have reached your limit of importing
                recipes for this month
              </Text>

              {!isProUser && (
                <Text className="text-muted text-center mt-4">
                  Please upgrade to Pro to continue importing recipes.
                </Text>
              )}
            </View>
          ) : (
            <View className="items-center justify-center p-4">
              <FouroFour />
              <Text className="text-primary text-center font-bold text-2xl mt-4">
                Recipe Not Found
              </Text>
              <Text className="text-muted text-center mt-1">
                We couldn't find the recipe you're looking for.
              </Text>
              <View className="flex flex-row items-center gap-2">
                <Text className="text-primary font-bold text-2xl text-center mt-4">
                  Here's what you can do
                </Text>
              </View>
              <View className="flex flex-col items-center gap-2">
                <Text className="text-muted text-center mt-2">
                  ✓ Check the full url for accuracy
                </Text>
                <Text className="text-muted text-center mt-2">
                  ✓ Verify the recipe is available on the website
                </Text>
                <Text className="text-muted text-center mt-2">
                  ✓ Refresh if page was temporarily down
                </Text>
              </View>
            </View>
          )
        ) : isAdding ? (
          <View style={{ alignItems: "center" }}>
            <LottieView
              ref={cookingAnimationRef}
              source={require("../../../assets/lottie/cookinganimation.json")}
              autoPlay
              loop
              style={{ width: 400, height: 400 }}
            />
            <View style={{ height: 120, marginTop: 20 }}>
              <Animated.View
                entering={FadeIn.duration(500)}
                exiting={FadeOut.duration(500)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  opacity: 0,
                }}
              >
                <FadeInOutText
                  text="Gathering the ingredients..."
                  fadeDuration={fadeDuration}
                />
              </Animated.View>
              <Animated.View
                entering={FadeIn.duration(500).delay(2000)}
                exiting={FadeOut.duration(500)}
                style={{
                  position: "absolute",
                  top: 40,
                  left: 0,
                  right: 0,
                  opacity: 0,
                }}
              >
                <FadeInOutText
                  text="Ate some of them, oops..."
                  fadeDuration={fadeDuration}
                />
              </Animated.View>
              <Animated.View
                entering={FadeIn.duration(500).delay(4000)}
                exiting={FadeOut.duration(500)}
                style={{
                  position: "absolute",
                  top: 80,
                  left: 0,
                  right: 0,
                  opacity: 0,
                }}
              >
                <FadeInOutText
                  text="Almost there..."
                  fadeDuration={fadeDuration}
                />
              </Animated.View>
            </View>
          </View>
        ) : recipe ? (
          <>
            <ScrollView className="w-full mt-4">
              <View
                className="flex flex-row justify-between items-center p-4 rounded-2xl mb-5 bg-card"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 3,
                }}
              >
                <View className="flex flex-row gap-4 flex-1">
                  <View className="relative">
                    <Image
                      source={{ uri: recipe?.image }}
                      className="w-24 h-24 rounded-xl"
                      resizeMode="cover"
                    />
                  </View>

                  <View className="flex flex-col justify-between flex-1">
                    <View>
                      <Text
                        className="font-bold text-lg mb-1 text-primary"
                        numberOfLines={1}
                      >
                        {recipe?.title}
                      </Text>

                      <View className="flex flex-row items-center gap-2 mb-2">
                        <Text className="text-muted text-sm">
                          {recipe?.host}
                        </Text>
                      </View>
                    </View>

                    <View className="flex flex-row gap-3">
                      <View className="flex flex-row items-center gap-1">
                        <Clock color="#6b7280" size={16} />
                        <Text className="text-muted text-sm">
                          {recipe?.total_time}
                        </Text>
                      </View>

                      <View className="flex flex-row items-center gap-1">
                        <Star color="#6b7280" size={16} />
                        <Text className="text-muted text-sm">
                          {recipe?.ratings}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Bottom Button */}
            <TouchableOpacity
              className="w-full mt-4 bg-secondary py-4 mb-2 rounded-xl items-center"
              onPress={handlePressSave}
            >
              {isAdding ? (
                <View style={{ alignItems: "center" }}>
                  <Animated.View
                    entering={FadeIn.duration(500)}
                    exiting={FadeOut.duration(500)}
                    style={{ height: 30 }}
                  >
                    {isAdding && (
                      <>
                        <Animated.View
                          entering={FadeIn.duration(500)}
                          exiting={FadeOut.duration(500)}
                          style={{ position: "absolute" }}
                        >
                          <FadeInOutText
                            text="Gathering the ingredients..."
                            fadeDuration={fadeDuration}
                          />
                        </Animated.View>
                      </>
                    )}
                  </Animated.View>
                </View>
              ) : (
                <Text className="text-white font-semibold">Save Recipe</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <LottieView
            ref={loginAnimationRef}
            source={require("../../../assets/lottie/loginanimation.json")}
            autoPlay
            loop
            style={{ width: 400, height: 400 }}
          />
        )}
      </View>
    </View>
  );
};

export default ScrapeRecipe;
