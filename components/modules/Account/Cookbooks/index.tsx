import React, { useCallback, useEffect, useState } from "react";
import { FilePenLine, Trash } from "lucide-react-native";

import { useCookBooks } from "@/redux/queries/recipes/useCookbooksQuery";
import { Text, useColorScheme, View } from "react-native";

import DeleteCookbook from "./deleteCookbook";
import EditCookbook from "./editCookbook";
import { CookBookSkeleton } from "../../Skeletons";
import { ScrollView } from "react-native-gesture-handler";
import RecipesFlatList from "./recipesFlatList";
import Error from "../../Error";
import { useFocusEffect } from "expo-router";

const Cookbooks = ({ activeTab }: { activeTab: string }) => {
  const {
    data: cookBooks,
    isLoading: cookbooksLoading,
    isError: cookbooksError,
    refetch,
  } = useCookBooks();
  const scheme = useColorScheme();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cookBookId, setCookBookId] = useState<null | number>(null);

  useFocusEffect(
    useCallback(() => {
      refetch();
      console.log("refetching on focus");
    }, [])
  );

  if (cookbooksLoading) {
    return <CookBookSkeleton />;
  }

  if (cookbooksError) {
    return <Error errorMessage="No Cookbooks found!" />;
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
      {cookBooks?.length === 0 ? (
        <View className="flex-1 justify-center items-center p-7">
          <Text className="text-gray-500 text-sm">
            No cookbooks found. Add one by going to a recipe
          </Text>
        </View>
      ) : (
        cookBooks?.map((cookbook) => {
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

              {cookbook?.recipes.length > 0 ? (
                <RecipesFlatList
                  recipeIds={cookbook?.recipes}
                  cookbookId={cookbook?.id}
                  refetch={refetch}
                />
              ) : (
                <View className="flex-1 justify-center items-center p-7">
                  <Text className="text-gray-500 text-sm">
                    No recipes available.
                  </Text>
                </View>
              )}
            </ScrollView>
          );
        })
      )}

      {/* Modals */}
      {showEditModal && (
        <EditCookbook
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          cookBookId={cookBookId}
          refetch={refetch}
        />
      )}
      {showDeleteModal && (
        <DeleteCookbook
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          cookBookId={cookBookId}
          refetch={refetch}
        />
      )}
    </View>
  );
};

export default Cookbooks;
