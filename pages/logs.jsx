import Head from "next/head";
import { supabase } from "../utils/supabase";
import moment from "moment";
import { MdDeleteOutline } from "react-icons/md";
import Footer from "../components/Footer";
import { parseCookies } from "../utils/parseCookies";
import { useAuth } from "../utils/auth";
import { getPagination } from "../utils/getPagination";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import { useRouter } from "next/router";

export default function Home({ logs, page }) {
  const { notifications } = useAuth();
  const router = useRouter();
  return (
    <>
      <Head>
        <title>
          {notifications && notifications.length > 0
            ? `(${notifications.length})`
            : ""}{" "}
          Logs - Ablestate Cloud
        </title>
      </Head>
      <main className="pt-[70px] relative pb-6 min-h-screen">
        <div className="mb-5 overflow-x-scroll ">
          <table className=" w-full table-auto p-10">
            <caption className=" bg-white py-3 outline outline-1 outline-[#e5e7eb] px-3">
              <section className="flex justify-between items-center px-3 md:px-16">
                <h3 className="font-bold text-left">Logs</h3>
                <div className="flex justify-between items-center">
                  <button className="flex items-center bg-white rounded-lg outline outline-1 outline-[#ededed] text-sm px-4 py-2 ml-2 justify-between">
                    <MdDeleteOutline />
                    clear
                  </button>
                </div>
              </section>
            </caption>
            <tbody className="">
              {logs.map((log, index) => (
                <tr
                  className="border-b border-l-2 border-l-transparent cursor-pointer mb-10"
                  key={index}
                >
                  <td className="py-2 text-left pl-3 px-3 md:px-16 font-semibold">
                    <h1 className="font-medium">{log.name}</h1>
                    <span className="font-extralight text-sm">
                      {log.details}(
                      <span
                        className={`${
                          log.status.includes("success")
                            ? "text-green-500"
                            : "text-red-600"
                        }`}
                      >
                        {log.status}
                      </span>
                      )
                    </span>
                  </td>
                  <td className="py-2 text-right pl-3 px-3 md:px-16">
                    {moment(new Date(log.created_at)).format(
                      "DD/MM/YYYY - hh:mm:ss"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs && logs.length > 0 && (
            <div className="flex py-2 px-4 gap-4 mt-3">
              <button
                className="outline outline-1 rounded-sm flex gap-1 items-center px-3 py-1"
                onClick={() => {
                  if (page > 0) {
                    router.push(`/logs?page=${page - 1}`);
                  }
                }}
              >
                <MdOutlineNavigateBefore />
                Prev
              </button>
              <button
                className="outline outline-1 rounded-sm flex gap-1 items-center px-3 py-1"
                onClick={() => router.push(`/logs?page=${page + 1}`)}
              >
                Next
                <MdOutlineNavigateNext />
              </button>
            </div>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}

export const getServerSideProps = async ({ req, res, query: { page = 0 } }) => {
  const { from, to } = getPagination(page, 10);
  const { data: logs } = await supabase
    .from("logs")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

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
      logs,
      page: +page,
    },
  };
};
