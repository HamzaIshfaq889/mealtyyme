import React, { useCallback, useState } from "react";

import { Image, Pressable, Text, useColorScheme, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { CircleUserRound, Settings, UserPen } from "lucide-react-native";

import { Button, ButtonText } from "@/components/ui/button";

import Cookbooks from "./Cookbooks";
import Savedrecipes from "./SavedRecipes";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { LoginResponseTypes } from "@/lib/types";

const Account = () => {
  const scheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<"cookbooks" | "savedrecipes">(
    "cookbooks"
  );

  const auth: LoginResponseTypes = useSelector(
    (state: any) => state.auth.loginResponseType
  );

  useFocusEffect(
    useCallback(() => {
      setActiveTab("cookbooks");
    }, [])
  );

  return (
    <View className="w-full h-full py-16">
      <View className="flex flex-row justify-between items-center px-3 ">
        <View style={{ width: 30 }} />
        <Text className="font-bold text-2xl text-foreground">Account</Text>
        <Pressable
          onPress={() => router.push("/(protected)/(nested)/settings")}
        >
          <Settings color={scheme === "dark" ? "#fff" : "#000"} size={26} />
        </Pressable>
      </View>

      <View
        className="flex flex-row justify-between items-center py-4 mb-5 mt-12 rounded-2xl px-6 "
        style={{
          boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
        }}
      >
        <View
          className={`flex flex-row items-center  ${
            auth?.avatar_url ? "gap-4" : "gap-4"
          } `}
        >
          {auth?.image_url ? (
            <Image
              source={{ uri: auth?.image_url }}
              className="w-16 h-16 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <CircleUserRound
              size={36}
              strokeWidth={1}
              color={scheme === "dark" ? "#fff" : "#000"}
            />
          )}

          <View>
            <Text className="font-bold text-xl leading-5 mb-0.5 text-primary">
              {auth?.first_name || "User"}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/(protected)/(nested)/subscriptioncta")}
        >
          <View className="flex flex-row gap-0.5 mr-2">
            <UserPen color={scheme === "dark" ? "#fff" : "#000"} size={30} />
          </View>
        </Pressable>
      </View>

      <View className="flex flex-row bg-gray4 p-1 rounded-full mb-5 mx-6 shadow-sm">
        {/* Cookbooks Tab */}
        <Button
          className={`flex-1 rounded-full transition-all duration-300 ${
            activeTab === "cookbooks" ? "bg-primary" : "bg-transparent"
          }`}
          onPress={() => setActiveTab("cookbooks")}
        >
          <ButtonText
            className={`text-center font-semibold text-sm ${
              activeTab === "cookbooks" ? "text-white" : "!text-primary"
            }`}
          >
            Cookbooks
          </ButtonText>
        </Button>

        {/* Saved Recipes Tab */}
        <Button
          className={`flex-1 rounded-full transition-all duration-300 ${
            activeTab === "savedrecipes" ? "bg-primary" : "bg-transparent"
          }`}
          onPress={() => setActiveTab("savedrecipes")}
        >
          <ButtonText
            className={`text-center font-semibold text-sm ${
              activeTab === "savedrecipes" ? "text-white" : "!text-primary"
            }`}
          >
            Saved Recipes
          </ButtonText>
        </Button>
      </View>

      {activeTab === "cookbooks" ? (
        <ScrollView>
          <Cookbooks activeTab={activeTab} />
        </ScrollView>
      ) : (
        <ScrollView>
          <Savedrecipes />
        </ScrollView>
      )}
    </View>
  );
};

export default Account;
