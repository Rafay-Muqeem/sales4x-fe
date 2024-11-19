import React, { useState } from "react";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog } from "@material-tailwind/react";
import { addCustomer } from "@/services/addCustomer";
import { updateCustomer } from "@/services/updateCustomer";
import { toast } from "react-toastify";
import { State } from "@/state/Context";
import { fetchBusiness } from "@/services/fetchBusiness";
import { addAddress } from "@/services/addAddress";
import { updateAddress } from "@/services/updateAddress";

const phoneRgex = /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/gm;

const addressSchema = Yup.object().shape({
  street: Yup.string().required("street is required"),
  city: Yup.string().required("city is required"),
  state: Yup.string().required("state is required"),
  zipcode: Yup.string().required("zip code is required"),
});

const schema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  customerType: Yup.string().default('personal').required("Customer type is required"),
  phone: Yup.string().matches(phoneRgex, "Please add a valid phone number").required("Mobile number is required"),
  licenseNo: Yup.string(),
  email: Yup.string().email("Please add a valid email"),
  Address: addressSchema,
  notes: Yup.string(),
  taxable: Yup.boolean(true),
});

const MyPopUpForm = ({ open, close, selectedItem, setSelectedItem, refresh, setRefresh }) => {

  const { state } = State();
  const [edit, setEdit] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [business, setBusiness] = useState(null);

  const showToastMessage = (type, message) => {
    if (type === 'success') {
      toast.success(message)
    }
    else if (type === 'info') {
      toast.info(message)
    }
    else {
      toast.error(message)
    }
  };

  useEffect(() => {
    getBusinesses();
  }, [])

  const getBusinesses = async () => {
    try {
      const res = await fetchBusiness(state.userToken);
      const businesses = await res.json();

      setBusiness(businesses[0].id)
      setBusinesses(businesses)
    } catch (error) {
      toast.error("Something went wrong")
    }
  }
  const handleClose = () => {
    clearForm(formikProps);
    setEdit(false);
    setSelectedItem(null);
    setBusiness('');
    close();
  };

  useEffect(() => {
    if (selectedItem) {
      formikProps.setValues(selectedItem);
      setBusiness(selectedItem.BusinessId);
      setEdit(true);
    }
  }, [selectedItem]);

  // to clean address object
  function removeExtraAddressFields(obj) {
    const { CustomerId, id, createdAt, updatedAt, ...rest } = obj;
    return rest;
  }

  const onSubmit = async (values) => {
    let updatedValues = {};
    // setting business id
    if (business !== '')
      updatedValues = { ...values, BusinessId: business };
    else
      updatedValues = { ...values, BusinessId: state.business.id };

    // setting taxable to false for business customer
    if (updatedValues.customerType === 'business') updatedValues.taxable = false;
    try {
      if (!edit) {
        // separating user data
        const { Address, ...customerData } = updatedValues

        // saving customer
        const res = await addCustomer(customerData, state.userToken);
        const customer = await res.json();
        if (res.status === 200) {
          showToastMessage('success', customer.message)

          // saving customer's address
          Address.CustomerId = customer.data.id;
          const addressRes = await addAddress(Address, state.userToken);
          const address = await addressRes.json();
          if (addressRes.status === 200) {
            showToastMessage('success', address.message)
          }
          else if (res.status === 409) {
            showToastMessage('error', address.message)
          }
        }
        else if (res.status === 409) {
          showToastMessage('error', customer.message)
        }
      }
      else {
        // separating user data
        const { Address, ...customerData } = updatedValues

        const res = await updateCustomer(selectedItem.id, customerData, state.userToken);
        const customer = await res.json();
        if (res.status === 200) {
          showToastMessage('success', customer.message)
          // checking if address updated
          const oldAddress = removeExtraAddressFields(customer.data.Address)
          const newAddress = removeExtraAddressFields(Address);
          const isAddressUpdated = Object.values(oldAddress).some(value => !Object.values(newAddress).includes(value));

          if (isAddressUpdated) {
            const addressRes = await updateAddress(customer.data.Address.id, newAddress, state.userToken);
            const address = await addressRes.json();

            if (addressRes.status === 200) {
              showToastMessage('success', address.message)
            }
            else if (addressRes.status === 404) {
              showToastMessage('info', address.message)
            }
            else if (addressRes.status === 409) {
              showToastMessage('error', address.message)
            }
          }
        }
        else if (res.status === 404) {
          showToastMessage('info', customer.message)
        }
        else if (res.status === 409) {
          showToastMessage('error', customer.message)
        }
      }

      setRefresh(!refresh);
      handleClose();
    } catch (error) {
      console.log(error)
      showToastMessage('error', 'Something went wrong')
      setRefresh(!refresh);
      handleClose();
    }
  };

  const clearForm = (formikProps) => {
    formikProps.resetForm({
      values: {
        firstName: "",
        lastName: "",
        customerType: "personal",
        phone: "",
        licenseNo: "",
        email: "",
        Address: {
          street: "",
          city: "",
          state: "",
          zipcode: ""
        },
        notes: "",
        taxable: true,
      },
      errors: {
        firstName: "",
        lastName: "",
        customerType: "personal",
        phone: "",
        licenseNo: "",
        email: "",
        Address: {
          street: "",
          city: "",
          state: "",
          zipcode: ""
        },
        notes: "",
        taxable: true,
      },
    });
  };

  const formikProps = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      customerType: "personal",
      phone: "",
      licenseNo: "",
      email: "",
      Address: {
        street: "",
        city: "",
        state: "",
        zipcode: ""
      },
      notes: "",
      taxable: true,
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
                  {edit ? "EDIT CUSTOMER" : "NEW CUSTOMER"}
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
                <div className="flex justify-around mb-3">
                  <div className="flex space-x-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="customerType"
                        value="personal"
                        checked={values.customerType === 'personal'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div
                        className={`px-4 py-2 rounded-full transition-colors ${values.customerType === 'personal' ? 'bg-gradient-to-br from-gray-800 to-gray-700 text-white' : 'bg-gray-200 text-gray-700'
                          }`}
                      >
                        Personal
                      </div>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="customerType"
                        value="business"
                        checked={values.customerType === 'business'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div
                        className={`px-4 py-2 rounded-full transition-colors ${values.customerType === 'business' ? 'bg-gradient-to-br from-gray-800 to-gray-700 text-white' : 'bg-gray-200 text-gray-700'
                          }`}
                      >
                        Business
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-start space-x-4 w-full">
                  <div className="basis-[33.33%]">
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
                  <div className="basis-[33.33%]">
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

                  <div className="basis-[33.33%]">
                    <label className="font-bold">Mobile Phone</label> <br />
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                      id="phone"
                      name="phone"
                      type="text"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {(touched.phone && errors.phone) ? (
                      <div className="text-red-500">
                        {errors.phone}
                      </div>
                    ) : (<div></div>)}
                  </div>
                </div>

                <div className="flex items-center justify-start space-x-4">
                  <div className="basis-[33.33%]">
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
                  <div className="basis-[33.33%]">
                    <label className="font-bold">License No</label> <br />
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                      id="licenseNo"
                      name="licenseNo"
                      type="text"
                      value={values.licenseNo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={values.customerType !== 'business'}
                    />
                    {touched.licenseNo && errors.licenseNo && (
                      <div className="text-red-500">
                        {errors.licenseNo}
                      </div>
                    )}
                  </div>

                  <div className="basis-[33.33%]">
                    <label className="p-2 font-bold">Branch</label> <br />
                    <select
                      className="w-full p-2 border border-gray-300 bg-inherit rounded-md"
                      label="Select Business"
                      animate={{
                        mount: { y: 0 },
                        unmount: { y: 25 },
                      }}
                      value={business}
                      onChange={(e) =>
                        setBusiness(e.target.value)
                      }
                      size="md"
                      disabled={state.userInfo.role !== 'super_admin'}
                    >
                      {businesses ?
                        businesses.map((business) => (
                          <option key={business.id} value={business.id}>{business.name}, {business.location}</option>
                        )) : []}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-start space-x-4 w-full">

                    <div className="basis-[40%]">
                      <label className="font-bold">Street</label> <br />
                      <input className="p-2 border border-gray-300 rounded-md text-black font-medium"
                        id="Address.street"
                        name="Address.street"
                        type="text"
                        value={values?.Address?.street}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {(touched.Address?.street && errors.Address?.street) ? (
                        <div className="text-red-500">
                          {errors.Address.street}
                        </div>
                      ) : (<div></div>)}
                    </div>

                    <div className="basis-[20%]">
                      <label className="font-bold">City</label> <br />
                      <input className="p-2 border border-gray-300 rounded-md text-black font-medium"
                        id="Address.city"
                        name="Address.city"
                        type="text"
                        value={values?.Address?.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {(touched.Address?.city && errors.Address?.city) ? (
                        <div className="text-red-500">
                          {errors.Address.city}
                        </div>
                      ) : (<div></div>)}
                    </div>

                    <div className="basis-[20%]">
                      <label className="font-bold">State</label> <br />
                      <input className="p-2 border border-gray-300 rounded-md text-black font-medium"
                        id="Address.state"
                        name="Address.state"
                        type="text"
                        value={values?.Address?.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {(touched.Address?.state && errors.Address?.state) ? (
                        <div className="text-red-500">
                          {errors.Address.state}
                        </div>
                      ) : (<div></div>)}
                    </div>

                    <div className="basis-[20%]">
                      <label className="font-bold">Zip Code</label> <br />
                      <input className="p-2 border border-gray-300 rounded-md text-black font-medium"
                        id="Address.zipcode"
                        name="Address.zipcode"
                        type="text"
                        value={values?.Address?.zipcode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {(touched.Address?.zipcode && errors.Address?.zipcode) ? (
                        <div className="text-red-500">
                          {errors.Address.zipcode}
                        </div>
                      ) : (<div></div>)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-bold">Notes</label> <br />
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                    id="notes"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.notes && errors.notes && (
                    <div className="text-red-500">
                      {errors.notes}
                    </div>
                  )}
                </div>
                {values.customerType !== 'business' && (
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
                </div>
              )}
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
                  {edit ? "Update" : "Save"}
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