import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Recipe } from "@/lib/types/recipe";
import { sendChatBotMessage } from "@/services/chatbotApi";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import {
  ArrowRight,
  Clock,
  Flame,
  MailIcon,
  MessageCircle,
  Send,
  Star,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Pressable,
  Image,
} from "react-native";
import Animated, {
  Easing,
  withTiming,
  useSharedValue,
  withRepeat,
  withDelay,
  useAnimatedStyle,
} from "react-native-reanimated";

interface ChatMessage {
  _id: number;
  text: string;
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
      text: "👋 Well, well, whisk me away and call me a spatula—it’s Nibbles! Your pun-slinging, recipe-wrangling, flavor-blasting kitchen sidekick! 🎉 \nGot a beet-iful craving? Maybe thyme-travel to a cozy dish? Or perhaps lettuce tempt you with something egg-ceptional? Just say the word—I’ll olive to help! 🫒🔥 \nDish it out, and I’ll pan-handle the rest! (No knead to thank me… unless you’re dough inclined.) 😆 \n (Stuck? Type “clear” to zest-art fresh!) 🍋✨",
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
    const isRecipe = item.recipe; // Check if it's a recipe message

    return (
      <View
        className={`px-4 py-3 rounded-xl my-1 max-w-[90%]  ${
          item.user._id === 1
            ? "bg-secondary self-end"
            : "bg-background self-start"
        }`}
      >
        {item.text === "ChatBot is typing..." ? (
          <Text className="text-muted text-sm">Nibbles is typing....</Text>
        ) : isRecipe ? (
          <Pressable onPress={() => router.push(`/recipe/${item.recipe?.id}`)}>
            <View
              className="flex flex-row justify-between items-center p-2 rounded-2xl  bg-background w-[100%]"
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
                    source={{ uri: item.recipe?.image_url }}
                    className="w-24 h-24 rounded-xl"
                    resizeMode="cover"
                  />
                  {item.recipe?.is_featured && (
                    <View className="absolute top-1 right-1 bg-yellow-400 p-1 rounded-full">
                      <Star color="#fff" size={14} />
                    </View>
                  )}
                </View>

                <View className="flex flex-col justify-between flex-1">
                  <View>
                    <Text
                      className="font-bold text-lg mb-1 text-primary"
                      numberOfLines={1}
                    >
                      {item.recipe?.title}
                    </Text>

                    <View className="flex flex-row items-center gap-2 mb-2">
                      <Image
                        source={{ uri: item.recipe?.created_by.image_url }}
                        className="w-5 h-5 rounded-full"
                      />
                      <Text className="text-muted text-sm">
                        {item.recipe?.created_by.first_name}{" "}
                        {item.recipe?.created_by.last_name}
                      </Text>
                    </View>
                  </View>

                  <View className="flex flex-row gap-3">
                    <View className="flex flex-row items-center gap-1">
                      <Clock color="#6b7280" size={16} />
                      <Text className="text-muted text-sm">
                        {item.recipe?.ready_in_minutes} min
                      </Text>
                    </View>

                    <View className="flex flex-row items-center gap-1">
                      <Flame color="#6b7280" size={16} />
                      <Text className="text-muted text-sm">
                        {Math.ceil(item.recipe?.calories ?? 0)} Kcal
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="ml-2 p-2 bg-secondary rounded-full">
                <ArrowRight color="#fff" size={18} />
              </View>
            </View>
          </Pressable>
        ) : (
          <Text className={item.user._id === 1 ? "text-white" : "text-primary"}>
            {item.text}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 ">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        // keyboardVerticalOffset={tabBarHeight + 10} // lift content above tab
      >
        <View className="flex-1">
          <View className="p-4">
            <Text className="text-2xl font-bold text-center text-primary">
              Chat with Nibbles
            </Text>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderMessage}
            inverted
            keyboardShouldPersistTaps="handled"
            className="flex-1"
            contentContainerStyle={{
              padding: 16,
              paddingBottom: tabBarHeight + 80,
            }}
          />

          <View
            className="flex-row items-center px-3 py-2 "
            style={{ paddingBottom: tabBarHeight - 20 }}
          >
            <Input className="flex-1 mr-2">
              <InputSlot className="ml-1">
                <InputIcon
                  className="!w-6 !h-6 text-primary"
                  as={MessageCircle}
                />
              </InputSlot>
              <InputField
                type="text"
                placeholder="Type a message..."
                value={inputText}
                onChangeText={setInputText}
              />
            </Input>

            <TouchableOpacity
              className="bg-secondary rounded-full p-3 justify-center"
              onPress={handleSend}
            >
              <Send color={"white"} strokeWidth={1} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatBot;
