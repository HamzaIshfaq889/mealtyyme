import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import moment from "moment";

const DateComponent = ({ date, onSelectDate, selected, disabled }: any) => {
  const day = moment(date).isSame(moment(), "day")
    ? "Today"
    : moment(date).format("ddd");
  const dayNumber = moment(date).format("D");
  const fullDate = moment(date).format("YYYY-MM-DD");
  const isSelected = selected === fullDate;

  const handlePress = () => {
    if (!disabled) {
      onSelectDate(fullDate);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      className={`items-center px-1.5 py-4 mx-1 rounded-full ${
        isSelected && "bg-secondary"
      }`}
    >
      <View
        className={`w-10 h-10 rounded-full p-1 border-2 flex justify-center items-center
          ${isSelected ? "bg-background border-secondary" : "border-secondary"}
          ${disabled ? "opacity-30 border-gray-400" : ""}
        `}
      >
        <Text
          className={`text-base font-bold ${
            isSelected ? "text-primary" : disabled ? "text-gray-400" : "text-secondary"
          }`}
        >
          {dayNumber}
        </Text>
      </View>
      <Text
        className={`text-sm ${isSelected ? "text-white" : disabled ? "text-gray-400" : "text-secondary"}`}
      >
        {day}
      </Text>
      <View className="h-2" />
    </TouchableOpacity>
  );
};

export default DateComponent;
