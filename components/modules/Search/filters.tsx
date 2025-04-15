import React from 'react'
import { FlatList, View } from 'react-native'

import { router } from 'expo-router';

import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';

import { Text } from 'react-native';

const Filters = () => {
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

    return (
        <View className='py-4 bg-background' >
            < Text className='font-bold text-2xl leading-8 text-foreground text-center'> Filter</Text >
            <View className='mt-4'>
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-black">Category</Text>
                </View>
                <View>
                    <FlatList
                        horizontal
                        data={categories}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 12 }}
                        renderItem={({ item, index }) => (
                            <Button
                                action="secondary"
                                className={`rounded-full px-10 py-2 bg-accent`}
                            >
                                <ButtonText
                                    className={`text-base leading-6 !text-primary font-semibold`}
                                >
                                    {item.name}
                                </ButtonText>
                            </Button>
                        )}
                    />
                </View>
            </View>
        </View >

    )
}

export default Filters