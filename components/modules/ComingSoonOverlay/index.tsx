"use client"

import type React from "react"
import { useEffect } from "react"
import { View, Text, StyleSheet, useColorScheme, Dimensions, TouchableOpacity } from "react-native"
import { Animated, Easing } from "react-native"
import { BlurView } from "expo-blur"
import { Rocket, Stars, Bell, Calendar, LogOut } from "lucide-react-native"

const { width, height } = Dimensions.get("window")

interface ComingSoonOverlayProps {
  title?: string
  subtitle?: string
  version?: string
  showNotifyOption?: boolean
  isLogOut?: boolean
  onLogOut?: () => void
}

const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({
  title = "Stay Tuned!",
  subtitle = "We're working on something amazing",
  version = "2.0",
  showNotifyOption = true,
  isLogOut = false,
  onLogOut = () => {},
}) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  // Animation values
  const fadeAnim = new Animated.Value(0)
  const scaleAnim = new Animated.Value(0.9)
  const rocketAnim = new Animated.Value(0)

  useEffect(() => {
    // Fade in and scale up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start()

    // Continuous floating animation for the rocket
    Animated.loop(
      Animated.sequence([
        Animated.timing(rocketAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rocketAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  const rocketTranslateY = rocketAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  })

  return (
    <BlurView intensity={90} tint={isDark ? "dark" : "light"} style={styles.container}>
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            backgroundColor: isDark ? "rgba(30, 30, 30, 0.85)" : "rgba(255, 255, 255, 0.85)",
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Stars size={24} color={isDark ? "#FFD700" : "#6366F1"} style={styles.starIcon} />
          <Animated.View style={{ transform: [{ translateY: rocketTranslateY }] }}>
            <Rocket size={48} color={isDark ? "#F97316" : "#8B5CF6"} style={styles.rocketIcon} />
          </Animated.View>
          <Stars size={24} color={isDark ? "#FFD700" : "#6366F1"} style={styles.starIcon} />
        </View>

        <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#1F2937" }]}>{title}</Text>

        <View style={styles.versionContainer}>
          <Text
            style={[
              styles.version,
              {
                color: isDark ? "#F97316" : "#8B5CF6",
                backgroundColor: isDark ? "rgba(249, 115, 22, 0.2)" : "rgba(139, 92, 246, 0.1)",
              },
            ]}
          >
            Version {version}
          </Text>
        </View>

        <Text style={[styles.subtitle, { color: isDark ? "#D1D5DB" : "#4B5563" }]}>{subtitle}</Text>

        {showNotifyOption && (
          <View
            style={[
              styles.notifyContainer,
              {
                backgroundColor: isDark ? "rgba(249, 115, 22, 0.15)" : "rgba(139, 92, 246, 0.1)",
              },
            ]}
          >
            <Bell size={16} color={isDark ? "#F97316" : "#8B5CF6"} />
            <Text style={[styles.notifyText, { color: isDark ? "#F97316" : "#8B5CF6" }]}>
              We'll notify you when it's ready
            </Text>
          </View>
        )}

        {isLogOut && (
          <TouchableOpacity
            style={[
              styles.logoutButton,
              {
                backgroundColor: isDark ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)",
              },
            ]}
            onPress={onLogOut}
            activeOpacity={0.7}
          >
            <LogOut size={16} color={isDark ? "#EF4444" : "#DC2626"} />
            <Text style={[styles.logoutText, { color: isDark ? "#EF4444" : "#DC2626" }]}>Logout</Text>
          </TouchableOpacity>
        )}

        <View style={styles.timelineContainer}>
          <Calendar size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
          <Text style={[styles.timelineText, { color: isDark ? "#9CA3AF" : "#6B7280" }]}>Coming soon</Text>
        </View>
      </Animated.View>
    </BlurView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  contentContainer: {
    width: width * 0.85,
    maxWidth: 400,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  rocketIcon: {
    marginHorizontal: 16,
  },
  starIcon: {
    opacity: 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  versionContainer: {
    marginBottom: 16,
  },
  version: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: "hidden",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  notifyContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  notifyText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  timelineContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timelineText: {
    marginLeft: 6,
    fontSize: 14,
  },
})

export default ComingSoonOverlay
