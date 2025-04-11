export type RootStackParamList = {
  onboarding2: undefined;
  onboarding3: undefined;
  otp: undefined;
  pickDiet: undefined;
};

export type AuthSliceType = {
  loginResponseType: LoginResponseTypes;
  "reset-token": null | string;
};

export type SignupPayload = {
  email: string;
  password: string;
  role: string;
  dob: string;
  first_name: string;
  last_name: string;
};

export type LoginPayload = {
  email: string | null;
  password: string | null;
};
export type ForgotPasswordPayload = {
  email: string | null;
};

export type OtpPayload = {
  email: string | null;
  otp: number | null;
};

export type ResetPasswordPayload = {
  email: string | null;
  reset_token: string | null;
  new_password: string | null;
};

export type LoginResponseTypes = {
  access: string | null;
  refresh: string | null;
  email: string | null;
  first_name: string | null;
  role: string | null;
  isAuthenticated: boolean;
};

export type OtpResponseTypes = {
  reset_token: string;
  message: string;
};
