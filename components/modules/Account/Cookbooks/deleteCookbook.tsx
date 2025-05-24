import { Text, useColorScheme, View, Platform } from "react-native";
import Dialog from "react-native-dialog";

import React, { useState } from "react";

import { Button, ButtonText } from "@/components/ui/button";
import { Trash2 } from "lucide-react-native";
import { deleteCookbook } from "@/services/cookbooksApi";
import Toast from "react-native-toast-message";
import { Spinner } from "@/components/ui/spinner";

type DeleteCookbook = {
  showDeleteModal: boolean;
  setShowDeleteModal: (showEditModal: boolean) => void;
  cookBookId: number | null;
  refetch: () => void;
};

const DeleteCookbook = ({
  setShowDeleteModal,
  showDeleteModal,
  cookBookId,
  refetch,
}: DeleteCookbook) => {
  const scheme = useColorScheme();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      if (!cookBookId) return;

      setLoading(true);

      await deleteCookbook(cookBookId);

      Toast.show({
        type: "success",
        text1: "Cookbook deleted successfully!",
      });
      refetch();
      setShowDeleteModal(false);
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "success",
        text1: error?.message || "Cookbook edited successfully!",
      });
    }
    setLoading(false);
  };

  return (
    <View>
      <Dialog.Container
        visible={showDeleteModal}
        contentStyle={{
          backgroundColor: scheme === "dark" ? "#1a1a1a" : "#fdf8f4",
          paddingVertical: 24,
          borderRadius: 16,
          paddingHorizontal: 24,
          minWidth: Platform.OS === "ios" ? 320 : 340,
          maxWidth: 400,
          alignSelf: "center",
          marginHorizontal: 20,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      >
        <View className="flex flex-row justify-center mb-6">
          <View className="bg-destructive flex flex-row justify-center items-center w-20 h-20 p-4 rounded-full">
            <Trash2 color="#fff" size={28} />
          </View>
        </View>
        <View className="mb-6">
          <Text className="font-bold text-xl text-foreground text-center mb-3">
            Delete Collection
          </Text>
          <Text className="text-base text-foreground/80 text-center">
            Are you sure you want to delete this collection? This action cannot
            be undone.
          </Text>
        </View>
        <View className="flex flex-row justify-center items-center gap-3">
          <Button
            action="card"
            className="basis-1/2 h-14 rounded-xl"
            onPress={() => setShowDeleteModal(false)}
          >
            <ButtonText className="text-base font-semibold">Cancel</ButtonText>
          </Button>
          <Button
            action="negative"
            onPress={handleDelete}
            className="basis-1/2 h-14 rounded-xl"
          >
            <ButtonText className="text-base font-semibold">
              {loading ? <Spinner size={24} /> : "Delete"}
            </ButtonText>
          </Button>
        </View>
      </Dialog.Container>
    </View>
  );
};

export default DeleteCookbook;
