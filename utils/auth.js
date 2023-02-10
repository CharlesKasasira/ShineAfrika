import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import axios from "axios";
import { useRouter } from "next/router";
import Router from "next/router";
import { useCookies } from "react-cookie";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(supabase.auth.session());
  const [user, setUser] = useState(supabase.auth.user());
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  const [welcome, setWelcome] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      const sessionUser = supabase.auth.user();

      if (sessionUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", sessionUser.id)
          .single();

        setUser({
          ...sessionUser,
          ...profile,
        });
      }
    };
    getUserProfile();
    getNotifications();

    const activeSession = supabase.auth.session();
    setSession(activeSession);
    setUser(activeSession?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user);
        getUserProfile();
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  supabase.auth.onAuthStateChange((event, session) => {
    if (event == "SIGNED_OUT") {
      delete_cookie("user");
      removeCookie("user");
    }
  });

  useEffect(() => {
    axios.post("/api/set-supabase-cookie", {
      event: user ? "SIGNED_IN" : "SIGNED_OUT",
      session: supabase.auth.session(),
    });
  }, []);

  const [notifications, setNotifications] = useState([]);
  const getNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      const myNotifications = data.filter(
        (note) => user && note.notifiers.includes(user.id)
      );
      setNotifications(myNotifications);
    }
    if (error) {
    }
  };

  function delete_cookie(name) {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  const values = {
    session,
    setSession,
    user,
    loading,
    setLoading,
    welcome,
    setWelcome,
    notifications,
    setNotifications,
    signOut: () => {
      const { data, error } = supabase.auth.signOut();
      delete_cookie("user");
      removeCookie("user");
      Router.push("/");
    },
    signIn: (data) => {
      supabase.auth.signIn(data);
    },
    signUp: (data) => supabase.auth.signUp(data),
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
