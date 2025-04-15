import React from 'react'

import { Clock } from 'lucide-react-native';

import { HStack } from '@/components/ui/hstack';

import { Text, View, FlatList, Image, Pressable } from "react-native";

const FeaturedRecipes = ({ onSelectRecipe }: { onSelectRecipe?: () => void }) => {
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

    return (
        <>
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
                        <Pressable className="mr-4" onPress={onSelectRecipe}>
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
        </>
    )
}

export default FeaturedRecipes