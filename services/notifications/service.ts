import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Alert, Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  try {
    // Must be a physical device
    if (!Device.isDevice) {
      Alert.alert(
        "Push Notifications",
        "Must use a physical device for push notifications."
      );
      return null;
    }

    // Request permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Push Notifications",
        "Permission not granted for push notifications."
      );
      return null;
    }

    // Get Expo push token (add experienceId manually for standalone builds if needed)
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "a86e20a1-d770-49f4-95bf-31f6fdc36e10", // <-- IMPORTANT for EAS-built apps
    });

    console.log("Expo Push Token:", tokenData.data); // log it for testing

    return tokenData.data;
  } catch (error) {
    console.error("Error getting push token:", error);
    return null;
  }
}
