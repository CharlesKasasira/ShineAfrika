import React, { useState } from "react";
import Router, { useRouter } from "next/router";
import PackageNav from "../../../../components/PackageNav";
import { FaSearch } from "react-icons/fa";
import Starter from "../../../../components/Starter";
import HelpDeck from "../../../../components/HelpDeck";
import { useAuth } from "../../../../utils/auth";
import Link from "next/link";
import { supabase } from "../../../../utils/supabase";
import { Formik, Form } from "formik";
import { validationSchema } from "../../../../utils/validation";
import Footer from "../../../../components/Footer";
import { CKLoader } from "../../../../components/ck";
import Head from "next/head";

function LoginFirst() {
  const router = useRouter();
  const { id, go, domain } = router.query;

  const packages = ["starter", "scaler", "stablizer"].filter(
    (pack) => pack !== id?.toLowerCase()
  );

  const [searched, setSearched] = useState(null);
  const [loading, setLoading] = useState(false);
  const [run, setRun] = useState(false);

  const handleSubmit = async (event, { email, password }, resetForm) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { user, session, error } = await supabase.auth.signIn({
        email: email,
        password,
      });
      if (user) {
        setLoading(false);
        if (domain) {
          Router.push(`/packages/${id}/${go}/checkout/?domain=${domain}`);
        } else {
          Router.push(`/packages/${id}/${go}/`);
        }
      }
      if (error) {
        setLoading(false);
        toast.error(`${error?.message}`, { position: "top-center" });
      }
    } catch (error) {
      setLoading(false);
    }

    document.loginForm.reset();
    resetForm({ email: "", password: "" });
  };

  const [cart, setCart] = useState([]);

  return (
    <div>
      <Head>
        <title>Login - Ablestate Cloud</title>
      </Head>
      <PackageNav />
      <HelpDeck />
      <main
        className={`pt-[70px] mx-5 md:mx-20 relative pb-6 min-h-screen gap-10 `}
      >
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
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
                className="mx-5 sm:mx-0 p-6 md:p-10"
                name="loginForm"
              >
                <div className="flex justify-between items-center">
                  <h1 className="font-medium text-xl mt-5">Login</h1>
                  <a
                    href={`/packages/${id}/${go}/create-account/?domain=${domain}`}
                    className="underline"
                  >
                    or create account
                  </a>
                </div>
                <div className="flex flex-col gap-2  my-2">
                  <label htmlFor="email">Email</label>
                  <div className="w-full">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="outline outline-1 py-1 px-2 placeholder:text-[#bcbfc2] w-full bg-transparent"
                      placeholder="Enter email"
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
                  <label htmlFor="password">Password</label>
                  <div className="w-full">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="outline outline-1 py-1 px-2 placeholder:text-[#bcbfc2] w-full bg-transparent"
                      placeholder="Enter password"
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
                  className="bg-[#1D1F20] text-white py-1 px-3 my-2 mt-4 hover:bg-[#292C2D] flex items-center cursor-pointer"
                >
                  {loading && CKLoader}
                  {loading ? "Loading" : "Login"}
                </button>
              </Form>
            );
          }}
        </Formik>
        <Footer />
      </main>
    </div>
  );
}

export default LoginFirst;
