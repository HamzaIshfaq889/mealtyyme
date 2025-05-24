import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";

import { ScrollView } from "react-native-gesture-handler";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Animated,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  Trash2,
  ArrowLeft,
  CheckCircle,
  Circle,
  Menu,
  EllipsisVertical,
  ShoppingBag,
  CheckSquare,
  ListChecks,
  Square,
  GripHorizontalIcon,
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
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";

const Cart = () => {
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const tabBarHeight = useBottomTabBarHeight();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const optionsSheetRef = useRef<BottomSheet>(null);
  const [showCheckedItems, setShowCheckedItems] = useState(false);

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

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateCheck = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleChecked = async (ingredientId: number) => {
    animateCheck();
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

  const optionsSnapPoints = useMemo(() => ["50%"], []);
  const checkedItemsSnapPoints = useMemo(() => ["90%"], []);

  const handleOptionsPress = useCallback(() => {
    if (optionsSheetRef.current) {
      optionsSheetRef.current.snapToIndex(0);
    }
  }, []);

  const handleMarkAllCompleted = async () => {
    if (!ingredients?.length) return;

    const newCheckedItems = new Set<number>();
    for (const ing of ingredients) {
      const id = ing.ingredient.id;
      newCheckedItems.add(id);
      await saveCheckedIngredient(customerId, ing);
      dispatch(removeIngredient(id));
      await removeIngredientFromCart(customerId, id);
    }

    setCheckedItems(newCheckedItems);
    setRefreshCheckedItems((prev) => prev + 1);
    if (optionsSheetRef.current) {
      optionsSheetRef.current.close();
    }
  };

  const handleViewCheckedItems = useCallback(() => {
    setShowCheckedItems(true);
    if (optionsSheetRef.current) {
      optionsSheetRef.current.close();
    }
  }, []);

  const handleOptionsSheetChange = useCallback(
    (index: number) => {
      if (index === -1 && showCheckedItems) {
        if (bottomSheetRef.current) {
          bottomSheetRef.current.snapToIndex(0);
        }
        setShowCheckedItems(false);
      }
    },
    [showCheckedItems]
  );

  const handleCheckedItemsSheetChange = useCallback((index: number) => {
    if (index === -1) {
      setShowCheckedItems(false);
    }
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

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
      <View className="pt-16 pb-5 px-7 flex-row justify-between items-center">
        <View className="flex-row items-center">
          {orderUrl ? (
            <TouchableOpacity onPress={handleBackPress} className="mr-4">
              <ArrowLeft size={20} color={isDark ? "#FAF1E5" : "#003D29"} />
            </TouchableOpacity>
          ) : null}
          <Text className="font-bold text-2xl text-primary">
            {orderUrl ? "Back to your Cart" : "Grocery"}
          </Text>
        </View>

        {!orderUrl && ingredients?.length > 0 && (
          <Button
            className={`h-12 flex-row items-center   ${
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
          <View className="flex-row justify-end items-center px-4 mb-4">
            <TouchableOpacity
              onPress={handleOptionsPress}
              className="flex-row items-center gap-2"
            >
              <GripHorizontalIcon
                size={20}
                color={isDark ? "#FAF1E5" : "#003D29"}
              />
            </TouchableOpacity>
          </View>

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
                <View key={category} className="mb-6">
                  <Text className="text-2xl font-bold text-secondary px-4 mb-4">
                    {capitalizeWords(category)}
                  </Text>
                  {items.map((ing: Ingredient) => (
                    <Animated.View
                      key={ing?.ingredient?.id}
                      style={{ transform: [{ scale: scaleAnim }] }}
                      className={`rounded-3xl mb-4 mx-4 bg-card  border border-input`}
                    >
                      <View className="p-5">
                        <View className="flex flex-row items-center justify-between">
                          <TouchableOpacity
                            onPress={() => toggleChecked(ing?.ingredient?.id)}
                            className="flex-1 flex-row items-center justify-between"
                          >
                            <View className="flex-row items-center gap-4">
                              <View className="bg-muted/5 p-2 rounded-full">
                                {checkedItems.has(ing?.ingredient?.id) ? (
                                  <Square size={22} color="#EE8427" />
                                ) : (
                                  <Square size={22} color="#B0B0B0" />
                                )}
                              </View>
                              <Text
                                className={`text-primary text-xs font-medium ${
                                  checkedItems.has(ing?.ingredient?.id)
                                    ? "line-through text-muted/60"
                                    : ""
                                }`}
                              >
                                {capitalizeWords(ing?.ingredient?.name)}
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-2">
                              <Text className="text-muted text-sm font-medium">
                                {convertToFraction(ing?.amount)}
                              </Text>
                              <Text className="text-muted text-sm">
                                {ing?.unit}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              ));
            })()
          ) : (
            <View className="flex-1 justify-center items-center p-7 mt-10">
              <View className="bg-card p-8 rounded-3xl items-center shadow-sm border border-muted/5">
                <ShoppingBag size={48} color={"#7CA982"} className="mb-4" />
                <Text className="text-muted text-lg text-center font-medium">
                  Your cart is feeling lonely...
                </Text>
                <Text className="text-muted text-sm text-center mt-2">
                  Add some ingredients to spice things up by going to a recipe!
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      <Portal hostName="root-host">
        {/* Options Bottom Sheet */}
        <BottomSheet
          ref={optionsSheetRef}
          index={-1}
          snapPoints={optionsSnapPoints}
          backdropComponent={renderBackdrop}
          onChange={handleOptionsSheetChange}
          style={{
            backgroundColor: "#000",
          }}
          handleStyle={{
            backgroundColor: isDark ? "#1c1c1c" : "#fdf8f4",
            borderWidth: 0,
          }}
          handleIndicatorStyle={{
            backgroundColor: isDark ? "#888" : "#ccc",
          }}
        >
          <BottomSheetScrollView className="bg-background  ">
            <View className="p-6">
              <TouchableOpacity
                onPress={handleMarkAllCompleted}
                className="flex-row items-center gap-3 mb-6 p-4 bg-card rounded-xl"
              >
                <CheckSquare size={24} color={isDark ? "#FAF1E5" : "#003D29"} />
                <Text className="text-lg font-medium text-primary">
                  Mark All Completed
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleViewCheckedItems}
                className="flex-row items-center gap-3 p-4 bg-card rounded-xl"
              >
                <ListChecks size={24} color={isDark ? "#FAF1E5" : "#003D29"} />
                <Text className="text-lg font-medium text-primary">
                  View Checked Items
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheetScrollView>
        </BottomSheet>

        {/* Checked Items Bottom Sheet */}
        <CheckedItems
          bottomSheetRef={bottomSheetRef}
          refreshTrigger={refreshCheckedItems}
          setRefreshTrigger={setRefreshCheckedItems}
          onChange={handleCheckedItemsSheetChange}
          backdropComponent={renderBackdrop}
        />
      </Portal>
    </View>
  );
};

export default Cart;
