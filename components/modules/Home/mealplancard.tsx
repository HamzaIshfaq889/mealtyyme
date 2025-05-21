import React, { useEffect, useRef, useState } from "react";
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
import { router } from "expo-router";

type ProFeaturesCardProps = {
  handleNonPro?: () => void;
  handleLater?: () => void;
};

export default function MealPlanCard({}) {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const featuresAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const dateSlideAnim = useRef(new Animated.Value(0)).current;

  // Get current date and format it
  const [currentDate] = useState(new Date());
  const [isAnimating, setIsAnimating] = useState(false);
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const getDates = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = getDates();

  const animateDateChange = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    Animated.sequence([
      Animated.timing(dateSlideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(dateSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimating(false);
    });
  };

  useEffect(() => {
    // Initial animations
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

    // Start date animation loop
    const interval = setInterval(animateDateChange, 1000);
    return () => clearInterval(interval);
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
            {/* Centered Date Selector */}
            <View className="items-center mb-8">
              {/* Date circles row */}
              <View className="flex-row justify-center items-center w-full">
                {dates.map((date, index) => {
                  const isToday = index === 3;
                  const opacity = isToday
                    ? 1
                    : Math.max(0.3, 1 - Math.abs(index - 3) * 0.2);
                  const scale = isToday
                    ? 1
                    : Math.max(0.7, 1 - Math.abs(index - 3) * 0.1);

                  return (
                    <TouchableOpacity
                      key={index}
                      className={`items-center mx-1 ${isToday ? "z-10" : ""}`}
                      activeOpacity={0.8}
                    >
                      <Animated.View
                        style={{
                          opacity,
                          transform: [
                            { scale },
                            {
                              translateX: dateSlideAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [
                                  0,
                                  isToday ? 0 : index < 3 ? -10 : 10,
                                ],
                              }),
                            },
                          ],
                        }}
                        className={`${
                          isToday ? "bg-white" : "bg-white/30"
                        } rounded-full p-3 ${
                          isToday ? "w-16 h-16" : "w-12 h-12"
                        } justify-center items-center`}
                      >
                        <Text
                          className={`${
                            isToday ? "text-black font-bold" : "text-white"
                          } text-center ${isToday ? "text-lg" : "text-sm"}`}
                        >
                          {date.getDate()}
                        </Text>
                        <Text
                          className={`${
                            isToday ? "text-black font-bold" : "text-white"
                          } text-center text-xs`}
                        >
                          {dayNames[date.getDay()]}
                        </Text>
                      </Animated.View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Current month and year */}
            </View>

            {/* Description */}
            <Text className="text-white text-base mb-8 text-center">
              Plan your meals up to 30 days ahead with ease.
            </Text>

            {/* Start Meal Planning Button */}
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
                onPress={() => router.replace("/(protected)/(tabs)/meal-plan")}
              >
                <Text className="text-secondary font-bold text-center text-lg">
                  Start Meal Planning
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}
