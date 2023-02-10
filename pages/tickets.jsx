import Head from "next/head";
import TicketCard from "../components/TicketCard";
import { supabase } from "../utils/supabase";
import { Fragment } from "react";
import { AiOutlineFileDone } from "react-icons/ai";
import { parseCookies } from "../utils/parseCookies";
import { useAuth } from "../utils/auth";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import { useRouter } from "next/router";
import { getPagination } from "../utils/getPagination";

function Tickets({ tickets, customers, page }) {
  const { notifications } = useAuth();
  const router = useRouter();

  console.log(page);
  return (
    <>
      <Head>
        <title>
          {notifications && notifications.length > 0
            ? `(${notifications.length})`
            : ""}{" "}
          Tickets - Ablestate Cloud
        </title>
      </Head>
      <main className="pt-[70px] mx-3 md:mx-16 relative pb-6 min-h-screen flex flex-col">
        {tickets && tickets.length > 0 && (
          <>
            {tickets.map((ticket, index) => (
              <Fragment key={index}>
                <TicketCard
                  ticket={ticket}
                  customer={
                    customers
                      .filter((customer) => customer.id === ticket.customer_id)
                      .map(
                        (customer) =>
                          customer.first_name + " " + customer.last_name
                      )[0]
                  }
                />
              </Fragment>
            ))}
            <div className="flex py-2 px-4 gap-4 mt-3">
              <button
                className="outline outline-1 rounded-sm flex gap-1 items-center px-3 py-1"
                onClick={() => {
                  if (page > 0) {
                    router.push(`/tickets?page=${page - 1}`);
                  }
                }}
              >
                <MdOutlineNavigateBefore />
                Prev
              </button>
              <button
                className="outline outline-1 rounded-sm flex gap-1 items-center px-3 py-1"
                onClick={() => router.push(`/tickets?page=${page + 1}`)}
              >
                Next
                <MdOutlineNavigateNext />
              </button>
            </div>
          </>
        )}
        {tickets && tickets.length === 0 && (
          <div className="flex-grow flex gap-5 flex-col justify-center items-center text-lg font-bold text-gray-400">
            <AiOutlineFileDone size={50} />
            There are no new Tickets.
          </div>
        )}
      </main>
    </>
  );
}

export default Tickets;

export const getServerSideProps = async ({ req, res, query: { page = 0 } }) => {
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

  const { data: customers } = await supabase.from("profiles").select("*");

  const { from, to } = getPagination(page, 10);
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  return {
    props: { tickets, customers, page: +page },
  };
};
