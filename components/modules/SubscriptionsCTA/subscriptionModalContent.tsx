import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Check,
  ChefHat,
  SlidersHorizontal,
  ShoppingCart,
  X,
} from "lucide-react-native";
import Pro from "@/assets/svgs/pro-svg.svg";
import { Button, ButtonText } from "@/components/ui/button";
import { ProductPrice } from "@/lib/types/subscription";

const subscriptionModalContent = ({
  isDarkMode,
  pricingOptions,
  bottomSheetRef,
  selectedPlan,
  handlePlanChange,
  handleCloseBottomSheet,
  handleSubscribe,
  loading,
  error,
  isLoading,
  isError,
}: any) => {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["95%"]}
      backdropComponent={BottomSheetBackdrop}
      handleStyle={{ backgroundColor: isDarkMode ? "#1f242a" : "#fff" }}
      handleIndicatorStyle={{ backgroundColor: isDarkMode ? "#888" : "#ccc" }}
    >
      <BottomSheetView className="bg-background w-full h-full">
        <SafeAreaView className="flex-1">
          <ScrollView className="bg-background flex-1">
            <View className="px-6 pt-4 pb-10">
              <TouchableOpacity onPress={handleCloseBottomSheet}>
                <X color={isDarkMode ? "#fff" : "#000"} size={30} />
              </TouchableOpacity>
              <Text className="text-[28px] font-bold text-foreground text-center mb-2">
                Unlock Pro Features
              </Text>
              <View className="flex justify-center items-center">
                <Pro />
              </View>
              <View className="-mt-20">
                {[
                  {
                    icon: (
                      <ChefHat size={24} color={isDarkMode ? "#fff" : "#000"} />
                    ),
                    title: "Exclusive Recipes Just for You",
                    subtitle: "Get fresh, unique recipes added weekly",
                  },
                  {
                    icon: (
                      <SlidersHorizontal
                        size={24}
                        color={isDarkMode ? "#fff" : "#000"}
                      />
                    ),
                    title: "Advanced Recipe Search & Filters",
                    subtitle: "Search by calories, dietary, and more.",
                  },
                  {
                    icon: (
                      <ShoppingCart
                        size={24}
                        color={isDarkMode ? "#fff" : "#000"}
                      />
                    ),
                    title: "One-Click Grocery Ordering",
                    subtitle: "Easily order ingredients to your door.",
                  },
                ].map((item, index) => (
                  <View
                    key={index}
                    className={`bg- p-4 rounded-2xl flex-row items-center overflow-hidden mb-5 ${
                      isDarkMode ? "bg-gray4" : "bg-background"
                    }`}
                    style={{ boxShadow: "0px 2px 16px rgba(6, 51, 54, 0.1)" }}
                  >
                    <View className="flex-1">
                      <Text className="text-foreground text-lg font-semibold">
                        {item.title}
                      </Text>
                      <Text
                        className={`${
                          isDarkMode ? "text-foreground/60" : "text-muted"
                        } text-sm mt-1`}
                      >
                        {item.subtitle}
                      </Text>
                    </View>
                    <View className="w-10 h-10 items-center justify-center">
                      {item.icon}
                    </View>
                  </View>
                ))}

                {isLoading && (
                  <View className="flex-row gap-4 mt-8">
                    {[1, 2].map((i) => (
                      <View
                        key={i}
                        className="flex-1 rounded-2xl border-2 border-muted p-4 animate-pulse bg-accent h-32"
                      >
                        <View className="w-24 h-4 bg-muted rounded mb-2" />
                        <View className="w-16 h-6 bg-muted rounded" />
                      </View>
                    ))}
                  </View>
                )}

                {isError && (
                  <Text className="text-center text-destructive mt-4">
                    {error?.message || "Failed to load pricing plans."}
                  </Text>
                )}

                {!isLoading && pricingOptions.length > 0 && (
                  <View className="flex-row gap-4 mt-8">
                    {pricingOptions.map((price: ProductPrice) => {
                      const interval =
                        price.interval === "month" ? "monthly" : "yearly";
                      const isSelected = selectedPlan === interval;

                      return (
                        <TouchableOpacity
                          key={price.stripe_price_id}
                          activeOpacity={0.7}
                          onPress={() =>
                            handlePlanChange(interval, price.stripe_price_id)
                          }
                          className={`flex-1 rounded-2xl border-2 p-4 relative ${
                            isSelected
                              ? "border-secondary"
                              : "border-foreground"
                          }`}
                        >
                          {isSelected && (
                            <View className="absolute -right-2 -top-3 w-6 h-6 rounded-full bg-secondary items-center justify-center z-10">
                              <Check size={16} color="white" />
                            </View>
                          )}

                          {interval === "yearly" ? (
                            <>
                              <View className="flex-row items-center justify-between">
                                <Text className="text-lg font-medium text-foreground">
                                  Yearly
                                </Text>
                                <View className="bg-secondary px-2 py-1 rounded-full">
                                  <Text className="text-xs font-medium text-white">
                                    15% Saving
                                  </Text>
                                </View>
                              </View>
                              <View className="flex-row items-center mt-1">
                                <Text className="text-lg font-medium text-muted line-through mr-2">
                                  $199.99
                                </Text>
                                <Text className="text-2xl font-bold text-foreground">
                                  ${price.amount}
                                </Text>
                              </View>
                            </>
                          ) : (
                            <>
                              <Text className="text-lg font-medium text-foreground">
                                Monthly
                              </Text>
                              <Text className="text-2xl font-bold text-foreground mt-1">
                                ${price.amount}
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                <Text className="text-lg text-foreground font-medium leading-5 text-center mt-8 mb-4">
                  {selectedPlan === "monthly"
                    ? "$3.99/month. Cancel anytime"
                    : "$99.00/year. Cancel anytime"}
                </Text>

                <Button onPress={handleSubscribe} disabled={loading}>
                  <ButtonText>
                    {loading ? "Subscribing..." : "Continue"}
                  </ButtonText>
                </Button>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default subscriptionModalContent;
