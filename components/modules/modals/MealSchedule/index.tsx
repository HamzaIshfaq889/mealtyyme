import React, { useState } from "react";

import {
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  StyleSheet,
} from "react-native";
import Dialog from "react-native-dialog";

import { Button, ButtonText } from "@/components/ui/button";

import { ChevronDown, ChevronUp, Clock } from "lucide-react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Toast from "react-native-toast-message";
import SelectDropdown from "react-native-select-dropdown";
import { Recipe } from "@/lib/types/recipe";
import { useSelector } from "react-redux";
import { AddMealSchedulePayload, MealType } from "@/lib/types/mealschedule";
import { AddMealSchedule } from "@/services/mealscheduleApi";

type MealScheduleProps = {
  showMealScheduleModal: boolean;
  setShowMealScheduleModal: (value: boolean) => void;
};

const mealOptions = [
  { label: "Breakfast", value: "BREAKFAST" },
  { label: "Lunch", value: "LUNCH" },
  { label: "Dinner", value: "DINNER" },
  { label: "Snack", value: "SNACK" },
] as const;

const MealSchedule = ({
  setShowMealScheduleModal,
  showMealScheduleModal,
}: MealScheduleProps) => {
  const scheme = useColorScheme();
  const currentRecipe: Recipe = useSelector(
    (state: any) => state.recipe.currentRecipe
  );
  const [selected, setSelected] = useState<MealType>("BREAKFAST");
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    console.log("date", date);
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const handleSave = async () => {
    if (!currentRecipe?.id || !date) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      // 👆 Converts to "YYYY-MM-DD" format

      const payload: AddMealSchedulePayload = {
        recipe: Number(currentRecipe?.id),
        meal_type: selected,
        date: formattedDate, // Use formatted date here
      };

      const response = await AddMealSchedule(payload);
      Toast.show({
        type: "success",
        text1: "Meal added succesfully!",
      });
    } catch (error) {
      console.error("Error adding meal schedule:", error);
      // Handle error
    }
  };

  return (
    <View>
      <Dialog.Container
        visible={showMealScheduleModal}
        contentStyle={{
          backgroundColor: scheme === "dark" ? "#000" : "#fff",
          paddingVertical: Platform.OS === "ios" ? 40 : 30,
          borderRadius: Platform.OS === "ios" ? 30 : 20,
          width: Platform.OS === "ios" ? "90%" : "85%",
        }}
      >
        <View style={{ padding: Platform.OS === "ios" ? 20 : 15 }}>
          <View className="flex flex-row justify-center mb-6">
            <View className="bg-secondary flex flex-row justify-center items-center w-24 h-24 p-8 rounded-full">
              <Clock color="#fff" size={Platform.OS === "ios" ? 45 : 40} />
            </View>
          </View>
          <Text
            className="text-center text-primary text-2xl mt-2 mb-10"
            style={{
              fontSize: Platform.OS === "ios" ? 24 : 22,
              marginBottom: Platform.OS === "ios" ? 40 : 30,
            }}
          >
            Schedule your meal
          </Text>

          <SelectDropdown
            data={mealOptions.map((item) => item.label)}
            defaultValue={
              mealOptions.find((item) => item.value === selected)?.label
            }
            onSelect={(selectedLabel) => {
              const matched = mealOptions.find(
                (item) => item.label === selectedLabel
              );
              if (matched) {
                setSelected(matched.value);
              }
            }}
            renderButton={(selectedItem, isOpened) => (
              <View
                className="flex-row items-center justify-between px-6 py-4 bg-background rounded-2xl"
                style={{
                  paddingVertical: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  className="flex-1 text-lg font-medium text-primary"
                  numberOfLines={1}
                >
                  {selectedItem || "Select an option"}
                </Text>
                <View className="ml-2">
                  {isOpened ? (
                    <ChevronUp color="#fff" size={24} />
                  ) : (
                    <ChevronDown color="#fff" size={24} />
                  )}
                </View>
              </View>
            )}
            renderItem={(item, index, isSelected) => (
              <View
                className={`px-6 py-4 ${
                  isSelected ? "bg-background" : "bg-background"
                }`}
              >
                <Text
                  className={`text-base ${
                    isSelected ? "font-semibold text-primary" : "text-muted"
                  }`}
                >
                  {item}
                </Text>
              </View>
            )}
            dropdownStyle={{
              borderRadius: 12,
              backgroundColor: "white",
              marginTop: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
            showsVerticalScrollIndicator={false}
            statusBarTranslucent={true}
          />

          <SafeAreaView>
            {/* <TouchableOpacity
              onPress={showDatepicker}
              className="bg-background px-4 border border-border rounded-xl py-5 mb-7"
              style={{
                borderRadius: Platform.OS === "ios" ? 16 : 12,
                paddingVertical: Platform.OS === "ios" ? 20 : 16,
              }}
            >
              <Text
                className="text-foreground"
                style={{
                  fontSize: Platform.OS === "ios" ? 16 : 15,
                }}
              >
                {moment(date).format("MMMM D, YYYY")}
              </Text>
            </TouchableOpacity>

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode as any}
                is24Hour={true}
                onChange={onChange}
                display={Platform.OS === "ios" ? "compact" : "default"}
              />
            )} */}
            <View style={{ width: "100%" }}>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode as any}
                is24Hour={true}
                onChange={onChange}
                display={Platform.OS === "ios" ? "inline" : "default"}
                minimumDate={new Date()} // This disables past dates
                style={
                  Platform.OS === "android" ? { width: "100%" } : undefined
                }
              />
            </View>
          </SafeAreaView>

          <View
            className="flex flex-row gap-2"
            style={{
              marginTop: Platform.OS === "ios" ? 10 : 5,
            }}
          >
            <Button
              action="muted"
              className="basis-1/2 h-16"
              style={{
                height: Platform.OS === "ios" ? 60 : 55,
                borderRadius: Platform.OS === "ios" ? 16 : 12,
              }}
              onPress={() => setShowMealScheduleModal(false)}
            >
              <ButtonText
                style={{
                  fontSize: Platform.OS === "ios" ? 18 : 16,
                }}
              >
                Cancel
              </ButtonText>
            </Button>
            <Button
              action="secondary"
              className="basis-1/2 h-16"
              onPress={() => {
                handleSave();
                setShowMealScheduleModal(false);
              }}
              style={{
                height: Platform.OS === "ios" ? 60 : 55,
                borderRadius: Platform.OS === "ios" ? 16 : 12,
              }}
            >
              <ButtonText
                style={{
                  fontSize: Platform.OS === "ios" ? 18 : 16,
                }}
              >
                Save
              </ButtonText>
            </Button>
          </View>
        </View>
      </Dialog.Container>
    </View>
  );
};

export default MealSchedule;

const styles = StyleSheet.create({
  pickerContainer: {
    width: "100%",
    alignSelf: "stretch", // This ensures the container takes full width
  },
  picker: {
    width: "100%", // Works on Android
    // On iOS, the width is controlled by the display mode
  },
});
