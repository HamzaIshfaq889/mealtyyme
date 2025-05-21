import React, { useState } from "react";

import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { useDietsQuery } from "@/redux/queries/recipes/useStaticFilter";
import {
  useGetCustomer,
  useUpdateCustomer,
} from "@/redux/queries/recipes/useCustomerQuery";

import { router } from "expo-router";

import { Button, ButtonText } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/redux/slices/Auth";
import { saveUserDataInStorage } from "@/utils/storage/authStorage";
import { Spinner } from "@/components/ui/spinner";

const PickDiet = () => {
  const { data: diets = [], isLoading: dietsLoading } = useDietsQuery();
  const { mutate: updateDietPrefrences } = useUpdateCustomer();
  const customerId = useSelector(
    (state: any) => state.auth.loginResponseType.customer_details?.id
  );
  const dispatch = useDispatch();
  const credentials = useSelector((state: any) => state.auth.loginResponseType);

  const { refetch } = useGetCustomer();

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const handleSelection = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const handleContinue = () => {
    setLoading(true);
    const data = {
      diet_preferences: selectedIndexes,
    };

    updateDietPrefrences(
      { customerId, data },
      {
        onSuccess: async () => {
          await refecthCustomer();
          setLoading(false);

          router.push("/(protected)/(onboarding)/allergies");
        },
        onError: (error) => {
          setLoading(false);
          console.error("Error while setting up diets:", error);
        },
      }
    );
  };

  const refecthCustomer = async () => {
    try {
      const { data } = await refetch();

      const updatedCustomer = data && data?.length ? data[0] : [];
      console.log("updatedCustomer", updatedCustomer);

      if (updatedCustomer) {
        const updatedLoginResponse = {
          ...credentials,
          customer_details: updatedCustomer,
        };

        dispatch(setCredentials(updatedLoginResponse));

        try {
          await saveUserDataInStorage(updatedLoginResponse);
        } catch (storageError) {
          console.error("Failed to save user data in storage:", storageError);
        }
      }
    } catch (err) {
      console.error("Failed to refetch updated customer:", err);
    }
  };

  return (
    <>
      <View className="w-full h-full px-9 py-16 flex-col relative bg-background">
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-1 items-center">
            <Text className="font-bold text-2xl text-primary">
              Pick your diet
            </Text>
          </View>
        </View>

        {/* Buttons List */}
        <ScrollView>
          {diets?.map((diet, index) => {
            const isSelected = selectedIndexes.includes(diet.id);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelection(diet.id)}
              >
                <View className="mb-4">
                  <Text
                    className={`font-bold leading-6 bg-card p-4 rounded-xl  ${
                      isSelected
                        ? "!text-background !bg-secondary "
                        : "text-foreground"
                    }`}
                  >
                    {diet.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <Button className="mt-2" action="primary" onPress={handleContinue}>
          <ButtonText>{loading ? <Spinner /> : "Next"}</ButtonText>
        </Button>

        {/* Next Button */}
      </View>
    </>
  );
};

export default PickDiet;
