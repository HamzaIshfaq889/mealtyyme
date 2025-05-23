// addTimerModal.tsx
import React, { useState } from "react";
import { useColorScheme, Text, View } from "react-native";
import Dialog from "react-native-dialog";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { Button, ButtonText } from "@/components/ui/button";

type AddTimerModalProps = {
  showTimerModal: boolean;
  setShowTimerModal: (v: boolean) => void;
  // minutes: number, start timestamp: ms
  setDuration: (min: number, startTime: number) => void;
};

const AddTimerModal = ({
  showTimerModal,
  setShowTimerModal,
  setDuration,
}: AddTimerModalProps) => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  // state for pickers
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(0);

  // arrays 0–6 hours, 0–60 minutes
  const hours = Array.from({ length: 7 }, (_, i) => i);
  const minutes = Array.from({ length: 61 }, (_, i) => i);

  const handleAdd = () => {
    const totalMinutes = selectedHours * 60 + selectedMinutes;
    if (totalMinutes <= 0) {
      return;
    }
    // start immediately
    setDuration(totalMinutes, Date.now());
    setShowTimerModal(false);
  };

  return (
    <View>
      <Dialog.Container
        visible={showTimerModal}
        contentStyle={{
          backgroundColor: scheme === "dark" ? "#1a1a1a" : "#fdf8f4",
          paddingBottom: 10,
          paddingTop: 2,
          borderRadius: 20,
        }}
      >
        <Text className="text-2xl text-center mb-6 text-primary">
          Add Timer
        </Text>

        <View className="flex flex-row justify-between mb-4">
          {/* Hours Picker */}
          <View className="w-[47%] h-64 px-4">
            <ScrollPicker
              dataSource={hours}
              selectedIndex={3}
              renderItem={(data, index) => (
                <Text
                  key={index}
                  className="text-xl text-foreground font-medium mb-2 px-3"
                >{`${data} hr`}</Text>
              )}
              onValueChange={(data, idx) => setSelectedHours(Number(data))}
              wrapperHeight={180}
              wrapperBackground={isDarkMode ? "#1A1A1A" : "#FDF8F4"}
              itemHeight={40}
              highlightColor={isDarkMode ? "#fff" : "#000"}
              highlightBorderWidth={2}
            />
          </View>

          {/* Minutes Picker */}
          <View className="w-[47%] h-64 px-4">
            <ScrollPicker
              dataSource={minutes}
              selectedIndex={4}
              renderItem={(data, index) => (
                <Text
                  key={index}
                  className="text-xl text-foreground font-medium mb-2 px-3"
                >{`${data} min`}</Text>
              )}
              onValueChange={(data, idx) => setSelectedMinutes(Number(data))}
              wrapperHeight={180}
              wrapperBackground={isDarkMode ? "#1A1A1A" : "#FDF8F4"}
              itemHeight={40}
              highlightColor={isDarkMode ? "#fff" : "#000"}
              highlightBorderWidth={2}
            />
          </View>
        </View>

        <View className="flex flex-row gap-2">
          <Button
            className="w-1/2"
            action="card"
            onPress={() => setShowTimerModal(false)}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button className="w-1/2" action="secondary" onPress={handleAdd}>
            <ButtonText>Add</ButtonText>
          </Button>
        </View>
      </Dialog.Container>
    </View>
  );
};

export default AddTimerModal;
