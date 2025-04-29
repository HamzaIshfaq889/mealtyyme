import React, { useState } from "react";

import { Image, Pressable, Text, useColorScheme, View } from "react-native";
import { router } from "expo-router";

import { Settings, User, UserPen } from "lucide-react-native";

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

  return (
    <View className="w-full h-full py-16">
      <View className="flex flex-row justify-between items-center px-6">
        <Text></Text>
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
            auth?.avatar_url ? "gap-4" : "gap-2"
          } `}
        >
          {auth?.avatar_url ? (
            <Image
              source={{ uri: auth?.avatar_url }}
              className="w-16 h-16"
              resizeMode="cover"
            />
          ) : (
            <User size={36} color={scheme === "dark" ? "#fff" : "#000"} />
          )}

          <View>
            <Text className="font-bold text-xl leading-5 mb-0.5 text-primary">
              {auth?.first_name || "User"}
            </Text>
          </View>
        </View>

        {/* <Pressable
          onPress={() => router.push("/(protected)/(nested)/edit-profile")}
        >
          <View className="flex flex-row gap-0.5 mr-2">
            <UserPen color={scheme === "dark" ? "#fff" : "#000"} size={30} />
          </View>
        </Pressable> */}
      </View>

      <View className="flex flex-row gap-1.5 bg-gray4 px-2 py-2 rounded-2xl mb-5 mx-6">
        <Button
          className={`basis-1/2 rounded-2xl ${
            activeTab === "cookbooks" ? "bg-foreground" : "bg-gray4"
          }`}
          onPress={() => setActiveTab("cookbooks")}
        >
          <ButtonText
            className={`${
              activeTab === "cookbooks" ? "text-background" : "!text-primary"
            }`}
          >
            Cookbooks
          </ButtonText>
        </Button>

        <Button
          className={`basis-1/2 rounded-2xl ${
            activeTab === "savedrecipes" ? "bg-foreground" : "bg-gray4"
          }`}
          onPress={() => setActiveTab("savedrecipes")}
        >
          <ButtonText
            className={`${
              activeTab === "savedrecipes" ? "text-background" : "!text-primary"
            }`}
          >
            Saved Recipes
          </ButtonText>
        </Button>
      </View>

      {activeTab === "cookbooks" ? (
        <ScrollView>
          <Cookbooks />
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
