import React from "react";
import { Account } from "@/components/modules";

import { useDispatch } from "react-redux";

import ComingSoonOverlay from "@/components/modules/ComingSoonOverlay";
import { deleteToken } from "@/redux/store/expoStore";
import { setCredentials } from "@/redux/slices/Auth";
import { useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";

const AccountScreen = () => {
  const { signOut } = useClerk();
  const dispatch = useDispatch();
  const handleLogout = () => {
    deleteToken();
    dispatch(
      setCredentials({
        access: null,
        refresh: null,
        email: null,
        first_name: null,
        role: null,
        isAuthenticated: false,
      })
    );
    signOut();
    router.replace("/(auth)/account-options");
    console.log("done");
  };
  return (
    <>
      <ComingSoonOverlay onLogOut={handleLogout} isLogOut={true} />
    </>
  );
};

export default AccountScreen;
