import React from "react";

import { useColorScheme, View } from "react-native";

import Onboarding3 from "../../../assets/svgs/onboarding3.svg";
import Onboarding3Dark from "@/assets/svgs/onboarding3-dark.svg";

const Slide3 = () => {
  const scheme = useColorScheme();
  return (
    <View className="relative flex justify-center items-center py-48">
      {scheme ? <Onboarding3Dark /> : <Onboarding3 />}
    </View>
  );
};

export default Slide3;
