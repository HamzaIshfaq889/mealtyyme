import React from "react";

import { Text, useColorScheme, View } from "react-native";

import Onboarding2 from "../../../assets/svgs/onboarding2.svg";
import Onboarding2Dark from "@/assets/svgs/Onboarding2-dark.svg";
import LottieView from "lottie-react-native";

const Slide2 = () => {
  const scheme = useColorScheme();
  return (
    <>
      <View className="relative flex justify-center items-center py-48">
        <LottieView
          source={require("../../../assets/lottie/on2.json")}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
      </View>
    </>
  );
};

export default Slide2;
