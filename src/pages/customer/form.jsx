import React from "react";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog } from "@material-tailwind/react";
const phoneRgex = /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/gm;
const schema = Yup.object().shape({
  companyName: Yup.string().required("Company name is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is reuired"),
  mobilePhone: Yup.string().matches(phoneRgex, "Please add a valid phone number").required("Mobile number is required"),
  officePhone: Yup.string().optional(),
  email: Yup.string().email("Please add a valid email").required("Email is required"),
  address: Yup.string().required("Address is required"),
  taxable: Yup.boolean(true),
  taxType: Yup.string()
});
const MyPopUpForm = ({ open, close, selectedItem }) => {

  const isEditMode = selectedItem != null;
  
  const handleClose = () => {
    clearForm(formikProps);
    close();
  };

  useEffect(() => {
    if (selectedItem) {
      console.log(selectedItem);
      formikProps.setValues(selectedItem);
      console.log(formikProps.values);
    }
  }, [selectedItem]);

  const onSubmit = (values, actions) => {
    console.log(values);
  };

  const clearForm = (formikProps) => {
    formikProps.resetForm({
      values: {
        companyName: "",
        firstName: "",
        lastName: "",
        mobilePhone: "",
        officePhone: "",
        email: "",
        address: "",
        taxable: false,
        taxType: ""
      },
      errors: {
        companyName: "",
        firstName: "",
        lastName: "",
        mobilePhone: "",
        officePhone: "",
        email: "",
        address: "",
        taxable: false,
        taxType: ""
      },
    });
  };

  const formikProps = useFormik({
    initialValues: {
      companyName: "",
      firstName: "",
      lastName: "",
      mobilePhone: "",
      officePhone: "",
      email: "",
      address: "",
      taxable: false,
      taxType: ""
    },
    validationSchema: schema,
    onSubmit,
  });


  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
  } = formikProps;
  return (
    <Dialog open={open}>
      {open && (
        <form onSubmit={handleSubmit} autoComplete="new" >
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="bg-white rounded shadow-xl">
              <div className="flex items-center justify-between sticky bg-gradient-to-br from-gray-800 to-gray-700">
                <div></div>
                <div className="text-white text-center text-lg">
                  {isEditMode ? "EDIT CUSTOMER" : "New Customer"}
                </div>
                <button
                  className=" bg-transparent hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                  onClick={handleClose}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6">

                <div>
                  <label className="font-bold">Company Name</label> <br />
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={values.companyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.companyName && errors.companyName && (
                    <div className="text-red-500">
                      {errors.companyName}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-start space-x-4">
                  <div>
                    <label className="font-bold">First Name</label> <br />
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {(touched.firstName && errors.firstName) ? (
                      <div className="text-red-500">
                        {errors.firstName}
                      </div>
                    ) : (<div></div>)}
                  </div>
                  <div>
                    <label className="font-bold">Last Name</label> <br />
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.lastName && errors.lastName ? (
                      <div className="text-red-500">
                        {errors.lastName}
                      </div>
                    ) : (<div></div>)}
                  </div>
                </div>

                <div className="flex items-center justify-start space-x-4">
                  <div>
                    <label className="font-bold">Mobile Phone</label> <br />
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                      id="mobilePhone"
                      name="mobilePhone"
                      type="text"
                      value={values.mobilePhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {(touched.mobilePhone && errors.mobilePhone) ? (
                      <div className="text-red-500">
                        {errors.mobilePhone}
                      </div>
                    ) : (<div></div>)}
                  </div>
                  <div>
                    <label className="font-bold">Office Phone</label> <br />
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                      id="officePhone"
                      name="officePhone"
                      type="text"
                      value={values.officePhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.officePhone && errors.officePhone ? (
                      <div className="text-red-500">
                        {errors.officePhone}
                      </div>
                    ) : (<div></div>)}
                  </div>
                </div>

                <div>
                  <label className="font-bold">Email</label> <br />
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.email && errors.email && (
                    <div className="text-red-500">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold">Address</label> <br />
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                    id="address"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.address && errors.address && (
                    <div className="text-red-500">
                      {errors.address}
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold">
                    <input
                      type="checkbox"
                      id="taxableCheckbox"
                      name="taxableCheckbox"
                      checked={values.taxable}
                      onChange={(e) => {
                        setValues((prevValues) => ({
                          ...prevValues,
                          taxable: e.target.checked
                        }));
                      }}
                    />
                    &nbsp;Taxable
                  </label>
                  {values.taxable && (
                    <div>
                      <label className="font-bold">Choose Tax Type</label>
                      <select
                        className="w-full p-2 border border-gray-300 bg-inherit rounded-md"
                        id="taxType"
                        name="taxType"
                        value={values.taxType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="">Select Tax Type</option>
                        <option value="Type A">Type A</option>
                        <option value="Type B">Type B</option>
                        <option value="Type C">Type C</option>
                      </select>
                    </div>
                  )}

                </div>




              </div>
              <div className="flex items-center justify-end space-x-2 sticky bg-gradient-to-br from-gray-800 to-gray-700">
                <button
                  className=" w-32 bg-gray-600 hover:bg-gray-900 text-white font-bold py-2 px-4"
                  onClick={() => clearForm(formikProps)}
                  type="button"
                >
                  Clear
                </button>
                <button
                  className="w-32 bg-gray-600 hover:bg-gray-900 text-white font-bold py-2 px-4"
                  type="submit"
                >
                  {isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </form>


      )}
    </Dialog>
  );
};
export default MyPopUpForm;