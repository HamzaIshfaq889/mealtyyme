// components/ui/CenteredLoader.tsx
import React from "react";
import { ActivityIndicator, View } from "react-native";

const CenteredLoader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <ActivityIndicator size="large" color="#4F46E5" />{" "}
      {/* Tailwind indigo-600 */}
    </View>
  );
};

export default CenteredLoader;
