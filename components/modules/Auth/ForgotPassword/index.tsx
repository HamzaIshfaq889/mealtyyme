import React, { useState } from "react";

import { TouchableOpacity } from "react-native";
import { Text, View } from "react-native";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { MailIcon } from "@/components/ui/icon";

import Svg1 from "@/assets/svgs/arrow-left.svg";
import { Button, ButtonText } from "@/components/ui/button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const handleSubmit = () => {
    console.log(email);
  };

  return (
    <View className="flex flex-col w-full h-full px-9 py-16">
      <View className="flex flex-row justify-between items-center mb-12">
        <TouchableOpacity>
          <Svg1 width={23} height={23} />
        </TouchableOpacity>
        <Text className="block font-bold text-2xl">Forgot Password</Text>
        <Text></Text>
      </View>
      <View>
        <Text className="text-primary/70 leading-6 mb-6">
          Enter your email and we will send you a link to reset your password.
        </Text>
        <FormControl isInvalid={isInvalid} size="md" className="mb-1">
          <FormControlLabel>
            <FormControlLabelText className="font-bold leading-5">
              Email Address
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="my-3.5">
            <InputSlot className="ml-1">
              <InputIcon className="!w-6 !h-6 text-primary" as={MailIcon} />
            </InputSlot>
            <InputField
              type="text"
              placeholder="Enter Email Address"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </Input>
          <FormControlError>
            <FormControlErrorText>
              Please enter valid email.
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
      </View>
      <Button action="primary" className="mt-auto" onPress={handleSubmit}>
        <ButtonText>Send Email</ButtonText>
      </Button>
    </View>
  );
};

export default ForgotPassword;
