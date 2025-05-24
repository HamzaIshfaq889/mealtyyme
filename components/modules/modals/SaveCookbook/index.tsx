import React, { useState } from "react";
import {
  Platform,
  Pressable,
  Text,
  useColorScheme,
  View,
  StyleSheet,
} from "react-native";
import Dialog from "react-native-dialog";
import Toast from "react-native-toast-message";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Bookmark, ChevronDown, ChevronUp, Plus } from "lucide-react-native";
import SelectDropdown from "react-native-select-dropdown";
import {
  useAddRecipeToCookbook,
  useCookBooks,
  useCreateCookbook,
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
  const {
    data: cookBooks,
    isLoading: selectLoading,
    isError: selectError,
  } = useCookBooks();
  const { mutate: addRecipe } = useAddRecipeToCookbook();
  const { mutate: createCookbook } = useCreateCookbook();

  const currentRecipe: Recipe = useSelector(
    (state: any) => state.recipe.currentRecipe
  );
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const options = cookBooks ? cookBooks?.map((cookbook) => cookbook?.name) : [];
  const [showExistingCollections, setShowExistingCOllections] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [selected, setSelected] = useState(options[0]);
  const [loading, setLoading] = useState(false);

  const handlexistingCollection = async () => {
    const cookbook =
      cookBooks && cookBooks.find((cookbook) => cookbook.name === selected);

    const cookBookId = cookbook?.id;
    const currentRecipeId = currentRecipe?.id;

    if (!cookBookId) return;
    if (!currentRecipeId) return;
    setLoading(true);

    addRecipeToCookBook(cookBookId, currentRecipeId);

    setLoading(false);
  };

  const handleNewCollection = () => {
    if (!collectionName) {
      Toast.show({
        type: "error",
        text1: "Please enter collection name!",
      });
      return;
    }
    setLoading(true);

    createCookbook(
      { name: collectionName },
      {
        onSuccess: (data) => {
          const cookBookId = data?.id;
          const currentRecipeId = currentRecipe?.id;

          addRecipeToCookBook(cookBookId, currentRecipeId);
        },
        onError: (error) => {
          console.log("Error while adding new cookbook :", error);
          Toast.show({
            type: "error",
            text1: "Something went wrong",
          });
        },
      }
    );

    setLoading(false);
  };

  const addRecipeToCookBook = (cookBookId: number, currentRecipeId: number) => {
    addRecipe(
      { cookbookId: cookBookId, recipeId: currentRecipeId },
      {
        onSuccess: (data) => {
          console.log("Recipe added successfully!", data);
          Toast.show({
            type: "success",
            text1: "Recipe saved Successfully!",
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
  };

  return (
    <View>
      <Dialog.Container
        visible={showSaveCookbookModal}
        contentStyle={{
          // backgroundColor: isDark ? "#2B2B2B" : "#2B2B2B",
          paddingVertical: Platform.OS === "ios" ? 20 : 24,
          borderRadius: 24,

          minWidth: Platform.OS === "ios" ? 300 : 300,
        }}
      >
        <View style={[styles.container]}>
          <View style={styles.iconContainer}>
            <View
              style={[styles.iconWrapper, isDark && styles.iconWrapperDark]}
            >
              <Bookmark color="#fff" size={Platform.OS === "ios" ? 28 : 32} />
            </View>
          </View>

          <Text style={[styles.title, isDark && styles.titleDark]}>
            Save to Cookbook
          </Text>

          {!showExistingCollections ? (
            <FormControl size="md" style={styles.formControl}>
              <FormControlLabel>
                <FormControlLabelText
                  style={[styles.labelText, isDark && styles.labelTextDark]}
                >
                  Add Cookbook
                </FormControlLabelText>
              </FormControlLabel>
              <Input style={[styles.input, isDark && styles.inputDark]}>
                <InputSlot style={styles.inputIcon}>
                  <InputIcon style={styles.icon} as={Plus} />
                </InputSlot>
                <InputField
                  type="text"
                  placeholder="Add new collection"
                  value={collectionName}
                  onChangeText={(text) => setCollectionName(text)}
                  style={[styles.inputField, isDark && styles.inputFieldDark]}
                  placeholderTextColor={isDark ? "#666" : "#999"}
                />
              </Input>
            </FormControl>
          ) : selectLoading ? (
            <Spinner size={50} />
          ) : selectError ? (
            <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
              Something went wrong. Please try again!
            </Text>
          ) : (
            <SelectDropdown
              data={options}
              defaultValue={selected}
              onSelect={(selectedItem) => {
                setSelected(selectedItem);
              }}
              renderButton={(selectedItem, isOpened) => (
                <View
                  style={[
                    styles.dropdownButton,
                    isDark && styles.dropdownButtonDark,
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      isDark && styles.dropdownTextDark,
                    ]}
                  >
                    {selectedItem || "Select collection"}
                  </Text>
                  <View style={styles.dropdownArrow}>
                    {isOpened ? (
                      <ChevronUp color="#ee8427" size={24} />
                    ) : (
                      <ChevronDown color="#ee8427" size={24} />
                    )}
                  </View>
                </View>
              )}
              renderItem={(item, isSelected) => (
                <View
                  style={[
                    styles.dropdownItem,
                    isDark && styles.dropdownItemDark,
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      isDark && styles.dropdownItemTextDark,
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              )}
              dropdownStyle={[styles.dropdown, isDark && styles.dropdownDark]}
              showsVerticalScrollIndicator={false}
              dropdownOverlayColor="transparent"
            />
          )}

          <Pressable
            style={[styles.switchButton, isDark && styles.switchButtonDark]}
            onPress={() => setShowExistingCOllections(!showExistingCollections)}
          >
            <Text
              style={[
                styles.switchButtonText,
                isDark && styles.switchButtonTextDark,
              ]}
            >
              {showExistingCollections
                ? "Add new Collection"
                : "Choose Collection"}
            </Text>
          </Pressable>

          <View style={styles.buttonContainer}>
            <Button
              action="card"
              style={[styles.button, isDark && styles.buttonDark]}
              onPress={() => setShowSaveCookbookModal(false)}
            >
              <ButtonText
                style={[styles.buttonText, isDark && styles.buttonTextDark]}
              >
                Cancel
              </ButtonText>
            </Button>
            <Button
              action="secondary"
              style={styles.button}
              onPress={
                showExistingCollections
                  ? handlexistingCollection
                  : handleNewCollection
              }
            >
              <ButtonText style={styles.buttonText}>
                {loading ? (
                  <Spinner />
                ) : showExistingCollections ? (
                  "Save"
                ) : (
                  "Add"
                )}
              </ButtonText>
            </Button>
          </View>
        </View>
      </Dialog.Container>
    </View>
  );
};

export default SaveCookbook;

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === "ios" ? 16 : 20,
  },
  containerDark: {
    backgroundColor: "#2B2B2B",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Platform.OS === "ios" ? 20 : 24,
  },
  iconWrapper: {
    backgroundColor: "#ee8427",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: Platform.OS === "ios" ? 70 : 80,
    height: Platform.OS === "ios" ? 70 : 80,
    padding: 16,
    borderRadius: 35,
  },
  iconWrapperDark: {
    backgroundColor: "#ee8427",
  },
  title: {
    textAlign: "center",
    color: "#ee8427",
    fontSize: Platform.OS === "ios" ? 22 : 24,
    fontWeight: "600",
    marginBottom: Platform.OS === "ios" ? 24 : 32,
  },
  titleDark: {
    color: "#ee8427",
  },
  formControl: {
    marginBottom: 16,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
  },
  labelTextDark: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputDark: {
    backgroundColor: "#2a2a2a",
    borderColor: "#3a3a3a",
  },
  inputIcon: {
    marginRight: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  inputField: {
    fontSize: 16,
    color: "#000",
  },
  inputFieldDark: {
    color: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
    marginVertical: 16,
  },
  errorTextDark: {
    color: "#ff6666",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  dropdownButtonDark: {
    backgroundColor: "#2a2a2a",
    borderColor: "#3a3a3a",
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  dropdownTextDark: {
    color: "#fff",
  },
  dropdownArrow: {
    marginLeft: 8,
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  dropdownItemDark: {
    backgroundColor: "#2a2a2a",
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  dropdownItemTextDark: {
    color: "#fff",
  },
  dropdown: {
    borderRadius: 16,
    backgroundColor: "#fff",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  dropdownDark: {
    backgroundColor: "#2a2a2a",
    borderColor: "#3a3a3a",
  },
  switchButton: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  switchButtonDark: {
    backgroundColor: "#2a2a2a",
    borderColor: "#3a3a3a",
  },
  switchButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  switchButtonTextDark: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: Platform.OS === "ios" ? 50 : 56,
    borderRadius: 16,
  },
  buttonDark: {
    backgroundColor: "#2a2a2a",
  },
  buttonText: {
    fontSize: Platform.OS === "ios" ? 15 : 16,
    fontWeight: "600",
  },
  buttonTextDark: {
    color: "#fff",
  },
});
