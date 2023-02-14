import React, { useState } from "react";
import Router, { useRouter } from "next/router";
import PackageNav from "../../../../components/PackageNav";
import HelpDeck from "../../../../components/HelpDeck";
import { CKAirtel, CKMtn } from "../../../../components/ck";
import { Formik, Form } from "formik";
import axios from "axios";
import { UG } from "../../../../components/react-flags/index";
import { currencyFormatter } from "../../../../utils/currencyFormatter";
import { parseCookies } from "../../../../utils/parseCookies";
import { supabase } from "../../../../utils/supabase";
import { toast } from "react-toastify";

function Checkout({ account_balance }) {
  const router = useRouter();
  const { id, go, domain } = router.query;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [complete, setComplete] = useState(null);

  const handleSubmit = async (event, values, resetForm) => {
    event.preventDefault();

    const results = await axios
      .post("/api/make-payment", {
        amount: values.amount,
        phone: values.phone,
        secret_code: values.secret_code,
        mobile_money_company_id: paymentMethod,
        reason: "Ablestate Cloud",
        metadata: "Paying for hosting",
      })
      .then(async (res) => {
        setComplete(true);

        const paymentMade = await axios
          .post("/api/buy-domain", {
            domain: domain,
          })
          .then((res) => {
            Router.push(`/packages/${id}/${go}/success`);
          });
      })
      .catch((error) => console.log(error));

    resetForm({
      amount: go,
      phone: "",
      secret_code: "",
    });
  };

  return (
    <div>
      <PackageNav />
      <HelpDeck />
      <main
        className={`pt-[70px] mx-5 md:mx-20 relative pb-6 min-h-screen gap-10 `}
      >
        <h1 className="font-medium text-xl mt-5 mb-5">Payment</h1>
        <div className="">
          <div className="flex gap-5">
            <p>Amount: </p>
            <p className="font-bold">{go}</p>
          </div>
          <div className="flex gap-5">
            <p>Hosting: </p>
            <p className="font-bold">
              {id && id[0].toUpperCase() + id.substring(1)} Hosting
            </p>
          </div>
          <div className="flex gap-5">
            <p>Domain Name: </p>
            <p className="font-bold">{domain}</p>
          </div>
        </div>

        <h3 className="mt-10 text-xl">Payment is easy, just like 1, 2, 3.</h3>

        <section className="mt-5">
          <div className="flex gap-2">
            <div className="bg-black p-1 w-5 h-5 text-white rounded-full text-xs flex justify-center items-center">
              1
            </div>
            <h3>Choose a Payment Method</h3>
          </div>
          <div className="flex flex-wrap gap-5 mt-2 ml-10">
            <span
              className={`bg-[#ca3011] px-2 w-[120px] md:w-[150px] flex justify-around items-center py-1 md:py-2 gap-2 cursor-pointer rounded-sm ${
                paymentMethod === 0 && "outline outline-2 outline-black"
              }`}
              onClick={() => setPaymentMethod(0)}
            >
              {/* <CKMtn /> */}
              <span className="font-bold text-white text-sm">
                <p>Ablestate</p>
                <p>Wallet</p>
              </span>
            </span>
            <span
              className={`bg-[#FFCC00] p-2 w-[150px] flex justify-around items-center gap-2 rounded-sm cursor-pointer ${
                paymentMethod === 1 && "outline outline-2 outline-black"
              }`}
              onClick={() => setPaymentMethod(1)}
            >
              <CKMtn />
              <span className="font-bold">
                <p>MTN</p>
                <p>MoMo</p>
              </span>
            </span>
            <span
              className={`bg-[#FF0000] p-2 text-white w-[150px] flex justify-around cursor-pointer rounded-sm ${
                paymentMethod === 2 && "outline outline-2 outline-black"
              }`}
              onClick={() => setPaymentMethod(2)}
            >
              <CKAirtel />
              <span className="font-medium">
                <p>Airtel</p>
                <p>Money</p>
              </span>
            </span>
          </div>
        </section>

        <section className="mt-2">
          <div className="flex gap-2">
            <div className="bg-black p-1 w-5 h-5 text-white rounded-full text-xs flex justify-center items-center">
              2
            </div>
            <h3>{paymentMethod === 0 ? "Step 2" : "Get Secret Code"}</h3>
          </div>

          <div className="ml-10">
            {paymentMethod === 0 && (
              <>
                <Formik initialValues={{ amount: "" }}>
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
                        onSubmit={async (event) => {
                          // handleRenew(event, values, resetForm)
                          event.preventDefault();

                          if (+go > +account_balance?.account_balance) {
                            toast.error(`Insufficient Account balance`, {
                              position: "top-center",
                            });
                          } else {
                            const paymentMade = await axios
                              .post("/api/buy-domain", {
                                domain: domain,
                              })
                              .then((res) => {
                                Router.push(`/packages/${id}/${go}/success`);
                              });
                          }
                        }}
                        className="mt-5"
                        name="loginForm"
                      >
                        <div className="flex gap-4">
                          <label htmlFor="">Current Balance:</label>
                          <label htmlFor="" className="font-bold">
                            <span className="text-sm">UGX</span>{" "}
                            {currencyFormatter(
                              account_balance?.account_balance
                            )}
                          </label>
                        </div>
                        <div className="select-none">
                          <div className="flex gap-4 my-2">
                            <label htmlFor="amount">Amount To Pay</label>
                            <p>
                              <span className="text-sm">UGX</span>{" "}
                              {currencyFormatter(go)}
                            </p>
                          </div>
                          <div className="">
                            <button
                              type="submit"
                              className="text-white bg-[#121212] px-2 py-1 rounded-sm outline outline-1 outline-black hover:bg-transparent hover:text-black mt-4 w-full mb-2"
                            >
                              Make Payment
                            </button>
                          </div>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </>
            )}
            {paymentMethod === 1 && (
              <>
                <p>MTN MoMo</p>
                <p>
                  Enter your mtn phone number to receive a{" "}
                  <span className="font-bold">*secret code*</span> then press
                  next to continue
                </p>

                <div className="flex flex-col my-2">
                  <label htmlFor="number">MTN phone Number</label>
                  <div className="outline outline-1 flex pl-2 gap-2">
                    <div className="flex gap-1 items-center">
                      <UG />
                      +256
                    </div>
                    <input
                      type="text"
                      name=""
                      id="number"
                      className="outline outline-1 px-2 py-1 bg-transparent flex-grow"
                      placeholder="771234567"
                      onChange={({ target }) => setPhoneNumber(target.value)}
                      value={phoneNumber}
                      required
                    />
                  </div>
                </div>
              </>
            )}
            {paymentMethod === 2 && (
              <>
                <p>Airtel Money</p>
                <p>
                  You will be required to initiate the withdraw from you airtel
                  money to get a{" "}
                  <span className="font-bold">*secret code*</span> then press
                  next to continue
                </p>
              </>
            )}

            {paymentMethod != null && paymentMethod !== 0 && (
              <div className="flex justify-end">
                <button
                  className="text-white bg-[#121212] px-2 py-1"
                  onClick={async () => {
                    if (paymentMethod === 1) {
                      const phoneno =
                        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/;
                      if (phoneNumber.match(phoneno)) {
                        const results = await axios
                          .post("/api/send-token", {
                            phone: `256${phoneNumber}`,
                          })
                          .then((res) => setComplete(true))
                          .catch((error) => console.log(error.message));
                        setComplete(true);
                      }
                    } else {
                      setComplete(true);
                    }
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>

        {[1, 2].includes(paymentMethod) && (
          <Formik initialValues={{ amount: go, phone: "", secret_code: "" }}>
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
                  className="mt-2"
                  name="loginForm"
                >
                  <div className="flex gap-2">
                    <div className="bg-black p-1 w-5 h-5 text-white rounded-full text-xs flex justify-center items-center">
                      3
                    </div>
                    <h3>Complete Payment</h3>
                  </div>

                  {paymentMethod != null && complete != null && (
                    <div className="ml-10">
                      <div className="flex flex-col my-2">
                        <label htmlFor="number">Amount</label>
                        <label htmlFor="number">{go}</label>
                      </div>
                      <div className="flex flex-col my-2">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          className="outline outline-1 px-2 py-1 bg-transparent"
                          placeholder="Enter phone Number"
                          onChange={handleChange("phone")}
                        />
                      </div>
                      <div className="flex flex-col my-2">
                        <label htmlFor="secret_code">Secret Code</label>
                        <input
                          type="text"
                          name="secret_code"
                          id="secret_code"
                          className="outline outline-1 px-2 py-1 bg-transparent"
                          placeholder="Enter secret code"
                          onChange={handleChange("secret_code")}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-[#121212] text-white p-1 px-2 mt-5"
                        >
                          Make Payment
                        </button>
                      </div>
                    </div>
                  )}
                </Form>
              );
            }}
          </Formik>
        )}
      </main>
    </div>
  );
}

export default Checkout;

export const getServerSideProps = async ({ req, res }) => {
  const person = parseCookies(req);
  if (res) {
    if (!person.user || JSON.parse(person?.user).profile.role === "customer") {
      return {
        // redirect: {
        //   permanent: false,
        //   destination: "/login",
        // },
        props: {},
      };
    }
  }

  const { data: account_balance } = await supabase
    .from("accounts")
    .select("account_balance")
    .eq("id", JSON.parse(person.user).user.id)
    .single();

  return {
    props: { account_balance },
  };
};
