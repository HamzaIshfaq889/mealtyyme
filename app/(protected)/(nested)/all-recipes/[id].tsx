import React, { useMemo } from "react";

import { AllRecipes } from "@/components/modules";

import { useLocalSearchParams } from "expo-router";

const AllRecipesScreen = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  const queryOptions = useMemo(() => {
    const numericId = id ? Number(id) : undefined;
    if (!numericId || !name) return {};

    switch (name.toLowerCase()) {
      case "diets":
        return { dietIds: [numericId] };
      case "categories":
        return { categoryIds: [numericId] };
      case "cuisines":
        return { cuisineIds: [numericId] };
      default:
        return {};
    }
  }, [id, name]);

  return <AllRecipes queryOptions={queryOptions} />;
};

export default AllRecipesScreen;
