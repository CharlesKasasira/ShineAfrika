import Head from "next/head";
import { supabase } from "../utils/supabase";
import { validationSchema } from "../utils/validation";
import { Formik, Form } from "formik";
import { toast, ToastContainer } from 'react-toastify'
import Router from 'next/router'
import { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import Footer from "../components/Footer";
import { useAuth } from "../utils/auth";
import { getCookies, getCookie, setCookies, removeCookies } from 'cookies-next';

export default function Home({ person }) {
  const [ loading, setLoading ] = useState(false)
  const { setSession } = useAuth()

  console.log(person)


  const handleSubmit = async (event, {email, password}, resetForm) => {
    event.preventDefault();
    setLoading(true)
    try{
      const {user,session, error} = await supabase.auth.signIn({ email: email, password })
      if(user){
        setSession(session)
        setLoading(false)
        resetForm({ email: "", password: "" })
        Router.push('/')
      }
      if(error){
        setLoading(false)
        toast.error(`${error?.message}`, {position: "top-center"})
      }
    }catch(error){
      setLoading(false)
    }

  };

  return (
    <>
      <Head>
        <title>Welcome to Shine Afrika</title>
      </Head>
      <ToastContainer />
      <main className="w-screen h-screen flex justify-center items-center relative pb-6 min-h-screen">
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
            resetForm
          }) => {
            return (
              <Form
                onSubmit={(event) => handleSubmit(event, values, resetForm)}
                className="bg-white mx-5 sm:mx-0 p-6 md:p-10 shadow"
                name="loginForm"
              >
                <h1 className="text-3xl font-bold text-center">Login</h1>
                <div className="flex flex-col gap-2  my-2">
                  <label htmlFor="email">Email</label>
                  <div className="w-full">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="outline outline-1 py-1 px-2 placeholder:text-[#bcbfc2] w-full"
                      placeholder="Enter email"
                      onChange={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                    />
                    <div
                      className={`${
                        errors?.email && touched?.email
                          ? "block"
                          : "hidden"
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
                  <label htmlFor="password">Password</label>
                  <div className="w-full">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="outline outline-1 py-1 px-2 placeholder:text-[#bcbfc2] w-full"
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
                <button type="submit" disabled={!(isValid && dirty)} className="bg-[#1D1F20] text-white py-1 px-3 my-2 mt-4 hover:bg-[#292C2D] flex items-center cursor-pointer">
                {loading && <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
        </svg>}
                  {loading ? "Loading" : "Login"}
                </button>
                <p className="cursor-point">Don&apos;t have an account? <Link href="/register">
                  <span className="underline cursor-pointer">Sign Up</span>
                  </Link></p>
                <p className="cursor-point"><Link href="/forgot-password">
                  <span className="underline cursor-pointer">Forgot Password?</span>
                  </Link></p>
              </Form>
            );
          }}
        </Formik>
        <Footer />
      </main>
    </>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  console.log(req)
  const { user } = await supabase.auth.api.getUserByCookie(req)
  const person = getCookie('person', { req, res});
  if(user){
    return {
      redirect: {
        permanent: false,
        destination: "/"
      },
      props: {},
    }
  }

  return {
    props: { person }
  }
}
