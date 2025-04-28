import React, { useState } from "react";

import { Pressable, Text, useColorScheme, View } from "react-native";
import Dialog from "react-native-dialog";

import Toast from "react-native-toast-message";

import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";

import { Bookmark, ChevronDown } from "lucide-react-native";
import SelectDropdown from "react-native-select-dropdown";
import {
  useAddRecipeToCookbook,
  useCookBooks,
} from "@/redux/queries/recipes/useCookbooksQuery";
import { Spinner } from "@/components/ui/spinner";
import { Recipe } from "@/lib/types/recipe";
import { useSelector } from "react-redux";

type SaveCookbookProps = {
  showSaveCookbookModal: boolean;
  setShowSaveCookbookModal: (value: boolean) => void;
};

const SaveCookbook = ({
  setShowSaveCookbookModal,
  showSaveCookbookModal,
}: SaveCookbookProps) => {
  const currentRecipe: Recipe = useSelector(
    (state: any) => state.recipe.currentRecipe
  );
  const scheme = useColorScheme();
  const {
    data: cookBooks,
    isLoading: selectLoading,
    isError: selectError,
  } = useCookBooks();
  const {
    mutate: addRecipe,
    isError: isaddCollectionError,
    error: addCollectionError,
  } = useAddRecipeToCookbook();

  const options = cookBooks ? cookBooks?.map((cookbook) => cookbook?.name) : [];
  const [showExistingCollections, setShowExistingCOllections] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({ collectionName: "" });
  const [loading, setLoading] = useState(false);

  const validateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    let errorMessage = "";

    // Validation rules for each field
    switch (key) {
      case "collectionName":
        if (!value) {
          errorMessage = "Collection name is required.";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [key]: errorMessage }));
  };
  console.log('asa')
  const handlexistingCollection = () => {
    const cookbook =
      cookBooks && cookBooks.find((cookbook) => cookbook.name === selected);

    if (!cookbook?.id) return;
    if (!currentRecipe?.id) return;
    setLoading(true);

    console.log(cookbook.id, currentRecipe.id);
    addRecipe(
      { cookbookId: cookbook.id, recipeId: currentRecipe.id },
      {
        onSuccess: (data) => {
          console.log("Recipe added successfully!", data);
          Toast.show({
            type: "success",
            text1: "Recipe added Successfully!",
          });
          setShowSaveCookbookModal(false);
        },
        onError: (error) => {
          console.error("Error adding recipe:", error);
          Toast.show({
            type: "error",
            text1: "Something went wrong",
          });
        },
      }
    );

    setLoading(false);
  };

  const handleNewCollection = () => {
    console.log("will handle");
  };

  return (
    <View>
      <Dialog.Container
        visible={showSaveCookbookModal}
        contentStyle={{
          backgroundColor: scheme === "dark" ? "#000" : "#fff",
          paddingVertical: 50,
          borderRadius: 30,
        }}
      >
        <View className="flex flex-row justify-center mb-6">
          <View className="bg-secondary flex flex-row justify-center items-center w-16 h-16 p-8 rounded-full">
            <Bookmark color="#fff" size={28} />
          </View>
        </View>
        {!showExistingCollections ? (
          <FormControl size="md" className="mb-1">
            <FormControlLabel>
              <FormControlLabelText className="font-bold leading-5 text-foreground text-center w-full h-full">
                <Text>Save Cookbook</Text>
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="my-5">
              <InputField
                type="text"
                placeholder="Add new collection"
                value={formData?.collectionName}
                onChangeText={(text) => validateField("collectionName", text)}
              />
            </Input>
            <FormControlError>
              <FormControlErrorText>
                {errors?.collectionName}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        ) : selectLoading ? (
          <Spinner size={50} />
        ) : selectError ? (
          <Text className="text-3xl text-foreground text-cneter my-4">
            Some thing went wrong.Please try again!
          </Text>
        ) : (
          <SelectDropdown
            data={options}
            defaultValue={selected}
            onSelect={(selectedItem) => {
              setSelected(selectedItem);
            }}
            renderButton={(selectedItem, isOpened) => (
              <View className="flex-row items-center gap-4 px-6 py-4 bg-secondary rounded-full mb-8">
                <Text className="flex-1 text-lg leading-6 font-semibold text-background">
                  {selectedItem || "Select"}
                </Text>
                {isOpened ? (
                  <ChevronDown color="#fff" size={22} />
                ) : (
                  <ChevronDown color="#fff" size={22} />
                )}
              </View>
            )}
            renderItem={(selectedItem, item, isSelected) => {
              return (
                <View
                  className={`px-4 py-2 ${
                    isSelected ? "bg-secondary" : "bg-accent "
                  }`}
                >
                  <Text
                    className={`text-lg text-foreground ${
                      isSelected ? "!text-background" : "text-foreground"
                    }`}
                  >
                    {selectedItem}
                  </Text>
                </View>
              );
            }}
            dropdownStyle={{
              borderRadius: 18,
              backgroundColor: "#f1f3f5",
              marginTop: -25,
            }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {!showExistingCollections ? (
          <Pressable onPress={() => setShowExistingCOllections(true)}>
            <Text className="text-primary text-lg font-medium tracking-wider text-center mb-8">
              Save From Existing
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => setShowExistingCOllections(false)}>
            <Text className="text-primary text-lg font-medium tracking-wider text-center mb-8">
              Add new collection
            </Text>
          </Pressable>
        )}
        <View className="flex flex-row gap-2">
          <Button
            action="muted"
            className="basis-1/2 h-16"
            onPress={() => setShowSaveCookbookModal(false)}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            action="secondary"
            className="basis-1/2 h-16"
            onPress={
              showExistingCollections
                ? handlexistingCollection
                : handleNewCollection
            }
          >
            <ButtonText>
              {loading ? <Spinner /> : showExistingCollections ? "Save" : "Add"}
            </ButtonText>
          </Button>
        </View>
      </Dialog.Container>
    </View>
  );
};

export default SaveCookbook;
