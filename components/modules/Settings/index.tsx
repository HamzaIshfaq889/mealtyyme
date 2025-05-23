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
  ArrowLeft,
  Info,
  FileTerminal,
  MessageCircle,
  Bell,
  ChevronRight,
  Gift,
  Cog,
  UserRound,
  UserPen,
} from "lucide-react-native";

import { Button, ButtonText } from "@/components/ui/button";

import { useDispatch, useSelector } from "react-redux";

import {
  setCredentials,
  setSavedRecipes,
  setShowSubscribeCTA,
} from "@/redux/slices/Auth";
import { useClerk } from "@clerk/clerk-expo";
import { clearUserDataFromStorage } from "@/utils/storage/authStorage";
import { Spinner } from "@/components/ui/spinner";
import { ScrollView } from "react-native-gesture-handler";
import { checkisProUser, checkisSubscriptionCanceled } from "@/utils";
import { useUserGamification } from "@/hooks/useUserGamification";
import { stopCooking } from "@/redux/slices/recipies";
import { clearCart } from "@/redux/slices/cart";

interface SettingCardProps {
  icon: React.ReactNode;
  text: string;
  desc: string;
  onPress: () => void;
  scheme: string | null | undefined;
}

const SettingCard: React.FC<SettingCardProps> = ({
  icon,
  text,
  onPress,
  desc,
}) => (
  <Pressable
    className="flex flex-row justify-between items-center py-5 px-5 rounded-2xl bg-card mb-4"
    onPress={onPress}
  >
    <View className="flex flex-row items-center gap-7">
      {icon}
      <View>
        <Text className="text-lg font-medium text-primary">{text}</Text>
        <Text className="text-sm font-medium text-muted">{desc}</Text>
      </View>
    </View>
    <ChevronRight size={32} color="#ee8427" />
  </Pressable>
);

const Settings = () => {
  const { signOut } = useClerk();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const status = useSelector(
    (state: any) =>
      state.auth.loginResponseType.customer_details?.subscription?.status
  );
  const isProUser = checkisProUser(status);
  const isSubscriptionCanceld = checkisSubscriptionCanceled(status);

  const { clearCheckInDate } = useUserGamification();
  const handleLogout = () => {
    setLoading(true);
    clearCheckInDate();
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
    dispatch(stopCooking());
    dispatch(clearCart());
    signOut();
    clearUserDataFromStorage();
    setLoading(false);
    router.replace("/(auth)/account-options");
  };

  const scheme = useColorScheme();
  return (
    <View className="flex-1 px-6 pt-16 pb-8 bg-background">
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

        {/* Cards */}
        <SettingCard
          icon={
            <UserPen color={scheme === "dark" ? "#fff" : "#000"} size={30} />
          }
          text="Edit profile"
          desc="Edit your information"
          onPress={() => router.push("/(protected)/(nested)/edit-profile")}
          scheme={scheme}
        />
        <SettingCard
          icon={<Info color={scheme === "dark" ? "#fff" : "#000"} size={30} />}
          text="Privacy Policy"
          desc="Check our policy"
          onPress={() => router.push("/(protected)/(nested)/privacy-policy")}
          scheme={scheme}
        />

        <SettingCard
          icon={
            <FileTerminal
              color={scheme === "dark" ? "#fff" : "#000"}
              size={30}
            />
          }
          text="Terms and Conditions"
          onPress={() => router.push("/(protected)/(nested)/terms-conditions")}
          desc="Check our terms"
          scheme={scheme}
        />

        <SettingCard
          icon={
            <MessageCircle
              color={scheme === "dark" ? "#fff" : "#000"}
              size={30}
            />
          }
          text="Contact Support"
          desc="24/7"
          onPress={() => router.push("/(protected)/(nested)/contact-support")}
          scheme={scheme}
        />

        <SettingCard
          icon={<Cog color={scheme === "dark" ? "#fff" : "#000"} size={30} />}
          text="Manage Subscription"
          onPress={() => {
            if (isProUser || isSubscriptionCanceld) {
              router.push("/(protected)/(nested)/active-subscription");
            } else {
              router.push("/(protected)/(nested)/buy-subscription");
            }
          }}
          desc="View your subsciption details"
          scheme={scheme}
        />

        <SettingCard
          icon={<Gift color={scheme === "dark" ? "#fff" : "#000"} size={30} />}
          text="Rewards Overview"
          onPress={() => {
            router.push("/(protected)/(nested)/rewards");
          }}
          desc="View your points and benefits"
          scheme={scheme}
        />

        <SettingCard
          icon={<Bell color={scheme === "dark" ? "#fff" : "#000"} size={30} />}
          text="Notification"
          onPress={() => {
            router.push("/(protected)/(nested)/notifications");
          }}
          desc="Turn on or off Notifications"
          scheme={scheme}
        />

        <View className="mt-4 px-2 mb-6">
          <Button
            action="secondary"
            onPress={handleLogout}
            className=" transition-all duration-150 h-16"
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
