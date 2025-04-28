import React, { useState } from "react";
import { FilePenLine, Trash } from "lucide-react-native";

import { useCookBooks } from "@/redux/queries/recipes/useCookbooksQuery";
import { Text, useColorScheme, View } from "react-native";

import DeleteCookbook from "./deleteCookbook";
import EditCookbook from "./editCookbook";
import { CookBookSkeleton } from "../../Skeletons";
import { ScrollView } from "react-native-gesture-handler";
import RecipesFlatList from "./recipesFlatList";
import Error from "../../Error";

const Cookbooks = () => {
  const {
    data: cookBooks,
    isLoading: cookbooksLoading,
    isError: cookbooksError,
  } = useCookBooks();
  const scheme = useColorScheme();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cookBookId, setCookBookId] = useState<null | number>(null);

  if (cookbooksLoading) {
    return <CookBookSkeleton />;
  }

  if (cookbooksError) {
    return <Error errorMessage="No Cookbooks found, Add One now!" />;
  }

  const handleEditCookbook = async (cookbookId: number) => {
    setShowEditModal(true);

    setCookBookId(cookbookId);
  };

  const handleDeleteCookbook = (cookbookId: number) => {
    setShowDeleteModal(true);

    setCookBookId(cookbookId);
  };

  return (
    <View className="mt-3">
      {cookBooks?.map((cookbook) => {
        return (
          <ScrollView key={cookbook.id} className="mb-6">
            <View className="flex-row items-center mb-2">
              <Text className="text-xl font-bold text-primary px-6">
                {cookbook.name}
              </Text>

              <View className="flex flex-row gap-5">
                <FilePenLine
                  color={scheme === "dark" ? "#fff" : "#0a2533"}
                  size={23}
                  onPress={() => handleEditCookbook(cookbook.id)}
                />
                <Trash
                  color="#ff0000"
                  size={23}
                  onPress={() => handleDeleteCookbook(cookbook.id)}
                />
              </View>
            </View>

            <RecipesFlatList recipeIds={cookbook?.recipes} />
          </ScrollView>
        );
      })}

      {/* Modals */}
      {showEditModal && (
        <EditCookbook
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          cookBookId={cookBookId}
        />
      )}
      {showDeleteModal && (
        <DeleteCookbook
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          cookBookId={cookBookId}
        />
      )}
    </View>
  );
};

export default Cookbooks;
