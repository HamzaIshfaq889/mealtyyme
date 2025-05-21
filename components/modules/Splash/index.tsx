import React from "react";
import { StyleSheet, View } from "react-native";

import SVG1 from "@/assets/svgs/splash1.svg";
import SVG2 from "@/assets/svgs/splash2.svg";
import SVG3 from "@/assets/svgs/splash3.svg";
import SVG4 from "@/assets/svgs/splash4.svg";

import Logo from "./logo";

const Splash = () => {
  return (
    <View className="bg-secondary w-full h-full">
      <View className="absolute left-0">
        <SVG1 />
      </View>
      <View className="absolute top-4 left-1">
        <SVG2 />
      </View>

      <View className="flex justify-center items-center w-screen h-screen">
        <Logo width={150} height={220} />
      </View>

      <View className="absolute -bottom-2 right-0 left-0">
        <SVG3 width={410} />
      </View>
      <View className="absolute bottom-0 right-14">
        <SVG4 />
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
});
