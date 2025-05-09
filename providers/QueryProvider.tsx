import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";

const queryClient = new QueryClient();

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
