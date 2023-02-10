import { Formik, Form } from "formik";
import { AiFillCloseCircle } from "react-icons/ai";
import { TbEdit } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { dropIn } from "../../utils/dropIn";

function UpdateModal({
  product,
  newCustomer,
  handleUpdate,
  popUpdate,
  setPopUpdate,
  loading,
  customers,
}) {
  return (
    <AnimatePresence>
      {popUpdate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setPopUpdate(false)}
          className={`bg-black z-20 bg-opacity-40 w-screen min-h-screen fixed top-0 left-0 right-0 flex justify-center`}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-white dark:bg-dark-bg max-h-screen overflow-auto dark:text-secondary-text py-2 md:p-10 w-10/12 md:8/12  rounded-sm m-5 sm:mb-5 shadow-md top-50 z-20"
          >
            <div className="flex items-center justify-between border-b-[1px] px-4">
              <h1 className="text-center font-bold text-lg my-5">
                Update Website
              </h1>
              <AiFillCloseCircle
                size={25}
                className="cursor-pointer"
                onClick={() => {
                  setPopUpdate(false);
                }}
              />
            </div>

            <Formik
              initialValues={{
                name: product.name,
                product_type: product.product_type,
                product_price: product.product_price,
                website_link: product.website_link,
                contact_person: product.contact_person,
                telephone_number:
                  product.telephone_number &&
                  `${product.telephone_number}`.slice(4, 13),
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
                    className="my-5 px-4"
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
                        className="py-2 px-2 bg-transparent  outline outline-1 outline-[#c1c7d6] rounded-sm w-full"
                        onChange={handleChange("name")}
                        onBlur={handleBlur("name")}
                        value={values.name}
                      />
                    </div>
                    <div className="flex flex-col gap-1 my-2">
                      <label htmlFor="name" className="">
                        Product Type
                      </label>
                      <select
                        name="product_type"
                        id="product_type"
                        className="py-2 px-2 bg-transparent  outline outline-1 outline-[#c1c7d6] rounded-sm w-full"
                        onChange={handleChange("product_type")}
                        onBlur={handleBlur("product_type")}
                        value={values.product_type}
                      >
                        <option value="">Select Product Type</option>
                        <option value="hosting">Hosting</option>
                        <option value="domain">Domain</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1 my-2">
                      <label htmlFor="product_price" className="">
                        Product Price
                      </label>
                      <input
                        type="text"
                        name="product_price"
                        id="product_price"
                        placeholder="Enter Price"
                        className="py-2 px-2 bg-transparent  outline outline-1 outline-[#c1c7d6] rounded-sm w-full"
                        onChange={handleChange("product_price")}
                        onBlur={handleBlur("product_price")}
                        value={values.product_price}
                      />
                    </div>
                    <div className="flex flex-col gap-1 my-2">
                      <label htmlFor="contact_person">Contact Person</label>
                      <div className="flex justify-between items-center gap-2 w-full">
                        <select
                          name=""
                          id="contact_person"
                          className="py-2 px-2 bg-transparent  outline outline-1 outline-[#c1c7d6] rounded-sm w-full"
                          onChange={(e) => {
                            setFieldValue("contact_person", e.target.value);
                            // setSelected(!selected);
                          }}
                          onBlur={handleBlur("contact_person")}
                          value={values.contact_person}
                        >
                          <option value="">Select Customer</option>
                          {customers &&
                            customers.map((customer, index) => (
                              <option
                                value={customer.id}
                                key={index}
                                className="outline bg-pink-200"
                              >
                                {customer.first_name + " " + customer.last_name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 my-2">
                      <label htmlFor="telephone_number">Telephone</label>
                      <div className="relative outline outline-1 outline-[#c1c7d6] rounded-sm flex">
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
                              : `${product.telephone_number}`.slice(4, 13)
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
                        value={newCustomer ? newCustomer?.email : product.email}
                      />
                    </div>

                    <div className="flex flex-col gap-1 my-2">
                      <label htmlFor="website_link">Website</label>
                      <input
                        type="text"
                        name="website_link"
                        placeholder="website"
                        className="py-2 px-2 bg-transparent  outline outline-1 outline-[#c1c7d6] rounded-sm w-full"
                        onChange={handleChange("website_link")}
                        onBlur={handleBlur("website_link")}
                        defaultValue={product.website_link}
                      />
                    </div>

                    <div className="flex justify-end mt-5">
                      <button
                        type="submit"
                        className="outline outline-1 outline-[#1D1F20] bg-[#1D1F20] text-white py-2 px-4 hover:bg-[#1D1F20] hover:text-white flex items-center gap-2 w-full justify-center rounded-sm"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UpdateModal;
