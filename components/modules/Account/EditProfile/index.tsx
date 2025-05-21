import React, { useState } from "react";
import { ArrowLeft, MailIcon, UserRound } from "lucide-react-native";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
} from "react-native";
import { router } from "expo-router";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CameraIcon } from "lucide-react-native";
import { useSelector, useDispatch } from "react-redux";
import { LoginResponseTypes } from "@/lib/types";
import {
  useUpdateCustomer,
  useUploadProfileImage,
} from "@/redux/queries/recipes/useCustomerQuery";
import { UploadAvatarResponse } from "@/lib/types/customer";
import axios from "axios";
import { patchUser } from "@/services/customerApi";
import { setCredentials } from "@/redux/slices/Auth";

const formDataImage = global.FormData;

const EditProfile = () => {
  const scheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [uploadedImageData, setUploadedImageData] =
    useState<null | UploadAvatarResponse>(null);

  const { mutate: uploadImage, isPending: isUploadingImage } =
    useUploadProfileImage();
  const { mutate: UpdateUserProfile } = useUpdateCustomer();
  const customerId = useSelector(
    (state: any) => state.auth.loginResponseType.customer_details?.user
  );

  const auth: LoginResponseTypes = useSelector(
    (state: any) => state.auth.loginResponseType
  );

  const [formData, setFormData] = useState({
    firstName: auth.first_name,
    lastName: auth.first_name,
  });

  const dispatch = useDispatch();

  const validateField = (key: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    let errorMessage = "";

    switch (key) {
      case "firstName":
        if (!value) {
          errorMessage = "First Name is required.";
        } else if (value.length < 3) {
          errorMessage = "First Name must be of 3 letters.";
        }
        break;

      case "lastName":
        if (!value) {
          errorMessage = "Last Name required.";
        } else if (value.length < 3) {
          errorMessage = "Last Name must be of 3 letters.";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [key]: errorMessage }));
  };

  const validateAllFields = () => {
    Object.entries(formData).forEach(([key, value]) => {
      validateField(key, value);
    });
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    !errors.firstName &&
    !errors.lastName;

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need access to your photos to set a profile picture"
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImage(uri);

        // Create form data
        const formData = new FormData();

        // Get the file extension from the URI
        const uriParts = uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        // Create the file object
        const file = {
          uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
          type: `image/${fileType}`,
          name: `profile-image.${fileType}`,
        };

        formData.append("file", file as any);

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth?.access}`,
          },
        };

        try {
          const response = await axios.post(
            "https://backend.mealtyme.co/api/attachments/",
            formData,
            config
          );

          if (response.data) {
            setUploadedImageData(response.data);
          }
        } catch (error) {
          console.error("Upload error:", error);
          Alert.alert("Error", "Failed to upload image. Please try again.");
        }
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const uriToFile = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new File([blob], "profile.jpg", { type: blob.type });
  };

  const handleSubmit = () => {
    setIsLoading(true);

    validateAllFields();
    if (!isFormValid) {
      console.log("Form not valid");
      return;
    }

    const firstName = formData?.firstName;
    const userImage = uploadedImageData?.file;

    const data = {
      first_name: firstName || "",
      last_name: formData?.lastName || "",
      image_url: userImage,
    };

    patchUser({ user_id: customerId, data })
      .then((response: any) => {
        // Update Redux store with only the changed fields
        dispatch(
          setCredentials({
            ...auth, // Keep existing auth state
            first_name: response.first_name,
            image_url: response.image_url,
            email: response.email,
            role: response.role,
            customer_details: auth.customer_details, // Keep existing customer details
          })
        );
        router.push("/(protected)/(tabs)/account");
      })
      .catch((error: Error) => {
        console.error("Error updating profile:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ScrollView className="min-w-sceen bg-background px-6 py-16">
      <View className="flex flex-row justify-between items-center mb-10">
        <TouchableOpacity
          onPress={() => router.push("/(protected)/(tabs)/account")}
        >
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <Text className="block font-bold text-2xl text-foreground">
          Edit profile
        </Text>
        <Text></Text>
      </View>

      <View className="flex items-center justify-center mb-10">
        <TouchableOpacity onPress={pickImage}>
          <View className="bg-gray3 rounded-full border-2 border-secondary w-32 h-32 relative">
            {(image || auth?.image_url) && (
              <Image
                source={{ uri: (image || auth?.image_url) as string }}
                className="w-full h-full rounded-full"
              />
            )}
            <View className="absolute bottom-0 right-0 bg-secondary rounded-full p-2">
              <CameraIcon size={20} color="white" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View className="w-full flex flex-row gap-6">
        <FormControl
          size="md"
          className="mb-1 basis-1/2"
          isInvalid={!!errors?.firstName}
        >
          <FormControlLabel>
            <FormControlLabelText className="font-bold leading-5">
              First Name
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="my-3.5">
            <InputSlot className="ml-1">
              <InputIcon className="!w-6 !h-6 text-primary" as={UserRound} />
            </InputSlot>
            <InputField
              type="text"
              placeholder="First Name"
              value={formData.firstName ? formData.firstName : undefined}
              onChangeText={(text) => validateField("firstName", text)}
            />
          </Input>
          <FormControlError>
            <FormControlErrorText>{errors?.firstName}</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl
          size="md"
          className="mb-1 basis-1/2"
          isInvalid={!!errors?.lastName}
        >
          <FormControlLabel>
            <FormControlLabelText className="font-bold leading-5">
              Last Name
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="my-3.5">
            <InputSlot className="ml-1">
              <InputIcon className="!w-6 !h-6 text-primary" as={UserRound} />
            </InputSlot>
            <InputField
              type="text"
              placeholder="Last Name"
              value={formData.lastName ? formData.lastName : undefined}
              onChangeText={(text) => validateField("lastName", text)}
            />
          </Input>
          <FormControlError>
            <FormControlErrorText>{errors?.lastName}</FormControlErrorText>
          </FormControlError>
        </FormControl>
      </View>

      <FormControl size="md" className="mb-1" isInvalid={!!errors?.email}>
        <FormControlLabel>
          <FormControlLabelText className="font-bold leading-5">
            Email Address
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="my-3.5" isReadOnly>
          <InputSlot className="ml-1">
            <InputIcon className="!w-6 !h-6 text-primary" as={MailIcon} />
          </InputSlot>
          <InputField
            type="text"
            placeholder="Enter Email Address"
            value={auth?.email ? auth?.email : undefined}
            onChangeText={(text) => validateField("email", text)}
            className="text-muted"
          />
        </Input>
        <FormControlError>
          <FormControlErrorText>{errors?.email}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <Button
        className="mt-2 mb-36 bg-secondary"
        action="primary"
        onPress={handleSubmit}
        disabled={!!isLoading}
      >
        {!isLoading ? (
          <ButtonText className="!text-white">Update Profile</ButtonText>
        ) : (
          <ButtonText>
            <Spinner />
          </ButtonText>
        )}
      </Button>
    </ScrollView>
  );
};

export default EditProfile;
