import * as Yup from "yup";

export const validationSchema = Yup.object({
  email: Yup.string().required("Email is required"),
  password: Yup.string()
    .trim()
    .min(8, "Password must be atleast 8 characters")
    .required("Password is required"),
});

export const amountValidationSchema = Yup.object({
  amount: Yup.string().required("Amount is required"),
});

export const resetPasswordSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "must follow example@example.com"
    ),
});

export const updatePasswordSchema = Yup.object({
  password: Yup.string()
    .trim()
    .min(8, "Password must be atleast 8 characters")
    .required("Password is required"),
  confirm_password: Yup.string()
    .trim()
    .min(8, "Password must be atleast 8 characters")
    .required("Confirm password"),
});

export const registerValidationSchema = Yup.object({
  email: Yup.string().required("Email is required"),
  first_name: Yup.string()
    .min(3, "Name must be atleast 3 characters")
    .required("Name is required"),
  last_name: Yup.string()
    .min(3, "Name must be atleast 3 characters")
    .required("Name is required"),
  password: Yup.string()
    .trim()
    .min(8, "Password must be atleast 8 characters")
    .required("Password is required"),
});

export const addSiteValidationSchema = Yup.object({
  website_link: Yup.string().matches(
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    "must match example.com"
  ),
  email: Yup.string()
    .required("Email is required")
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "must follow example@example.com"
    ),
});

export const addCustomerValidationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "must follow example@example.com"
    ),
});

export const rfqValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .required("Email is required")
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "must follow example@example.com"
    ),
  phone: Yup.string().required("Phone Number is required"),
  purpose: Yup.string().required("This is a required question"),
  timeline: Yup.string().required("This is required"),
});
