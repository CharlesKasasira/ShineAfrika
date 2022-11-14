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
import { dropIn } from '../../utils/dropIn'
import { parseCookies } from "../../utils/parseCookies";
import axios from "axios";

export default function Site({ profile }) {
  const router = useRouter();
  const { id } = router.query;
  const [popUp, setPopUp] = useState(false);
  const [popUpdate, setPopUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState({});
  const [countryCode, setCountryCode] = useState("+256");
  const [addedBy, setAddedBy] = useState(null);

  useEffect(() => {
    getAddedBy();
  }, []);


  const getAddedBy = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profile.added_by)
      .single();
    setAddedBy(data);
  };

  const { user } = useAuth();

  const handleDelete = async () => {
    await axios.post("/api/delete-user", {
      userId: profile.id,
      actor: `${user.first_name} ${user.last_name}`,
      username: profile.first_name
    })
    .then(res => {
      toast.success(`Successfully deleted`, { position: "top-center" });
    })
    .catch((error) => {
      toast.error(`${error?.message}`, { position: "top-center" });
    })

    setPopUp(false);
    Router.push("/customers");
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

    // if (data) {
    //   toast.success(`Successfully updated`, { position: "top-center" });
    // }
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
                className="bg-[#1D1F20] text-white py-2 px-4 my-2 mt-4 hover:bg-[#292C2D] flex items-center gap-2"
                onClick={() => setPopUpdate(true)}
              >
                <TbEdit />
                Edit
              </button>
            </section>
            <section className="my-5">
              <p>{profile.role}</p>
              <p>{profile.email}</p>
              <p>{profile.contact_number}</p>
              <br />

              {addedBy && (
                <div className="flex gap-2">
                  <p className="">Added By:</p>
                  <p className="">
                    {addedBy.first_name + " " + addedBy.last_name}
                  </p>
                </div>
              )}
            </section>

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
                        className="relative bg-white dark:bg-dark-bg max-h-screen overflow-auto dark:text-secondary-text p-10 w-10/12 md:8/12  rounded-md m-5 sm:mb-5 shadow-md top-50 z-20"
                      >
                  <div className="flex items-center justify-between">
                    <h1 className="text-center font-bold text-lg my-5">
                      Edit {profile.last_name}&apos;s information
                    </h1>
                    <AiFillCloseCircle
                      size={25}
                      className="cursor-pointer"
                      onClick={() => setPopUpdate(false)}
                    />
                  </div>
                  <hr />

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
                    {({
                      values,
                      errors,
                      touched,
                      isValid,
                      dirty,
                      handleChange,
                      handleBlur,
                      resetForm,
                      setFieldValue,
                    }) => {
                      return (
                        <Form
                          className="my-5"
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
                              className="py-2 px-2 bg-transparent  outline outline-1 outline-[#c1c7d6] rounded w-full"
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
                              className="py-2 px-2 bg-transparent  outline outline-1 outline-[#c1c7d6] rounded w-full"
                              onChange={handleChange("first_name")}
                              onBlur={handleBlur("first_name")}
                              value={values.first_name}
                            />
                          </div>
                          <div className="flex flex-col gap-1 my-2">
                            <label htmlFor="contact_number" className="">
                              Telephone Number
                            </label>
                            <div className="relative outline outline-1 outline-[#c1c7d6] rounded flex">
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
                                onChange={(e) => setCountryCode(e.target.value)}
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
                              className="py-2 px-2 bg-transparent  outline outline-1 outline-[#c1c7d6] rounded w-full"
                              onChange={handleChange("email")}
                              onBlur={handleBlur("email")}
                              value={values.email}
                            />
                          </div>

                          <div className="flex justify-end mt-5">
                            <button
                              type="submit"
                              className="outline outline-1 outline-[#1D1F20] bg-[#1D1F20] text-white py-2 px-4 hover:bg-[#1D1F20] hover:text-white flex items-center gap-2"
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
            {/* <p>
              {product.contact_person}, {`+256` + product.telephone_number}
            </p> */}
            {/* <section className="my-5">
              <h1>Extension</h1>
              <div className="flex gap-5 items-center my-1">
                <input
                  type="date"
                  id="extension"
                  className="py-2 px-2 bg-transparent  outline outline-1 outline-[#121212] rounded w-8/12 md:w-8/12"
                />
                <button
                  className="bg-[#1D1F20] text-white py-2 px-4 hover:bg-[#292C2D] flex items-center gap-2"
                  onClick={handleExtension}
                >
                  Extend
                </button>
              </div>
            </section> */}

            <div className="flex gap-5 items-center my-1">
              <button
                className="outline outline-1 outline-[#1D1F20] text-[#1D1F20] py-2 px-4 hover:bg-[#1D1F20] hover:text-white flex items-center gap-2"
                onClick={() => setPopUp(true)}
              >
                <MdDeleteOutline size={20} /> Delete Customer
              </button>
            </div>
          </>
        )}

<AnimatePresence
     
            >
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
            
             className="relative bg-white dark:bg-dark-bg max-h-screen overflow-auto dark:text-secondary-text p-10  rounded-md m-2 sm:mb-5 shadow-md top-50 z-20">
              <h1 className="text-center font-bold text-lg my-5">
                Delete Customer
              </h1>
              <p>
                Are you sure you want to delete <b>{profile.first_name}</b>?
              </p>
              <p className="bg-[#ffe9d9] p-2 border-l-2 text-[#bc4c2e] border-[#fa703f] flex flex-col text-sm my-1">
                <span className="text-[#771505] font-bold flex items-center gap-1">
                  <IoWarning /> Warning
                </span>
                By deleting this account, you won&apos;t be able to access it or
                it&apos;s info
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
        <footer className="text-center text-gray-500 absolute bottom-1 h-6 w-full">
          <p>
            Copyright &#169; {new Date().getFullYear()} A service of Gagawala
            Graphics Limited
          </p>
        </footer>
      </main>
    </div>
  );
}

export const getServerSideProps = async ({ req, res, params }) => {

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

    const person = parseCookies(req)
    if (res) {
      if (!person.user || JSON.parse(person?.user).profile.role === "customer") {
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
    props: { profile },
  };
};
