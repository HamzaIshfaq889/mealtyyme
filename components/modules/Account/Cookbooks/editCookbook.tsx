import React, { useState } from "react";

import { Text, useColorScheme, View } from "react-native";
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
};
const EditCookbook = ({
  setShowEditModal,
  showEditModal,
  cookBookId,
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
          backgroundColor: scheme === "dark" ? "#000" : "#fff",
          paddingVertical: 50,
          borderRadius: 30,
          marginLeft: 35,
          marginRight: 20,
        }}
      >
        <View className="flex flex-row justify-center mb-6">
          <View className="bg-secondary flex flex-row justify-center items-center w-24 h-24 p-8 rounded-full">
            <FilePenLine color="#fff" size={35} />
          </View>
        </View>
        <FormControl size="md" className="mb-1">
          <FormControlLabel>
            <FormControlLabelText className="font-bold leading-5 text-foreground text-center w-full h-full">
              <Text>Edit Collection Name</Text>
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="my-5">
            <InputField
              type="text"
              placeholder="Enter Collection Name"
              value={collectionName}
              onChangeText={(text) => setCollectionName(text)}
            />
          </Input>
        </FormControl>
        <View className="flex flex-row gap-2">
          <Button
            action="muted"
            className="basis-1/2 h-16"
            onPress={() => setShowEditModal(false)}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button action="secondary" className="basis-1/2 h-16">
            <ButtonText onPress={handleEdit}>
              {loading ? <Spinner size={30} /> : "Edit"}
            </ButtonText>
          </Button>
        </View>
      </Dialog.Container>
    </View>
  );
};

export default EditCookbook;
