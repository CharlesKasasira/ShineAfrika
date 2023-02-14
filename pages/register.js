import Head from "next/head";
import { supabase } from "../utils/supabase";
import { registerValidationSchema } from "../utils/validation";
import { Formik, Form } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import Router from "next/router";
import Link from "next/link";
import { Footer } from "../components";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event,
    { email, password, first_name, last_name, role, contact_number },
    resetForm
  ) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { user, session, error } = await supabase.auth.signUp(
        { email, password },
        {
          data: {
            first_name,
            last_name,
            role,
            contact_number: "",
          },
        }
      );
      if (user) {
        toast.success(`A confirmation mail has been sent`, {
          position: "top-center",
        });
        setTimeout(() => {
          Router.push("/login");
        }, 1000);
      }
      if (error) {
        toast.error(`${error?.message}`, { position: "top-center" });
      }
    } catch (error) {}

    setLoading(false);
    resetForm({
      password: "",
      first_name: "",
      last_name: "",
      role: "customer",
      email: "",
    });
  };

  return (
    <>
      <Head>
        <title>Register - Ablestate</title>
      </Head>
      <ToastContainer />
      <div className="w-screen h-screen flex justify-center items-center relative pb-6 min-h-screen">
        <Formik
          initialValues={{
            password: "",
            first_name: "",
            last_name: "",
            role: "customer",
            email: "",
            contact_number: "",
          }}
          validationSchema={registerValidationSchema}
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
          }) => {
            return (
              <Form
                onSubmit={(event) => handleSubmit(event, values, resetForm)}
                className="bg-white p-10 shadow"
                name="signUpForm"
              >
                <h1 className="text-3xl font-bold text-center">
                  Create an account
                </h1>
                <div className="flex flex-col gap-2  my-2">
                  <label htmlFor="email">Email</label>
                  <div className="w-full">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="outline outline-1 py-1 px-2 placeholder:text-[#bcbfc2] w-full rounded-sm"
                      placeholder="Enter Email"
                      onChange={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                    />
                    <div
                      className={`${
                        errors?.email && touched?.email ? "block" : "hidden"
                      }`}
                    >
                      <label
                        className={`${
                          errors?.email && touched?.email
                            ? "text-red-500 text-xs"
                            : "text-transparent text-xs"
                        }`}
                      >{`${
                        errors?.email && touched?.email ? errors.email : "hide"
                      }`}</label>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2  my-2">
                  <label htmlFor="first_name">First Name</label>
                  <div className="w-full">
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      className="outline outline-1 py-1 px-2 placeholder:text-[#bcbfc2] w-full rounded-sm"
                      placeholder="Enter First name"
                      onChange={handleChange("first_name")}
                      onBlur={handleBlur("first_name")}
                      value={values.first_name}
                    />
                    <div
                      className={`${
                        errors?.first_name && touched?.first_name
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      <label
                        className={`${
                          errors?.first_name && touched?.first_name
                            ? "text-red-500 text-xs"
                            : "text-transparent text-xs"
                        }`}
                      >{`${
                        errors?.first_name && touched?.first_name
                          ? errors.first_name
                          : "hide"
                      }`}</label>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2  my-2">
                  <label htmlFor="last_name">Last Name</label>
                  <div className="w-full">
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      className="outline outline-1 py-1 px-2 placeholder:text-[#bcbfc2] w-full rounded-sm"
                      placeholder="Enter Last name"
                      onChange={handleChange("last_name")}
                      onBlur={handleBlur("last_name")}
                      value={values.last_name}
                    />
                    <div
                      className={`${
                        errors?.last_name && touched?.last_name
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      <label
                        className={`${
                          errors?.last_name && touched?.last_name
                            ? "text-red-500 text-xs"
                            : "text-transparent text-xs"
                        }`}
                      >{`${
                        errors?.last_name && touched?.last_name
                          ? errors.last_name
                          : "hide"
                      }`}</label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2  my-2">
                  <label htmlFor="telephone_number">Telephone</label>
                  <div
                    className="relative flex
                  outline outline-1 placeholder:text-[#bcbfc2] w-full rounded-sm"
                  >
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

                <div className="flex flex-col gap-2  my-2">
                  <label htmlFor="password">Password</label>
                  <div className="w-full">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="outline outline-1 py-1 px-2 placeholder:text-[#bcbfc2] w-full rounded-sm"
                      placeholder="Enter Password"
                      onChange={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                    />
                    <div
                      className={`${
                        errors?.password && touched?.password
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      <label
                        className={`${
                          errors?.password && touched?.password
                            ? "text-red-500 text-xs"
                            : "text-transparent text-xs"
                        }`}
                      >{`${
                        errors?.password && touched?.password
                          ? errors.password
                          : "hide"
                      }`}</label>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!(isValid && dirty)}
                  className="bg-[#1D1F20] text-white py-1 px-3 my-2 mt-4 hover:bg-[#292C2D] flex items-center cursor-pointer w-full justify-center rounded-sm"
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
                  {loading ? "Loading" : "Register"}
                </button>
                <p className="cursor-point">
                  Already have an account?{" "}
                  <Link href="/login">
                    <span className="underline cursor-pointer font-medium">
                      Login
                    </span>
                  </Link>
                </p>
              </Form>
            );
          }}
        </Formik>
        <Footer />
      </div>
    </>
  );
}
