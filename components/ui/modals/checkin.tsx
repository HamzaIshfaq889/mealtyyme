import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCircle, Calendar, Medal, DollarSign } from "lucide-react-native";
import { UserPointsData } from "@/lib/types/gamification";
import LottieView from "lottie-react-native";

type DailyCheckInCardProps = {
  handleCheckIn: () => void;
  handleSkip: () => void;
  userPointsData: UserPointsData | null;
};

export default function DailyCheckInCard({
  handleCheckIn,
  handleSkip,
  userPointsData,
}: DailyCheckInCardProps) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
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
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        shadowStyle,
      ]}
      className="rounded-3xl overflow-hidden"
    >
      <LinearGradient
        colors={["#00AAFF", "#0077CC", "#66DDFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 24, borderRadius: 24 }}
      >
        {/* Coin + Message */}
        <View className="items-center mb-8">
          <LottieView
            source={require("../../../assets/lottie/coin.json")}
            autoPlay
            loop={true}
            style={{ width: 100, height: 100 }}
          />
          <Text className="text-white text-lg font-bold  mb-1 text-center">
            Congratulations!
          </Text>
          <Text className="text-white text-base text-center">
            You’ve earned 5 points for checking in.
          </Text>
        </View>

        {/* Buttons */}
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
            className="bg-white py-4 rounded-xl active:opacity-90 flex-row justify-center items-center"
            activeOpacity={0.8}
            onPress={handleCheckIn}
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
              Collect Reward
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4 py-3 rounded-xl border border-white/30 active:bg-white/10"
            activeOpacity={0.7}
            onPress={handleSkip}
          >
            <Text className="text-white font-medium text-center">
              Maybe Later
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}
