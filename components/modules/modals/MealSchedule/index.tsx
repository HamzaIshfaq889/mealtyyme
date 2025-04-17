import React, { useState } from "react";

import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Dialog from "react-native-dialog";

import { Button, ButtonText } from "@/components/ui/button";

import { Clock } from "lucide-react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

type MealScheduleProps = {
  showMealScheduleModal: boolean;
  setShowMealScheduleModal: (value: boolean) => void;
};
const MealSchedule = ({
  setShowMealScheduleModal,
  showMealScheduleModal,
}: MealScheduleProps) => {
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
      <Dialog.Container visible={showMealScheduleModal}>
        <View className="flex flex-row justify-center mb-6">
          <View className="bg-secondary flex flex-row justify-center items-center w-16 h-16 p-8 rounded-full">
            <Clock color="#fff" size={28} />
          </View>
        </View>
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
      </Dialog.Container>
    </View>
  );
};

export default MealSchedule;
