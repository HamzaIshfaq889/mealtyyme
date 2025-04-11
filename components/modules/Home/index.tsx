import React from "react";
import { Text, View, FlatList, Image, Pressable } from "react-native";

import { router } from "expo-router";

import { Heart, Search, Flame } from "lucide-react-native";
import { Clock } from "lucide-react-native";

import Svg1 from "@/assets/svgs/Sun.svg";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";

const data = [
  {
    id: "1",
    title: "Asian white noodle with extra seafood",
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

const featuredData = [
  {
    id: "1",
    title: "Easy homemade beef burger",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    title: "Half boiled egg sandwich",
    image: "https://via.placeholder.com/150",
  },
];

const categories = [
  { id: "1", name: "Relax Dinner" },
  { id: "2", name: "Kids Favourite" },
  { id: "3", name: "Family Meals" },
  { id: "4", name: "Quick Bites" },
  { id: "5", name: "Relax Dinner" },
  { id: "6", name: "Kids Favourite" },
  { id: "7", name: "Family Meals" },
  { id: "8", name: "Quick Bites" },
];

const HomeUser = () => {
  return (
    <View className="flex flex-col w-full h-full pl-7 py-16 bg-background">
      <View className="flex flex-row justify-between items-center mb-10">
        <View className="space-y-1.5">
          <View className="flex flex-row items-center gap-1">
            <Svg1 />
            <Text className=" text-sm leading-6 text-foreground">
              Good Morning
            </Text>
          </View>
          <Text className="font-bold text-2xl text-foreground leading-8">
            MealTyme
          </Text>
        </View>
        <View className="mr-5">
          <Search color="#000" />
        </View>
      </View>

      <Text className="text-foreground font-bold text-xl leading-5">
        Featured
      </Text>

      <View className="max-h-max mt-1 mb-8">
        <FlatList
          horizontal
          data={data}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          className="mt-4 "
          renderItem={({ item }) => (
            <Pressable className="mr-4">
              <View className="bg-secondary rounded-2xl p-4 w-[260px]">
                <Image
                  source={{ uri: item?.image }}
                  resizeMode="cover"
                  className="h-[100px] w-full mb-2"
                />

                <Text className="text-background font-semibold text-lg leading-5">
                  {item.title}
                </Text>

                <HStack className="justify-between items-center">
                  <View className="flex flex-row gap-1 items-center">
                    <View className="bg-[#C4C4C4] p-2.5 rounded-full border border-background"></View>
                    <Text className="text-background/75 text-sm leading-6">
                      {item.author}
                    </Text>
                  </View>
                  <HStack className="items-center gap-1.5">
                    <Clock color="white" size={14} />
                    <Text className="text-background/80 text-sm">
                      {item.time}
                    </Text>
                  </HStack>
                </HStack>
              </View>
            </Pressable>
          )}
        />
      </View>

      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-black">Category</Text>
          <Pressable onPress={() => router.push("/")}>
            <Text className="text-secondary pr-5 font-bold">See All</Text>
          </Pressable>
        </View>

        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item, index }) => (
            <Button
              action="secondary"
              className={`rounded-full px-10 py-2 ${
                index === 0 ? "bg-secondary" : "bg-accent"
              }`}
            >
              <ButtonText
                className={`text-base leading-6 ${
                  index === 0
                    ? "text-background"
                    : "!text-primary font-semibold"
                }`}
              >
                {item.name}
              </ButtonText>
            </Button>
          )}
        />
      </View>

      <View className="flex flex-row justify-between">
        <Text className="text-foreground font-bold text-xl leading-5 mb-5">
          Popular Recipies
        </Text>
        <Pressable onPress={() => router.push("/")}>
          <Text className="text-secondary pr-5 font-bold">See All</Text>
        </Pressable>
      </View>
      <View className="py-3">
        <FlatList
          data={data}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable className="mr-5">
              <View className="bg-background rounded-2xl w-64 p-3 shadow-custom">
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

                <View className="flex flex-row items-center gap-2">
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
    </View>
  );
};

export default HomeUser;
