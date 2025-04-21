import React, { useEffect, useRef } from "react";
import {
  Animated,
  ViewStyle,
  Easing,
  StyleProp,
  useColorScheme,
} from "react-native";

interface PulsePlaceholderProps {
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  backgroundColor?: string;
}

export const PulsePlaceholder: React.FC<PulsePlaceholderProps> = ({
  style,
  // Reduced for more professional look
  backgroundColor,
}) => {
  const colorScheme = useColorScheme();
  const opacity = useRef(new Animated.Value(0.4)).current; // Lower initial opacity
  const scale = useRef(new Animated.Value(1)).current;

  // Default colors based on theme
  const defaultBackgroundColor =
    colorScheme === "dark"
      ? "rgba(255, 255, 255, 0.2)" // Subtle light color for dark mode
      : "rgba(0, 0, 0, 0.2)"; // Subtle dark color for light mode

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.7, // Reduced max opacity for subtlety
            duration: 1000, // Slightly slower animation
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.02, // Reduced scale for subtlety
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.4,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          backgroundColor: backgroundColor || defaultBackgroundColor,
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
};
