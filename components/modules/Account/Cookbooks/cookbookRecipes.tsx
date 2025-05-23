import React from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useCookbookRecipes } from "@/services/cookbooksApi";
import { RecipeSkeletonItem } from "../../Skeletons";
import Error from "../../Error";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import HorizontalRecipeCard from "../../RecipeCards/horizontalRecipeCard";
import { useDeleteRecipeFromCookbook } from "@/redux/queries/recipes/useCookbooksQuery";
import Toast from "react-native-toast-message";

type CookbookRecipesProps = {
  recipeIds: string[];
  cookbookId: string;
  cookbookImage: string;
  cookbookName: string | string[];
};

const CookbookRecipes = ({
  recipeIds,
  cookbookId,
  cookbookImage,
  cookbookName,
}: CookbookRecipesProps) => {
  const recipeIdsinNumbers = recipeIds?.map((rec) => Number(rec));
  const { mutate: deleteRecipe } = useDeleteRecipeFromCookbook();
  const scheme = useColorScheme();

  const {
    data: recipes,
    isLoading: recipesLoading,
    isError: recipesError,
  } = useCookbookRecipes(recipeIdsinNumbers);

  if (recipesLoading) {
    return (
      <>
        <View className="mt-3 space-y-6 px-6 pt-24 pb-16 w-full h-full bg-background">
          <Text className="mb-4 text-foreground text-2xl font-semibold">
            Recipes
          </Text>
          {[1, 2, 3, 4].map((item) => {
            return <RecipeSkeletonItem key={item} />;
          })}
        </View>
      </>
    );
  }

  if (recipesError) {
    return <Error errorMessage="No Cookbook Recipes found, Add One now!" />;
  }

  const handleRecipeDelete = (recipeId: number) => {
    if (!cookbookId || !recipeId) {
      console.log("No cookbookId or recipeId provided");
      return;
    }

    deleteRecipe(
      { cookbookId: Number(cookbookId), recipeId: recipeId },
      {
        onSuccess: () => {
          router.back();
        },
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1:
              error?.message || "Error while deleting recipe.Please try again!",
          });
        },
      }
    );
  };

  return (
    <View className="w-full h-full px-6 pt-16 pb-20 flex-col relative bg-background">
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="font-bold text-2xl text-primary">
            {cookbookName}
          </Text>
        </View>

        <View style={{ width: 30 }} />
      </View>

      <View className="mb-8">
        <Image
          source={{ uri: cookbookImage }}
          className="w-full h-52 rounded-xl"
          resizeMode="cover"
        />
      </View>
      {recipes && recipes?.length > 0 ? (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item?.id.toString()}
          contentContainerStyle={{
            paddingHorizontal: 2,
            paddingBottom: 200,
          }}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: recipe }) => (
            <HorizontalRecipeCard
              recipe={recipe}
              showDelete={true}
              onDelete={handleRecipeDelete}
            />
          )}
        />
      ) : (
        <Error errorMessage="No Cookbook Recipes found, Add One now!" />
      )}
    </View>
  );
};

export default CookbookRecipes;
