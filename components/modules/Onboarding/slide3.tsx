import React from "react";

import { Text, View } from "react-native";

import Svg1 from "../../../assets/svgs/Vector11.svg";
import Svg2 from "../../../assets/svgs/Vector12.svg";
import Svg3 from "../../../assets/svgs/Vector13.svg";

const Slide3 = () => {
  return (
    <>
      <View className="relative h-[65%]">
        <View className="absolute left-44 top-0">
          <Svg2 />
        </View>
        <View className="relative flex justify-center items-center py-44">
          <Svg1 />
        </View>
        <View className="absolute left-0 right-0 -bottom-44">
          <Svg3 />
        </View>
      </View>

      <View className="mt-6 px-8">
        <Text className="text-center text-primary font-bold text-3xl mb-3 leading-10 font-sofia">
          Organize meals and plan ahead effortlessly.
        </Text>
        <Text className="text-center text-lg leading-6 text-muted mb-10">
          Seamlessly organize meals to enjoy more time with family!
        </Text>
      </View>
    </>
  );
};

export default Slide3;
