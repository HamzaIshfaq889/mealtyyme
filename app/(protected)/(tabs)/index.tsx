// app/(tabs)/index.tsx
import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBarContext } from "./_layout";
import { HomeUser } from "@/components/modules";

export default function HomeScreen() {
  const tabBarTranslation = useContext(TabBarContext);
  const lastOffset = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const tabBarHeight = 70 + insets.bottom;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetY = event.contentOffset.y;
      const diff = offsetY - lastOffset.value;

      if (diff > 0) {
        // scrolling down
        //@ts-ignore
        tabBarTranslation.value = withTiming(tabBarHeight, { duration: 250 });
      } else if (diff < 0) {
        // scrolling up
        //@ts-ignore
        tabBarTranslation.value = withTiming(0, { duration: 250 });
      }

      lastOffset.value = offsetY;
    },
  });

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentContainerStyle={styles.content}
    >
      <HomeUser />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  card: {
    height: 100,
    margin: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
});
