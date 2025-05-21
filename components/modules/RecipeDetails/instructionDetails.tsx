import { Instruction } from "@/lib/types/recipe";
import React from "react";

import { Pressable, Text, useColorScheme, View } from "react-native";

type InstructionDetailsProps = {
  instructions: Instruction[];
};

const InstructionDetails = ({ instructions }: InstructionDetailsProps) => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  if (instructions?.length === 0) {
    return (
      <View className="flex items-center justify-center">
        <Text className="text-primary text-xl font-semibold">
          No Instructions
        </Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex flex-row justify-between mt-5">
        <View>
          <Text className="text-primary font-bold text-xl leading-5 mb-1">
            Instructions
          </Text>
        </View>
        <Pressable>
          <Text className="text-muted pr-5 font-bold">
            {instructions?.length}
          </Text>
        </Pressable>
      </View>
      <View className="mt-6">
        {instructions.map((instruction) => {
          return (
            <View
              className="mb-4 flex flex-row items-start gap-4 p-5 rounded-2xl bg-foreground"
              key={instruction?.step_number}
            >
              <View className="bg-background py-1.5 px-4 rounded-lg">
                <Text className="text-secondary font-bold text-2xl">
                  {instruction?.step_number}
                </Text>
              </View>
              <Text className="text-primary font-medium pr-16 leading-6">
                {instruction?.step_text}
              </Text>
            </View>
          );
        })}
      </View>
    </>
  );
};

export default InstructionDetails;
