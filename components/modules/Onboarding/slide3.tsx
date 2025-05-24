import React from "react";

import { useColorScheme, View } from "react-native";

import Onboarding3 from "../../../assets/svgs/onboarding3.svg";
import Onboarding3Dark from "@/assets/svgs/onboarding3-dark.svg";
import LottieView from "lottie-react-native";

const Slide3 = () => {
  const scheme = useColorScheme();
  return (
    <View className="relative flex justify-center items-center py-48">
      <LottieView
        source={require("../../../assets/lottie/on3.json")}
        autoPlay
        loop
        style={{ width: 300, height: 300 }}
      />
    </View>
  );
};

export default Slide3;
