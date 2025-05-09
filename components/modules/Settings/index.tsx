import React, { useState } from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { router } from "expo-router";

import {
  Bell,
  ArrowRight,
  ArrowLeft,
  Info,
  FileTerminal,
  WalletCardsIcon,
} from "lucide-react-native";

import { Switch } from "@/components/ui/switch";

import { Image } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";

import { useDispatch } from "react-redux";

import ComingSoonOverlay from "@/components/modules/ComingSoonOverlay";
import { setCredentials, setSavedRecipes, setShowSubscribeCTA } from "@/redux/slices/Auth";
import { useClerk } from "@clerk/clerk-expo";
import { clearUserDataFromStorage } from "@/utils/storage/authStorage";
import { Spinner } from "@/components/ui/spinner";
import { ScrollView } from "react-native-gesture-handler";

interface SettingCardProps {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
  scheme: string | null | undefined;
}

const SettingCard: React.FC<SettingCardProps> = ({
  icon,
  text,
  onPress,
  scheme,
}) => (
  <Pressable
    className="flex flex-row justify-between items-center py-5 px-5 rounded-2xl bg-background mt-4"
    style={{
      boxShadow:
        scheme === "dark"
          ? "0px 2px 12px rgba(0,0,0,0.2)"
          : "0px 2px 12px rgba(0,0,0,0.1)",
    }}
    onPress={onPress}
  >
    <View className="flex flex-row items-center gap-4">
      {icon}
      <Text className="text-base font-medium text-primary">{text}</Text>
    </View>
    <View className="bg-secondary p-2 rounded-md">
      <ArrowRight size={18} color="#fff" />
    </View>
  </Pressable>
);

