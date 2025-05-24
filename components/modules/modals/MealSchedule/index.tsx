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
  const isDark = scheme === "dark";
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
          paddingVertical: Platform.OS === "ios" ? 20 : 24,
          borderRadius: 24,
          width: Platform.OS === "ios" ? "92%" : "90%",
          maxWidth: Platform.OS === "ios" ? 380 : 400,
        }}
      >
        <View style={[styles.container]}>
          <View style={styles.iconContainer}>
            <View
              style={[styles.iconWrapper, isDark && styles.iconWrapperDark]}
            >
              <Clock color="#fff" size={Platform.OS === "ios" ? 36 : 40} />
            </View>
          </View>

          <Text style={[styles.title, isDark && styles.titleDark]}>
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
                style={[
                  styles.dropdownButton,
                  isDark && styles.dropdownButtonDark,
                ]}
              >
                <View style={styles.dropdownIcon}>
                  <Clock1 color={isDark ? "#fff" : "#000"} size={20} />
                </View>
                <Text
                  style={[
                    styles.dropdownText,
                    isDark && styles.dropdownTextDark,
                  ]}
                  numberOfLines={1}
                >
                  {selectedItem || "Select meal type"}
                </Text>
                <View style={styles.dropdownArrow}>
                  {isOpened ? (
                    <ChevronUp color="#ee8427" size={24} />
                  ) : (
                    <ChevronDown color="#ee8427" size={24} />
                  )}
                </View>
              </View>
            )}
            renderItem={(item, isSelected) => (
              <View
                style={[styles.dropdownItem, isDark && styles.dropdownItemDark]}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    isDark && styles.dropdownItemTextDark,
                  ]}
                >
                  {item}
                </Text>
              </View>
            )}
            dropdownStyle={[styles.dropdown, isDark && styles.dropdownDark]}
            showsVerticalScrollIndicator={false}
            dropdownOverlayColor="transparent"
          />

          <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity
              onPress={() => showMode("date")}
              style={[styles.dateButton, isDark && styles.dateButtonDark]}
            >
              <View style={styles.dateButtonContent}>
                <CalendarRange color={isDark ? "#fff" : "#000"} size={20} />
                <Text style={[styles.dateText, isDark && styles.dateTextDark]}>
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
              <View style={styles.iosCalendarContainer}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  onChange={onChange}
                  display="inline"
                  minimumDate={today}
                  maximumDate={maxDate}
                  themeVariant={scheme === "dark" ? "dark" : "light"}
                />
              </View>
            )}
          </SafeAreaView>

          <View style={styles.buttonContainer}>
            <Button
              action="card"
              style={[styles.button, isDark && styles.buttonDark]}
              onPress={() => setShowMealScheduleModal(false)}
            >
              <ButtonText
                style={[styles.buttonText, isDark && styles.buttonTextDark]}
              >
                Cancel
              </ButtonText>
            </Button>
            <Button
              action="secondary"
              style={styles.button}
              onPress={() => {
                handleSave();
                setShowMealScheduleModal(false);
              }}
            >
              <ButtonText style={styles.buttonText}>Save</ButtonText>
            </Button>
          </View>
        </View>
      </Dialog.Container>
    </View>
  );
};

export default MealSchedule;

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === "ios" ? 16 : 20,
  },
  containerDark: {
    backgroundColor: "#1a1a1a",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Platform.OS === "ios" ? 20 : 24,
  },
  iconWrapper: {
    backgroundColor: "#ee8427",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: Platform.OS === "ios" ? 70 : 80,
    height: Platform.OS === "ios" ? 70 : 80,
    padding: 16,
    borderRadius: 35,
  },
  iconWrapperDark: {
    backgroundColor: "#ee8427",
  },
  title: {
    textAlign: "center",
    color: "#ee8427",
    fontSize: Platform.OS === "ios" ? 22 : 24,
    fontWeight: "600",
    marginBottom: Platform.OS === "ios" ? 24 : 32,
  },
  titleDark: {
    color: "#ee8427",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  dropdownButtonDark: {
    backgroundColor: "#2a2a2a",
    borderColor: "#3a3a3a",
  },
  dropdownIcon: {
    marginRight: 12,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  dropdownTextDark: {
    color: "#fff",
  },
  dropdownArrow: {
    marginLeft: 8,
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  dropdownItemDark: {
    backgroundColor: "#2a2a2a",
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  dropdownItemTextDark: {
    color: "#fff",
  },
  dropdown: {
    borderRadius: 16,
    backgroundColor: "#fff",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  dropdownDark: {
    backgroundColor: "#2a2a2a",
    borderColor: "#3a3a3a",
  },
  safeArea: {
    width: "100%",
  },
  iosCalendarContainer: {
    width: "100%",
    paddingHorizontal: Platform.OS === "ios" ? 4 : 0,
    marginBottom: 16,
  },
  dateButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  dateButtonDark: {
    backgroundColor: "#2a2a2a",
    borderColor: "#3a3a3a",
  },
  dateButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  dateText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  dateTextDark: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: Platform.OS === "ios" ? 50 : 56,
    borderRadius: 16,
  },
  buttonDark: {
    backgroundColor: "#2a2a2a",
  },
  buttonText: {
    fontSize: Platform.OS === "ios" ? 15 : 16,
    fontWeight: "600",
  },
  buttonTextDark: {
    color: "#fff",
  },
});
