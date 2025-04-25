import React from "react";

import { Instruction } from "@/lib/types/recipe";

import { Text, View } from "react-native";

type StepProps = {
  step: Instruction;
};

const Step = ({ step }: StepProps) => {
  return (
    <View>
      <Text className="text-center font-bold text-xl leading-5 text-primary/50 mb-8">
        Step {step?.step_number}
      </Text>
      <Text className="text-xl leading-7 text-left text-primary/75">
        {step?.step_text}
      </Text>
    </View>
  );
};

export default Step;
