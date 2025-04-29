import { useSavedRecipes } from "@/redux/queries/recipes/useSaveRecipesQuery";
import { setSavedRecipes } from "@/redux/slices/Auth";
import { saveSavedRecipesInStorage } from "@/utils/storage/authStorage";
import { Tabs } from "expo-router";

import { House, CalendarDays, ShoppingCart, User } from "lucide-react-native";
import { useColorScheme, Platform } from "react-native";
import { useDispatch } from "react-redux";

export default function TabsLayout() {
  const scheme = useColorScheme();
  const dispatch = useDispatch();

  const { data: savedRecipes } = useSavedRecipes();
  const savedRecipeIds = savedRecipes?.map((recipe) => recipe.id);
  console.log("ids", savedRecipeIds);
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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: scheme === "dark" ? "#00C3FF" : "#00C3FF",
        tabBarInactiveTintColor: scheme === "dark" ? "#6B7280" : "#97A2B0",
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: scheme === "dark" ? "#17181A" : "#FFFFFF",
          position: "absolute", // ensures it’s not floating
          bottom: 0, // stick to bottom
          height: Platform.OS === "android" ? 60 : 75, // control height
          paddingBottom: 10, // tweak as needed
          paddingTop: Platform.OS === "android" ? 10 : 5,
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
  );
}
