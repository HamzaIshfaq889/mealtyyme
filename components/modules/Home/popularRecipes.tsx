import React from "react";

import { Text, View, FlatList, Image, Pressable } from "react-native";

import { router } from "expo-router";
import { Clock, Flame, Heart } from "lucide-react-native";

const data = [
  {
    id: "1",
    title: "hello",
    author: "James Spader",
    time: "20 Min",
    image: "/abc",
  },
  {
    id: "2",
    title: "Rice noodle with extra seafood",
    author: "Olive Austin",
    time: "20 Min",
    image: "/abc",
  },
  {
    id: "3",
    title: "Yougart white noodle with extra seafood",
    author: "James Spader",
    time: "20 Min",
    image: "/abc",
  },
];

const PopularRecipes = () => {
  return (
    <>
      <View className="flex flex-row justify-between">
        <Text className="text-foreground font-bold text-xl leading-5 mb-1">
          Popular Recipies
        </Text>
        <Pressable>
          <Text className="text-secondary pr-5 font-bold">See All</Text>
        </Pressable>
      </View>
      <View>
        <FlatList
          data={data}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              className="ml-2 mr-5 py-4"
              onPress={() => router.push(`/recipe/${1}` as const)}
            >
              <View className="flex flex-col bg-background rounded-2xl w-64 p-3 shadow-custom !h-64">
                <View className="relative mb-4">
                  <Image
                    source={{ uri: item.image }}
                    className="h-36 w-full rounded-xl bg-gray-300"
                    resizeMode="cover"
                  />
                  <View className="absolute top-2 right-2 bg-background rounded-md p-1.5">
                    <Heart color="#000" size={16} />
                  </View>
                </View>
                <Text className="text-foreground font-bold text-base leading-5 mb-3">
                  {item.title}
                </Text>

                <View className="flex flex-row items-center gap-2 mt-auto">
                  <View className="flex flex-row items-center gap-0.5">
                    <Flame color="#96a1b0" size={20} />
                    <Text className="text-muted">120 Kcal</Text>
                  </View>
                  <View className="bg-muted p-0.5"></View>
                  <View className="flex flex-row items-center gap-1">
                    <Clock color="#96a1b0" size={16} />
                    <Text className="text-muted text-sm">{item.time}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    </>
  );
};

export default PopularRecipes;
