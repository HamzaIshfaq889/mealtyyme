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
import RecipeCollectionCard from "./recipeCollectionCard";

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

  const collections = [
    {
      id: 1,
      title: "Vegan Delights",
      recipeCount: 11,
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FRX7kSms2kwnT6KKFALtWLpyeYP4JW.png",
    },
    {
      id: 2,
      title: "My Delights",
      recipeCount: 12,
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FRX7kSms2kwnT6KKFALtWLpyeYP4JW.png",
    },
    {
      id: 2,
      title: "My Delights",
      recipeCount: 12,
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FRX7kSms2kwnT6KKFALtWLpyeYP4JW.png",
    },
  ];

  console.log(cookBooks);

  return (
    <View className="mt-3">
      {cookBooks?.length === 0 ? (
        <View className="flex-1 justify-center items-center p-7">
          <Text className="text-gray-500 text-sm">
            No cookbooks found. Add one by going to a recipe
          </Text>
        </View>
      ) : (
        <ScrollView className="mb-6">
          <View className="flex flex-row flex-wrap justify-between mx-6">
            {cookBooks?.length &&
              cookBooks.map((cookbook) => (
                <RecipeCollectionCard
                  key={cookbook?.id}
                  id={cookbook?.id}
                  title={cookbook?.name}
                  recipeCount={cookbook?.recipes?.length || 0}
                  imageUrl={cookbook?.recipe_thumbnails?.[0]}
                  onEdit={() => handleEditCookbook(cookbook?.id)}
                  onDelete={() => handleDeleteCookbook(cookbook?.id)}
                  recipes={cookbook?.recipes || []}
                />
              ))}
          </View>
        </ScrollView>
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
