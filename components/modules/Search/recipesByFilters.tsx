import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  useCategoriesQuery,
  useCuisinesQuery,
  useDietsQuery,
} from "@/redux/queries/recipes/useStaticFilter";
import { router } from "expo-router";
import ProFeaturesCard from "./proFeaturesCard";
import SubcriptionCTA from "../SubscriptionsCTA";
import { useSelector } from "react-redux";
import { checkisProUser } from "@/utils";

const MAX_VISIBLE = 10;

type FilterItem = { id?: string | number; name: string };

const FilterSection = ({
  title,
  items,
}: {
  title: string;
  items: FilterItem[];
}) => {
  const [visibleItems, setVisibleItems] = useState<FilterItem[]>([]);

  useEffect(() => {
    setVisibleItems(
      items.length > MAX_VISIBLE ? items.slice(0, MAX_VISIBLE) : items
    );
  }, [items]);

  const handleShowAll = () => setVisibleItems(items);

  const shouldShowMoreButton =
    visibleItems.length <= MAX_VISIBLE && items.length > MAX_VISIBLE;

  return (
    <>
      <Text className="text-foreground font-semibold text-base mb-2">
        {title}
      </Text>
      <View className="mb-6">
        <View className="flex-row flex-wrap">
          {visibleItems.map((item, index) => (
            <TouchableOpacity
              key={item.id ?? `${item.name}-${index}`}
              className="bg-background px-3 py-2.5 rounded-full mr-2 mb-2"
              onPress={() =>
                router.push({
                  pathname:
                    `/(protected)/(nested)/all-recipes/${item?.id}` as any,
                  params: { name: title?.toLowerCase() },
                })
              }
            >
              <Text className="text-foreground font-medium">{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {shouldShowMoreButton && (
          <TouchableOpacity
            className="w-16 flex justify-center items-center rounded-full bg-gray3"
            onPress={handleShowAll}
          >
            <Text className="text-foreground font-medium pb-2.5">...</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const FilterSectionSkeleton = ({ title }: { title: string }) => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  return (
    <View className="px-6">
      <Text className="text-foreground font-semibold text-2xl mb-4">
        {title}
      </Text>
      <View className="flex-row flex-wrap mb-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <View
            key={i}
            className={`w-20 h-7 rounded-full mr-2 mb-2 animate-pulse ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default function RecipesByFilters() {
  const { data: cuisines = [], isLoading: cuisinesLoading } =
    useCuisinesQuery();
  const { data: diets = [], isLoading: dietsLoading } = useDietsQuery();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategoriesQuery();
  const status = useSelector(
    (state: any) =>
      state.auth.loginResponseType.customer_details?.subscription?.status
  );
  const isProUser = checkisProUser(status);

  const [showSubscribeCTA, setShowSubscribeCTA] = useState(false);

  const handleNonPro = () => {
    setShowSubscribeCTA(true);
  };

  if (cuisinesLoading || dietsLoading || categoriesLoading) {
    return <FilterSectionSkeleton title="Filters" />;
  }

  return (
    <ScrollView className="px-6 pt-2.5 pb-40">
      <FilterSection title="Diets" items={diets} />
      <FilterSection title="Categories" items={categories} />
      <FilterSection title="Cuisines" items={cuisines} />
      {!isProUser && <ProFeaturesCard handleNonPro={handleNonPro} />}

      {showSubscribeCTA && (
        <SubcriptionCTA
          setShowSubscribeCTA={setShowSubscribeCTA}
          forceShow={true}
        />
      )}
    </ScrollView>
  );
}
