import React from "react";
import { Instruction } from "@/lib/types/recipe";

import { Text, useColorScheme, View } from "react-native";

type AllSteps = {
  steps: Instruction[];
};

const AllSteps = ({ steps }: AllSteps) => {
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";

  return (
    <View className="pb-10 pt-4 px-6 bg-background">
      <Text className="font-bold text-2xl leading-8 text-foreground text-center mb-4 mt-8">
        Steps
      </Text>
      {steps.map((step) => {
        return (
          <View
            className="mt-6 flex flex-row items-start gap-4 p-5 rounded-2xl"
            style={{
              boxShadow: isDarkMode
                ? "0px 2px 12px 0px rgba(0,0,0,0.3)"
                : "0px 2px 12px 0px rgba(0,0,0,0.1)",
            }}
            key={step.step_number}
          >
            <View className="bg-accent py-1.5 px-4 rounded-lg">
              <Text className="text-secondary font-bold text-2xl">
                {step.step_number}
              </Text>
            </View>
            <Text className="text-muted font-medium pr-16 leading-6">
              {step?.step_text}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default AllSteps;
