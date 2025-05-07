import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react-native";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  useColorScheme,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useSelector } from "react-redux";

import FeaturedRecipes from "./featuredRecipes";
import PopularRecipes from "./popularRecipes";

import Svg1 from "@/assets/svgs/cookingfood.svg";
import LogoAPP from "@/assets/svgs/logoapp.svg";
import { getGreeting, getIconName } from "@/utils";
import SubscribeDrawer from "./subscribe_drawer";
import SubcriptionCTA from "../SubscriptionsCTA";

const HomeUser = () => {
  const scheme = useColorScheme();

  const subscriptionBottomSheetRef = useRef<BottomSheet>(null);
  const isCooking = useSelector((state: any) => state.recipe.isCooking);
  const name = useSelector(
    (state: any) => state.auth.loginResponseType.first_name
  );

  return (
    <View className="flex-1 relative">
      <View
        className="absolute top-0 left-0 right-0 z-10 bg-background pt-12 pb-4"
        style={{
          paddingTop: Platform.OS === "ios" ? 50 : 36,
        }}
      >
        <View className="flex flex-row justify-between items-center px-5 bg-background">
          <View className="rounded-2xl bg-secondary p-1">
            <LogoAPP width={29} height={29} />
          </View>

          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name={getIconName()} size={20} color="orange" />
              <Text className="text-sm text-foreground ml-2 pt-1">
                {getGreeting(name)}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push("/(protected)/(nested)/search")}
          >
            <Search color={scheme === "dark" ? "#fff" : "#000"} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: Platform.OS === "ios" ? 110 : 110,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <FeaturedRecipes />
          <PopularRecipes />
        </View>
      </ScrollView>

      {isCooking && (
        <Pressable
          className="absolute bottom-5 right-5 z-20 mb-24"
          onPress={() => router.push(`/cooking/1` as any)}
        >
          <View className="bg-secondary p-1 rounded-full shadow-lg">
            <Svg1 width={50} height={50} color="#fff" />
          </View>
        </Pressable>
      )}

      {/* Test button to manually show the bottom sheet */}
      {/* <Pressable
        className="absolute bottom-5 right-5 z-20 mb-36"
        onPress={() => bottomSheetMenuRef.current?.snapToIndex(1)}
      >
        <View className="bg-secondary p-1 rounded-full shadow-lg">
          <Svg1 width={50} height={50} color="#fff" />
        </View>
      </Pressable> */}

      <SubcriptionCTA bottomSheetRef={subscriptionBottomSheetRef as any} />

      {/* <BottomSheet
        ref={bottomSheetMenuRef}
        index={-1}
        snapPoints={["30%"]}
        // backdropComponent={BottomSheetBackdrop}
        onChange={(index) => {
          console.log(index);
          if (index === 0) {
            bottomSheetMenuRef.current?.close();
          }
        }}
        handleStyle={{
          backgroundColor: isDarkMode ? "#1f242a" : "#fff",
          borderWidth: 0,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDarkMode ? "#888" : "#ccc",
        }}
      >
        <BottomSheetView>
          <SubscribeDrawer />
        </BottomSheetView>
      </BottomSheet> */}
    </View>
  );
};

export default HomeUser;
