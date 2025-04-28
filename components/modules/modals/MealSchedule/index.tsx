import React, { useState } from "react";

import {
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Dialog from "react-native-dialog";

import { Button, ButtonText } from "@/components/ui/button";

import { ChevronDown, ChevronUp, Clock } from "lucide-react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

import SelectDropdown from "react-native-select-dropdown";

type MealScheduleProps = {
  showMealScheduleModal: boolean;
  setShowMealScheduleModal: (value: boolean) => void;
};

const options = ["BREAKFAST", "LAUNCH", "DINNER"];

const MealSchedule = ({
  setShowMealScheduleModal,
  showMealScheduleModal,
}: MealScheduleProps) => {
  const scheme = useColorScheme();

  const [selected, setSelected] = useState(options[0]);
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
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

  return (
    <View>
      <Dialog.Container
        visible={showMealScheduleModal}
        contentStyle={{
          backgroundColor: scheme === "dark" ? "#131414" : "#fff",
          paddingVertical: 50,
          borderRadius: 30,
        }}
      >
        <View>
          <View className="flex flex-row justify-center mb-6">
            <View className="bg-secondary flex flex-row justify-center items-center w-24 h-24 p-8 rounded-full">
              <Clock color="#fff" size={45} />
            </View>
          </View>
          <Text className="text-center text-primary text-2xl mt-2 mb-10">
            Schedule your meal
          </Text>

          <View className={`${Platform.OS === "ios" && "mx-4"}`}>
            <SelectDropdown
              data={options}
              defaultValue={selected}
              onSelect={(selectedItem) => {
                setSelected(selectedItem);
              }}
              renderButton={(selectedItem, isOpened) => (
                <View className="flex-row items-center gap-4 px-6 py-4 bg-secondary rounded-full mb-8">
                  <Text className="flex-1 text-lg leading-6 font-semibold text-background">
                    {selectedItem || "Select"}
                  </Text>
                  {isOpened ? (
                    <ChevronDown color="#fff" size={22} />
                  ) : (
                    <ChevronUp color="#fff" size={22} />
                  )}
                </View>
              )}
              renderItem={(selectedItem, item, isSelected) => {
                return (
                  <View
                    className={`px-4 py-2 ${
                      isSelected ? "bg-secondary" : "bg-accent "
                    }`}
                  >
                    <Text
                      className={`text-lg text-black ${
                        isSelected ? "!text-background" : "text-foreground"
                      }`}
                    >
                      {selectedItem}
                    </Text>
                  </View>
                );
              }}
              dropdownStyle={{
                borderRadius: 18,
                backgroundColor: "#f1f3f5",
                marginTop: -25,
              }}
              showsVerticalScrollIndicator={false}
            />

            <SafeAreaView>
              <TouchableOpacity
                onPress={showDatepicker}
                className="bg-background px-4 border border-border rounded-xl py-5 mb-7"
              >
                <Text className="text-foreground">
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
                />
              )}
            </SafeAreaView>

            <View className="flex flex-row gap-2">
              <Button
                action="muted"
                className="basis-1/2 h-16"
                onPress={() => setShowMealScheduleModal(false)}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button action="secondary" className="basis-1/2 h-16">
                <ButtonText>Save</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </Dialog.Container>
    </View>
  );
};

export default MealSchedule;
