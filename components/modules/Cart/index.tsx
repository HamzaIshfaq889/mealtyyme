import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ScrollView } from "react-native-gesture-handler";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import Toast from "react-native-toast-message";
import {
  ShoppingBagIcon,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Circle,
} from "lucide-react-native";

import { Ingredient, Recipe } from "@/lib/types/recipe";
import { sendIngredients } from "@/services/cartApi";
import { capitalizeWords } from "@/utils";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { removeIngredient } from "@/redux/slices/cart";
import { Button, ButtonText } from "@/components/ui/button";
import InstacartLogo from "@/assets/svgs/instacart.svg";
import { Spinner } from "@/components/ui/spinner";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import { removeIngredientFromCart } from "@/utils/storage/cartStorage";

const Cart = () => {
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const tabBarHeight = useBottomTabBarHeight();

  const [loading, setLoading] = useState(false);
  const [orderUrl, setOrderUrl] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const ingredients: Recipe["ingredients"] = useSelector(
    (state: any) => state?.cart?.items
  );
  const webViewRef = useRef<WebView>(null);

  const customerId = useSelector(
    (state: any) => state?.auth?.loginResponseType?.customer_details?.id
  );

  const handleRemove = async (id: number) => {
    dispatch(removeIngredient(id));
    await removeIngredientFromCart(customerId, id);

    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toggleChecked = (id: number) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleOrder = async () => {
    setLoading(true);
    try {
      const data: any = await sendIngredients(ingredients);
      const url = data.products_link_url;

      if (url) {
        await WebBrowser.openBrowserAsync(url);
      } else {
        throw new Error("Unable to retrieve the grocery list URL.");
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

  const handleBackPress = () => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    } else {
      setOrderUrl(null);
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
  };

  return (
    <View className="flex-1">
      {/* Top Heading */}
      <View className="pt-16 pb-4 px-7 flex-row justify-between items-center bg-foreground">
        <View className="flex-row items-center">
          {orderUrl ? (
            <TouchableOpacity onPress={handleBackPress} className="mr-4">
              <ArrowLeft size={20} color={isDark ? "#FAF1E5" : "#003D29"} />
            </TouchableOpacity>
          ) : (
            <ShoppingBagIcon size={24} color={isDark ? "#FAF1E5" : "#003D29"} />
          )}
          <Text className="font-bold text-2xl text-primary ml-2">
            {orderUrl ? "Back to your Cart" : "Cart"}
          </Text>
        </View>

        {!orderUrl && ingredients?.length > 0 && (
          <Button
            className={`h-[38px] !px-[14px] flex-row items-center ${
              isDark ? "!bg-[#003D29]" : "bg-[#FAF1E5]"
            }`}
            onPress={handleOrder}
          >
            <InstacartLogo />
            <ButtonText
              className={`ml-2 text-sm font-medium ${
                isDark ? "!text-[#FAF1E5]" : "!text-[#003D29]"
              }`}
            >
              {loading ? <Spinner size={20} /> : "Get Recipe Ingredients"}
            </ButtonText>
          </Button>
        )}
      </View>

      {orderUrl ? (
        <WebView
          ref={webViewRef}
          source={{ uri: orderUrl }}
          style={{ flex: 1, marginBottom: tabBarHeight }}
          onNavigationStateChange={handleNavigationStateChange}
        />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingVertical: 16,
            paddingBottom: 120,
          }}
          className="bg-background"
          showsVerticalScrollIndicator={false}
        >
          {ingredients?.length > 0 ? (
            (() => {
              const grouped: { [key: string]: Ingredient[] } = {};

              ingredients.forEach((ing: Ingredient) => {
                const category = ing?.ingredient?.category?.name || "Others";
                if (!grouped[category]) {
                  grouped[category] = [];
                }
                grouped[category].push(ing);
              });

              return Object.entries(grouped).map(([category, items]) => (
                <View key={category} className="mb-3">
                  <Text className="text-2xl font-bold text-primary px-4 mb-2">
                    {capitalizeWords(category)}
                  </Text>
                  {items.map((ing: Ingredient) => (
                    <View
                      key={ing?.ingredient?.id}
                      className={`rounded-3xl mb-4 bg-foreground ${
                        isDark && "bg-foreground"
                      }`}
                      style={{
                        boxShadow: !isDark
                          ? "0px 2px 12px rgba(0,0,0,0.05)"
                          : undefined,
                      }}
                    >
                      <View className="p-4">
                        <View className="flex flex-row items-center justify-between">
                          <TouchableOpacity
                            onPress={() => toggleChecked(ing?.ingredient?.id)}
                          >
                            <View className="flex flex-row items-center ml-4 gap-4">
                              <View>
                                {checkedItems.has(ing?.ingredient?.id) ? (
                                  <CheckCircle
                                    size={20}
                                    color="#4CAF50"
                                    className="mr-2"
                                  />
                                ) : (
                                  <Circle
                                    size={20}
                                    color="#B0B0B0"
                                    className="mr-2"
                                  />
                                )}
                              </View>
                              <View className="w-[200px]">
                                <Text
                                  className={`text-primary text-xl font-medium ${
                                    checkedItems.has(ing?.ingredient?.id)
                                      ? "line-through text-muted"
                                      : ""
                                  }`}
                                >
                                  {capitalizeWords(ing?.ingredient?.name)}
                                </Text>
                                <Text className="text-muted text-sm">
                                  {ing?.unit}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className="ml-4"
                            onPress={() => handleRemove(ing?.ingredient?.id)}
                          >
                            <Trash2 size={20} color="#FF3B30" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ));
            })()
          ) : (
            <View className="flex-1 justify-center items-center p-7">
              <Text className="text-muted text-sm text-center">
                Your cart is feeling lonely... add some ingredients to spice
                things up by going to a recipe!
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Cart;
