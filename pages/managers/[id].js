import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabase";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoWarning } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import Router from "next/router";
import { Formik, Form } from "formik";
import { AiFillCloseCircle } from "react-icons/ai";
import { useAuth } from "../../utils/auth";
import { TbEdit } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { dropIn } from "../../utils/dropIn";
import { parseCookies } from "../../utils/parseCookies";
import axios from "axios";
import moment from "moment/moment";
import Image from "next/image";

export default function Site({ profile, manager, websites }) {
  const router = useRouter();
  const { id } = router.query;
  const [popUp, setPopUp] = useState(false);
  const [popUpdate, setPopUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+256");

  useEffect(() => {}, []);

  const { user } = useAuth();

  const handleDelete = async () => {
    await axios
      .post("/api/delete-user", {
        userId: profile.id,
        actor: `${user.first_name} ${user.last_name}`,
        username: profile.first_name,
      })
      .then((res) => {
        toast.success(`Successfully deleted`, { position: "top-center" });
      })
      .catch((error) => {
        toast.error(`${error?.message}`, { position: "top-center" });
      });

    setPopUp(false);
    Router.push("/managers");
  };

  const handleUpdate = async (event, values) => {
    event.preventDefault();
    setLoading(true);

    const { first_name, last_name, email, contact_number } = values;

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: first_name,
        last_name: last_name,
        email: email,
        contact_number: countryCode + contact_number,
      })
      .eq("id", id);

    if (error) {
      toast.error(`${error?.message}`, { position: "top-center" });
    }

    setLoading(false);

    setPopUpdate(false);
  };

  return (
    <div>
      <Head>
        <title>
          {profile ? profile.first_name : "loading..."} - Shine Africa
        </title>
      </Head>

      <ToastContainer />

      <main className="pt-[70px] mx-5 md:mx-20 relative pb-6 min-h-screen">
        {profile && (
          <>
            <section className="flex justify-between items-center">
              <h1 className="font-bold text-2xl">
                {profile.first_name + " " + profile.last_name}
              </h1>
              <button
                className="bg-[#1D1F20] text-white py-2 px-4 my-5 hover:bg-[#292C2D] flex items-center gap-2"
                onClick={() => setPopUpdate(true)}
              >
                <TbEdit />
                Edit
              </button>
            </section>

            <section className="">
              <p>{profile.role}</p>
              <p>{profile.email}</p>
              <p>
                {profile.contact_number === "+256null"
                  ? "N/A"
                  : profile.contact_number}
              </p>
              <br />

              {manager && (
                <div className="flex gap-2">
                  <p className="">Added By:</p>
                  <p className="">
                    {manager.first_name + " " + manager.last_name}
                  </p>
                </div>
              )}
            </section>
            {websites && websites.length > 0 && <h1>Products</h1>}

            <div className="mb-5 py-5 pb-10 px-2 overflow-x-scroll select-none flex flex-wrap gap-2">
              {websites &&
                websites.map((website, index) => (
                  <div
                    className="outline outline-1 outline-[#e5e7eb] bg-white px-4 py-2 rounded-md w-72 h-36 cursor-pointer shadow-md hover:shadow-lg flex flex-col justify-between"
                    key={index}
                  >
                    <div className="flex gap-2 items-center">
                      <div className="w-[25px] h-[25px] overflow-hidden flex justify-center items-center">
                        <Image
                          // loader={myLoader}
                          src={`https://www.google.com/s2/favicons?sz=64&domain_url=${website.website_link}`}
                          alt={`${website.name[0].toUpperCase()}`}
                          width={25}
                          height={25}
                        />
                      </div>
                      <div>
                        <h1 className="font-medium text-sm">{website.name}</h1>
                        <p className="font-light text-sm text-gray-400">
                          {website.website_link}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm">expiring</p>
                      <p className="font-light text-gray-400 text-sm">
                        {moment(new Date(website.expiry_date)).format(
                          "DD-MM-YYYY"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/*something here*/}
            <AnimatePresence>
              {popUpdate && profile && (
                <div
                  className={`bg-black z-20 bg-opacity-40 w-screen min-h-screen fixed top-0 left-0 right-0 flex justify-center`}
                >
                  <motion.div
                    onClick={(e) => e.stopPropagation()}
                    variants={dropIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="relative bg-white dark:bg-dark-bg max-h-screen overflow-auto md:p-10 w-11/12 md:8/12  rounded-sm m-5 sm:mb-5 shadow-md top-50 z-20"
                  >
                    <div className="flex items-center justify-between border-b-[1px] px-4">
                      <h1 className="text-center font-bold text-lg my-5">
                        Edit {profile.last_name}&apos;s information
                      </h1>
                      <AiFillCloseCircle
                        size={22}
                        className="cursor-pointer"
                        onClick={() => setPopUpdate(false)}
                      />
                    </div>

                    <Formik
                      initialValues={{
                        last_name: profile.last_name,
                        first_name: profile.first_name,
                        contact_number:
                          profile.contact_number &&
                          profile.contact_number.slice(4, 13),
                        email: profile.email,
                      }}
                    >
                      {({ values, handleChange, handleBlur, resetForm }) => {
                        return (
                          <Form
                            className="my-5 px-4"
                            onSubmit={(event) => handleUpdate(event, values)}
                          >
                            <div className="flex flex-col gap-1 my-2">
                              <label htmlFor="last_name" className="">
                                Last Name
                              </label>
                              <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                placeholder="Enter Last Name"
                                className="py-2 px-2 bg-transparent  outline outline-1 outline-[#c1c7d6] rounded-sm w-full"
                                onChange={handleChange("last_name")}
                                onBlur={handleBlur("last_name")}
                                value={values.last_name}
                              />
                            </div>
                            <div className="flex flex-col gap-1 my-2">
                              <label htmlFor="first-name" className="">
                                First Name
                              </label>
                              <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                placeholder="first_name"
                                className="py-2 px-2 bg-transparent  outline outline-1 outline-[#c1c7d6] rounded-sm w-full"
                                onChange={handleChange("first_name")}
                                onBlur={handleBlur("first_name")}
                                value={values.first_name}
                              />
                            </div>
                            <div className="flex flex-col gap-1 my-2">
                              <label htmlFor="contact_number" className="">
                                Telephone Number
                              </label>
                              <div className="relative outline outline-1 outline-[#c1c7d6] rounded-sm flex">
                                <input
                                  type="tel"
                                  id="telephone_number"
                                  name="telephone_number"
                                  placeholder="Telephone number"
                                  className=" py-2 px-2 ml-16 bg-transparent flex-grow focus:outline-none"
                                  onChange={handleChange("contact_number")}
                                  onBlur={handleBlur("contact_number")}
                                  value={values.contact_number}
                                />
                                <select
                                  name=""
                                  id=""
                                  className="bg-transparent absolute left-0 h-full w-16 border-r-2"
                                  onChange={(e) =>
                                    setCountryCode(e.target.value)
                                  }
                                >
                                  <option value="+256">+256</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 my-2">
                              <label htmlFor="email" className="">
                                Email
                              </label>
                              <input
                                type="text"
                                name="email"
                                id="email"
                                placeholder="email"
                                className="py-2 px-2 bg-transparent  outline outline-1 outline-[#c1c7d6] rounded-sm w-full"
                                onChange={handleChange("email")}
                                onBlur={handleBlur("email")}
                                value={values.email}
                              />
                            </div>

                            <div className="flex justify-end mt-5">
                              <button
                                type="submit"
                                className="outline outline-1 outline-[#1D1F20] bg-[#1D1F20] text-white py-2 px-4 hover:bg-[#1D1F20] hover:text-white flex items-center rounded-sm w-full justify-center gap-2"
                              >
                                {loading && (
                                  <svg
                                    className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                )}
                                {!loading && <TbEdit />}
                                {loading ? "Loading" : "Update"}
                              </button>
                            </div>
                          </Form>
                        );
                      }}
                    </Formik>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <div className="flex gap-5 items-center my-5">
              <button
                className="outline outline-1 outline-[#1D1F20] text-[#1D1F20] py-2 px-4 hover:bg-[#1D1F20] hover:text-white flex items-center gap-2 rounded-sm"
                onClick={() => setPopUp(true)}
              >
                <MdDeleteOutline size={20} /> Delete Manager
              </button>
            </div>
          </>
        )}

        <AnimatePresence>
          {popUp && (
            <div
              className={`bg-black z-20 bg-opacity-40 w-screen min-h-screen fixed top-0 left-0 right-0 flex justify-center items-center`}
            >
              {/* actual modal */}

              <motion.div
                onClick={(e) => e.stopPropagation()}
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-white dark:bg-dark-bg max-h-screen overflow-auto dark:text-secondary-text py-2 px-4 md:p-10  rounded-sm m-2 sm:mb-5 shadow-md top-50 z-20"
              >
                <h1 className="text-center font-bold text-lg my-5">
                  Delete Customer
                </h1>
                <p>
                  Are you sure you want to delete{" "}
                  <b>{profile.first_name + " " + profile.last_name}</b>?
                </p>
                {websites && websites.length > 0 && (
                  <>
                    <h2 className="mt-2 text-sm font-medium">
                      Products under{" "}
                      {profile.first_name + " " + profile.last_name}
                    </h2>
                    <div className="p-2 bg-neutral-100 flex flex-wrap gap-1">
                      {websites &&
                        websites.map((website, index) => (
                          <div
                            className="outline outline-1 outline-[#e5e7eb] bg-white px-4 py-2 rounded-md cursor-pointer flex flex-col justify-between"
                            key={index}
                          >
                            <div className="flex gap-2 items-center">
                              <div className="w-[25px] h-[25px] overflow-hidden flex justify-center items-center outline outline-1 rounded-full">
                                <Image
                                  // loader={myLoader}
                                  src={`https://www.google.com/s2/favicons?sz=64&domain_url=${website.website_link}`}
                                  alt={`${website.name[0].toUpperCase()}`}
                                  className="flex justify-center items-center"
                                  width={25}
                                  height={25}
                                />
                              </div>
                              <div>
                                <h1 className="font-medium text-sm">
                                  {website.name}
                                </h1>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                )}
                <p className="bg-[#ffe9d9] p-2 border-l-2 text-[#bc4c2e] border-[#fa703f] flex flex-col text-sm my-1">
                  <span className="text-[#771505] font-bold flex items-center gap-1">
                    <IoWarning /> Warning
                  </span>
                  By deleting this account, you won&apos;t be able to access it
                  or it&apos;s info
                </p>
                <div className="flex justify-between mt-5">
                  <button
                    className="outline outline-1 outline-[#1D1F20] bg-[#1D1F20] text-white py-2 px-4 hover:bg-[#1D1F20] hover:text-white flex items-center gap-2 rounded-sm"
                    onClick={() => setPopUp(false)}
                  >
                    No, Cancel
                  </button>
                  <button
                    className="outline outline-1 outline-[#1D1F20] text-[#1D1F20] py-2 px-4 hover:bg-[#1D1F20] hover:text-white flex items-center gap-2 rounded-sm"
                    onClick={handleDelete}
                  >
                    Yes, Delete
                  </button>
                </div>
              </motion.div>
              {/* actual modal */}
            </div>
          )}
        </AnimatePresence>
        <footer className="text-center text-gray-500 absolute bottom-1 h-6 w-full text-sm">
          <p>
            Copyright &#169; {new Date().getFullYear()} A service of Ablestate
            Creatives Limited
          </p>
        </footer>
      </main>
    </div>
  );
}

export const getServerSideProps = async ({ req, res, params }) => {
  let manager;
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (profile?.added_by) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profile.added_by)
      .single();

    manager = data;
  } else {
    manager = null;
  }

  const { data: websites } = await supabase
    .from("websites")
    .select("*")
    .eq("contact_person", params.id);

  const person = parseCookies(req);
  if (res) {
    if (
      !person.user ||
      JSON.parse(person?.user).user.user_metadata.role === "customer"
    ) {
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
    props: { profile, manager, websites },
  };
};
