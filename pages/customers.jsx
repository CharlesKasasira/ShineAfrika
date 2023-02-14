import Head from "next/head";
import { useRouter } from "next/router";
import { MdAdd } from "react-icons/md";
import { FaSort } from "react-icons/fa";
import { supabase } from "../utils/supabase";
import { useState } from "react";
import { Footer } from "../components";
import Avatar from "../components/Avatar";
import { parseCookies } from "../utils/parseCookies";
import { useAuth } from "../utils/auth";
import { FiChevronDown } from "react-icons/fi";

export default function Customers({ customers, managers, websites }) {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [sortNames, setSortNames] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const { notifications } = useAuth();

  customers =
    customers &&
    customers.filter((customer) =>
      !customer?.[searchBy] || searchBy !== "contact_number"
        ? searchBy === "name"
          ? `${customer?.["first_name"] + " " + customer?.["last_name"]}`
              .toLowerCase()
              .indexOf(searchText.toLowerCase()) > -1
          : customer?.[searchBy]
              .toLowerCase()
              .indexOf(searchText.toLowerCase()) > -1
        : customer?.[searchBy]
            .toString()
            .toLowerCase()
            .indexOf(searchText.toLowerCase()) > -1
    );

  customers =
    customers && sortNames
      ? customers.sort((a, b) => a[sortBy] > b[sortBy])
      : customers.sort((a, b) => b[sortBy] > a[sortBy]);

  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <>
      <Head>
        <title>
          {notifications && notifications.length > 0
            ? `(${notifications.length})`
            : ""}{" "}
          Customers - Ablestate Cloud
        </title>
      </Head>

      <main className="pt-[70px] mx-3 md:mx-16 relative pb-6 min-h-screen">
        <section className="flex justify-between items-center my-10">
          <h1 className="font-bold text-2xl"></h1>
          <button
            className="bg-[#1D1F20] text-white py-2 px-4 my-2 hover:bg-transparent hover:text-black outline outline-1 outline-black flex items-center gap-2 "
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
                  <div className="flex justify-between items-center">
                    <div className="flex justify-between items-center relative focus-within:text-black ">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="search"
                          className="px-3 py-2 bg-[#f7f7f7] rounded-lg placeholder:text-[#bcbfc2] w-full outline outline-1 outline-[#f4f3f7]"
                          onChange={(event) => {
                            setSearchText(event.target.value);
                            if (event.target.value !== "") {
                              const rightWeb = customers.filter((customer) =>
                                customer.first_name
                                  .toLowerCase()
                                  .startsWith(event.target.value.toLowerCase())
                              );
                              document.getElementById("paragraph").innerHTML =
                                rightWeb.length > 0
                                  ? `${rightWeb[0]?.first_name} ${rightWeb[0]?.last_name}`
                                      .toLowerCase()
                                      .replace(
                                        event.target.value,
                                        `<span class="text-black">${event.target.value}</span>`
                                      )
                                  : "";
                            } else {
                              document.getElementById("paragraph").innerHTML =
                                "";
                            }
                          }}
                        />
                        <p
                          id="paragraph"
                          className="text-gray-400 absolute top-2 left-3 pointer-events-none"
                        ></p>
                      </div>
                      <select
                        name=""
                        id=""
                        className="absolute right-1 px-1 py-2 ml-2 bg-white rounded-lg outline outline-1 outline-[#ededed] text-sm"
                        onChange={(event) => setSearchBy(event.target.value)}
                      >
                        <option value="name">Name</option>
                        <option value="contact_number">Telephone</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>
            </caption>
            <thead>
              <tr className="border-b bg-[#f7f7f7] text-[#555b6d]">
                <th></th>
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
                    Products
                    <span className="px-1">{websites?.length}</span>
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
                  <div className="flex items-center">Added By</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {customers &&
                customers.map((customer, index) => (
                  <>
                    <tr
                      className={`border-b border-l-2 border-l-transparent hover:border-l-[#ca3011] cursor-pointer mb-10`}
                      key={index}
                      onClick={() => router.push(`/customers/${customer.id}`)}
                    >
                      <td
                        className="py-4 pl-2 text-center text-gray-500"
                        onClick={(event) => {
                          event.stopPropagation();
                          activeIndex === index
                            ? setActiveIndex(null)
                            : setActiveIndex(index);
                        }}
                      >
                        <FiChevronDown
                          size={18}
                          className={`${
                            activeIndex === index ? "" : "-rotate-90"
                          }`}
                        />
                      </td>
                      <td className="py-2 text-left pl-3">
                        <span className="flex items-center gap-2">
                          <Avatar
                            first_name={customer.first_name}
                            last_name={customer.last_name}
                          />
                          <h1 className="font-medium">
                            {customer.first_name + " " + customer.last_name}
                          </h1>
                        </span>
                      </td>
                      <td className="py-2 text-left  pl-3">
                        <div className="w-full flex justify-center">
                          {
                            websites.filter(
                              (website) =>
                                website.contact_person === customer.id
                            ).length
                          }
                        </div>
                      </td>
                      <td className="py-2 text-left pl-3">
                        {customer.contact_number === "+256null"
                          ? "N/A"
                          : customer.contact_number}
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
                    {activeIndex === index && (
                      <tr className=" bg-zinc-50 border-b-[1px] border-b-gray-500 py-5">
                        <td className="py-4 pl-2"></td>
                        <td colSpan={4} className="py-4 pl-2">
                          <h3>{customer.email}</h3>
                          <br />
                          <h3 className="font-medium">Products owned</h3>
                          {websites &&
                            websites
                              .filter(
                                (website, index) =>
                                  website.contact_person === customer.id
                              )
                              .map((product, index) => (
                                <p key={index}>
                                  <span className="text-sm">{index + 1}</span>:{" "}
                                  {product.name}
                                </p>
                              ))}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
            </tbody>
          </table>
        </div>

        <Footer />
      </main>
    </>
  );
}

export const getServerSideProps = async ({ req, res }) => {
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

  const person = parseCookies(req);
  if (res) {
    if (
      !person.user ||
      JSON.parse(person?.user).user.user_metadata.role === "customer"
    ) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
        props: {},
      };
    }
  }

  return {
    props: {
      customers,
      managers,
      websites,
    },
  };
};
