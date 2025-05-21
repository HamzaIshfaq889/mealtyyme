import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { router } from "expo-router";
import { MessageCircle } from "lucide-react-native";

export default function AskChefMate() {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const featuresAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(featuresAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="rounded-3xl mx-6 overflow-hidden">
      <LinearGradient
        colors={["#D35400", "#E67E22", "#F5B041"]}
        className="rounded-3xl"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View className="py-6 px-6  overflow-hidden">
          <View>
            <View className="flex justify-center items-center mb-4">
              <MessageCircle size={40} color="#fff" />
            </View>
            <Text className="text-white font-semibold text-xl mb-2 text-center">
              Need Help?
            </Text>
            <Text className="text-white font-semibold text-sm mb-6 text-center">
              Ask ChefMate anything about cooking!
            </Text>

            <Animated.View
              style={{
                transform: [
                  {
                    translateY: buttonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
                opacity: buttonAnim,
              }}
            >
              <TouchableOpacity
                className="bg-white py-4 rounded-3xl active:opacity-90 flex-row justify-center items-center"
                activeOpacity={0.8}
                onPress={() => router.replace("/(protected)/(tabs)/chat-bot")}
              >
                <Text className="text-secondary font-bold text-center text-lg">
                  Ask Chefmate
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}
