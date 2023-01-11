import React, { useState } from "react";
import Router, { useRouter } from "next/router";
import PackageNav from "../../../../components/PackageNav";
import { FaSearch } from "react-icons/fa";
import HelpDeck from "../../../../components/HelpDeck";
import { useAuth } from "../../../../utils/auth";
import Head from "next/head";

function Cart() {
  const router = useRouter();
  const { id, go, domain } = router.query;

  const { user } = useAuth();

  const [cart, setCart] = useState([]);

  const names = cart && cart.map((product) => product.name);

  return (
    <div>
      <Head>
        <title>Cart - Ablestate Cloud</title>
      </Head>
      <PackageNav />
      <HelpDeck />
      <main
        className={`pt-[70px] mx-5 md:mx-20 relative pb-6 min-h-screen gap-10 `}
      >
        <section>
          <h1 className="font-medium text-xl mt-5">Cart</h1>
          <div className="flex justify-between mt-10 bg-white outline outline-1 outline-[#E4E6E5] py-10 px-2">
            <h2 className="font-bold text-xl">{domain}</h2>
            <p>{id} Package</p>
            <p>UGX {go}</p>
          </div>

          <div className="flex flex-col justify-center items-center mt-10 gap-3">
            <button
              className="bg-[#ca3011] text-white p-1 px-2"
              onClick={() => {
                if (user) {
                  Router.push(
                    `/packages/${id}/${go}/checkout/?domain=${domain}`
                  );
                } else {
                  Router.push(`/packages/${id}/${go}/login/?domain=${domain}`);
                }
              }}
            >
              Order Now
            </button>
            <button>clear cart</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Cart;
