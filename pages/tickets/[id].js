import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "../../utils/supabase";
import { useAuth } from "../../utils/auth";
import { parseCookies } from "../../utils/parseCookies";

function Ticket({ ticket, customer }) {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [values, setValues] = useState({
    response: "",
  });
  const [reload, setReload] = useState(false);

  const handleResponse = async () => {
    const { data, error } = await supabase
      .from("tickets")
      .update({ response: values.response, response_by_id: user.id })
      .match({ id: ticket.id });
    if (data) {
      setValues({
        response: "",
      });
    }
    setReload(!reload);
  };

  return (
    <div>
      <Head>
        <title>{id ? `TK${id}` : "Ticket"}- Ablestate Cloud</title>
      </Head>

      <main className="pt-[70px] mx-5 md:mx-20 relative pb-6 min-h-screen">
        <div className="w-ful my-10 md:p-10">
          <div className="flex justify-between mb-5">
            <h1 className="font-bold">#TK{ticket && ticket.id}</h1>
            <div>
              <span
                className={`${
                  ticket.agency == "high"
                    ? "bg-red-100 text-red-400"
                    : ticket.agency == "mid"
                    ? "bg-indigo-100 text-indigo-400"
                    : "bg-neutral-100 text-neutral-400"
                }  px-2 py-1 rounded-2xl text-xs font-bold mb-1`}
              >
                {ticket.agency}
              </span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-2xl text-xs font-bold">
                {ticket.category}
              </span>
            </div>
          </div>
          <div className="w-full bg-white p-4 md:p-10 pb-16 rounded-sm">
            <div className="flex flex-col gap-5">
              <div className="flex gap-1">
                <div className="w-12 h-12 flex justify-center items-center rounded-full bg-[#CA3011] text-white font-bold">
                  {customer &&
                    customer.first_name &&
                    customer.first_name[0].toUpperCase() +
                      customer.last_name[0].toUpperCase()}
                </div>
                <div className="w-9/12">
                  <p className="bg-neutral-100 px-2 py-3 rounded-md m-2">
                    {ticket && ticket.message}
                  </p>
                  <p className="font-bold">
                    {customer &&
                      customer.first_name &&
                      customer.first_name + " " + customer.last_name}
                    <span className="text-xs">({customer.role})</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                {ticket && ticket.response && (
                  <>
                    <p className="bg-neutral-200 px-2 py-3 rounded-lg m-2">
                      {ticket.response}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="mt-12">
              <textarea
                type="text"
                name=""
                placeholder="Write your response here"
                id=""
                value={values.response}
                className="w-full px-5 py-2 outline-none border-t-[1px] border-t-gray-200 focus:border-t-gray-500"
                onChange={(event) =>
                  setValues({ ...values, response: event.target.value })
                }
              />
              <div className="flex justify-end mt-2">
                <input
                  type="submit"
                  value="Send"
                  className="bg-black text-white p-2 cursor-pointer rounded-sm"
                  onClick={() => handleResponse()}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Ticket;

export const getServerSideProps = async ({ req, res, params }) => {
  let customer;

  const { data: ticket } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", params.id)
    .single();

  if (ticket?.customer_id) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", ticket.customer_id)
      .single();

    customer = data;
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/tickets",
      },
      props: {},
    };
  }

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

  return {
    props: { ticket, customer },
  };
};
