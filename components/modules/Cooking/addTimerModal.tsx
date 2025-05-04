import React, { useState } from "react";

import { useColorScheme } from "react-native";
import { Text } from "react-native";

import Dialog from "react-native-dialog";

import { View } from "lucide-react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";

type AddTimeModalProps = {
  showTimerModal: boolean;
  setDuration: (value: number) => void;
  setShowTimerModal: (value: boolean) => void;
  setIsPlaying: (value: boolean) => void;
  setIsTimerComplete: (value: boolean) => void;
};

const AddTimerModal = ({
  setShowTimerModal,
  showTimerModal,
  setDuration,
  setIsPlaying,
  setIsTimerComplete,
}: AddTimeModalProps) => {
  const scheme = useColorScheme();

  const [formData, setFormData] = useState({ time: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    let errorMessage = "";

    switch (key) {
      case "time":
        if (!value) {
          errorMessage = "Time is required.";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [key]: errorMessage }));
  };

  const validateAllFields = () => {
    const fieldsToValidate = {
      ...formData,
    };

    Object.entries(fieldsToValidate).forEach(([key, value]) => {
      validateField(key, value);
    });
  };

  const isFormValid = formData.time && !errors.time;
  const handleAddClick = () => {
    validateAllFields();
    if (!isFormValid) {
      return;
    }

    setShowTimerModal(false);
    setIsPlaying(true);
    setIsTimerComplete(false);
    setDuration(Number(formData?.time));
  };

  return (
    <View>
      <Dialog.Container
        visible={showTimerModal}
        contentStyle={{
          backgroundColor: scheme === "dark" ? "#000" : "#fff",
          paddingBottom: 50,
          paddingTop: 10,
          borderRadius: 30,
        }}
      >
        <Text className="text-primary text-2xl text-center mb-7">
          Add Timer
        </Text>

        <FormControl size="md" className="mb-7">
          <Input>
            <InputField
              type="text"
              placeholder="Enter Time in Minutes"
              value={formData?.time}
              keyboardType="numeric"
              onChangeText={(text) => validateField("time", text)}
              className="text-primary text-lg"
              placeholderTextColor="#999"
            />
          </Input>

          {errors?.time && (
            <Text style={{ color: "#EF4444", marginTop: 4 }}>
              {errors?.time}
            </Text>
          )}
        </FormControl>

        <Button
          action="secondary"
          className="w-full py-3"
          onPress={handleAddClick}
        >
          <ButtonText className="text-primary">Add</ButtonText>
        </Button>

        <Button
          action="muted"
          className="!w-full py-3 mt-4"
          onPress={() => setShowTimerModal(false)}
        >
          <ButtonText className="text-foreground">Cancel</ButtonText>
        </Button>
      </Dialog.Container>
    </View>
  );
};

export default AddTimerModal;
