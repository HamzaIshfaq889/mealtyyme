import React from "react";

import { Button, Text, View } from "react-native";
import Swiper from "react-native-swiper";

import Slide1 from "./slide1";
import Slide2 from "./slide2";
import Slide3 from "./slide3";

const OnBoarding3 = () => {
  return (
    <View className="flex w-full h-full">
      <Swiper>
        <View className="flex-1 justify-center items-center">
          <Slide1 />
        </View>
        <View className="flex-1 justify-center items-center">
          <Slide2 />
        </View>
        <View className="flex-1 justify-center items-center">
          <Slide3 />
        </View>
      </Swiper>

      <View className="mt-auto mb-10 px-8">
        <Text className="text-center text-primary font-bold text-3xl mb-3 leading-10">
          Organize meals and plan ahead effortlessly.
        </Text>
        <Text className="text-center text-lg leading-6 text-accent mb-10">
          Seamlessly organize meals to enjoy more time with family!
        </Text>

        <Button title="Next"></Button>
      </View>
    </View>
  );
};

export default OnBoarding3;
