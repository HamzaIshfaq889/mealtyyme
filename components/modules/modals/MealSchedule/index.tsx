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
import {
  CalendarRange,
  ChevronDown,
  ChevronUp,
  Clock,
  Clock1,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Toast from "react-native-toast-message";
import SelectDropdown from "react-native-select-dropdown";
import { Recipe } from "@/lib/types/recipe";
import { useSelector } from "react-redux";
import { AddMealSchedulePayload, MealType } from "@/lib/types/mealschedule";
import { AddMealSchedule } from "@/services/mealscheduleApi";
import { checkisProUser } from "@/utils";

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

  const status = useSelector(
    (state: any) =>
      state.auth.loginResponseType.customer_details?.subscription?.status
  );
  const isProUser = checkisProUser(status);

  // Date configuration
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + (isProUser ? 6 : 3));

  const [date, setDate] = useState(today);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode: "date" | "time") => {
    setShow(true);
    setMode(currentMode);
  };

  const handleSave = async () => {
    if (!currentRecipe?.id || !date) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const payload: AddMealSchedulePayload = {
        recipe: Number(currentRecipe.id),
        meal_type: selected,
        date: formattedDate,
      };

      await AddMealSchedule(payload);
      Toast.show({
        type: "success",
        text1: "Meal added successfully!",
      });
    } catch (error) {
      console.error("Error adding meal schedule:", error);
      Toast.show({
        type: "error",
        text1: "Failed to add meal schedule",
      });
    }
  };

  return (
    <View>
      <Dialog.Container
        visible={showMealScheduleModal}
        contentStyle={{
          backgroundColor: scheme === "dark" ? "#1a1a1a" : "#fdf8f4",
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
              if (matched) setSelected(matched.value);
            }}
            renderButton={(selectedItem, isOpened) => (
              <View
                className="flex-row items-center justify-between px-3 py-4 bg-background rounded-2xl"
                style={{
                  paddingVertical: 16,
                  marginBottom: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View className="mr-3">
                  <Clock1
                    color={scheme === "dark" ? "#fff" : "#000"}
                    size={20}
                  />
                </View>
                <Text
                  className="flex-1 text-lg font-medium text-primary"
                  numberOfLines={1}
                >
                  {selectedItem || "Select meal type"}
                </Text>
                <View className="ml-2">
                  {isOpened ? (
                    <ChevronUp color="#ee8427" size={24} />
                  ) : (
                    <ChevronDown color="#ee8427" size={24} />
                  )}
                </View>
              </View>
            )}
            renderItem={(item, isSelected) => (
              <View className="px-6 py-4 bg-background">
                <Text className="text-base font-semibold text-primary">
                  {item}
                </Text>
              </View>
            )}
            dropdownStyle={{
              borderRadius: 12,
              backgroundColor: scheme === "dark" ? "#000" : "#fff",
              marginTop: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          />

          <SafeAreaView>
            <TouchableOpacity
              onPress={() => showMode("date")}
              className="bg-background px-4 border border-border rounded-xl py-5 mb-7"
              style={{
                borderRadius: Platform.OS === "ios" ? 16 : 12,
                paddingVertical: Platform.OS === "ios" ? 20 : 16,
              }}
            >
              <View className="flex flex-row gap-4">
                <CalendarRange
                  color={scheme === "dark" ? "#fff" : "#000"}
                  size={20}
                />
                <Text
                  className="text-foreground"
                  style={{
                    fontSize: Platform.OS === "ios" ? 16 : 15,
                    color: scheme === "dark" ? "#fff" : "#000",
                    textAlign: "center",
                    fontWeight: "500",
                  }}
                >
                  {moment(date).format("MMMM D, YYYY")}
                </Text>
              </View>
            </TouchableOpacity>

            {show && Platform.OS !== "ios" && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
                display="default"
                minimumDate={today}
                maximumDate={maxDate}
                themeVariant={scheme === "dark" ? "dark" : "light"}
              />
            )}

            {Platform.OS === "ios" && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                // is24Hour={true}
                onChange={onChange}
                display="inline"
                minimumDate={today}
                maximumDate={maxDate}
                themeVariant={scheme === "dark" ? "dark" : "light"}
              />
            )}
          </SafeAreaView>

          <View
            className="flex flex-row gap-2"
            style={{ marginTop: Platform.OS === "ios" ? 10 : 5 }}
          >
            <Button
              action="card"
              className="basis-1/2 h-16"
              style={{
                height: Platform.OS === "ios" ? 60 : 55,
                borderRadius: Platform.OS === "ios" ? 16 : 12,
              }}
              onPress={() => setShowMealScheduleModal(false)}
            >
              <ButtonText style={{ fontSize: Platform.OS === "ios" ? 18 : 16 }}>
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
              <ButtonText style={{ fontSize: Platform.OS === "ios" ? 18 : 16 }}>
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
    alignSelf: "stretch",
  },
  picker: {
    width: "100%",
  },
});
