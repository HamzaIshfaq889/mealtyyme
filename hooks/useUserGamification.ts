import { useState, useCallback } from "react";

import { useFocusEffect } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkInUser, getGamificationStats } from "@/services/gamification";
import { UserPointsData } from "@/lib/types/gamification";

export const useUserGamification = () => {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [stats, setStats] = useState<UserPointsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const today = new Date().toISOString().split("T")[0];

  useFocusEffect(
    useCallback(() => {
      checkTodayCheckIn();
      fetchStats();
    }, [])
  );

  const checkTodayCheckIn = async () => {
    const storedDate = await AsyncStorage.getItem("lastCheckInDate");
    console.log("hello", storedDate);
    console.log("storedDate", today);

    if (storedDate === today) {
      setHasCheckedIn(true);
    } else {
      setHasCheckedIn(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getGamificationStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to load stats.");
    } finally {
      setLoading(false);
    }
  };

  const checkIn = async () => {
    try {
      console.log('hhh')
      await checkInUser();
      console.log("1");
      await AsyncStorage.setItem("lastCheckInDate", today);
      console.log("2");
      setHasCheckedIn(true);
      await fetchStats();
    } catch (err: any) {
      setError(err.message || "Check-in failed.");
    }
  };

  const clearCheckInDate = async () => {
    try {
      await AsyncStorage.removeItem("lastCheckInDate");
      setHasCheckedIn(false);
    } catch (err: any) {
      setError(err.message || "Failed to clear check-in date.");
    }
  };

  return { hasCheckedIn, stats, error, loading, checkIn, clearCheckInDate };
};
