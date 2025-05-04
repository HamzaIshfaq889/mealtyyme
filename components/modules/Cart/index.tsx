import React, { useState } from "react";

import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { Trash2 } from "lucide-react-native";

import { useSelector, useDispatch } from "react-redux";

import * as Linking from "expo-linking";

import { Ingredient } from "@/lib/types/recipe";
import { sendIngredients } from "@/services/cartApi";
import { capitalizeWords } from "@/utils";

import { removeIngredient } from "@/redux/slices/cart";
import { Button, ButtonText } from "@/components/ui/button";

import InstacartLogo from "@/assets/svgs/instacart.svg";
import { Spinner } from "@/components/ui/spinner";

const Cart = () => {
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [loading, setLoading] = useState(false);

  const ingredients = useSelector((state: any) => state.cart.items);

  const handleRemove = (id: number) => {
    dispatch(removeIngredient(id));
  };

  const handleOrder = async () => {
    setLoading(true);
    try {
      const data: any = await sendIngredients(ingredients);
      const url = data.products_link_url;

      if (url && (await Linking.canOpenURL(url))) {
        await Linking.openURL(url);
      } else {
        throw new Error("Unable to open the grocery list URL.");
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error while ordering ingredients",
      });
      console.error("Error sending ingredients:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="w-full h-full">
      <View
        className={`flex-row items-center justify-between pb-10 px-7 pt-16 mb-4`}
      >
        <View className="flex-1 items-center">
          <Text className="font-bold text-2xl text-primary">
            My Grocery List
          </Text>
        </View>
      </View>

      {ingredients?.length > 0 ? (
        <View className="px-6">
          {ingredients?.map((ing: Ingredient, index: number) => {
            return (
              <View
                className={`rounded-3xl ${
                  index === ingredients?.length - 1 ? "mb-6" : "mb-6"
                } ${isDark && "bg-[#1D232B]"}`}
                style={{
                  boxShadow: !isDark ? "0px 2px 12px 0px rgba(0,0,0,0.05)" : "",
                }}
              >
                <View className="p-6">
                  <View className="flex flex-row justify-between">
                    <View className="flex flex-col gap-3">
                      <Text className="text-foreground text-xl font-medium leading-6">
                        {capitalizeWords(ing?.ingredient?.name)}
                      </Text>
                      <Text className="text-muted text-sm">
                        {Math.ceil(ing.amount)} {ing?.unit}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="ml-4"
                      onPress={() => handleRemove(ing?.ingredient?.id)}
                    >
                      <Trash2 size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}

          <View className="mb-36">
            <Button
              className={`h-[46px] !px-[18px] ${
                isDark ? "!bg-[#003D29]" : "bg-[#FAF1E5]"
              }`}
              onPress={handleOrder}
            >
              <InstacartLogo />
              <ButtonText
                className={`${
                  isDark ? "!text-[#FAF1E5]" : "!text-[#003D29]"
                } !leading-10`}
              >
                {loading ? <Spinner size={30}/> : "Order with Instacart"}
              </ButtonText>
            </Button>
          </View>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center p-7">
          <Text className="text-muted text-sm text-center">
            Your cart is feeling lonely... add some ingredients to spice things
            up by going to a recipe!
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Cart;
