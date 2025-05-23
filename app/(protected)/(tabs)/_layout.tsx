import { useSavedRecipes } from "@/redux/queries/recipes/useSaveRecipesQuery";
import { setSavedRecipes } from "@/redux/slices/Auth";
import { saveSavedRecipesInStorage } from "@/utils/storage/authStorage";
import { router, Tabs } from "expo-router";

import {
  House,
  CalendarDays,
  ShoppingCart,
  User,
  BotMessageSquare,
} from "lucide-react-native";
import {
  useColorScheme,
  Platform,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function TabsLayout() {
  const scheme = useColorScheme();
  const dispatch = useDispatch();

  const { data: savedRecipes } = useSavedRecipes();
  const savedRecipeIds = savedRecipes?.map((recipe) => recipe.id);
  if (savedRecipeIds && savedRecipeIds?.length > 0) {
    saveSavedRecipesInStorage([...savedRecipeIds])
      .then(() => {
        console.log("Saved Recipes retrieved successfully");
      })
      .catch((error) => {
        console.error("Error saving recipe to storage:", error);
      });
    dispatch(setSavedRecipes(savedRecipeIds));
  }

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#00C3FF",
          tabBarInactiveTintColor: scheme === "dark" ? "#6B7280" : "#97A2B0",
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: scheme === "dark" ? "#17181A" : "#FFFFFF",
            position: "absolute",
            bottom: 0,
            height: Platform.OS === "android" ? 100 : 75,
            paddingBottom: 10,
            paddingTop: Platform.OS === "android" ? 10 : 5,
            zIndex: 1,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <House color={color} size={27} strokeWidth={1} />
            ),
          }}
        />
        <Tabs.Screen
          name="meal-plan"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <CalendarDays color={color} size={27} strokeWidth={1} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat-bot"
          options={{
            tabBarButton: () => null, 
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <ShoppingCart color={color} size={27} strokeWidth={1} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <User color={color} size={27} strokeWidth={1} />
            ),
          }}
        />
      </Tabs>
      <View style={styles.tabBarCutout} />
      {/* Floating Button for Chat Bot */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.replace("/(protected)/(tabs)/chat-bot")}
      >
        <BotMessageSquare color="#fff" size={24} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 30 : 48,
    alignSelf: "center",
    backgroundColor: "#00C3FF",
    padding: 16,
    borderRadius: 40,
    elevation: 5,
    zIndex: 100,
  },
  tabBarCutout: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 50 : 60,
    alignSelf: "center",
    width: 80,
    height: 80,
    backgroundColor: "transparent", // match tab bar background
    borderRadius: 40,
    zIndex: 99,
  },
});