const Settings = () => {
  const { signOut } = useClerk();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);

    dispatch(
      setCredentials({
        access: null,
        refresh: null,
        email: null,
        first_name: null,
        role: null,
        isAuthenticated: false,
        customer_details: null,
      })
    );

    dispatch(setShowSubscribeCTA(true));
    dispatch(setSavedRecipes(null));
    signOut();
    clearUserDataFromStorage();
    setLoading(false);
    router.replace("/(auth)/account-options");
  };

  const scheme = useColorScheme();
  return (
    <View className="flex-1 px-6 pt-16 pb-8">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="relative flex items-center justify-center mb-12">
          <TouchableOpacity
            onPress={() => router.push("/(protected)/(tabs)/account")}
            className="absolute left-0"
          >
            <ArrowLeft
              width={30}
              height={30}
              color={scheme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <Text className="font-bold text-2xl text-foreground">Settings</Text>
        </View>

        {/* Section Title */}
        <Text className="text-lg font-semibold text-foreground mb-4">
          Legal
        </Text>

        {/* Cards */}
        <SettingCard
          icon={<Info color="#00C3FF" size={30} />}
          text="Privacy Policy"
          onPress={() => router.push("/(protected)/(nested)/privacy-policy")}
          scheme={scheme}
        />

        <SettingCard
          icon={<FileTerminal color="#00C3FF" size={30} />}
          text="Terms and Conditions"
          onPress={() => router.push("/(protected)/(nested)/terms-conditions")}
          scheme={scheme}
        />

        {/* <SettingCard
          icon={<WalletCardsIcon color="#00C3FF" size={30} />}
          text="Manage Subscription"
          onPress={() => router.push("/(protected)/(nested)/manage-subscriptions")}
          scheme={scheme}
        /> */}

        <Pressable
          className="flex flex-row justify-between items-center py-5 px-5 rounded-2xl bg-background mt-4"
          style={{
            boxShadow:
              scheme === "dark"
                ? "0px 2px 12px rgba(0,0,0,0.2)"
                : "0px 2px 12px rgba(0,0,0,0.1)",
          }}
          onPress={() =>
            router.push("/(protected)/(nested)/manage-subscriptions")
          }
        >
          <View className="flex flex-row items-center gap-4">
            <WalletCardsIcon color="#00C3FF" size={30} />
            <Text className="text-base font-medium text-primary">
              Manage Subscriptions
            </Text>
          </View>
          <View className="bg-secondary p-2 rounded-md">
            <ArrowRight size={18} color="#fff" />
          </View>
        </Pressable>

        {/* Logout Button */}
        <View className="mt-12 px-2">
          <Button
            action="negative"
            onPress={handleLogout}
            className=" transition-all duration-150"
          >
            <ButtonText className="text-primary font-semibold ">
              {!loading ? "Logout" : <Spinner />}
            </ButtonText>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;

{
  /* <View
        className="flex flex-row justify-between mt-3 py-3 px-5 rounded-2xl"
        style={{
          boxShadow:
            scheme === "dark"
              ? "0px 2px 12px 0px rgba(0,0,0,0.2)"
              : "0px 2px 12px 0px rgba(0,0,0,0.1)",
        }}
      >
        <View className="flex flex-row items-center gap-4">
          <Bell color="#00C3FF" />
          <Text className="font-medium text-primary leading-4">
            Notifications
          </Text>
        </View>
        <View>
          <Switch
            size="md"
            isDisabled={false}
            trackColor={{
              false: "#fff",
              true: "#000",
            }}
            thumbColor={"#00C3FF"}
          />
        </View>
      </View> */
}

{
  /* <View
        className="flex flex-row justify-between mt-3 py-6 px-5 rounded-2xl"
        style={{
          boxShadow:
            scheme === "dark"
              ? "0px 2px 12px 0px rgba(0,0,0,0.2)"
              : "0px 2px 12px 0px rgba(0,0,0,0.1)",
        }}
      >
        <View className="flex flex-row items-center gap-4">
          <Bell color="#00C3FF" />
          <Text className="font-medium text-primary leading-4">FAQ</Text>
        </View>
        <View className="bg-primary flex flex-row justify-center items-center p-1 rounded-md">
          <ArrowRight size={16} color={scheme === "dark" ? "#000" : "#fff"} />
        </View>
      </View> */
}

{
  /* <View
        className="flex flex-row justify-between mt-3 py-6 px-5 rounded-2xl"
        style={{
          boxShadow:
            scheme === "dark"
              ? "0px 2px 12px 0px rgba(0,0,0,0.2)"
              : "0px 2px 12px 0px rgba(0,0,0,0.1)",
        }}
      >
        <View className="flex flex-row items-center gap-4">
          <View className="flex justify-center items-center w-6 h-6 border-2 border-secondary rounded-md">
            <Text className="text-secondary font-semibold text-base p-1">
              i
            </Text>
          </View>
          <Text className="font-medium text-primary leading-4">About app</Text>
        </View>
        <View className="bg-primary flex flex-row justify-center items-center p-1 rounded-md">
          <ArrowRight size={16} color={scheme === "dark" ? "#000" : "#fff"} />
        </View>
      </View> */
}

{
  /* <View className="mt-10 ">
        <Text className="text-center text-foreground font-semibold leading-6">
          Follow us
        </Text>
        <View className="flex flex-row justify-center gap-3 py-4">
          <View
            className="flex justify-center items-center px-1.5 rounded-xl bg-background"
            style={{
              boxShadow:
                scheme === "dark"
                  ? "0px 2px 12px 0px rgba(0,0,0,0.2)"
                  : "0px 2px 12px 0px rgba(0,0,0,0.1)",
            }}
          >
            <Image
              source={require("@/assets/images/instagram.png")}
              className="w-12 h-12 mt-2"
            />
          </View>
          <View
            className="flex justify-center items-center px-3.5 py-1 rounded-xl bg-background"
            style={{
              boxShadow:
                scheme === "dark"
                  ? "0px 2px 12px 0px rgba(0,0,0,0.2)"
                  : "0px 2px 12px 0px rgba(0,0,0,0.1)",
            }}
          >
            <Image
              source={require("@/assets/images/facebook.png")}
              className="w-8 h-8"
            />
          </View>
          <View
            className="flex justify-center items-center px-3.5 py-1 rounded-xl bg-background"
            style={{
              boxShadow:
                scheme === "dark"
                  ? "0px 2px 12px 0px rgba(0,0,0,0.2)"
                  : "0px 2px 12px 0px rgba(0,0,0,0.1)",
            }}
          >
            <Image
              source={require("@/assets/images/youutbe.png")}
              className="w-8 h-8"
            />
          </View>
        </View>
      </View> */
}
