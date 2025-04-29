export type RootStackParamList = {
  onboarding2: undefined;
  onboarding3: undefined;
  otp: undefined;
  pickDiet: undefined;
};

export type AuthSliceType = {
  loginResponseType: LoginResponseTypes;
  hasOnboarded: boolean;
  isSigningIn: boolean;
  "reset-token": null | string;
  savedRecipes: number[];
};

export type SignupPayload = {
  email: string;
  password: string;
  role: string;
  dob: string;
  first_name: string;
  last_name: string;
  image_url?: string;
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
  image_url?: string;
  avatar_url?: string;
  customer_details: {
    user: number | null;
    diet_preferences: number[] | [];
    allergies: string[] | [];
    trial_start_date: string | null;
    trial_used: boolean;
    is_pro_user: boolean;
    avatar: string | null;
    subscription_type: string | null;
    subscription_expiry: string | null;
    created_at: string;
    updated_at: string;
    saved_recipes: number[] | [];
  } | null;
};

export type OtpResponseTypes = {
  reset_token: string;
  message: string;
};

export type cookbooks = {
  id: number;
  name: string;
  customer: number;
  customer_email: string;
  recipes: [];
  created_at: string;
  recipe_thumbnails: [];
};

export type AddRecipePayload = {
  cookbookId: number;
  recipeId: number;
};

export type CreateCookbookPayload = {
  name: string;
};

export type CreateCookBookResponse = {
  id: number;
  name: string;
  customer: 13;
  customer_email: string;
  recipes: [];
  created_at: "2025-04-28T10:11:58.301261Z";
  recipe_thumbnails: [];
};

export type UpdateCookbookPayload = {
  id: number;
  name: string;
};
