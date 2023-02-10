import Head from "next/head";
import { supabase } from "../utils/supabase";
import { updatePasswordSchema } from "../utils/validation";
import { Formik, Form } from "formik";
import Router from "next/router";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Footer from "../components/Footer";
import { parseCookies } from "../utils/parseCookies";
import { toast, ToastContainer } from "react-toastify";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event,
    { password, confirm_password },
    resetForm
  ) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (password === confirm_password) {
        const { data, error } = await supabase.auth.update({
          password: password,
        });
        if (data) {
          setLoading(false);
          toast.success(`Successfully updated password`, {
            position: "top-center",
          });
          setTimeout(() => {
            Router.push("/login");
          }, 1500);
        }
        if (error) {
          setLoading(false);
          toast.error(`${error?.message}`, { position: "top-center" });
        }
      } else {
        toast.error(`Password didnot match`, { position: "top-center" });
      }
    } catch (error) {
      setLoading(false);
    }

    document.resetForm.reset();
    resetForm({ password: "", confirm_password: "" });
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Password Reset - Ablestate Cloud</title>
      </Head>
      <ToastContainer />
      <main className="w-screen h-screen flex justify-center items-center relative pb-6 min-h-screen">
        <Formik
          initialValues={{ password: "", confirm_password: "" }}
          validationSchema={updatePasswordSchema}
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
                className="bg-white mx-5 sm:mx-0 p-6 md:p-10 shadow"
                name="resetForm"
              >
                <h1 className="text-3xl font-bold text-center">
                  Update Password
                </h1>

                <div className="flex flex-col gap-2 my-2">
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
                <div className="flex flex-col gap-2 my-2">
                  <label htmlFor="confirm_password">Confirm Password</label>
                  <div className="w-full">
                    <input
                      type="password"
                      name="confirm_password"
                      id="confirm_password"
                      className="outline outline-1 py-1 px-2 placeholder:text-[#bcbfc2] w-full rounded-sm"
                      placeholder="Confirm Password"
                      onChange={handleChange("confirm_password")}
                      onBlur={handleBlur("confirm_password")}
                      value={values.confirm_password}
                    />
                    <div
                      className={`${
                        errors?.confirm_password && touched?.confirm_password
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      <label
                        className={`${
                          errors?.confirm_password && touched?.confirm_password
                            ? "text-red-500 text-xs"
                            : "text-transparent text-xs"
                        }`}
                      >{`${
                        errors?.confirm_password && touched?.confirm_password
                          ? errors.confirm_password
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
                  {loading ? "Loading" : "Submit"}
                </button>
                <p className="cursor-point">
                  Remember password?{" "}
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
      </main>
    </>
  );
}

export const getServerSideProps = async ({ req }) => {
  const userData = parseCookies(req);

  if (userData?.user) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};
