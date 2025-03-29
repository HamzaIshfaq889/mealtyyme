import React from "react";

import { Button, Text, TouchableOpacity, View } from "react-native";

import Svg1 from "../../../assets/svgs/account-option.svg";

const AccountsOptions = () => {
  return (
    <View className="bg-secondary w-full h-full flex flex-col justify-end items-center">
      <View>
        <Svg1 width={300} height={300} />
      </View>
      <View className="px-10 py-16 w-full mt-4 mb-6">
        <Text className="font-bold text-3xl leading-10 underline text-center text-secondary mb-10">
          Discover the joy of cooking at home!
        </Text>
        <Button title="login"></Button>
        <TouchableOpacity>
          <Text className="font-bold leading-5 mt-6 text-center text-background">
            Create New Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountsOptions;
