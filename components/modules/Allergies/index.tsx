import React, { useState } from "react";

import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

import { router } from "expo-router";

import { Button, ButtonText } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react-native";
import {
  useGetCustomer,
  useUpdateCustomer,
} from "@/redux/queries/recipes/useCustomerQuery";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "@/components/ui/spinner";
import { setCredentials } from "@/redux/slices/Auth";
import { saveUserDataInStorage } from "@/utils/storage/authStorage";

const Allergies = () => {
  const scheme = useColorScheme();
  const dispatch = useDispatch();

  const { mutate: updateAllergies } = useUpdateCustomer();
  const { refetch } = useGetCustomer();

  const customerId = useSelector(
    (state: any) => state.auth.loginResponseType.customer_details?.id
  );
  const credentials = useSelector((state: any) => state.auth.loginResponseType);

  const [loading, setLoading] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const allergies = [
    { id: 503, title: "Peanuts" },
    { id: 678, title: "Milk" },
    { id: 120, title: "Egg" },
    { id: 1422, title: "Soya" },
    { id: 277, title: "Fish" },
    { id: 179, title: "Sesame Oil" },
    { id: 435, title: "Mustard" },
    { id: 1058, title: "Celery" },
  ];

  const handleSelection = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const handleNext = async () => {
    setLoading(true);

    const data = {
      allergies: selectedIndexes,
    };

    updateAllergies(
      { customerId, data },
      {
        onSuccess: async () => {
          await refecthCustomer();
          setLoading(false);

          router.push("/(protected)/(tabs)");
        },
        onError: (error) => {
          console.error("Error while settingup allergies:", error);
          setLoading(false);
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
    <View className="w-full h-full px-9 pt-16 pb-6 flex-col relative bg-background">
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity
          onPress={() => router.push("/(protected)/(onboarding)/pick-diet")}
        >
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="font-bold text-2xl text-primary">
            Any Allergies?
          </Text>
        </View>

        <View style={{ width: 30 }} />
      </View>
      <View className="flex-row flex-wrap">
        {allergies?.map((allergy, index) => {
          const isSelected = selectedIndexes.includes(allergy.id);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelection(allergy?.id)}
            >
              <Text
                className={`inline p-4 rounded-xl font-bold leading-6 bg-card mx-1.5 my-1.5 
                 ${
                   isSelected ? "!text-white !bg-secondary " : "text-foreground"
                 }`}
              >
                {allergy.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View className="mt-auto mb-10">
        <Text className="text-xs text-center text-muted leading-5">
          Don’t see your allergy listed? No worries! Use our advanced filter to
          easily remove any ingredient from your recipe searches. Enjoy
          personalized meal suggestions that cater to your needs!
        </Text>
      </View>
      <Button
        className="mt-2 bg-secondary"
        action="primary"
        onPress={handleNext}
        disabled={!!loading}
      >
        <ButtonText className="!text-white">
          {loading ? <Spinner /> : "Next"}
        </ButtonText>
      </Button>
    </View>
  );
};

export default Allergies;
