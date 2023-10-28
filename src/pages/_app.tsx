import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { BiconomyProvider } from "@/context/BiconomyContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BiconomyProvider>
      <Component {...pageProps} />
    </BiconomyProvider>
  );
}
