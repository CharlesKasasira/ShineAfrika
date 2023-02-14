import React, { useState } from "react";
import Router, { useRouter } from "next/router";
import PackageNav from "../../../../components/PackageNav";
import HelpDeck from "../../../../components/HelpDeck";
import { useAuth } from "../../../../utils/auth";
import Link from "next/link";
import { registerValidationSchema } from "../../../../utils/validation";
import { Formik, Form } from "formik";
import { Footer } from "../../../../components";
import Head from "next/head";
import { toast, ToastContainer } from "react-toastify";

function CreateAccountFirst() {
  const router = useRouter();
  const { id, go, domain } = router.query;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event,
    { email, password, first_name, last_name, role },
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
    <div>
      <Head>
        <title>Register - Ablestate Cloud</title>
      </Head>
      <PackageNav />
      <ToastContainer />
      <HelpDeck />
      <main
        className={`pt-[70px] mx-5 md:mx-20 relative pb-6 min-h-screen gap-10 `}
      >
        <section>
          <div className="flex justify-between items-center">
            <h1 className="font-medium text-xl mt-5">Create Account</h1>
            <a
              href={`/packages/${id}/${go}/login/?domain=${domain}`}
              className="underline"
            >
              or login
            </a>
          </div>

          <Formik
            initialValues={{
              password: "",
              first_name: "",
              last_name: "",
              role: "customer",
              email: "",
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
                  className=""
                  name="signUpForm"
                >
                  <div className="flex flex-col gap-2  my-2">
                    <label htmlFor="email">Email</label>
                    <div className="w-full">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="outline outline-1 py-1 px-2 placeholder:text-[#bcbfc2] w-full bg-transparent"
                        placeholder="enter email"
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
                          errors?.email && touched?.email
                            ? errors.email
                            : "hide"
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
                        className="outline outline-1 py-1 px-2 placeholder:text-[#bcbfc2] w-full bg-transparent"
                        placeholder="enter first name"
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
                        className="outline outline-1 py-1 px-2 placeholder:text-[#bcbfc2] w-full bg-transparent"
                        placeholder="enter last name"
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
                    <label htmlFor="password">Password</label>
                    <div className="w-full">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        className="outline outline-1 py-1 px-2 placeholder:text-[#bcbfc2] w-full bg-transparent"
                        placeholder="enter password"
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
                  <div>
                    <button
                      type="submit"
                      className="text-white bg-black px-2 py-1 mt-3"
                    >
                      Create Account
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </section>
        <Footer />
      </main>
    </div>
  );
}

export default CreateAccountFirst;
