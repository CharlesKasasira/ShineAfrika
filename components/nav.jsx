import { CgMenu } from "react-icons/cg";
import navStyles from "../styles/Nav.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import Router from "next/router";
import { useRouter } from "next/router";
import { useAuth } from "../utils/auth";
import Notifications from "./Notifications";
import { downloadFile } from "../utils/getImages";
import ActiveLink from "./ActiveLink";
import { Transition } from "@tailwindui/react";
import { menuData } from "../utils/menuData";
import { motion, AnimateSharedLayout } from "framer-motion";
import { useCookies } from "react-cookie";
import { parseCookies } from "../utils/parseCookies";
import { BiSearchAlt2 } from "react-icons/bi";
import { useKBar } from "kbar";

export default function Navbar({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notify, setNotify] = useState(false);
  const [avatar, setAvatar] = useState("");
  // const [notifications, setNotifications] = useState([]);
  const router = useRouter();
  const { signOut, loading, setLoading, notifications, setNotifications } =
    useAuth();
  const { query } = useKBar();

  const [cookie] = useCookies(["user"]);
  let role;
  if (cookie?.user?.user) {
    role = cookie?.user?.user.user_metadata.role;
  } else {
    role = "customer";
  }

  useEffect(() => {
    try {
      downloadFile(cookie?.user?.profile.avatar_url.substring(8), "avatars")
        .then((data) => setAvatar(data.avatar_url))
        .catch((error) => console.log(error));
    } catch (error) {}

    getNotifications();
    const navSubscription = supabase
      .from("notifications")
      .on("*", (payload) => {
        setNotifications((current) => [...current, payload.new]);
        getNotifications().catch((error) => console.log(error));
      })
      .subscribe();

    setLoading(false);

    return () => supabase.removeSubscription(navSubscription);
  }, [loading]);

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

  const seenAllNotifications = () => {
    notifications.forEach(async (notification, index) => {
      const list = notification.notifiers.filter((note) => note !== user.id);
      const { data, error } = await supabase
        .from("notifications")
        .update({ notifiers: list })
        .match({ id: notification.id });
    });
    getNotifications();
  };

  if (showMenu || showMobileMenu) {
    window.onclick = (event) => {
      if (!event.target.matches(".dialog")) {
        setShowMenu(false);
        setShowMobileMenu(false);
      }
    };
  }

  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <nav className="w-screen h-[70px] z-10 fixed top-0 right-0 left-0 bg-white py-2 px-3 md:px-16 flex justify-between items-center border-b-2 border-[#E4E6E5] select-none">
      <div className="flex gap-5 items-center justify-between w-[100%]">
        <div className="flex justify-center items-start gap-1">
          <h1
            className="text-[#CA3011] font-Roboto text-3xl font-black cursor-pointer"
            onClick={() => router.push("/")}
          >
            Ablestate Cloud
          </h1>
          {/* <span className="bg-[#CA3011] text-xs font-light text-white rounded px-1">
            beta
          </span> */}
        </div>
        <AnimateSharedLayout>
          <motion.ul
            onHoverEnd={() => setActiveIndex(null)}
            className={`${navStyles.navMenu} h-[70px] items-center`}
          >
            {menuData[`${role}`]?.map((menuItem, index) => (
              <ActiveLink
                name={menuItem.label}
                href={menuItem.link}
                key={index}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                index={index}
              />
            ))}
          </motion.ul>
        </AnimateSharedLayout>
        <div className={navStyles.profileMenu}>
          <span
            className="cursor-pointer relative hover:bg-[#eaeaea] rounded-md p-2"
            onClick={query.toggle}
          >
            <BiSearchAlt2 size={20} />
          </span>
          <span
            className="cursor-pointer relative hover:bg-[#eaeaea] rounded-md p-2"
            onClick={() => {
              setNotify(!notify);
              seenAllNotifications();
            }}
          >
            <Notifications
              notify={notify}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </span>
          <p className="cursor-pointer">
            Hi, {user && user?.user_metadata.first_name}
          </p>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center relative dialog cursor-pointer`}
            onClick={(event) => {
              setShowMenu(!showMenu);
              event.stopPropagation();
            }}
          >
            <span className="w-10 h-10 rounded-full overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="profile" />
              ) : (
                <span className="text-white font-bold flex items-center justify-center bg-[#CA3011] w-10 h-10">
                  {user?.user_metadata.first_name[0].toUpperCase()}
                  {user?.user_metadata.last_name[0].toUpperCase()}
                </span>
              )}
            </span>
            <Transition
              show={showMenu}
              enter="transition ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in-out duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ul className="bg-white absolute z-10 outline outline-1 outline-[#E4E6E5] top-[60px] -right-5 py-2 shadow-lg rounded px-2">
                <div className="flex gap-1 mb-1 border-b-[1px] px-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    {avatar ? (
                      <img src={avatar} alt="profile" />
                    ) : (
                      <span className="text-white font-bold flex items-center justify-center bg-[#CA3011] w-10 h-10">
                        {user?.user_metadata.first_name[0].toUpperCase()}
                        {user?.user_metadata.last_name[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <p className="font-medium">
                      {user?.user_metadata.first_name +
                        " " +
                        user?.user_metadata.last_name}{" "}
                    </p>
                    <p className="text-zinc-500 text-sm mb-1">
                      {cookie?.user && cookie?.user?.user.email}{" "}
                    </p>
                    <p className="uppercase text-zinc-400 font-medium text-sm">
                      Appearance (soon)
                    </p>
                    <select
                      name=""
                      id=""
                      className="bg-transparent outline outline-1 px-2 py-1 mb-1 text-zinc-400 rounded text-sm"
                    >
                      <option value="light">light</option>
                      <option value="dark">dark</option>
                      <option value="system_preferences">
                        System Preferences
                      </option>
                    </select>
                  </div>
                </div>
                <div className="px-2">
                  <Link href="/account">
                    <li className="w-full p-2 px-12 mb-1 hover:bg-[#ececec] rounded">
                      My Account
                    </li>
                  </Link>
                  <li
                    className="w-full p-2 px-12 hover:bg-[#ececec] rounded"
                    onClick={() => {
                      signOut();
                      Router.push("/login");
                    }}
                  >
                    <button>Logout</button>
                  </li>
                </div>
              </ul>
            </Transition>
          </div>
        </div>
      </div>
      <div className={navStyles.mobileMenu}>
        <i
          className="bg-red-500  cursor-pointer relative"
          onClick={(event) => {
            setShowMobileMenu(!showMobileMenu);
            event.stopPropagation();
          }}
        >
          <CgMenu size={25} color={"#CA3011"} />
          {showMobileMenu && (
            <ul className="bg-white absolute z-20 outline outline-1 outline-[#E4E6E5] top-10 -right-4 p-2 w-56">
              <div className="flex flex-col items-center gap-1 mb-1 border-b-[1px] px-2 not-italic">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="profile" />
                  ) : (
                    <span className="text-white font-bold flex items-center justify-center bg-[#CA3011] w-10 h-10">
                      {user?.user_metadata.first_name[0].toUpperCase()}
                      {user?.user_metadata.last_name[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <p className="font-medium text-center">
                    {user?.user_metadata.first_name +
                      " " +
                      user?.user_metadata.last_name}{" "}
                  </p>
                  <p className="text-zinc-500 text-sm mb-1 text-center">
                    {user?.email}{" "}
                  </p>
                  <p className="uppercase text-zinc-400 font-medium text-sm not-italic">
                    Appearance (soon)
                  </p>
                  <select
                    name=""
                    id=""
                    className="bg-transparent outline outline-1 px-2 py-1 mb-1 text-zinc-400 rounded text-sm"
                  >
                    <option value="light">light</option>
                    <option value="dark">dark</option>
                    <option value="system_preferences">
                      System Preferences
                    </option>
                  </select>
                </div>
              </div>
              <p className="not-italic text-xs pl-2 text-gray-400 font-medium bg-gray-50 py-1">
                Go to
              </p>
              {menuData[`${role}`].map((menuItem, index) => (
                <Link href={menuItem.link} className="nn" key={index}>
                  <li className="w-full py-2 pl-2 pr-12 hover:bg-[#f3f5f7] not-italic rounded">
                    {menuItem.label}
                  </li>
                </Link>
              ))}
              <p className="not-italic text-xs pl-2 text-gray-400 font-medium bg-gray-50 py-1">
                Settings
              </p>

              <Link href="/profile">
                <li className="w-full py-2 pl-2 pr-12 hover:bg-[#f3f5f7] not-italic rounded">
                  My Account
                </li>
              </Link>
              <li className="w-full py-2 pl-2 pr-12 hover:bg-[#f3f5f7] not-italic rounded">
                <button
                  onClick={() => {
                    signOut();
                    Router.push("/login");
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </i>
      </div>
    </nav>
  );
}

export const getServerSideProps = async ({ req }) => {
  const person = parseCookies(req);
  if (res) {
    if (!person?.user) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
        props: {},
      };
    }
  }

  return {
    props: {
      person,
    },
  };
};
