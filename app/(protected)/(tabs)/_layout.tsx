import { Tabs, useSegments } from "expo-router";
import {
  useColorScheme,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import {
  House,
  CalendarDays,
  ShoppingCart,
  User,
  BotMessageSquare,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getCookingPrivacy,
  getCookingRecipe,
} from "@/utils/storage/cookingStorage";
import { startCooking } from "@/redux/slices/recipies";
import { loadIngredientCart } from "@/utils/storage/cartStorage";
import { addIngredients } from "@/redux/slices/cart";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import React from "react";

// Create a context to share the tab bar animation value
export const TabBarContext = React.createContext<{
  tabBarTranslateY: Animated.SharedValue<number>;
}>({
  tabBarTranslateY: { value: 0 } as any,
});

export default function FloatingTabsLayout() {
  const scheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const isDark = scheme === "dark";
  const dispatch = useDispatch();
  const tabBarTranslateY = useSharedValue(0);

  const customerId = useSelector(
    (state: any) => state?.auth?.loginResponseType?.customer_details?.id
  );

  const colors = {
    background: isDark ? "#2B2B2B" : "#FFFFFF",
    active: "#EE8427",
    inactive: isDark ? "#CCCCCC" : "#5C5C5C",
  };

  const currentRoute = segments[segments.length - 1] || "index";
  const tabIndexMap = {
    index: 0,
    "meal-plan": 1,
    "chat-bot": 2,
    cart: 3,
    account: 4,
  };
  const activeIndex =
    tabIndexMap[currentRoute as keyof typeof tabIndexMap] ?? 0;

  // Custom floating tab bar without navigation prop, uses router instead
  function FloatingTabBar() {
    const { tabBarTranslateY } = React.useContext(TabBarContext);

    const tabBarAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: tabBarTranslateY.value,
          },
        ],
      };
    });

    return (
      <Animated.View
        style={[
          styles.floatingTabBar,
          { backgroundColor: colors.background },
          tabBarAnimatedStyle,
        ]}
      >
        {/* Home tab */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/")}
        >
          <House
            color={activeIndex === 0 ? colors.active : colors.inactive}
            size={24}
            strokeWidth={1.5}
          />
        </TouchableOpacity>

        {/* Meal Plan tab */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/meal-plan")}
        >
          <CalendarDays
            color={activeIndex === 1 ? colors.active : colors.inactive}
            size={24}
            strokeWidth={1.5}
          />
        </TouchableOpacity>

        {/* Center FAB */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/chat-bot")}
        >
          <BotMessageSquare
            color={activeIndex === 2 ? colors.active : colors.inactive}
            size={24}
            strokeWidth={1.5}
          />
        </TouchableOpacity>

        {/* Cart tab */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/cart")}
        >
          <ShoppingCart
            color={activeIndex === 3 ? colors.active : colors.inactive}
            size={24}
            strokeWidth={1.5}
          />
        </TouchableOpacity>

        {/* Account tab */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/account")}
        >
          <User
            color={activeIndex === 4 ? colors.active : colors.inactive}
            size={24}
            strokeWidth={1.5}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  useEffect(() => {
    const checkUserData = async () => {
      const recipe = await getCookingRecipe(customerId);
      const isPrivate = await getCookingPrivacy(customerId);
      const cart = await loadIngredientCart(customerId);

      if (recipe) {
        dispatch(startCooking({ recipe, isPrivate }));
      }
      if (cart.length > 0) {
        dispatch(addIngredients(cart));
      }
    };

    checkUserData();
  }, []);

  return (
    <TabBarContext.Provider value={{ tabBarTranslateY }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" }, // hide default tab bar
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="meal-plan" />
        <Tabs.Screen name="chat-bot" />
        <Tabs.Screen name="cart" />
        <Tabs.Screen name="account" />
      </Tabs>

      <FloatingTabBar />
    </TabBarContext.Provider>
  );
}

const styles = StyleSheet.create({
  floatingTabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    paddingBottom: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 100,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#00C3FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00C3FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: -20, // floats above tab bar
    zIndex: 101,
  },
});
