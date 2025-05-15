import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type EarnCardProps = {
  id: string;
  points: string;
  description: string;
  button_text: string;
};

const EarnCard = ({ button_text, description, id, points }: EarnCardProps) => {
  return (
    <View
      className="bg-background rounded-3xl px-4 py-5 shadow-md basis-[47%]"
      key={id}
    >
      <View className="bg-secondary/20 self-start rounded-full px-3 py-1 mb-3">
        <Text className="text-secondary font-medium">{points}</Text>
      </View>

      <Text className="text-foreground text-lg font-semibold mb-4">
        {description}
      </Text>

      <TouchableOpacity
        className="border border-secondary/80 rounded-full py-2.5 items-center"
        activeOpacity={0.7}
      >
        <Text className="text-secondary font-medium text-base">
          {button_text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EarnCard;
