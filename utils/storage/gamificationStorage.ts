import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_PREFIX = "@MyApp";

const lastCheckInKey = (userId: string) =>
  `${STORAGE_PREFIX}:lastCheckIn:${userId}`;

export const getLastCheckInDate = async (
  userId: string
): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(lastCheckInKey(userId));
  } catch (err) {
    console.error("Error reading last check-in date:", err);
    return null;
  }
};

export const setLastCheckInDate = async (
  userId: string,
  date: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem(lastCheckInKey(userId), date);
  } catch (err) {
    console.error("Error setting last check-in date:", err);
  }
};
