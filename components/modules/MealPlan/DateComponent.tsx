import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import moment from "moment";

const DateComponent = ({ date, onSelectDate, selected }: any) => {
  const day = moment(date).isSame(moment(), "day")
    ? "Today"
    : moment(date).format("ddd");
  const dayNumber = moment(date).format("D");
  const fullDate = moment(date).format("YYYY-MM-DD");
  const isSelected = selected === fullDate;

  return (
    <TouchableOpacity
      onPress={() => onSelectDate(fullDate)}
      className={`items-center px-1.5 py-4 mx-1 rounded-full ${
        isSelected && "bg-secondary"
      }`}
    >
      <View
        className={`w-10 h-10 rounded-full text-center p-1 border-2 border-secondary flex justify-center items-center ${
          isSelected ? "bg-background" : ""
        }`}
      >
        <Text
          className={`text-base font-bold  ${
            isSelected ? "text-primary" : "text-secondary"
          }`}
        >
          {dayNumber}
        </Text>
      </View>
      <Text
        className={`text-sm ${isSelected ? "text-white" : "text-secondary"}`}
      >
        {day}
      </Text>
      <View className="h-2" />
    </TouchableOpacity>
  );
};

export default DateComponent;
