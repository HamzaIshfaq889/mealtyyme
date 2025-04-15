import React, { useState } from "react";
import { FilePenLine, Trash } from "lucide-react-native";

import { FlatList, Pressable, Text, View } from "react-native";

import { router } from "expo-router";

import RecipeData from "@/components/data/recipeData.json";
import { RecipeCard } from "@/components/modules";

import DeleteCookbook from "./deleteCookbook";
import EditCookbook from "./editCookbook";

const Cookbooks = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  console.log(showEditModal);

  return (
    <View>
      <View className="flex-row justify-between items-center mb-4 mt-4">
        <View className="flex flex-row items-center gap-5">
          <Text className="text-xl font-bold text-primary text-gray leading-5">
            Nex's recipess
          </Text>
          <View className="flex flex-row gap-6">
            <FilePenLine
              color="#0a2533"
              size={22}
              onPress={() => setShowEditModal(!showEditModal)}
            />
            <Trash
              color="#ff0000"
              size={22}
              onPress={() => setShowDeleteModal(!showDeleteModal)}
            />
          </View>
        </View>
        <Pressable onPress={() => router.push("/")}>
          <Text className="text-secondary pr-5 font-bold">See All</Text>
        </Pressable>
      </View>
      <FlatList
        data={RecipeData}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable className="mr-5">
            <RecipeCard recipeItem={item} />
          </Pressable>
        )}
      />

      {/* Modals */}
      {showEditModal && (
        <EditCookbook
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
        />
      )}
      {showDeleteModal && (
        <DeleteCookbook
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
    </View>
  );
};

export default Cookbooks;
