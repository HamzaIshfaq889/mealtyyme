import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

const NOTIFICATION_LOGS_KEY = "NOTIFICATION_LOGS";

const storeNotificationLog = async (log: string) => {
  try {
    const existingLogs = await AsyncStorage.getItem(NOTIFICATION_LOGS_KEY);
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push({ timestamp: new Date().toISOString(), message: log });
    await AsyncStorage.setItem(NOTIFICATION_LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    // Silent fail in production
  }
};

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
  logs?: string[];
}

export const usePushNotifications = (): PushNotificationState => {
  const [logs, setLogs] = useState<string[]>([]);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      await storeNotificationLog("Device is physical device");
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      await storeNotificationLog(
        `Existing permission status: ${existingStatus}`
      );
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        await storeNotificationLog(`New permission status: ${status}`);
      }
      if (finalStatus !== "granted") {
        await storeNotificationLog(
          "Failed to get push token for push notification"
        );
        alert("Failed to get push token for push notification");
        return;
      }

      await storeNotificationLog(
        `Getting Expo push token with projectId: ${Constants.expoConfig?.extra?.eas.projectId}`
      );
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
      await storeNotificationLog(`Generated token: ${JSON.stringify(token)}`);
    } else {
      await storeNotificationLog(
        "Must be using a physical device for Push notifications"
      );
      alert("Must be using a physical device for Push notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    // Load existing logs
    const loadLogs = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem(NOTIFICATION_LOGS_KEY);
        if (storedLogs) {
          setLogs(JSON.parse(storedLogs));
        }
      } catch (error) {
        // Silent fail in production
      }
    };
    loadLogs();

    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        storeNotificationLog(
          `Received notification: ${JSON.stringify(notification)}`
        );
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        storeNotificationLog(
          `Notification response: ${JSON.stringify(response)}`
        );
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    expoPushToken,
    notification,
    logs,
  };
};
