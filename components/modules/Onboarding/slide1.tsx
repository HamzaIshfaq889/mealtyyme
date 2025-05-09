import React from "react";

import { Text, useColorScheme, View } from "react-native";

import Svg2 from "@/assets/svgs/Vector6.svg";
import Svg2Dark from "@/assets/svgs/ilus1.svg";

import Svg1 from "@/assets/svgs/Vector5.svg";
import Svg3 from "@/assets/svgs/Vector7.svg";

const Slide1 = () => {
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";

  return (
    <>
      <View className="h-[71%]">
        <View className="absolute left-0 top-0">
          <Svg1 />
        </View>
        <View className="relative flex justify-center items-center py-48">
          {isDarkMode ? <Svg2Dark /> : <Svg2 />}
        </View>
        <View className="absolute left-0 right-0 -bottom-28">
          <Svg3 />
        </View>
      </View>

      <View className="mt-3 px-4">
        <Text className="text-center text-primary font-bold text-3xl mb-3 leading-9 font-sofia">
          Endless recipes for your tastes and lifestyle.
        </Text>
        <Text className="text-center text-xl leading-8 text-muted mb-10">
          Unlock access to a huge collection of recipes—over 100,000 and
          counting!
        </Text>
      </View>
    </>
  );
};

export default Slide1;
