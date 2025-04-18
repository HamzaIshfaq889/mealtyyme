import React, { useState } from "react";

import { Text } from "react-native";
import Dialog from "react-native-dialog";

import { FilePenLine, View } from "lucide-react-native";

import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { useColorScheme } from "react-native";

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
  const [formData, setFormData] = useState({ time: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const systemColorScheme = useColorScheme();

  const validateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    let errorMessage = "";

    // Validation rules for each field
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
    <Dialog.Container visible={showTimerModal}>
      <Text className="bg-foreground">Add Timer</Text>

      <FormControl size="md">
        <Input>
          <InputField
            type="text"
            placeholder="Enter Time in Minutes"
            value={formData?.time}
            keyboardType="numeric"
            onChangeText={(text) => validateField("time", text)}
            style={{ color: "#000" }}
            placeholderTextColor="#999"
          />
        </Input>

        {errors?.time && (
          <Text style={{ color: "#EF4444", marginTop: 4, marginBottom: 16 }}>
            {errors?.time}
          </Text>
        )}
      </FormControl>

      <Button
        action="secondary"
        className="w-full h-16 mb-4"
        onPress={handleAddClick}
      >
        <ButtonText className="text-black">Add</ButtonText>
      </Button>

      <Button
        action="muted"
        className="w-full h-16"
        onPress={() => setShowTimerModal(false)}
      >
        <ButtonText className="text-black">Cancel</ButtonText>
      </Button>
    </Dialog.Container>
  );
};

export default AddTimerModal;
