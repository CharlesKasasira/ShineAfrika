import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "../utils/auth";
import Layout from "../components/Layout";
import CommandBar from "../components/CommandBar";
import React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import NProgress from "nprogress";
import "../styles/Progress.css";
import { CookiesProvider } from "react-cookie";


function MyApp({ Component, pageProps, ...appProps }) {
  const isLayoutNeeded = [
    "/login",
    "/register",
    "/forgot-password",
    "/packages/[id]/[go]",
    "/404",
    "/500",
    "/update-password"
  ].includes(appProps.router.pathname);

  const LayoutComponent = isLayoutNeeded ? React.Fragment : Layout;

  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return (
    <AuthProvider>
      <CommandBar>
      <CookiesProvider>
        <LayoutComponent>
          <Component {...pageProps} />
        </LayoutComponent>
      </CookiesProvider>
      </CommandBar>
    </AuthProvider>
  );
}

export default MyApp;
