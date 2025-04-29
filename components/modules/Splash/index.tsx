import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";

import Logo from "../../../assets/svgs/logo.svg";
import SVG3 from "../../../assets/svgs/Vector3.svg";
import SVG1 from "../../../assets/svgs/splash-1.svg";
import SVG2 from "../../../assets/svgs/Vector2.svg";
import SVG4 from "../../../assets/svgs/Vector4.svg";

const Splash = () => {
  const logoScale = useSharedValue(1);
  const logoOpacity = useSharedValue(1);

  const svg1Opacity = useSharedValue(0);
  const svg2Opacity = useSharedValue(0);
  const svg3Opacity = useSharedValue(0);
  const svg4Opacity = useSharedValue(0);

  useEffect(() => {
    // Looping pulse effect for logo
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    logoOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0.8, { duration: 1200 })
      ),
      -1,
      true
    );

    // Fade in all SVGs once
    svg3Opacity.value = withTiming(1, { duration: 500 });
    svg1Opacity.value = withTiming(1, { duration: 600 });
    svg2Opacity.value = withTiming(1, { duration: 700 });
    svg4Opacity.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const fadeIn = (value: typeof svg1Opacity) =>
    useAnimatedStyle(() => ({
      opacity: value.value,
    }));

  return (
    <View className="bg-secondary w-full h-full">
      <Animated.View className="absolute top-0" style={fadeIn(svg3Opacity)}>
        <SVG3 />
      </Animated.View>
      <Animated.View
        className="absolute top-4 left-0 right-0"
        style={fadeIn(svg1Opacity)}
      >
        <SVG1 width={410} />
      </Animated.View>

      <View className="flex justify-center items-center w-screen h-screen">
        <Animated.View style={animatedLogoStyle}>
          <Logo width={250} height={250} />
        </Animated.View>
      </View>

      <Animated.View
        className="absolute bottom-0 right-0 left-0"
        style={fadeIn(svg2Opacity)}
      >
        <SVG2 width={410} />
      </Animated.View>
      <Animated.View
        className="absolute bottom-0 right-14"
        style={fadeIn(svg4Opacity)}
      >
        <SVG4 />
      </Animated.View>
    </View>
  );
};

export default Splash;
