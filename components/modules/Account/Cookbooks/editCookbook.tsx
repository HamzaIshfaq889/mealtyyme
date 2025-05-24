import React, { useState } from "react";

import { Text, useColorScheme, View, Platform } from "react-native";
import Dialog from "react-native-dialog";

import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";

import { FilePenLine } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { updateCookbookName } from "@/services/cookbooksApi";
import { Spinner } from "@/components/ui/spinner";

type EditCookbook = {
  showEditModal: boolean;
  setShowEditModal: (value: boolean) => void;
  cookBookId: number | null;
  refetch: () => void;
};
const EditCookbook = ({
  setShowEditModal,
  showEditModal,
  cookBookId,
  refetch,
}: EditCookbook) => {
  const scheme = useColorScheme();
  const [collectionName, setCollectionName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    if (!collectionName || !cookBookId) {
      Toast.show({
        type: "error",
        text1: "Please enter collection name.",
      });
      return;
    }

    try {
      setLoading(true);

      await updateCookbookName({
        id: cookBookId,
        name: collectionName,
      });

      Toast.show({
        type: "success",
        text1: "Cookbook edited successfully!",
      });
      refetch();
      setShowEditModal(false);
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
        visible={showEditModal}
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
          <View className="bg-secondary flex flex-row justify-center items-center w-20 h-20 p-4 rounded-full">
            <FilePenLine color="#fff" size={28} />
          </View>
        </View>
        <FormControl size="md" className="mb-4">
          <FormControlLabel>
            <FormControlLabelText className="font-bold text-lg text-foreground text-center w-full">
              <Text>Edit Collection Name</Text>
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="mt-4 border-2">
            <InputField
              type="text"
              placeholder="Enter Collection Name"
              value={collectionName}
              onChangeText={(text) => setCollectionName(text)}
              className="text-base py-3"
            />
          </Input>
        </FormControl>
        <View className="flex flex-row justify-center items-center gap-3 mt-2">
          <Button
            action="card"
            className="basis-1/2 h-14 rounded-xl"
            onPress={() => setShowEditModal(false)}
          >
            <ButtonText className="text-base font-semibold">Cancel</ButtonText>
          </Button>
          <Button
            onPress={handleEdit}
            action="secondary"
            className="basis-1/2 h-14 rounded-xl"
          >
            <ButtonText className="text-base font-semibold">
              {loading ? <Spinner size={24} /> : "Edit"}
            </ButtonText>
          </Button>
        </View>
      </Dialog.Container>
    </View>
  );
};

export default EditCookbook;
