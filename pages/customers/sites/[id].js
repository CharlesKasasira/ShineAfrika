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
import AddCustomerModal from "../../components/AddCustomerModal";
import { MdAdd } from "react-icons/md";
import { RiExternalLinkFill } from "react-icons/ri";
import moment from "moment";

export default function CustomerSite({ product }) {
  const router = useRouter();
  const { id } = router.query;
  const [popUp, setPopUp] = useState(false);
  const [popUpdate, setPopUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerModel, setCustomerModel] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [newCustomer, setNewCustomer] = useState(null);
  const [contact, setContact] = useState({});
  const [countryCode, setCountryCode] = useState("+256");
  const [selected, setSelected] = useState(false);
  const [password, setPassword] = useState(null);

  useEffect(() => {
    getCustomers();
    getContact();
  }, [selected]);

  const getCustomers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    setCustomers(data);
  };

  const getContact = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", product.contact_person)
      .single();
    setContact(data);
  };

  const getNewCustomer = async (id, setFieldValue) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    // setContact(data);
    if (data.contact_number) {
      // values.telephone_number = "+256985"
      setFieldValue("telephone_number", data.contact_number.slice(4, 13));
    }
    setNewCustomer(data);
  };

  // console.log(newCustomer)

  const addNewCustomer = async (values) => {
    if (password) {
      // console.log(password)
      const { email, first_name, last_name, role } = values;
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
        setCustomerModel(false);
        setSelected(!selected);
      }
      if (error) {
        toast.error(`${error?.message}`, { position: "top-center" });
      }
    } else {
      toast.error(`No password`, { position: "top-center" });
    }
    setLoading(false);
  };

  const { user } = useAuth();

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
      }
      if (error) {
        toast.error(`${error?.message}`, { position: "top-center" });
      }
    }
  };

  const handleUpdate = async (event, values) => {
    event.preventDefault();
    setLoading(true);

    const { name, website_link, contact_person, telephone_number } = values;
    console.log(values);

    const { data, error } = await supabase
      .from("websites")
      .update({
        name: name,
        website_link: website_link,
        contact_person: contact_person,
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

  console.log(product)

  return (
    <div>
      <Head>
        <title>{product ? product.name : "loading..."} - Shine Africa</title>
      </Head>

      <ToastContainer />

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
            {popUpdate && (
              <div
                className={`bg-black z-20 bg-opacity-40 w-screen min-h-screen fixed top-0 left-0 right-0 flex justify-center`}
              >
                <div className="relative bg-white dark:bg-dark-bg max-h-screen overflow-auto dark:text-secondary-text p-10 w-10/12 md:8/12  rounded-md m-5 sm:mb-5 shadow-md top-50 z-20">
                  <div className="flex items-center justify-between">
                    <h1 className="text-center font-bold text-lg my-5">
                      Update Website
                    </h1>
                    <AiFillCloseCircle
                      size={25}
                      className="cursor-pointer"
                      onClick={() => {
                        setPopUpdate(false);
                        setNewCustomer(null);
                      }}
                    />
                  </div>

                  <Formik
                    initialValues={{
                      name: product.name,
                      website_link: product.website_link,
                      contact_person: product.contact_person,
                      telephone_number:
                        product.telephone_number &&
                        product.telephone_number.slice(4, 13),
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
                            <label htmlFor="name" className="">
                              Product Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              placeholder="name"
                              className="py-2 px-2 bg-transparent  outline outline-1 outline-[#c1c7d6] rounded w-full"
                              onChange={handleChange("name")}
                              onBlur={handleBlur("name")}
                              value={values.name}
                            />
                          </div>
                          <div className="flex flex-col gap-1 my-2">
                            <label htmlFor="contact_person">
                              Contact Person
                            </label>
                            <div className="flex justify-between items-center gap-2 w-full">
                              <select
                                name=""
                                id="contact_person"
                                className=" py-2 px-2 bg-transparent  outline outline-1 outline-[#121212] rounded w-8/12 md:w-8/12"
                                onChange={(e) => {
                                  setFieldValue(
                                    "contact_person",
                                    e.target.value
                                  );
                                  setCustomerId(e.target.value);
                                  getNewCustomer(e.target.value, setFieldValue);
                                  setSelected(!selected);
                                }}
                                onBlur={handleBlur("contact_person")}
                                value={values.contact_person}
                              >
                                {/* <input type="text" name="" id="" /> */}
                                <option value="">Select Customer</option>
                                {customers &&
                                  customers.map((customer, index) => (
                                    <option value={customer.id} key={index}>
                                      {customer.first_name +
                                        " " +
                                        customer.last_name}
                                    </option>
                                  ))}
                              </select>
                              <button
                                type="button"
                                className="bg-[#1D1F20] text-white py-2 px-4  hover:bg-transparent hover:text-black outline outline-1 outline-black flex items-center gap-2 "
                                onClick={() => setCustomerModel(true)}
                              >
                                <MdAdd />
                                Add Customer
                              </button>
                              {customerModel && (
                                <AddCustomerModal
                                  loading={loading}
                                  setCustomerModel={setCustomerModel}
                                  addNewCustomer={addNewCustomer}
                                  password={password}
                                  setPassword={setPassword}
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 my-2">
                            <label htmlFor="telephone_number">Telephone</label>
                            <div className="relative outline outline-1 outline-[#c1c7d6] rounded flex">
                              <input
                                type="tel"
                                id="telephone_number"
                                name="telephone_number"
                                placeholder="Telephone number"
                                className=" py-2 px-2 ml-16 bg-transparent flex-grow focus:outline-none"
                                onChange={handleChange("telephone_number")}
                                onBlur={handleBlur("telephone_number")}
                                value={
                                  newCustomer?.contact_number
                                    ? newCustomer?.contact_number.slice(4, 13)
                                    : product?.telephone_number.slice(4, 13)
                                }
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
                            <label htmlFor="email">Email</label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              placeholder="Email"
                              className="py-2 px-2 bg-transparent  outline outline-1 outline-[#c1c7d6] rounded w-full"
                              onChange={handleChange("email")}
                              onBlur={handleBlur("email")}
                              value={
                                newCustomer ? newCustomer?.email : product.email
                              }
                            />
                          </div>

                          <div className="flex flex-col gap-1 my-2">
                            <label htmlFor="website_link">Website</label>
                            <input
                              type="text"
                              name="website_link"
                              placeholder="website"
                              className="py-2 px-2 bg-transparent  outline outline-1 outline-[#c1c7d6] rounded w-full"
                              onChange={handleChange("website_link")}
                              onBlur={handleBlur("website_link")}
                              defaultValue={product.website_link}
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
                </div>
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-5 outline outline-1 outline-[#e4e6e5] bg-white p-2 md:p-5 rounded-sm md:shadow-sm justify-center md:justify-start items-center md:items-start">
              <iframe
                id="website_frame"
                scrolling="no"
                className="h-80 w-80 outline outline-1 outline-[#e4e6e5] rounded-sm bg-[#f7f7f7]"
                src={`https://${product.website_link}`}
                title={product.name}
              ></iframe>
              <div>
                <div className="mb-3">
                  <p className="uppercase font-medium">DOMAIN</p>
                  <a
                    href={`https://${product.website_link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 cursor-pointer underline font-bold text-sm text-gray-700"
                  >
                    {product.website_link}
                    <RiExternalLinkFill />
                  </a>
                </div>

                <div className="mb-3">
                  <p className="uppercase font-medium">CONTACT PERSON</p>
                  <p className="font-bold text-sm text-gray-700">
                    {contact?.first_name + " " + contact?.last_name},{" "}
                    {product.telephone_number}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="uppercase font-medium">STATUS</p>
                  <div className="flex gap-1 items-center">
                    <p className="font-bold text-sm text-gray-700">{product.status}</p>
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
          <div
            className={`bg-black z-20 bg-opacity-40 w-screen min-h-screen fixed top-0 left-0 right-0 flex justify-center items-center`}
          >
            <div className="relative bg-white dark:bg-dark-bg max-h-screen overflow-auto dark:text-secondary-text p-10  rounded-md m-2 sm:mb-5 shadow-md top-50 z-20">
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
            </div>
          </div>
        )}
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

export const getServerSideProps = async ({ req, params }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  const { data: product } = await supabase
    .from("websites")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  return {
    props: { product },
  };
};