import React from "react";

import { View } from "react-native";

import Logo from "../../../assets/svgs/logo.svg";
import SVG3 from "../../../assets/svgs/Vector3.svg";
import SVG1 from "../../../assets/svgs/Vector1.svg";
import SVG2 from "../../../assets/svgs/Vector2.svg";
import SVG4 from "../../../assets/svgs/Vector4.svg";

const Splash = () => {
  return (
    <View className="bg-secondary w-full h-full">
      <View className="absolute top-0">
        <SVG3 />
      </View>
      <View className="absolute top-4 left-0">
        <SVG1 />
      </View>
      <View className="flex justify-center items-center w-screen h-screen ">
        <Logo />
      </View>
      <View className="absolute bottom-0 right-0 left-0">
        <SVG2 />
      </View>
      <View className="absolute bottom-0 right-14">
        <SVG4 />
      </View>
    </View>
  );
};

export default Splash;
