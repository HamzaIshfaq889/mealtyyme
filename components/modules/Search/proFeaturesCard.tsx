import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles, Zap, Star } from "lucide-react-native";

type ProFeaturesCardProps = {
  handleNonPro: () => void;
};
export default function ProFeaturesCard({
  handleNonPro,
}: ProFeaturesCardProps) {
  return (
    <View className="mb-10 mt-1.5 rounded-3xl overflow-hidden">
      <LinearGradient
        colors={["#4c1d95", "#7e22ce", "#c026d3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-6 rounded-3xl"
      >
        {/* Header with icon */}
        <View className="flex-row items-center mb-4">
          <Sparkles size={24} color="#f5f5f5" />
          <Text className="text-white font-bold text-xl ml-2">
            Premium Experience
          </Text>
        </View>

        {/* Features list */}
        <View className="mb-6 space-y-3">
          <View className="flex-row items-center">
            <Zap size={18} color="#f5f5f5" />
            <Text className="text-white ml-2 text-base">
              Unlock multiple filters
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          className="bg-white py-4 rounded-xl active:opacity-90"
          activeOpacity={0.9}
          onPress={() => handleNonPro()}
        >
          <Text className="text-purple-900 font-bold text-center text-lg">
            Unlock Pro Features
          </Text>
        </TouchableOpacity>

        {/* Price tag */}
        <Text className="text-white text-center mt-4 opacity-90">
          Starting at just $4.99/month
        </Text>
      </LinearGradient>
    </View>
  );
}
