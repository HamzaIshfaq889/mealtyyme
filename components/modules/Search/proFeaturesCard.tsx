import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Sparkles,
  Zap,
  Star,
  ChevronRight,
  Medal,
  Filter,
  Trophy,
  UserPlus,
  Calendar,
} from "lucide-react-native";
import { useSelector } from "react-redux";
import { checkisSubscriptionCanceled } from "@/utils";

type ProFeaturesCardProps = {
  handleNonPro: () => void;
  handleLater: () => void;
};

export default function ProFeaturesCard({
  handleNonPro,
  handleLater,
}: ProFeaturesCardProps) {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const featuresAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  const status = useSelector(
    (state: any) =>
      state.auth.loginResponseType.customer_details?.subscription?.status
  );
  const isSubscriptionCanceled = checkisSubscriptionCanceled(status);

  useEffect(() => {
    // Card entrance animation
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
      // Features fade in sequentially
      Animated.timing(featuresAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Button appears with a bounce
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Platform specific styles
  const shadowStyle = Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
    },
    android: {
      elevation: 8,
    },
  });

  const features = [
    {
      icon: <Zap size={20} color="#f5f5f5" />,
      text: "Access more exclusive recipes",
    },
    {
      icon: <Filter size={20} color="#f5f5f5" />,
      text: "Apply multiple filters including nutrition",
    },
    {
      icon: <Trophy size={20} color="#f5f5f5" />,
      text: "Earn more gamification points",
    },
    {
      icon: <UserPlus size={20} color="#f5f5f5" />,
      text: "Increased access to ChefMate support",
    },
    {
      icon: <Calendar size={20} color="#f5f5f5" />,
      text: "Plan your meals up to 30 days ahead",
    },
  ];

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        shadowStyle,
      ]}
      className="rounded-3xl overflow-hidden "
    >
      <View>
        <LinearGradient
          colors={["#00AAFF", "#0077CC", "#66DDFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 24, borderRadius: 16 }} // p-6 = 24, rounded-2xl ≈ 16
        >
          {/* Header with icon */}
          <View className="flex-row items-center mb-5">
            <Sparkles size={26} color="#f5f5f5" />
            <Text className="text-white font-bold text-xl ml-2">
              Premium Experience
            </Text>
          </View>

          {/* Features list with animation */}
          <Animated.View
            style={{ opacity: featuresAnim }}
            className="mb-8 space-y-8"
          >
            {features.map((feature, index) => (
              <Animated.View
                key={index}
                style={{
                  opacity: featuresAnim,
                  transform: [
                    {
                      translateX: featuresAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                }}
                className="flex-row items-center mb-2"
              >
                <View className="mr-3 bg-white/20 p-2 rounded-full">
                  {feature.icon}
                </View>
                <Text className="text-white text-base flex-1">
                  {feature.text}
                </Text>
              </Animated.View>
            ))}
          </Animated.View>

          {/* CTA Buttons */}
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
            {/* Upgrade button */}
            <TouchableOpacity
              className="bg-white py-4 rounded-xl active:opacity-90 flex-row justify-center items-center"
              activeOpacity={0.8}
              onPress={handleNonPro}
              style={Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                },
                android: { elevation: 4 },
              })}
            >
              <Text className="text-purple-900 font-bold text-center text-lg mr-1">
                {isSubscriptionCanceled ? "Resume Now" : "Upgrade Now"}
              </Text>
              <ChevronRight size={20} color="#4c1d95" />
            </TouchableOpacity>

            {/* Later button - improved design */}
            <TouchableOpacity
              className="mt-4 py-3 rounded-xl border border-white/30 active:bg-white/10"
              activeOpacity={0.7}
              onPress={handleLater}
            >
              <Text className="text-white font-medium text-center">
                Maybe Later
              </Text>
            </TouchableOpacity>

            {/* Price tag */}
            <Text className="text-white text-center mt-5 opacity-90">
              Starting at just $4.99/month
            </Text>
          </Animated.View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
}
