import React from "react";

import { Text, View } from "react-native";

import Svg1 from "../../../assets/svgs/Vector9.svg";
import Svg2 from "../../../assets/svgs/Vector8.svg";
import Svg3 from "../../../assets/svgs/Vector10.svg";

const Slide2 = () => {
  return (
    <>
      <View className="relative h-[65%]">
        <View className="absolute left-0 top-0">
          <Svg1 />
        </View>
        <View className="relative flex justify-center items-center py-48">
          <Svg2 />
        </View>
        <View className="absolute left-0 right-0 -bottom-40">
          <Svg3 />
        </View>
      </View>
      <View className="mt-2 px-8">
        <Text className="text-center text-primary font-bold text-3xl mb-3 leading-10 font-sofia">
          Order groceries straight to your door.
        </Text>
        <Text className="text-center text-lg leading-6 text-muted mb-10">
          Skip the store—your groceries come to you!
        </Text>
      </View>
    </>
  );
};

export default Slide2;
