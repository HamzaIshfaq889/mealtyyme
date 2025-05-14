import { Button, ButtonText } from "@/components/ui/button";
import { useIngredientsQuery } from "@/redux/queries/recipes/useStaticFilter";
import { capitalizeWords } from "@/utils";
import { router } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Clock,
  Search,
  ShoppingBag,
  Star,
  Trash2,
  Utensils,
} from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
  Layout,
  Easing,
} from "react-native-reanimated";
import React, { useRef, useState, useEffect } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  AutocompleteDropdown,
  IAutocompleteDropdownRef,
} from "react-native-autocomplete-dropdown";
import { ScrollView } from "react-native-gesture-handler";
import { Ingredient } from "@/lib/types/recipe";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import LottieView from "lottie-react-native";
import { savePrivateRecipe, scrapeRecipe } from "@/services/privateRecipe";
import { PrivateRecipe } from "@/lib/types/privateRecipe";

const ScrapeRecipe = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [recipe, setRecipe] = useState<PrivateRecipe | null>(null);

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
      console.log("Scraped Recipe:", firstRecipe);
    } catch (error: any) {
      Alert.alert(
        "Scraping Failed",
        error.message || "An unexpected error occurred."
      );
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
        layout={Layout.springify()} // Smooth layout transition
      >
        <Text style={{ fontSize: 18, color: "#333", marginTop: 10 }}>
          {text}
        </Text>
      </Animated.View>
    );
  };
  const fadeDuration = 1000; // Duration for fade-in/fade-out in ms
  const slideDuration = 1000; // Duration for slide-in/slide-out in ms
  return (
    <View className="flex-1 px-6 pt-20 pb-6">
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
          Let us help you get your recipes in one place
        </Text>
      </Animated.View>

      {/* Search Input */}
      <View className="flex-row items-center rounded-full py-2">
        <Input className="flex-1">
          <InputField
            type="text"
            value={websiteUrl}
            onChangeText={setWebsiteUrl}
            placeholder="Enter website url..."
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
            source={require("../../../assets/lottie/loading.json")}
            autoPlay
            loop
            style={{ width: 300, height: 300 }}
          />
        ) : isAdding ? (
          <View style={{ alignItems: "center" }}>
            <LottieView
              source={require("../../../assets/lottie/cookinganimation.json")}
              autoPlay
              loop
              style={{ width: 400, height: 400 }}
            />
            <Animated.View
              entering={SlideInRight.duration(slideDuration)} // Slide in the text from the right
              exiting={SlideOutRight.duration(slideDuration)} // Slide out the text to the right
            >
              <FadeInOutText
                text="Gathering the ingredients..."
                fadeDuration={fadeDuration}
              />
            </Animated.View>
            <Animated.View
              entering={SlideInRight.duration(slideDuration)}
              exiting={SlideOutRight.duration(slideDuration)}
            >
              <FadeInOutText
                text="Ate some of them, oops..."
                fadeDuration={fadeDuration}
              />
            </Animated.View>
            <Animated.View
              entering={SlideInRight.duration(slideDuration)}
              exiting={SlideOutRight.duration(slideDuration)}
            >
              <FadeInOutText
                text="Almost there..."
                fadeDuration={fadeDuration}
              />
            </Animated.View>
          </View>
        ) : recipe ? (
          <>
            <ScrollView className="w-full mt-4">
              <View
                className="flex flex-row justify-between items-center p-4 rounded-2xl mb-5 bg-background"
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
              <Text className="text-white font-semibold">Save Recipe</Text>
            </TouchableOpacity>
          </>
        ) : (
          <LottieView
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
