import React from "react";

import { Text, useColorScheme, View } from "react-native";

import Onboarding2 from "../../../assets/svgs/onboarding2.svg";
import Onboarding2Dark from "@/assets/svgs/Onboarding2-dark.svg";

const Slide2 = () => {
  const scheme = useColorScheme();
  return (
    <>
      <View className="relative flex justify-center items-center py-48">
        {scheme === "dark" ? <Onboarding2Dark /> : <Onboarding2 />}
      </View>
    </>
  );
};

export default Slide2;
