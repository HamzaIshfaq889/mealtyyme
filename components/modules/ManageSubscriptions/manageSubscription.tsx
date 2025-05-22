import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetCustomer } from "@/redux/queries/recipes/useCustomerQuery";
import {
  useCancelSubscription,
  useResumeSubscription,
  useUpgradeSubscription,
} from "@/redux/queries/recipes/useStripeQuery";
import { setCredentials } from "@/redux/slices/Auth";
import {
  capitalizeFirstLetter,
  formatDate,
  getNextBillingDate,
  PackagesPrice,
} from "@/utils";
import { saveUserDataInStorage } from "@/utils/storage/authStorage";
import { router } from "expo-router";
import { ArrowLeft, Ban } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  Alert,
} from "react-native";
import Dialog from "react-native-dialog";
import { useDispatch, useSelector } from "react-redux";

interface ManageSubscriptionProps {
  status: string | null;
  planName: "month" | "year" | null;
  startDate: string | null;
  subscriptionId: string | null;
}

export default function ManageSubscription({
  status = "",
  planName = "month",
  startDate = null,
  subscriptionId = "",
}: ManageSubscriptionProps) {
  const dispatch = useDispatch();

  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const [cancelLoading, setCancelLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const credentials = useSelector((state: any) => state.auth.loginResponseType);

  const price = planName && PackagesPrice[planName];

  const { mutate: cancelSubscription } = useCancelSubscription();
  const { mutate: upgrade } = useUpgradeSubscription();
  const { mutate: resumeSubscription } = useResumeSubscription();
  const { refetch } = useGetCustomer();

  const handlePostSubscriptionUpdate = async (
    updatedMessage: string,
    alertTitle: string
  ) => {
    try {
      const { data } = await refetch();

      const updatedCustomer = data && data?.length ? data[0] : [];
      console.log("updatedCustomer", updatedCustomer);

      if (updatedCustomer) {
        const updatedLoginResponse = {
          ...credentials,
          customer_details: updatedCustomer,
        };

        dispatch(setCredentials(updatedLoginResponse));

        try {
          await saveUserDataInStorage(updatedLoginResponse);
        } catch (storageError) {
          console.error("Failed to save user data in storage:", storageError);
        }

        router.push("/(protected)/(nested)/settings");
        Alert.alert(alertTitle, updatedMessage);
      }
    } catch (err) {
      console.error("Failed to refetch updated customer:", err);
    }
  };

  const handleCancelSubscription = () => {
    if (!subscriptionId) return;

    setCancelLoading(true);

    cancelSubscription(subscriptionId, {
      onSuccess: async () => {
        await handlePostSubscriptionUpdate(
          `Subscription for ${
            planName === "month" ? "month" : "year"
          } is now Cancelled!`,
          "Success"
        );
        setCancelLoading(false);
      },
      onError: (err) => {
        setCancelLoading(false);
        console.error("Cancellation failed:", err.message);
      },
    });
  };

  const handleUpgrade = () => {
    setUpgradeLoading(true);

    upgrade(undefined, {
      onSuccess: async () => {
        await handlePostSubscriptionUpdate("Upgraded Successfully!", "Success");
        setUpgradeLoading(false);
      },
      onError: (err) => {
        setUpgradeLoading(false);
        console.error("Upgrading failed:", err.message);
      },
    });
  };

  const handelRetrySubscription = () => {
    if (!subscriptionId) return null;
    setRetryLoading(true);

    resumeSubscription(subscriptionId, {
      onSuccess: async () => {
        setRetryLoading(false);

        await handlePostSubscriptionUpdate("Resumed Successfully!", "Success");
        setUpgradeLoading(false);
      },
      onError: (err) => {
        setRetryLoading(false);

        setUpgradeLoading(false);
        console.error("Resume subscription failed:", err.message);
      },
    });
  };

  return (
    <>
      <View
        className={`flex flex-col w-full h-full bg-background px-6 pt-16 pb-6`}
      >
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity
            onPress={() =>
              router.push("/(protected)/(nested)/active-subscription")
            }
          >
            <ArrowLeft
              width={30}
              height={30}
              color={scheme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>

          <View className="flex-1 items-center">
            <Text className="font-bold text-2xl text-primary">
              Manage Subscription
            </Text>
          </View>

          <View style={{ width: 30 }} />
        </View>

        <View className={`p-4 rounded-2xl bg-card`}>
          <View className="mb-4">
            <View className="flex-row justify-between items-start">
              {/* <View className="bg-[#1C3A1F] px-2 py-1 rounded-md mb-2">
                <Text className="text-[#4ADE80] text-xs font-medium">
                  {status === "active"
                    ? "Active"
                    : status === "inactive"
                    ? "Inactive"
                    : "Expired"}
                </Text>
              </View> */}

              <View
                className={`px-2 py-1 rounded-md mb-2 ${
                  status === "active"
                    ? "bg-[#1C3A1F]"
                    : status === "trialing"
                    ? "bg-[#333]"
                    : "bg-[#3A1C1C]"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    status === "active"
                      ? "text-[#4ADE80]"
                      : status === "trialing"
                      ? "text-[#A3A3A3]"
                      : "text-[#F87171]"
                  }`}
                >
                  {status === "active"
                    ? "Active"
                    : status === "trialing"
                    ? "Trialing"
                    : "Canceled"}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-foreground text-lg font-semibold">
                {planName ? `${capitalizeFirstLetter(planName)}ly` : "N/A"}
              </Text>
              <Text className="text-foreground text-lg">{`$${price}/${planName}`}</Text>
            </View>
          </View>

          <View className="space-y-2 mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-foreground/60 text-sm">Started:</Text>
              <Text className="text-foreground text-sm">
                {" "}
                {startDate ? formatDate(startDate) : "N/A"}
              </Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-foreground/60 text-sm">
                Next Billing Date:
              </Text>
              <Text className="text-foreground text-sm">
                {startDate && planName
                  ? getNextBillingDate(startDate, planName)
                  : "N/A"}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-foreground/60 text-sm">
                Subscription ID:
              </Text>
              <Text className="text-foreground text-sm">{subscriptionId}</Text>
            </View>
          </View>

          <View>
            {status === "canceled" ? (
              <Button
                onPress={handelRetrySubscription}
                disabled={!!retryLoading}
                action="secondary"
                className="h-16"
              >
                {
                  <ButtonText>
                    {retryLoading ? (
                      <Spinner size={30} />
                    ) : (
                      "Resume Subscription"
                    )}
                  </ButtonText>
                }
              </Button>
            ) : (
              <View className="flex flex-row gap-2 w-full">
                <View
                  className={`${planName === "month" ? "w-1/2" : "w-full"} `}
                >
                  <Button
                    variant="outline"
                    className="border border-destructive h-16"
                    onPress={() => setShowDeleteModal(true)}
                  >
                    <ButtonText className="!text-lg !font-semibold !text-destructive">
                      Cancel
                    </ButtonText>
                  </Button>
                </View>
                {planName === "month" && (
                  <Button
                    className="w-1/2 h-16"
                    onPress={handleUpgrade}
                    disabled={!!upgradeLoading}
                    action="secondary"
                  >
                    <ButtonText className="!text-lg !font-semibold !text-white">
                      {upgradeLoading ? <Spinner size={30} /> : "Upgrade"}
                    </ButtonText>
                  </Button>
                )}
              </View>
            )}
          </View>
        </View>

        <View className="mt-auto">
          <Button action="secondary" className="h-16">
            <ButtonText
              className="!text-white"
              onPress={() =>
                router.push("/(protected)/(nested)/payment-methods")
              }
            >
              Manage Payment Methods
            </ButtonText>
          </Button>
        </View>
      </View>

      <Dialog.Container
        visible={showDeleteModal}
        contentStyle={{
          backgroundColor: scheme === "dark" ? "#1a1a1a" : "#fdf8f4",
          paddingVertical: 50,
          marginLeft: 30,
          marginRight: 20,
          borderRadius: 30,
        }}
      >
        <View className="flex flex-row justify-center mb-6">
          <View className="bg-destructive flex flex-row justify-center items-center w-24 h-24 p-8 rounded-full basis-1/">
            <Ban color="#fff" size={35} />
          </View>
        </View>
        <View>
          <Text className="font-bold leading-5 text-foreground text-lg text-center mb-3">
            Cancel Subscription
          </Text>
          <Text className="font-bold leading-5 text-foreground text-lg text-center mb-7 ">
            Are you sure to cancel your subscription?
          </Text>
        </View>
        <View className="flex flex-row justify-center items-center gap-2">
          <Button
            action="muted"
            className="basis-1/2 h-16"
            onPress={() => setShowDeleteModal(false)}
          >
            <ButtonText>Back</ButtonText>
          </Button>
          <Button
            action="secondary"
            onPress={handleCancelSubscription}
            disabled={!!cancelLoading}
            className="basis-1/2 h-16"
          >
            <ButtonText className="!text-white">
              {cancelLoading ? <Spinner size={30} /> : "Cancel"}
            </ButtonText>
          </Button>
        </View>
      </Dialog.Container>
    </>
  );
}
