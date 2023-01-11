import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabase";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoWarning } from "react-icons/io5";
import { toast } from "react-toastify";
import Router from "next/router";
import { useAuth } from "../../utils/auth";
import { TbEdit } from "react-icons/tb";
import { RiExternalLinkFill } from "react-icons/ri";
import moment from "moment";
import { motion } from "framer-motion";
import { dropIn } from "../../utils/dropIn";
import { parseCookies } from "../../utils/parseCookies";
import UpdateModal from "../../components/managers/updateModal";
import RenewModal from "../../components/managers/renewModal";
import axios from "axios";

export default function Site({
  product,
  contactPerson,
  customers,
  account_balance,
}) {
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [complete, setComplete] = useState(null);

  const router = useRouter();
  const { id } = router.query;
  const [popUp, setPopUp] = useState(false);
  const [popRenew, setPopRenew] = useState(false);
  const [popUpdate, setPopUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newCustomer, setNewCustomer] = useState(null);
  const [countryCode, setCountryCode] = useState("+256");
  const [renewPeriod, setRenewPeriod] = useState(1);

  const { user } = useAuth();

  const handleRenew = async (event, values, resetForm) => {
    event.preventDefault();
    const { amount } = values;

    if (+amount > +account_balance.account_balance) {
      toast.error(`Insufficient Account balance`, { position: "top-center" });
    } else {
      const date = new Date(product.expiry_date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const extendedDate = new Date(year, month, day);

      const { data, error } = await supabase
        .from("websites")
        .update({
          last_paid:
            new Date().getFullYear() +
            "-" +
            new Date().getMonth() +
            "-" +
            new Date().getDate(),
          expiry_date:
            extendedDate.getFullYear() +
            1 +
            "-" +
            extendedDate.getMonth() +
            "-" +
            extendedDate.getDate(),
          status: "active",
        })
        .match({ id: id });

      if (data) {
        toast.success(`Successfully Renewed`, { position: "top-center" });

        await axios.post("/api/extendedProduct", {
          email: product.email || contactPerson.email,
          product: "website",
          product_owner: `${contactPerson.first_name} ${contactPerson.last_name}`,
          product_link: product.name,
          telephone_number: product.telephone_number,
        });

        const { data, error } = await supabase
          .from("accounts")
          .update({
            account_balance: +account_balance.account_balance - +amount,
          })
          .eq("id", user.id);

        if (data) {
          const { data: transaction, error } = await supabase
            .from("transactions")
            .insert([
              {
                transaction_type: "payment",
                status: "successful",
                amount: amount,
                actor_id: user.id,
                description: "",
              },
            ]);
        }
        // send email and sms to managers
      }
      if (error) {
        toast.error(`${error?.message}`, { position: "top-center" });
      }

      resetForm({
        amount: "",
      });
    }
    setPopRenew(false);
  };

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("websites")
      .delete()
      .match({ id: id });

    setPopUp(false);

    Router.push("/");

    if (data) {
      toast.success(`Successfully deleted`, { position: "top-center" });
      await supabase.from("logs").insert([
        {
          name: `[Deleted] ${product.name}`,
          details: `deleted by ${user.first_name} ${user.last_name}`,
          status: "success",
        },
      ]);
    }
    if (error) {
      toast.error(`${error?.message}`, { position: "top-center" });
    }
  };

  const handleExtension = async () => {
    if (document.getElementById("extension").value !== "") {
      const { data, error } = await supabase
        .from("websites")
        .update({
          last_paid: new Date(document.getElementById("extension").value),
          expiry_date: new Date(document.getElementById("extension").value),
          status: "active",
        })
        .match({ id: id });

      if (data) {
        toast.success(`Successfully extended`, { position: "top-center" });
        await axios.post("/api/extendedProduct", {
          email: product.email || contactPerson.email,
          product: "website",
          product_owner: `${contactPerson.first_name} ${contactPerson.last_name}`,
          product_link: product.name,
          telephone_number: product.telephone_number,
        });
      }
      if (error) {
        toast.error(`${error?.message}`, { position: "top-center" });
      }
    }
  };

  const handleUpdate = async (event, values) => {
    event.preventDefault();
    setLoading(true);

    const {
      name,
      website_link,
      contact_person,
      telephone_number,
      product_price,
      product_type,
    } = values;

    const { data, error } = await supabase
      .from("websites")
      .update({
        name: name,
        website_link: website_link,
        contact_person: contact_person,
        product_price: product_price,
        product_type: product_type,
        telephone_number: countryCode + telephone_number,
      })
      .match({ id: id });

    if (data) {
      toast.success(`Successfully updated`, { position: "top-center" });
    }
    if (error) {
      toast.error(`${error?.message}`, { position: "top-center" });
    }

    setLoading(false);

    setPopUpdate(false);
  };

  return (
    <div>
      <Head>
        <title>{product ? product.name : "loading..."} - Ablestate Cloud</title>
      </Head>

      <main className="pt-[70px] mx-5 md:mx-20 relative pb-6 min-h-screen">
        {product && (
          <>
            <section className="flex justify-between items-center">
              <h1 className="font-bold text-2xl my-5">{product.name}</h1>
              <button
                className="bg-[#1D1F20] text-white py-2 px-4 my-2 mt-4 hover:bg-[#292C2D] flex items-center gap-2"
                onClick={() => setPopUpdate(true)}
              >
                <TbEdit />
                Update
              </button>
            </section>

            <UpdateModal
              product={product}
              newCustomer={newCustomer}
              customers={customers}
              handleUpdate={handleUpdate}
              popUpdate={popUpdate}
              setPopUpdate={setPopUpdate}
              loading={loading}
            />

            <div className="flex flex-col md:flex-row gap-5 outline outline-1 outline-[#e4e6e5] bg-white p-2 md:p-5 rounded-sm md:shadow-sm justify-center md:justify-start items-center md:items-start">
              <iframe
                id="website_frame"
                scrolling="no"
                className="h-80 w-80 outline outline-1 outline-[#e4e6e5] rounded-sm bg-[#f7f7f7]"
                src={`https://${product.website_link.replace(
                  /^https?:\/\//,
                  ""
                )}`}
                title={product.name}
              ></iframe>
              <div className="w-full">
                <div className="mb-3">
                  <p className="uppercase font-medium">DOMAIN</p>
                  <a
                    href={`https://${product.website_link.replace(
                      /^https?:\/\//,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 cursor-pointer underline font-bold text-sm text-gray-700"
                  >
                    https://{product.website_link.replace(/^https?:\/\//, "")}
                    <RiExternalLinkFill />
                  </a>
                </div>

                <div className="mb-3">
                  <p className="uppercase font-medium">CONTACT PERSON</p>
                  <p className="font-bold text-sm text-gray-700">
                    {contactPerson?.first_name + " " + contactPerson?.last_name}
                    , {product.telephone_number}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="uppercase font-medium">STATUS</p>
                  <div className="flex gap-1 items-center">
                    <p className="font-bold text-sm text-gray-700">
                      {product.status}
                    </p>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        product.status === "active"
                          ? "bg-green-500"
                          : product.status === "warning"
                          ? "bg-yellow-200"
                          : "bg-red-600"
                      }`}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="uppercase font-medium">EXPIRING ON</p>
                  <p className="font-bold text-sm text-gray-700">
                    {moment(new Date(product.expiry_date)).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div className="mt-5">
                  <button
                    className="bg-[#1D1F20] text-white py-2 px-4 hover:bg-[#292C2D] flex items-center gap-2 rounded-sm"
                    onClick={() => setPopRenew(true)}
                  >
                    Renew Now
                  </button>
                </div>
              </div>
            </div>

            <section className="my-5">
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
            </section>

            <div className="flex gap-5 items-center mt-1 mb-5">
              <button
                className="outline outline-1 outline-[#1D1F20] text-[#1D1F20] py-2 px-4 hover:bg-[#1D1F20] hover:text-white flex items-center gap-2"
                onClick={() => setPopUp(true)}
              >
                <MdDeleteOutline size={20} /> Delete Website
              </button>
            </div>
          </>
        )}

        {popUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopUp(false)}
            className={`bg-black z-20 bg-opacity-40 w-screen min-h-screen fixed top-0 left-0 right-0 flex justify-center items-center`}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              variants={dropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white dark:bg-dark-bg max-h-screen overflow-auto dark:text-secondary-text p-10  rounded-md m-2 sm:mb-5 shadow-md top-50 z-20"
            >
              <h1 className="text-center font-bold text-lg my-5">
                Delete Website
              </h1>
              <p>
                Are you sure you want to delete <b>{product.name}</b>?
              </p>
              <p className="bg-[#ffe9d9] p-2 border-l-2 text-[#bc4c2e] border-[#fa703f] flex flex-col text-sm my-1">
                <span className="text-[#771505] font-bold flex items-center gap-1">
                  <IoWarning /> Warning
                </span>
                By deleting this website, you won&apos;t be able to access it or
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
          </motion.div>
        )}
        {popUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopUp(false)}
            className={`bg-black z-20 bg-opacity-40 w-screen min-h-screen fixed top-0 left-0 right-0 flex justify-center items-center`}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              variants={dropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white dark:bg-dark-bg max-h-screen overflow-auto dark:text-secondary-text p-10  rounded-md m-2 sm:mb-5 shadow-md top-50 z-20"
            >
              <h1 className="text-center font-bold text-lg my-5">
                Delete Website
              </h1>
              <p>
                Are you sure you want to delete <b>{product.name}</b>?
              </p>
              <p className="bg-[#ffe9d9] p-2 border-l-2 text-[#bc4c2e] border-[#fa703f] flex flex-col text-sm my-1">
                <span className="text-[#771505] font-bold flex items-center gap-1">
                  <IoWarning /> Warning
                </span>
                By deleting this website, you won&apos;t be able to access it or
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
          </motion.div>
        )}
        {popRenew && (
          <RenewModal
            product={product}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            account_balance={account_balance.account_balance}
            renewPeriod={renewPeriod}
            setPopRenew={setPopRenew}
            setRenewPeriod={setRenewPeriod}
            complete={complete}
            setComplete={setComplete}
            handleRenew={handleRenew}
          />
        )}

        {popUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopUp(false)}
            className={`bg-black z-20 bg-opacity-40 w-screen min-h-screen fixed top-0 left-0 right-0 flex justify-center items-center`}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              variants={dropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white dark:bg-dark-bg max-h-screen overflow-auto dark:text-secondary-text p-10  rounded-md m-2 sm:mb-5 shadow-md top-50 z-20"
            >
              <h1 className="text-center font-bold text-lg my-5">
                Delete Website
              </h1>
              <p>
                Are you sure you want to delete <b>{product.name}</b>?
              </p>
              <p className="bg-[#ffe9d9] p-2 border-l-2 text-[#bc4c2e] border-[#fa703f] flex flex-col text-sm my-1">
                <span className="text-[#771505] font-bold flex items-center gap-1">
                  <IoWarning /> Warning
                </span>
                By deleting this website, you won&apos;t be able to access it or
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
          </motion.div>
        )}
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
  const { data: product } = await supabase
    .from("websites")
    .select("*")
    .eq("id", params.id)
    .single();

  const { data: contactPerson } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", product.contact_person)
    .single();

  const { data: customers } = await supabase.from("profiles").select("*");

  const person = parseCookies(req);
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

  const { data: account_balance } = await supabase
    .from("accounts")
    .select("account_balance")
    .eq("id", JSON.parse(person.user).user.id)
    .single();

  return {
    props: { product, contactPerson, customers, account_balance },
  };
};
