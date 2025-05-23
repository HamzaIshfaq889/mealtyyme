import { Input, InputField } from "@/components/ui/input";
import { Recipe } from "@/lib/types/recipe";
import { sendChatBotMessage } from "@/services/chatbotApi";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import {
  Easing,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import CheMateAi from "@/assets/svgs/chef-mate-ai.svg";
import HorizontalRecipeCard from "../RecipeCards/horizontalRecipeCard";

interface ChatMessage {
  _id: number;
  text: string;
  heading?: string;
  createdAt: Date;
  recipe?: Recipe;
  user: {
    _id: number;
    name: string;
  };
}

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const scheme = useColorScheme();
  const tabBarHeight = useBottomTabBarHeight();
  const [isLoading, setIsLoading] = useState(false);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const messagesBOT = [
    "ChatBot is typing...",
    "Nibbles is finding a recipe for you...",
    "Nibbles is processing your request...",
    "Nibbles is searching for the best options...",
    "Nibbles is connecting you with the best match...",
  ];

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  // Set interval for changing the text message
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messagesBOT.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  // Trigger animations when the message changes
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000, easing: Easing.ease });
    translateY.value = withTiming(0, { duration: 1000, easing: Easing.ease });
  }, [messageIndex]);

  // Animated styles using useAnimatedStyle
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    const defaultMessage: ChatMessage = {
      _id: Date.now(),
      heading: "👋 Welcome to ChefMate!",
      text: "I'm your AI cooking assistant. I can help you find recipes based on your dietary needs, ingredients you have, or whatever you're craving!",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "ChatBot",
      },
    };
    setMessages([defaultMessage]);
  }, []);

  const handleSend = async () => {
    const trimmedInput = inputText.trim();

    // Case 1: If input is blank, do nothing
    if (!trimmedInput) return;

    // Case 2: If input is "clear", reset messages and history
    if (trimmedInput.toLowerCase() === "clear") {
      setMessages((prev) => (prev.length > 0 ? [prev[prev.length - 1]] : []));
      setInputText("");
      setInputHistory([]);
      return;
    }

    // Case 3: Send user message
    const userMessage: ChatMessage = {
      _id: Date.now(),
      text: trimmedInput,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: "You",
      },
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInputText("");

    const updatedHistory = [...inputHistory, trimmedInput];
    setInputHistory(updatedHistory);

    // Add loading message
    const loadingMessage: ChatMessage = {
      _id: Date.now() + 2,
      text: "ChatBot is typing...",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "ChatBot",
      },
    };

    setMessages((prev) => [loadingMessage, ...prev]);
    setIsLoading(true);

    try {
      const response = await sendChatBotMessage(updatedHistory);

      // Remove loading message
      setMessages((prev) =>
        prev.filter((msg) => msg.text !== "ChatBot is typing...")
      );

      // Main bot message
      const botMessage: ChatMessage = {
        _id: Date.now() + 1,
        text: response.reply,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "ChatBot",
        },
      };

      const updatedMessages = [botMessage];

      // Add recipe cards
      if (response.recipes && response.recipes.length > 0) {
        response.recipes.forEach((recipe: any, index: number) => {
          const recipeCard: ChatMessage = {
            _id: Date.now() + 2 + index,
            text: `${recipe.title ?? recipe.name ?? "Untitled Recipe"}`,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "ChatBot",
            },
            recipe: recipe,
          };
          updatedMessages.push(recipeCard);
        });
      } else {
        // Add a message if no recipes are found
        const noRecipesMessage: ChatMessage = {
          _id: Date.now() + 100,
          text: "Don’t worry, I’ve got a-peel (get it?) for this! If you’re craving something specific, just say “clear” to wipe the slate clean—like a freshly scrubbed skillet! I’m Nibbles, your pun-loving kitchen sidekick, here to knead your questions into tasty answers. Let’s taco ‘bout what you’re hungry for! 🌮✨ (Too cheesy? Nah, just gouda ‘nuff.) 🧀😉",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "ChatBot",
          },
        };
        updatedMessages.push(noRecipesMessage);
      }

      setMessages((prev) => [...updatedMessages, ...prev]);
    } catch (error: any) {
      setMessages((prev) =>
        prev.filter((msg) => msg.text !== "ChatBot is typing...")
      );
      const errorMessage: ChatMessage = {
        _id: Date.now() + 3,
        text: "Uh-oh! 🐾 Nibbles just had a full meal 🍽️ and is now too stuffed to process your request. 😅 Give Nibbles a moment to digest, and we’ll be back to serving you with a bite of fun in no time! 🐾🍴",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "ChatBot",
        },
      };
      setMessages((prev) => [errorMessage, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isRecipe = item.recipe;

    return (
      <View>
        {item.text === "ChatBot is typing..." ? (
          <View
            className={`p-4 rounded-xl mb-4 mx-6 ${
              item.user._id === 1
                ? "bg-foreground self-end"
                : "bg-background self-start"
            }`}
          >
            <Text className="text-muted text-sm">Nibbles is typing....</Text>
          </View>
        ) : isRecipe ? (
          item?.recipe ? (
            <View className="mx-6">
              <HorizontalRecipeCard recipe={item.recipe} />
            </View>
          ) : null
        ) : (
          <View
            className={`px-4 py-2.5 mb-4 mx-6 ${
              item.user._id === 1
                ? "bg-secondary self-end rounded-tl-2xl rounded-br-2xl rounded-bl-2xl"
                : "bg-card self-start rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"
            }`}
          >
            {item?.heading ? (
              <Text className="text-secondary text-lg font-700  leading-6 mb-3">
                {item.heading}
              </Text>
            ) : null}
            <Text
              className={`leading-7 ${
                item.user._id === 1 ? "text-white" : "!text-foreground"
              }`}
            >
              {item.text}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 w-full h-full pt-16">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-5 mx-6">
            <TouchableOpacity
              onPress={() => router.push("/(protected)/(tabs)")}
            >
              <ArrowLeft
                width={30}
                height={30}
                color={scheme === "dark" ? "#fff" : "#000"}
              />
            </TouchableOpacity>

            <View className="flex flex-row gap-3 items-center">
              <CheMateAi />
              <Text className="font-bold text-2xl text-secondary">
                ChefMate
              </Text>
            </View>

            <View style={{ width: 30 }} />
          </View>

          <View className="mx-6 pb-1.5">
            <View className="bg-[#fae1cb] rounded-full">
              <View className="bg-secondary w-[60%] py-1 rounded-full m-0"></View>
            </View>
            <View className="flex flex-row justify-between mt-2">
              <Text className="text-secondary text-sm leading-6 font-medium">
                Free Tokens Left
              </Text>
              <Text className="text-secondary text-sm leading-6 font-medium">
                65%
              </Text>
            </View>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderMessage}
            inverted
            keyboardShouldPersistTaps="handled"
            className="flex-1"
            scrollEnabled
          />

          <View
            className="flex-row items-center pt-4 pb-4 mx-6"
            style={{ paddingBottom: tabBarHeight + 20 }}
          >
            <Input className="flex-1 mr-2 py-1.5">
              <InputField
                type="text"
                placeholder="Message Chefmate"
                value={inputText}
                onChangeText={setInputText}
              />
            </Input>

            <TouchableOpacity
              className="bg-secondary rounded-full w-14 h-14 flex flex-col justify-center items-center"
              onPress={handleSend}
            >
              <ArrowRight color={"#fff"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatBot;
