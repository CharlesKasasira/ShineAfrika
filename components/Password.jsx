import { Form, Formik } from "formik";
import { supabase } from "../utils/supabase";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../utils/auth";

function Password() {
  const [loading, setLoading] = useState(false);
  const {user} = useAuth()

  const handleSubmit = async (event, values, resetForm) => {
    event.preventDefault()
    setLoading(true)
    const { new_password, confirm_password} = values
    if(new_password === confirm_password){
      const { user, error } = await supabase.auth.update({password: new_password})

      if(error){
        toast.error(`${error.message}`, {
          position: "top-center",
        });
      }else {
        toast.success(`Successfully changed password`, {
          position: "top-center",
        });
      }

      resetForm({ old_password: "", new_password: "", confirm_password: ""})
    } else {
      resetForm({ old_password: "", new_password: "", confirm_password: ""})
      toast.error(`Password does not match`, {
        position: "top-center",
      });
    }
    setLoading(false)
  }
  return (
    <section className="my-5 flex-grow flex flex-col md:px-8">
      <h1 className="font-bold text-lg border-b-2 p-2">Password</h1>

      <div className="my-4">
        <label htmlFor="">Send Emails using</label>
        <div className="flex flex-col">
          <div className="flex gap-1">
            <input type="radio" name="sendPulse" id="sendPulse" className="cursor-pointer" />
            <label htmlFor="sendPulse">Send Pulse</label>
          </div>
          <div className="flex gap-1">
            <input type="radio" name="zoho" id="zoho" className="cursor-pointer" />
            <label htmlFor="zoho">Zohomail</label>
          </div>
        </div>
      </div>
      <Formik
              initialValues={{ old_password: "",new_password: "", confirm_password: "" }}
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
                    className="my-2 flex-grow pb-5"
                    name="signUpForm"
                  >
                    <div className="flex flex-col gap-2 px-2 md:px-0 md:my-5">
                      <label htmlFor="new_password" className="">
                        New Password
                      </label>
                      <div className="w-full">
                        <input
                          type="password"
                          name="new_password"
                          className="outline outline-1 bg-transparent py-1 placeholder:text-[#bcbfc2] px-2 rounded-sm w-full md:w-10/12"
                          placeholder="Enter password"
                          onChange={handleChange("new_password")}
                          onBlur={handleBlur("new_password")}
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
                    <div className="flex flex-col gap-2 px-2 md:px-0 my-5">
                      <label htmlFor="confirm_password" className="">
                        Confirm Password
                      </label>
                      <div className="w-full">
                        <input
                          type="password"
                          name="confirm_password"
                          className="outline outline-1 bg-transparent py-1 px-2 placeholder:text-[#bcbfc2] rounded-sm w-full md:w-10/12"
                          placeholder="Enter password"
                          onChange={handleChange("confirm_password")}
                          onBlur={handleBlur("confirm_password")}
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
                      className="bg-[#1D1F20] text-white py-2 px-4 my-2 mt-4 hover:bg-transparent hover:text-black outline outline-1 outline-black flex items-center gap-2 mx-2 md:mx-0 rounded-sm"
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
                      {loading ? "Loading" : "Change Password"}
                    </button>
                  </Form>
                );
              }}
            </Formik>
    </section>
  )
}

export default Password