import React, { useState } from 'react'

import { Text } from 'react-native'
import Dialog from "react-native-dialog";

import { FilePenLine, View } from 'lucide-react-native';

import { Button, ButtonText } from '@/components/ui/button';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';

type AddTimeModalProps = {

    showTimerModal: boolean;
    setDuration: (value: number) => void;
    setShowTimerModal: (value: boolean) => void;
    setIsPlaying: (value: boolean) => void;
    setIsTimerComplete: (value: boolean) => void;
};

const AddTimerModal = ({ setShowTimerModal, showTimerModal, setDuration, setIsPlaying, setIsTimerComplete }: AddTimeModalProps) => {
    const [formData, setFormData] = useState({ time: "" });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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


    const isFormValid = formData.time && !errors.time
    const handleAddClick = () => {
        validateAllFields()
        if (!isFormValid) {
            return;
        }

        setShowTimerModal(false);
        setIsPlaying(true)
        setIsTimerComplete(false)
        setDuration(Number(formData?.time))
    }

    return (
        <View>
            <Dialog.Container visible={showTimerModal}>
                <View className="flex flex-row justify-center mb-6">
                    <View className="bg-secondary flex flex-row justify-center items-center w-16 h-16 p-8 rounded-full">
                        <FilePenLine color="#fff" size={28} />
                    </View>
                </View>
                <FormControl size="md" className="mb-1">
                    <FormControlLabel>
                        <FormControlLabelText className="font-bold leading-5 text-foreground text-center w-full h-full">
                            <Text className='text-2xl'>Add Timer</Text>
                        </FormControlLabelText>
                    </FormControlLabel>
                    <Input className="mt-5 mb-3">
                        <InputField
                            type="text"
                            placeholder="Enter Time in Minutes"
                            value={formData?.time}
                            keyboardType='numeric'
                            onChangeText={(text) => validateField("time", text)}
                        />
                    </Input>

                    {errors?.time && <Text className='text-destructive mt-0 mb-5'>{errors?.time}</Text>}
                </FormControl>

                <Button action="secondary" className="w-full h-16 mb-4 mx-auto" onPress={handleAddClick}>
                    <ButtonText>Add</ButtonText>
                </Button>
                <Button
                    action="muted"
                    className="w-full h-16 mb-4 mx-auto"
                    onPress={() => setShowTimerModal(false)}
                >
                    <ButtonText>Cancel</ButtonText>
                </Button>
            </Dialog.Container>
        </View>
    )
}

export default AddTimerModal