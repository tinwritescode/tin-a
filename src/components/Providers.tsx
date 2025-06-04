"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TRPCReactProvider } from "../trpc/react";
import { SessionProvider } from "next-auth/react";
import { Header } from "./Header";
import { Footer } from "./Footer";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCReactProvider>
        <SessionProvider>
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </SessionProvider>
      </TRPCReactProvider>
    </QueryClientProvider>
  );
}
