import React from "react";

import { Text, useColorScheme, View } from "react-native";

import Onboarding2 from "../../../assets/svgs/onboarding2.svg";

const Slide2 = () => {
  return (
    <>
      <View className="relative flex justify-center items-center py-48">
        <Onboarding2 />
      </View>
    </>
  );
};

export default Slide2;
