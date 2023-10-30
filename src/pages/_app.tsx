import "@/styles/globals.css";
import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { BiconomyProvider } from "@/context/BiconomyContext";
import { useHuddle01 } from "@huddle01/react";

export default function App({ Component, pageProps }: AppProps) {
  const { initialize } = useHuddle01();

  useEffect(() => {
    // its preferable to use env vars to store projectId
    initialize(process.env.NEXT_PUBLIC_HUDDLE01_PROJECT_ID as string);
  }, []);

  return (
    <BiconomyProvider>
      <Component {...pageProps} />
    </BiconomyProvider>
  );
}
