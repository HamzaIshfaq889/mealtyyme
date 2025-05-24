import apiClient from "@/lib/apiClient";

type contactSupportProps = { subject: string; email: string; message: string };

export const contactSupport = async ({
  email,
  message,
  subject,
}: contactSupportProps) => {
  console.log("aaaa",email);
  const response = await apiClient.post("support/", {
    email,
    message,
    subject,
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error(
        "Something went wrong while sending data to the support."
      );
    }

    throw new Error(
      response?.originalError?.message ||
        "Something went wrong while sending ingredients."
    );
  }

  return response.data;
};
