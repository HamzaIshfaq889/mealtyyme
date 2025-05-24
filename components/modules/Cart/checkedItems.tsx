import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import { useSelector } from "react-redux";

import { capitalizeWords, convertToFraction } from "@/utils";
import {
  loadCheckedIngredients,
  removeCheckedIngredient,
} from "@/utils/storage/cartStorage";
import { Ingredient } from "@/lib/types/recipe";
import { CheckCircle, Trash2 } from "lucide-react-native";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";

type CheckedItemsProps = {
  bottomSheetRef: React.RefObject<BottomSheetMethods | null>;
  refreshTrigger: number;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
  onChange?: (index: number) => void;
  backdropComponent?: (props: any) => React.ReactElement;
};

const CheckedItems = ({
  bottomSheetRef,
  refreshTrigger,
  setRefreshTrigger,
  onChange,
  backdropComponent,
}: CheckedItemsProps) => {
  const [checkedItems, setCheckedItems] = useState<Ingredient[]>([]);
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const customerId = useSelector(
    (state: any) => state?.auth?.loginResponseType?.customer_details?.id
  );

  useEffect(() => {
    if (customerId) {
      loadCheckedIngredients(customerId).then((items) => {
        if (items) {
          setCheckedItems(items);
        } else {
          setCheckedItems([]); // fallback to empty array if null
        }
      });
    }
  }, [customerId, refreshTrigger]);

  const handleRemove = async (id: number) => {
    await removeCheckedIngredient(customerId, id);

    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Portal hostName="root-host">
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["90%"]}
        enablePanDownToClose
        backdropComponent={backdropComponent || BottomSheetBackdrop}
        onChange={onChange}
        style={{
          backgroundColor: "#000",
        }}
        handleStyle={{
          backgroundColor: isDarkMode ? "#1c1c1c" : "#fdf8f4",
          borderWidth: 0,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDarkMode ? "#888" : "#ccc",
        }}
      >
        <BottomSheetScrollView className="bg-background h-full py-12">
          {checkedItems.length > 0 ? (
            (() => {
              const grouped: { [key: string]: Ingredient[] } = {};

              checkedItems.forEach((ing) => {
                const category = ing?.ingredient?.category?.name || "Others";
                if (!grouped[category]) {
                  grouped[category] = [];
                }
                grouped[category].push(ing);
              });

              const groupEntries = Object.entries(grouped);

              return groupEntries.map(([category, items], groupIndex) => {
                const isLastGroup = groupIndex === groupEntries.length - 1;

                return (
                  <View key={category} className="mb-3">
                    <Text className="text-2xl font-bold text-secondary px-4 mb-2">
                      {capitalizeWords(category)}
                    </Text>
                    {items.map((ing, index) => {
                      const isLastItemInGroup = index === items.length - 1;
                      const isLastItemOverall =
                        isLastGroup && isLastItemInGroup;

                      return (
                        <View
                          key={ing?.ingredient?.id}
                          className={`rounded-3xl mx-4 bg-card ${
                            isLastItemOverall ? "mb-32" : "mb-4"
                          }`}
                        >
                          <View className="flex flex-row justify-between items-center px-6 py-4">
                            <View className="flex flex-row items-center ml-4 gap-4">
                              <CheckCircle size={20} color="#EE8427" />
                              <View className="w-[200px]">
                                <Text className="text-xl font-medium line-through text-muted">
                                  {capitalizeWords(ing?.ingredient?.name)}
                                </Text>
                                <Text className="text-muted text-sm">
                                  {convertToFraction(ing?.amount)} {ing?.unit}
                                </Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              className="ml-4"
                              onPress={() => handleRemove(ing?.ingredient?.id)}
                            >
                              <Trash2 size={20} color="#FF3B30" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                );
              });
            })()
          ) : (
            <View className="flex-1 justify-center items-center p-7">
              <Text className="text-muted text-sm text-center">
                You haven't checked off any ingredients yet.
              </Text>
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </Portal>
  );
};

export default CheckedItems;
