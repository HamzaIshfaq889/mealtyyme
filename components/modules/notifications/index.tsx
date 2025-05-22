import { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Button,
  Platform,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { saveNotificationToken } from "../../../services/notifications/api";
import { ArrowLeft, Truck } from "lucide-react-native";
import { router } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

async function saveTokenToBackend(token: string) {
  try {
    await saveNotificationToken(token);
    console.log("Token saved to backend successfully");
  } catch (error) {
    console.error("Error saving token to backend:", error);
  }
}

export default function NotificationsPage() {
  const scheme = useColorScheme();

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          setExpoPushToken(token);
          saveTokenToBackend(token);
        }
      })
      .catch((error: any) => setExpoPushToken(`${error}`));

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    // <View
    //   style={{ flex: 1, alignItems: "center", justifyContent: "space-around" }}
    //   className="bg-white"
    // >
    //   <Text>Your Expo push token: {expoPushToken}</Text>
    //   <View style={{ alignItems: "center", justifyContent: "center" }}>
    //     <Text>
    //       Title: {notification && notification.request.content.title}{" "}
    //     </Text>
    //     <Text>Body: {notification && notification.request.content.body}</Text>
    //     <Text>
    //       Data:{" "}
    //       {notification && JSON.stringify(notification.request.content.data)}
    //     </Text>
    //   </View>
    //   <Button
    //     title="Press to Send Notification"
    //     onPress={async () => {
    //       await sendPushNotification(expoPushToken);
    //     }}
    //   />
    // </View>

    <View className="w-full h-full px-6 pt-16 pb-4 flex-col relative bg-background">
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity
          onPress={() => router.push("/(protected)/(nested)/settings")}
        >
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="font-bold text-2xl text-primary">Notifications</Text>
        </View>

        <View style={{ width: 30 }} />
      </View>

      {[1, 2, 3, 4].map((_, index) => {
        return (
          <View className="p-4 rounded-lg w-full max-w-md" key={index}>
            <View className="mb-2">
              <Truck size={24} color={scheme === "dark" ? "#fff" : "#000"} />
            </View>

            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-bold text-foreground">
                Order Update
              </Text>
              <Text className="!text-green-500">3 hour ago</Text>
            </View>

            <Text className="text-foreground text-base">
              Your grocery delivery scheduled for today has been delayed by 2
              hours. We apologize for delay.
            </Text>
          </View>
        );
      })}
    </View>
  );
}
