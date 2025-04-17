import React, { useState } from "react";

import { Text, View } from "react-native";
import Dialog from "react-native-dialog";

import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";

import { FilePenLine } from "lucide-react-native";

type AddSchedule = {
  showEditModal: boolean;
  setShowEditModal: (value: boolean) => void;
};
const AddSchedule = ({ setShowEditModal, showEditModal }: AddSchedule) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({ collectionName: "" });

  const validateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    let errorMessage = "";

    // Validation rules for each field
    switch (key) {
      case "collectionName":
        if (!value) {
          errorMessage = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = "Please enter a valid email.";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [key]: errorMessage }));
  };

  return (
    <View>
      <Dialog.Container visible={showEditModal}>
        <View className="flex flex-row justify-center mb-6">
          <View className="bg-secondary flex flex-row justify-center items-center w-16 h-16 p-8 rounded-full">
            <FilePenLine color="#fff" size={28} />
          </View>
        </View>
        <FormControl size="md" className="mb-1">
          <FormControlLabel>
            <FormControlLabelText className="font-bold leading-5 text-foreground text-center w-full h-full">
              <Text>Edit Collection Name</Text>
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="my-5">
            <InputField
              type="text"
              placeholder="Enter Collection Name"
              value={formData?.collectionName}
              onChangeText={(text) => validateField("collectionName", text)}
            />
          </Input>
          <FormControlError>
            <FormControlErrorText>{errors?.email}</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <View className="flex flex-row gap-2">
          <Button
            action="muted"
            className="basis-1/2 h-16"
            onPress={() => setShowEditModal(false)}
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

export default AddSchedule;
