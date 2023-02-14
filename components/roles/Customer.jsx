import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import { IoWarning } from "react-icons/io5";
import Footer from "../Footer";
import { HiChevronDown } from "react-icons/hi";
import { motion, AnimateSharedLayout } from "framer-motion";
import { useAuth } from "../../utils/auth";

export default function Customer({ websites, customers, person }) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const [deleteArray, setDeleteArray] = useState([]);
  const [popUp, setPopUp] = useState(false);

  const myWebsites = websites.filter(
    (website) => website.contact_person === JSON.parse(person.user).profile.id
  );

  const [productsContext, setProductsContext] = useState(false);

  if (showMenu) {
    window.onclick = (event) => {
      if (!event.target.matches(".dialog")) {
        setPopUp(false);
        setShowMenu(false);
      }
    };
  }

  const { notifications } = useAuth();

  const [activeIndex, setActiveIndex] = useState(null);

  const addNewOptions = [
    {
      label: "Full Package",
      link: "/packages/Starter/175,000",
    },
    {
      label: "Domain only",
      link: "/packages/domains",
    },
  ];

  return (
    <>
      <Head>
        <title>
          {notifications && notifications.length > 0
            ? `(${notifications.length})`
            : ""}{" "}
          Dashboard - Ablestate Cloud
        </title>
      </Head>
      <ToastContainer />

      <main className="pt-[70px] mx-3 md:mx-16 relative pb-6 min-h-screen">
        <section className="flex justify-between items-center my-10">
          <h1 className="font-bold text-2xl"></h1>
          <div className="relative">
            <button
              className="bg-[#1D1F20] text-white py-2 px-4 my-2 mt-4 hover:bg-transparent hover:text-black outline outline-1 outline-black flex items-center gap-2 "
              onClick={() => {
                setProductsContext(!productsContext);
              }}
            >
              Add New...
              <HiChevronDown size={18} />
            </button>
            {productsContext && (
              <AnimateSharedLayout>
                <motion.ul
                  onHoverEnd={() => setActiveIndex(null)}
                  className="absolute right-0 outline outline-1 outline-gray-200 px-3 py-2 bg-white rounded-md shadow-lg w-40 md:w-52 dialog cursor-pointer"
                  onClick={(event) => {
                    setShowMenu(!showMenu);
                    event.stopPropagation();
                  }}
                >
                  {addNewOptions.map((item, index) => (
                    <motion.li
                      onHoverStart={() => setActiveIndex(index)}
                      key={index}
                      className="rounded-md cursor-pointer flex items-center"
                      onClick={() => {
                        Router.push(`${item.link}`);
                      }}
                    >
                      <a
                        href={item.link}
                        className="relative px-3 py-2 inline-block cursor-pointer z-10 w-full h-full mb-1"
                      >
                        <span>{item.label}</span>
                        {activeIndex === index ? (
                          <motion.div
                            layoutId="cover"
                            className="cover bg-[#eaeaea] absolute -z-10 w-full h-full inset-0 rounded cursor-pointer"
                          ></motion.div>
                        ) : null}
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimateSharedLayout>
            )}
          </div>
        </section>

        <div className="mb-5 py-5 pb-10 px-2 overflow-x-scroll select-none flex flex-wrap gap-2">
          {myWebsites &&
            myWebsites.map((website, index) => (
              <div
                className="outline outline-1 outline-[#e5e7eb] bg-white px-4 py-2 rounded-lg w-64 h-32 cursor-pointer shadow-md hover:shadow-lg flex flex-col justify-between"
                onClick={() => router.push(`/customers/sites/${website.id}`)}
                key={index}
              >
                <div>
                  <h1 className="font-medium">{website.name}</h1>
                  <p className="font-light text-gray-400">
                    {website.website_link}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">expiring</p>
                  <p className="font-light text-gray-400 text-sm">
                    {moment(new Date(website.expiry_date)).format("DD-MM-YYYY")}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {popUp && (
          <div
            className={`bg-black z-20 bg-opacity-40 w-screen min-h-screen fixed top-0 left-0 right-0 flex justify-center items-center`}
          >
            <div className="relative bg-white dark:bg-dark-bg max-h-screen overflow-auto dark:text-secondary-text p-10  rounded-md m-2 sm:mb-5 shadow-md top-50 z-20">
              <h1 className="text-center font-bold text-lg my-5">
                Delete {deleteArray.length} Websites
              </h1>
              <p>
                Are you sure you want to delete{" "}
                <b>{deleteArray.map((site) => site[1] + " ")}</b>?
              </p>
              <p className="bg-[#ffe9d9] p-2 border-l-2 text-[#bc4c2e] border-[#fa703f] flex flex-col text-sm my-1">
                <span className="text-[#771505] font-bold flex items-center gap-1">
                  <IoWarning /> Warning
                </span>
                By deleting these website, you won&apos;t be able to access it
                or it&apos;s info
              </p>
              <div className="flex justify-between mt-5">
                <button
                  className="outline outline-1 outline-[#1D1F20] bg-[#1D1F20] text-white py-2 px-4 hover:bg-[#1D1F20] hover:text-white flex items-center gap-2"
                  onClick={() => setPopUp(false)}
                >
                  No, Cancel
                </button>
                <button
                  className="outline outline-1 outline-[#1D1F20] text-[#1D1F20] py-2 px-4 hover:bg-[#1D1F20] hover:text-white flex items-center gap-2"
                  onClick={bulkDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </main>
    </>
  );
}
