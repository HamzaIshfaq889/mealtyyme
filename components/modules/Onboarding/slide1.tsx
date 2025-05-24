import React from "react";

import { useColorScheme, View } from "react-native";

import Onboarding from "@/assets/svgs/onboarding1.svg";
import OnboardingDark from "@/assets/svgs/onboarding1-dark.svg";

const Slide1 = () => {
  const scheme = useColorScheme();
  return (
    <>
      <View className="relative flex justify-center items-center py-48">
        {scheme === "dark" ? <OnboardingDark /> : <Onboarding />}
      </View>
    </>
  );
};

export default Slide1;
