import { supportOptions } from "@/utils";
import { router } from "expo-router";
import { ArrowLeft, ChevronDown, ChevronUp, Scroll } from "lucide-react-native";
import React, { useState } from "react";

import { Textarea, TextareaInput } from "@/components/ui/textarea";

import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { ScrollView } from "react-native-gesture-handler";

const ContactSupport = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const [selected, setSelected] = useState(supportOptions[0]);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={
        Platform.OS === "ios" ? 100 : StatusBar.currentHeight || 0
      }
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="w-full h-full px-6 py-16 flex-col relative"
      >
        <View className="flex-row items-center justify-between mb-10">
          <TouchableOpacity
            onPress={() => router.push("/(protected)/(nested)/settings")}
          >
            <ArrowLeft
              width={30}
              height={30}
              color={scheme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>

          <View className="flex-1 items-center">
            <Text className="font-bold text-2xl text-primary">
              Contact Support
            </Text>
          </View>

          <View style={{ width: 30 }} />
        </View>

        <View>
          <Text className="text-foreground font-bold leading-5 text-xl mb-5">
            Subject
          </Text>
          <SelectDropdown
            data={supportOptions}
            defaultValue={selected}
            onSelect={(selectedItem) => {
              setSelected(selectedItem);
            }}
            renderButton={(selectedItem, isOpened) => (
              <View className="flex-row items-center gap-4 px-6 py-4 !rounded-2xl mb-8 border-2 border-foreground">
                <Text className="flex-1 text-base leading-6 font-semibold text-primary">
                  {selectedItem || "Select"}
                </Text>
                {isOpened ? (
                  <ChevronUp color="#00D4FF" size={24} />
                ) : (
                  <ChevronDown color="#00D4FF" size={24} />
                )}
              </View>
            )}
            renderItem={(selectedItem, item, isSelected) => {
              return (
                <View
                  className={`px-4 py-2  ${
                    isSelected ? "bg-secondary" : "bg-background"
                  }`}
                >
                  <Text
                    className={`text-lg text-foreground ${
                      isSelected ? "!text-background" : "text-foreground"
                    }`}
                  >
                    {selectedItem}
                  </Text>
                </View>
              );
            }}
            dropdownStyle={{
              borderRadius: 12,
              backgroundColor: scheme === "dark" ? "#1c1f1f" : "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View className="mb-7">
          <Text className="text-foreground font-bold leading-5 text-xl mb-5">
            Message
          </Text>
          <Textarea className="flex flex-row items-start gap-1 px-3 py-2  border border-foreground">
            <TextareaInput
              type="text"
              placeholder="Enter message..."
              value={message}
              onChangeText={(text) => setMessage(text)}
              className="placeholder:text-muted !placeholder:text-base !text-base"
            />
          </Textarea>
        </View>

        <View>
          <FormControl
            isInvalid={!!email}
            size="md"
            isDisabled={false}
            isReadOnly={false}
            isRequired={false}
            className="mb-1"
          >
            <FormControlLabel>
              <FormControlLabelText className="font-bold leading text-foreground mb-3.5">
                Email Address
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="border-2 border-foreground">
              <InputField
                type="text"
                placeholder="Enter Email Address"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </Input>
            <FormControlError>
              <FormControlErrorText>{email}</FormControlErrorText>
            </FormControlError>
          </FormControl>
        </View>

        <View className="mt-auto">
          <Button>
            <ButtonText>Send Message</ButtonText>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ContactSupport;
