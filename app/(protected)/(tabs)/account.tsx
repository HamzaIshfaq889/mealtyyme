import React from "react";
import { Account } from "@/components/modules";

import { useDispatch } from "react-redux";

import ComingSoonOverlay from "@/components/modules/ComingSoonOverlay";
import { setCredentials } from "@/redux/slices/Auth";
import { useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { clearUserDataFromStorage } from "@/utils/storage/authStorage";

const AccountScreen = () => {
  const { signOut } = useClerk();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(
      setCredentials({
        access: null,
        refresh: null,
        email: null,
        first_name: null,
        role: null,
        isAuthenticated: false,
        customer_details: null,
      })
    );
    signOut();
    clearUserDataFromStorage();
    router.replace("/(auth)/account-options");
  };
  return (
    <>
      {/* <ComingSoonOverlay onLogOut={handleLogout} isLogOut={true} /> */}
      <Account />
    </>
  );
};

export default AccountScreen;
