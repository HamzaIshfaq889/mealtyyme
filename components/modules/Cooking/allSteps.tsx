import React from "react";
import { Text, View } from "react-native";

type AllSteps = {
  steps: {
    stepNo: number;
    stepDetail: string;
  }[];
};

const AllSteps = ({ steps }: AllSteps) => {
  return (
    <View className="py-10 px-6">
      <Text className="font-bold text-2xl leading-8 text-foreground text-center mb-4 mt-8">
        Steps
      </Text>
      {steps.map((step, index) => {
        return (
          <View
            className="mt-6 flex flex-row items-start gap-4 p-5 rounded-2xl"
            style={{
              boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
            }}
            key={index}
          >
            <View className="bg-accent py-1.5 px-4 rounded-lg">
              <Text className="text-secondary font-bold text-2xl">
                {step.stepNo}
              </Text>
            </View>
            <Text className="text-[#48525F] font-medium pr-16 leading-6">
              {step?.stepDetail}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default AllSteps;
