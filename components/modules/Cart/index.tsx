import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ScrollView } from "react-native-gesture-handler";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import Toast from "react-native-toast-message";
import {
  Trash2,
  ArrowLeft,
  CheckCircle,
  Circle,
  Menu,
  EllipsisVertical,
} from "lucide-react-native";

import { Ingredient, Recipe } from "@/lib/types/recipe";
import { sendIngredients } from "@/services/cartApi";
import { capitalizeWords, convertToFraction } from "@/utils";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { removeIngredient } from "@/redux/slices/cart";
import { Button, ButtonText } from "@/components/ui/button";
import InstacartLogo from "@/assets/svgs/instacart.svg";
import { Spinner } from "@/components/ui/spinner";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import {
  loadCheckedIngredients,
  removeCheckedIngredient,
  removeIngredientFromCart,
  saveCheckedIngredient,
} from "@/utils/storage/cartStorage";
import CheckedItems from "./checkedItems";
import BottomSheet from "@gorhom/bottom-sheet";

const Cart = () => {
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const tabBarHeight = useBottomTabBarHeight();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const [loading, setLoading] = useState(false);
  const [orderUrl, setOrderUrl] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [refreshCheckedItems, setRefreshCheckedItems] = useState(0);

  const ingredients: Recipe["ingredients"] = useSelector(
    (state: any) => state?.cart?.items
  );
  const webViewRef = useRef<WebView>(null);

  const customerId = useSelector(
    (state: any) => state?.auth?.loginResponseType?.customer_details?.id
  );

  const toggleChecked = async (ingredientId: number) => {
    const isAlreadyChecked = checkedItems.has(ingredientId);

    if (isAlreadyChecked) {
      await removeCheckedIngredient(customerId, ingredientId);
      setCheckedItems(new Set());
    } else {
      const selected = ingredients.find(
        (ing) => ing.ingredient.id === ingredientId
      );
      if (!selected) return;

      setCheckedItems(new Set([ingredientId]));

      await saveCheckedIngredient(customerId, selected);
      dispatch(removeIngredient(ingredientId));
      await removeIngredientFromCart(customerId, ingredientId);
    }

    setRefreshCheckedItems((prev) => prev + 1);
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

  useEffect(() => {
    const loadChecked = async () => {
      if (!customerId) return;

      const saved = await loadCheckedIngredients(customerId);
      if (saved) {
        console.log("saved", saved);
      }
    };

    loadChecked();
  }, [customerId]);

  return (
    <View className="flex-1 bg-background">
      {/* Top Heading */}
      <View className="pt-16 pb-4 px-7 flex-row justify-between items-center ">
        <View className="flex-row items-center">
          {orderUrl ? (
            <TouchableOpacity onPress={handleBackPress} className="mr-4">
              <ArrowLeft size={20} color={isDark ? "#FAF1E5" : "#003D29"} />
            </TouchableOpacity>
          ) : // <ShoppingBagIcon size={24} color={isDark ? "#FAF1E5" : "#003D29"} />
          null}
          <Text className="font-bold text-2xl text-primary mr-4">
            {orderUrl ? "Back to your Cart" : "Grocery"}
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

      <View className="flex justify-end items-end bg-background px-10 mt-4">
        <TouchableOpacity
          onPress={() => bottomSheetRef.current?.snapToIndex(1)}
        >
          <Text className="text-lg font-semibold text-secondary underline">
            Checked Items
          </Text>
        </TouchableOpacity>
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
                  <Text className="text-2xl font-bold text-secondary px-4 mb-2">
                    {capitalizeWords(category)}
                  </Text>
                  {items.map((ing: Ingredient) => (
                    <View
                      key={ing?.ingredient?.id}
                      className={`rounded-3xl mb-4 mx-4 bg-card`}
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
                                    color="#EE8427"
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
                                      ? "line-through text-muted/60"
                                      : ""
                                  }`}
                                >
                                  {capitalizeWords(ing?.ingredient?.name)}
                                </Text>
                                <Text className="text-muted text-sm">
                                  {convertToFraction(ing?.amount)}
                                  {` ${ing?.unit}`}
                                </Text>
                              </View>
                            </View>
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

      <CheckedItems
        bottomSheetRef={bottomSheetRef}
        refreshTrigger={refreshCheckedItems}
        setRefreshTrigger={setRefreshCheckedItems}
      />
    </View>
  );
};

export default Cart;
