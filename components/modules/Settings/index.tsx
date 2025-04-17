import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";

import { Bell, ArrowRight } from "lucide-react-native";

import { Switch } from "@/components/ui/switch";

import Svg1 from "@/assets/svgs/arrow-left.svg";
import { Image } from "react-native";

const Settings = () => {
  return (
    <View className="flex flex-col w-full h-full px-9 py-16">
      <View className="flex flex-row justify-between items-center mb-14">
        <TouchableOpacity onPress={() => router.push("/(tabs)/account")}>
          <Svg1 width={23} height={23} />
        </TouchableOpacity>
        <Text className="block font-bold text-2xl text-foreground">
          Settings
        </Text>
        <Text></Text>
      </View>

      <View
        className="flex flex-row justify-between mt-3 py-6 px-5 rounded-2xl"
        style={{
          boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
        }}
      >
        <View className="flex flex-row items-center gap-4">
          <Bell color="#00C3FF" />
          <Text className="font-medium text-primary leading-4">
            Notifications
          </Text>
        </View>
        <View>
          <Switch
            size="md"
            isDisabled={false}
            trackColor={{
              false: "#fff",
              true: "#000",
            }}
            thumbColor={"#00C3FF"}
          />
        </View>
      </View>

      <View
        className="flex flex-row justify-between mt-3 py-6 px-5 rounded-2xl"
        style={{
          boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
        }}
      >
        <View className="flex flex-row items-center gap-4">
          <Bell color="#00C3FF" />
          <Text className="font-medium text-primary leading-4">FAQ</Text>
        </View>
        <View className="bg-primary flex flex-row justify-center items-center p-1 rounded-md">
          <ArrowRight size={16} color="#fff" />
        </View>
      </View>

      <View
        className="flex flex-row justify-between mt-3 py-6 px-5 rounded-2xl"
        style={{
          boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
        }}
      >
        <View className="flex flex-row items-center gap-4">
          <View className="flex justify-center items-center w-6 h-6 border-2 border-secondary rounded-md">
            <Text className="text-secondary font-semibold text-lg p-1">?</Text>
          </View>
          <Text className="font-medium text-primary leading-4">
            Privacy Policy
          </Text>
        </View>
        <View className="bg-primary flex flex-row justify-center items-center p-1 rounded-md">
          <ArrowRight size={16} color="#fff" />
        </View>
      </View>

      <View
        className="flex flex-row justify-between mt-3 py-6 px-5 rounded-2xl"
        style={{
          boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
        }}
      >
        <View className="flex flex-row items-center gap-4">
          <View className="flex justify-center items-center w-6 h-6 border-2 border-secondary rounded-md">
            <Text className="text-secondary font-semibold text-base p-1">
              i
            </Text>
          </View>
          <Text className="font-medium text-primary leading-4">
            Terms and Conditions
          </Text>
        </View>
        <View className="bg-primary flex flex-row justify-center items-center p-1 rounded-md">
          <ArrowRight size={16} color="#fff" />
        </View>
      </View>
      <View
        className="flex flex-row justify-between mt-3 py-6 px-5 rounded-2xl"
        style={{
          boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
        }}
      >
        <View className="flex flex-row items-center gap-4">
          <View className="flex justify-center items-center w-6 h-6 border-2 border-secondary rounded-md">
            <Text className="text-secondary font-semibold text-base p-1">
              i
            </Text>
          </View>
          <Text className="font-medium text-primary leading-4">About app</Text>
        </View>
        <View className="bg-primary flex flex-row justify-center items-center p-1 rounded-md">
          <ArrowRight size={16} color="#fff" />
        </View>
      </View>

      <View className="mt-10 ">
        <Text className="text-center text-foreground font-semibold leading-6">
          Follow us
        </Text>
        <View className="flex flex-row justify-center gap-3 py-4">
          <View
            className="flex justify-center items-center px-1.5 rounded-xl bg-background"
            style={{
              boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
            }}
          >
            <Image
              source={require("@/assets/images/instagram.png")}
              className="w-12 h-12 mt-2"
            />
          </View>
          <View
            className="flex justify-center items-center px-3.5 py-1 rounded-xl bg-background"
            style={{
              boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
            }}
          >
            <Image
              source={require("@/assets/images/facebook.png")}
              className="w-8 h-8"
            />
          </View>
          <View
            className="flex justify-center items-center px-3.5 py-1 rounded-xl bg-background"
            style={{
              boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
            }}
          >
            <Image
              source={require("@/assets/images/youutbe.png")}
              className="w-8 h-8"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Settings;
