import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { BiconomyProvider } from "@/context/BiconomyContext";
import { MentorProvider } from "@/context/mentorContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BiconomyProvider>
      <MentorProvider>
        <Component {...pageProps} />
      </MentorProvider>
    </BiconomyProvider>
  );
}
