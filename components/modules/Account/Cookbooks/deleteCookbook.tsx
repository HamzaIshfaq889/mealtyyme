import { Text, View } from "react-native";
import Dialog from "react-native-dialog";

import React from "react";

import { Button, ButtonText } from "@/components/ui/button";
import { FilePenLine } from "lucide-react-native";

type DeleteCookbook = {
  showDeleteModal: boolean;
  setShowDeleteModal: (showEditModal: boolean) => void;
};

const DeleteCookbook = ({
  setShowDeleteModal,
  showDeleteModal,
}: DeleteCookbook) => {
  return (
    <View>
      <Dialog.Container visible={showDeleteModal}>
        <View className="flex flex-row justify-center mb-6">
          <View className="bg-destructive flex flex-row justify-center items-center w-16 h-16 p-8 rounded-full basis-1/">
            <FilePenLine color="#fff" size={28} />
          </View>
        </View>
        <View>
          <Text className="font-bold leading-5 text-foreground text-lg text-center mb-3">
            Delete Collection
          </Text>
          <Text className="font-bold leading-5 text-foreground text-lg text-center mb-7 ">
            Are you sure to delte this collections
          </Text>
        </View>
        <View className="flex flex-row gap-2">
          <Button
            action="muted"
            className="basis-1/2 h-16"
            onPress={() => setShowDeleteModal(false)}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button action="negative" className="basis-1/2 h-16">
            <ButtonText>Delete</ButtonText>
          </Button>
        </View>
      </Dialog.Container>
    </View>
  );
};

export default DeleteCookbook;
