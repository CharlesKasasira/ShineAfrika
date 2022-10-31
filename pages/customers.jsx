import Head from "next/head";
import { useRouter } from "next/router";
import { MdAdd, MdSearch } from "react-icons/md";
import { FaSort } from "react-icons/fa";
import { supabase } from "../utils/supabase";
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../utils/auth";
import { IoWarning } from "react-icons/io5";
import { Footer } from "../components";
import { avatarColors } from "../utils/avatarColors";
import Avatar from "../components/Avatar";

export default function Customers({ websites, customers, managers }) {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [sortNames, setSortNames] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const checkbox = useRef();
  const { user } = useAuth();

  customers = customers.filter((customer) =>
    !customer?.[searchBy] || searchBy !== "contact_number"
      ? 
      searchBy === "name"
      ?
      `${customer?.["first_name"] + " " + customer?.["last_name"]}`.toLowerCase().indexOf(searchText.toLowerCase()) >
        -1
      :
      customer?.[searchBy].toLowerCase().indexOf(searchText.toLowerCase()) >
        -1
      : customer?.[searchBy]
          .toString()
          .toLowerCase()
          .indexOf(searchText.toLowerCase()) > -1
  );
  // .filter((customer) => !status || customer.status === status);

  customers = sortNames
    ? customers.sort((a, b) => a[sortBy] > b[sortBy])
    : customers.sort((a, b) => b[sortBy] > a[sortBy]);

  console.log(customers);

  return (
    <>
      <Head>
        <title>Customers - Shine Afrika</title>
      </Head>
      <ToastContainer />

      <main className="pt-[70px] mx-3 md:mx-16 relative pb-6 min-h-screen">
        <section className="flex justify-between items-center my-10">
          <h1 className="font-bold text-2xl"></h1>
          <button
            className="bg-[#1D1F20] text-white py-2 px-4 my-2 mt-4 hover:bg-transparent hover:text-black outline outline-1 outline-black flex items-center gap-2 "
            onClick={() => router.push("/add-customer")}
          >
            <MdAdd />
            New Customer
          </button>
        </section>

        <div className="outline outline-1 outline-[#e5e7eb] mb-5 overflow-x-scroll select-none">
          <table className="bg-white w-full table-auto p-10 select-none">
            <caption className=" bg-white py-3 outline outline-1 outline-[#e5e7eb] px-3">
              <section className="flex justify-between items-center">
                <h3 className="font-bold text-left">Customers</h3>
                <div className="flex items-center gap-2">
                  {/* <form onSubmit={(event) => {
                  event.preventDefault()
                  setPopUp(true)
                }}>
                    <select
                        name=""
                        id=""
                        className="px-3 py-2 bg-[#f7f7f7] rounded-lg placeholder:text-[#bcbfc2] outline outline-1 outline-[#f4f3f7]" required
                      >
                        <option value="">Bulk Actions</option>
                        <option value="telephone_number">Delete</option>
                      </select>
                      <input type="submit" value="apply" className="px-3 py-2 ml-2 bg-gray-700 text-white rounded-lg text-sm cursor-pointer" />
                  </form> */}
                  <div className="flex justify-between items-center">
                    <div className="flex justify-between items-center relative focus-within:text-black ">
                      <input
                        type="text"
                        placeholder="search"
                        className="px-3 py-2 bg-[#f7f7f7] rounded-lg placeholder:text-[#bcbfc2] w-full outline outline-1 outline-[#f4f3f7]"
                        onChange={(event) => setSearchText(event.target.value)}
                      />
                      <select
                        name=""
                        id=""
                        className="absolute right-1 px-1 py-2 ml-2 bg-white rounded-lg outline outline-1 outline-[#ededed] text-sm"
                        onChange={(event) => setSearchBy(event.target.value)}
                      >
                        <option value="name">Name</option>
                        <option value="contact_number">Telephone</option>
                        {/* <option value="contact_number">Added By</option> */}
                      </select>
                    </div>
                  </div>
                </div>
              </section>
            </caption>
            <thead>
              <tr className="border-b bg-[#f7f7f7] text-[#555b6d]">
                <th className="py-4 text-left pl-3 font-light">
                  <div className="flex items-center">
                    Name
                    <i
                      className="cursor-pointer"
                      onClick={() => {
                        setSortNames(!sortNames);
                        setSortBy("first_name");
                      }}
                    >
                      <FaSort size={13} />
                    </i>
                  </div>
                </th>
                <th className="py-4 text-left pl-3 font-light">
                  <div className="flex items-center">
                    Telephone
                    <i
                      className="cursor-pointer"
                      onClick={() => {
                        setSortNames(!sortNames);
                        setSortBy("contact_number");
                      }}
                    >
                      <FaSort size={13} />
                    </i>
                  </div>
                </th>
                <th className="py-4 text-left pl-3 font-light">
                  <div className="flex items-center">
                    Added By
                    {/* <i
                      className="cursor-pointer"
                      onClick={() => {
                        setSortNames(!sortNames);
                        setSortBy("added_by");
                      }}
                    >
                      <FaSort size={13} />
                    </i> */}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr
                  className={`border-b border-l-2 border-l-transparent hover:border-l-[#ca3011] cursor-pointer mb-10`}
                  key={index}
                  onClick={() => router.push(`/customers/${customer.id}`)}
                >
                  <td className="py-2 text-left pl-3">
                    <span className="flex items-center gap-2">
                      {/* <div className={`bg-[${avatarColors["S"]}] w-10 h-10 rounded-full text-white flex items-center justify-center`}>
                      {customer.first_name[0].toUpperCase() + customer.last_name[0].toUpperCase()}
                      </div> */}
                      <Avatar
                        first_name={customer.first_name}
                        last_name={customer.last_name}
                      />
                      <h1 className="font-medium">
                        {customer.first_name + " " + customer.last_name}
                      </h1>
                    </span>
                  </td>
                  {/* <td className="py-2 text-left pl-3">{customers.filter((customer => customer.id === site.contact_person)).map((customer, index) => <p key={index}>{customer.first_name+ " " + customer.last_name}</p>)}</td> */}
                  <td className="py-2 text-left pl-3">
                    {customer.contact_number}
                  </td>
                  <td className="py-2 text-left pl-3">
                    {managers
                      .filter((manager) => manager.id === customer.added_by)
                      .map((manager, index) => (
                        <p key={index}>
                          {manager.first_name + " " + manager.last_name}
                        </p>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Footer />
      </main>
    </>
  );
}

export const getServerSideProps = async ({ req }) => {
  const { data: websites } = await supabase
    .from("websites")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: customers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer");

  const { data: managers } = await supabase
    .from("profiles")
    .select("*")
    .neq("role", "customer");

  const { user } = await supabase.auth.api.getUserByCookie(req);

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
    props: {
      websites,
      customers,
      managers,
    },
  };
};
