import moment from "moment";
import React, { useState } from "react";

import { View, Text, ScrollView, useColorScheme } from "react-native";
import Calendar from "./Calander";
import { ArrowRight } from "lucide-react-native";

const MealPlan = () => {
  const scheme = useColorScheme();
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  return (
    <ScrollView className="w-full h-full bg-background">
      <View className="flex flex-row justify-center px-9 pt-16 pb-10">
        <Text className="block font-bold text-2xl text-foreground">
          Meal Planning
        </Text>
      </View>

      <View>
        <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
        <Text
          className="mt-8 text-lg text-primary px-8 font-roboto"
          style={{
            textShadowColor:
              scheme === "dark"
                ? "rgba(100, 100, 100, 0.5)"
                : "rgba(0, 0, 0, 0.25)",
            textShadowOffset: { width: 0, height: 4 },
            textShadowRadius: 4,
          }}
        >
          {selectedDate}
        </Text>
      </View>

      <View className="mt-8 px-8">
        <Text className="text-xl leading-6 text-secondary">BREAKFAST</Text>
        <View
          className="flex flex-row justify-between items-center py-5 px-3 rounded-2xl mb-5 mt-5"
          style={{
            boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
          }}
        >
          <View className="flex flex-row gap-4">
            {/* Will be replavce by image if the recipie */}
            <View className="w-24 h-[80px] rounded-2xl bg-gray3"></View>
            <View className="flex flex-col justify-between max-w-40">
              <Text className="font-bold text-lg mb-1 leading-6 text-primary">
                Easy homemade beef burger
              </Text>
              <View className="flex flex-row gap-2">
                <View className="bg-gray3 w-1 h-1 p-3.5 rounded-full"></View>
                <Text className="text-muted text-base ">James Spader</Text>
              </View>
            </View>
          </View>
          <View className="mr-2 p-0.5 bg-secondary rounded-md">
            <ArrowRight color="#fff" size={22} />
          </View>
        </View>
      </View>

      <View className="mt-2 px-8">
        <Text className="text-xl leading-6 text-secondary">LUNCH</Text>
        <View
          className="flex flex-row justify-between items-center py-5 px-3 rounded-2xl mb-5 mt-5"
          style={{
            boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
          }}
        >
          <View className="flex flex-row gap-4">
            {/* Will be replavce by image if the recipie */}
            <View className="w-24 h-[80px] rounded-2xl bg-gray3"></View>
            <View className="flex flex-col justify-between max-w-40">
              <Text className="font-bold text-lg mb-1 leading-6 text-primary">
                Easy homemade beef burger
              </Text>
              <View className="flex flex-row gap-2">
                <View className="bg-gray3 w-1 h-1 p-3.5 rounded-full"></View>
                <Text className="text-muted text-base ">James Spader</Text>
              </View>
            </View>
          </View>
          <View className="mr-2 p-0.5 bg-secondary rounded-md">
            <ArrowRight color="#fff" size={22} />
          </View>
        </View>
        <View
          className="flex flex-row justify-between items-center py-5 px-3 rounded-2xl mb-5 mt-1"
          style={{
            boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
          }}
        >
          <View className="flex flex-row gap-4">
            {/* Will be replavce by image if the recipie */}
            <View className="w-24 h-[80px] rounded-2xl bg-gray3"></View>
            <View className="flex flex-col justify-between max-w-40">
              <Text className="font-bold text-lg mb-1 leading-6 text-primary">
                Easy homemade beef burger
              </Text>
              <View className="flex flex-row gap-2">
                <View className="bg-gray3 w-1 h-1 p-3.5 rounded-full"></View>
                <Text className="text-muted text-base ">James Spader</Text>
              </View>
            </View>
          </View>
          <View className="mr-2 p-0.5 bg-secondary rounded-md">
            <ArrowRight color="#fff" size={22} />
          </View>
        </View>
      </View>

      <View className="mt-2 px-8">
        <Text className="text-xl leading-6 text-secondary">DINNER</Text>
        <View
          className="flex flex-row justify-between items-center py-5 px-3 rounded-2xl mb-5 mt-5"
          style={{
            boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
          }}
        >
          <View className="flex flex-row gap-4">
            {/* Will be replavce by image if the recipie */}
            <View className="w-24 h-[80px] rounded-2xl bg-gray3"></View>
            <View className="flex flex-col justify-between max-w-40">
              <Text className="font-bold text-lg mb-1 leading-6 text-primary">
                Easy homemade beef burger
              </Text>
              <View className="flex flex-row gap-2">
                <View className="bg-gray3 w-1 h-1 p-3.5 rounded-full"></View>
                <Text className="text-muted text-base ">James Spader</Text>
              </View>
            </View>
          </View>
          <View className="mr-2 p-0.5 bg-secondary rounded-md">
            <ArrowRight color="#fff" size={22} />
          </View>
        </View>
        <View
          className="flex flex-row justify-between items-center py-5 px-3 rounded-2xl mb-5 mt-1"
          style={{
            boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
          }}
        >
          <View className="flex flex-row gap-4">
            {/* Will be replavce by image if the recipie */}
            <View className="w-24 h-[80px] rounded-2xl bg-gray3"></View>
            <View className="flex flex-col justify-between max-w-40">
              <Text className="font-bold text-lg mb-1 leading-6 text-primary">
                Easy homemade beef burger
              </Text>
              <View className="flex flex-row gap-2">
                <View className="bg-gray3 w-1 h-1 p-3.5 rounded-full"></View>
                <Text className="text-muted text-base ">James Spader</Text>
              </View>
            </View>
          </View>
          <View className="mr-2 p-0.5 bg-secondary rounded-md">
            <ArrowRight color="#fff" size={22} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default MealPlan;
