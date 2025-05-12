import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserPointsData } from "@/lib/types/gamification";
import { checkInUser, getGamificationStats } from "@/services/gamification";
import { useFocusEffect } from "expo-router";

export const useUserGamification = () => {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [stats, setStats] = useState<UserPointsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const today = new Date().toISOString().split("T")[0];

  const checkTodayCheckIn = async () => {
    const storedDate = await AsyncStorage.getItem("lastCheckInDate");
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
      await checkInUser(); // 👈 Call your API here
      await AsyncStorage.setItem("lastCheckInDate", today);
      setHasCheckedIn(true);
      await fetchStats(); // 👈 Optionally refresh stats
    } catch (err: any) {
      setError(err.message || "Check-in failed.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkTodayCheckIn();
      fetchStats();
    }, [])
  );

  const clearCheckInDate = async () => {
    try {
      await AsyncStorage.removeItem("lastCheckInDate");
      setHasCheckedIn(false); // Optionally reset the state
    } catch (err: any) {
      setError(err.message || "Failed to clear check-in date.");
    }
  };

  return { hasCheckedIn, stats, error, loading, checkIn, clearCheckInDate };
};
