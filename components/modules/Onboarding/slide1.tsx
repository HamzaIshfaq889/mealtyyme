import React from "react";

import { View } from "react-native";

import Onboarding from "@/assets/svgs/onboarding1.svg";

const Slide1 = () => {
  return (
    <>
      <View className="relative flex justify-center items-center py-48">
        <Onboarding />
      </View>
    </>
  );
};

export default Slide1;
