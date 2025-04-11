import React from "react";
import { Text } from "react-native";

import { TouchableOpacity, View } from "react-native";
import Svg1 from "@/assets/svgs/arrow-left.svg";
import { router } from "expo-router";
import { Heart } from "lucide-react-native";

const Favourites = () => {
  const favouritesData = [
    {
      id: 1,
      name: "Sunny Egg & Toast Avocado",
      image: require("@/assets/svgs/Sun.svg"),
    },
    {
      id: 2,
      name: "Sunny Egg & Toast Avocado",
      image: require("@/assets/svgs/Sun.svg"),
    },
    {
      id: 3,
      name: "Sunny Egg & Toast Avocado",
      image: require("@/assets/svgs/Sun.svg"),
    },
    {
      id: 4,
      name: "Sunny Egg & Toast Avocado",
      image: require("@/assets/svgs/Sun.svg"),
    },
    {
      id: 5,
      name: "Sunny Egg & Toast Avocado",
      image: require("@/assets/svgs/Sun.svg"),
    },
    {
      id: 6,
      name: "Sunny Egg & Toast Avocado",
      image: require("@/assets/svgs/Sun.svg"),
    },
  ];

  return (
    <View className="flex flex-col w-full h-full px-5 py-16 bg-background">
      <View className="flex flex-row justify-between items-center mb-6 p-1.5">
        <TouchableOpacity onPress={() => router.push("/")}>
          <Svg1 width={23} height={23} />
        </TouchableOpacity>
        <Text className="block font-bold text-2xl text-foreground">
          My Favouritessss
        </Text>
        <Text></Text>
      </View>
      <View className="flex flex-row flex-wrap">
        {favouritesData.map((item) => {
          return (
            <View key={item.id} className="basis-1/2 p-1.5">
              <View className="bg-background rounded-2xl p-3 shadow-custom">
                <View className="relative mb-4">
                  <View className="h-32 w-full rounded-xl bg-gray-300" />

                  <View className="absolute top-2 right-2 bg-background rounded-md p-1.5">
                    <Heart color="#000" size={16} />
                  </View>
                </View>
                <Text className="text-foreground font-bold text-base leading-5 mb-3">
                  {item.name}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Favourites;
