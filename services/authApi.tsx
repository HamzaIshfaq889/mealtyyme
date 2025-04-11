import apiClient from "@/lib/apiClient";

import {
  ForgotPasswordPayload,
  LoginPayload,
  OtpPayload,
  OtpResponseTypes,
  ResetPasswordPayload,
  SignupPayload,
} from "@/lib/types";

export const loginUser = async (payload: LoginPayload) => {
  const response = await apiClient.post("/auth/login/", {
    ...payload,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Invalid Credentials");
    }
    throw new Error(response?.originalError?.message || "Login failed");
  }

  return response.data;
};

export const signupUser = async (payload: SignupPayload) => {
  const response = await apiClient.post("/auth/signup/", payload);

  if (!response.ok) {
    throw new Error(response?.originalError?.message || "Signup failed");
  }

  return response.data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const response = await apiClient.post("/forgot-password/", payload);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Email not registered");
    }

    throw new Error(
      response?.originalError?.message || "Forgot Password failed"
    );
  }

  return response.data;
};

export const verifyOtp = async (payload: OtpPayload) => {
  const response = await apiClient.post("/verify-otp/", payload);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Email not registered");
    }
    if (response.status === 400) {
      throw new Error("Invalid or expired OTP");
    }

    throw new Error(
      response?.originalError?.message || "OTP verification failed"
    );
  }

  return response.data as OtpResponseTypes;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const response = await apiClient.post("/reset-password/", payload);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Email not registered");
    }

    throw new Error(
      response?.originalError?.message || "Password reset failed"
    );
  }

  return response.data;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const response = await apiClient.post("/token/refresh/", {
    refresh: refreshToken,
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return response.data;
};
