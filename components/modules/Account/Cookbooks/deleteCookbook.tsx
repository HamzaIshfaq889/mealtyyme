import { Text, useColorScheme, View } from "react-native";
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
          paddingVertical: 50,
          marginLeft: 20,
          marginRight: 20,
          borderRadius: 30,
        }}
      >
        <View className="flex flex-row justify-center mb-6">
          <View className="bg-destructive flex flex-row justify-center items-center w-24 h-24 p-8 rounded-full basis-1/">
            <Trash2 color="#fff" size={35} />
          </View>
        </View>
        <View>
          <Text className="font-bold leading-5 text-foreground text-lg text-center mb-3">
            Delete Collection
          </Text>
          <Text className="font-bold leading-5 text-foreground text-lg text-center mb-7 ">
            Are you sure to delete this collection
          </Text>
        </View>
        <View className="flex flex-row justify-center items-center gap-2">
          <Button
            action="card"
            className="basis-1/2 h-16"
            onPress={() => setShowDeleteModal(false)}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            action="negative"
            onPress={handleDelete}
            className="basis-1/2 h-16"
          >
            <ButtonText>
              {loading ? <Spinner size={30} /> : "Delete"}
            </ButtonText>
          </Button>
        </View>
      </Dialog.Container>
    </View>
  );
};

export default DeleteCookbook;
