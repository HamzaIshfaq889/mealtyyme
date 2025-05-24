import React from "react";

import { useColorScheme, View } from "react-native";

import Onboarding from "@/assets/svgs/onboarding1.svg";
import OnboardingDark from "@/assets/svgs/onboarding1-dark.svg";
import LottieView from "lottie-react-native";

const Slide1 = () => {
  const scheme = useColorScheme();
  return (
    <>
      <View className="relative flex justify-center items-center py-48">
        <LottieView
          source={require("../../../assets/lottie/on1.json")}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
      </View>
    </>
  );
};

export default Slide1;
