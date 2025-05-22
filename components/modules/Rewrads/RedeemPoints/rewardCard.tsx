import { Text, TouchableOpacity, View } from "react-native";

type RewardCardProps = {
  title: string;
  points: number;
  bgColor: string;
  textColor: string;
  borderColor: string;
};

const RewardCard = ({
  title,
  points,
  bgColor,
  textColor,
  borderColor,
}: RewardCardProps) => {
  return (
    <View className="rounded-3xl overflow-hidden shadow-sm border-0">
      <View className={`${bgColor} p-4 pb-5`}>
        <Text
          className="text-white text-base font-medium mb-2.5"
          numberOfLines={2}
        >
          {title}
        </Text>

        {/* "For all member" pill */}
        <View
          className={`${bgColor} rounded-full px-3 py-1 self-start border border-white bg-opacity-80`}
        >
          <Text className="text-white font-medium text-xs">For all member</Text>
        </View>
      </View>

      <View className="bg-card p-4 items-center">
        <Text className={`${textColor} font-medium text-lg mb-3`}>
          {points} Points
        </Text>

        <TouchableOpacity
          className={`${borderColor} border rounded-full py-2 w-full`}
          activeOpacity={0.7}
        >
          <Text className={`${textColor} font-medium text-center`}>Redeem</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RewardCard;
