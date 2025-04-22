import React, { useEffect, useRef } from "react";
import {
  Animated,
  View,
  useColorScheme,
  Easing,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

const { width } = Dimensions.get("window");

const RecipeDetailsSkeleton = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  // Animation values
  const opacity = useRef(new Animated.Value(0.4)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Default colors based on theme
  const defaultBackgroundColor = isDarkMode
    ? "rgba(255, 255, 255, 0.2)"
    : "rgba(0, 0, 0, 0.2)";

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.02,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.4,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const SkeletonItem = ({ style }: any) => (
    <Animated.View
      style={[
        style,
        {
          backgroundColor: defaultBackgroundColor,
          opacity,
          transform: [{ scale }],
          borderRadius: 8,
        },
      ]}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="relative">
        {/* Image placeholder */}
        <SkeletonItem style={{ width: "100%", height: 384 }} />

        {/* Header controls */}
        <View
          className="flex flex-row justify-between w-full absolute top-0 py-12 px-6"
          pointerEvents="box-none"
        >
          <SkeletonItem style={{ width: 40, height: 40, borderRadius: 8 }} />
          <View className="flex flex-row gap-2 items-center">
            <SkeletonItem style={{ width: 80, height: 40, borderRadius: 8 }} />
            <SkeletonItem style={{ width: 40, height: 40, borderRadius: 8 }} />
          </View>
        </View>

        {/* Content area */}
        <View className="px-6 pt-6 pb-20 rounded-tl-[30px] rounded-tr-[30] -mt-10 bg-background">
          {/* Menu icon */}
          <View className="flex flex-row justify-end py-1">
            <SkeletonItem
              style={{ width: 25, height: 25, borderRadius: 12.5 }}
            />
          </View>

          {/* Title and time */}
          <View className="w-full fex flex-row items-center justify-between">
            <SkeletonItem
              style={{ width: width * 0.6, height: 32, marginTop: 8 }}
            />
            <View className="flex flex-row items-center justify-between gap-1.5">
              <SkeletonItem style={{ width: 80, height: 20 }} />
            </View>
          </View>

          {/* Description */}
          <SkeletonItem style={{ width: "100%", height: 60, marginTop: 12 }} />

          {/* Nutrition info grid */}
          <View className="flex flex-row flex-wrap mt-3 mb-3">
            {[1, 2, 3, 4].map((item) => (
              <View
                key={item}
                className="basis-1/2 flex flex-row items-center gap-3 py-2"
              >
                <SkeletonItem
                  style={{ width: 40, height: 40, borderRadius: 8 }}
                />
                <SkeletonItem style={{ width: 80, height: 20 }} />
              </View>
            ))}
          </View>

          {/* Servings box */}
          <SkeletonItem
            style={{
              width: "100%",
              height: 80,
              marginBottom: 20,
              borderRadius: 16,
            }}
          />

          {/* Tabs */}
          <SkeletonItem
            style={{
              width: "100%",
              height: 50,
              marginBottom: 20,
              borderRadius: 16,
            }}
          />

          {/* Ingredients/Instructions list */}
          <View>
            {[1, 2, 3, 4, 5].map((item) => (
              <SkeletonItem
                key={item}
                style={{
                  width: "100%",
                  height: 60,
                  marginBottom: 12,
                  borderRadius: 12,
                }}
              />
            ))}
          </View>

          {/* Start cooking button */}
          <SkeletonItem
            style={{
              width: "100%",
              height: 64,
              marginTop: 24,
              marginBottom: 24,
              borderRadius: 12,
            }}
          />

          {/* Reviews section */}
          <SkeletonItem
            style={{
              width: "100%",
              height: 120,
              marginBottom: 32,
              borderRadius: 12,
            }}
          />

          {/* Divider */}
          <SkeletonItem
            style={{ width: "100%", height: 2, marginBottom: 28 }}
          />

          {/* Author section */}
          <View className="flex flex-row gap-3.5 mb-10">
            <SkeletonItem style={{ width: 56, height: 56, borderRadius: 28 }} />
            <View>
              <SkeletonItem
                style={{ width: 120, height: 20, marginBottom: 6 }}
              />
              <SkeletonItem style={{ width: 200, height: 16 }} />
            </View>
          </View>

          {/* Related recipes */}
          <View className="mt-8">
            <SkeletonItem
              style={{ width: 150, height: 24, marginBottom: 16 }}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex flex-row gap-4">
                {[1, 2, 3].map((item) => (
                  <SkeletonItem
                    key={item}
                    style={{
                      width: 140,
                      height: 100,
                      marginRight: 16,
                      borderRadius: 16,
                    }}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipeDetailsSkeleton;
