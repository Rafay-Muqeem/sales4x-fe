import React from "react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog } from "@material-tailwind/react";
import { addProduct } from "@/services/addProduct";
import { updateProduct } from "@/services/updateProduct";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  price: Yup.number().required("Price is required"),
  cost: Yup.number(),
  itemCode: Yup.string(),
  type: Yup.string().required("Type is required"),
  description: Yup.string(),
  taxable: Yup.boolean(true).required("Field is required"),
});
const MyPopUpForm = ({ refresh, setRefresh, open, close, selectedItem, setSelectedItem }) => {

  const [edit, setEdit] = useState(false);

  const handleClose = () => {
    clearForm(formikProps);
    setEdit(false);
    setSelectedItem(null);
    close();
  };

  useEffect(() => {
    if (selectedItem) {
      console.log(selectedItem);
      formikProps.setValues(selectedItem);
      setEdit(true);
      console.log(formikProps.values);
    }
  }, [selectedItem]);

  const onSubmit = async (values, actions) => {
    let res='';
    try {
      if (!edit) {
        res = await addProduct(values)
      }
      else {
        res = await updateProduct(selectedItem.id, values)
      }
      const product = await res.json();
      console.log(product)
      setRefresh(!refresh);
      handleClose();
    } catch (error) {
      console.log(error)
    }
  };

  const clearForm = (formikProps) => {
    formikProps.resetForm({
      values: {
        name: "",
        price: "",
        cost: "",
        itemCode: "",
        type: "",
        description: "",
        taxable: false,
      },
      errors: {
        name: "",
        price: "",
        cost: "",
        itemCode: "",
        type: "",
        description: "",
        taxable: false,
      },
    });
  };

  const formikProps = useFormik({
    initialValues: {
      name: "",
      price: "",
      cost: "",
      itemCode: "",
      type: "",
      description: "",
      taxable: false,
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
                  {edit ? "Edit Product" : "New Product"}
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
                  <label className="font-bold">Name</label> <br />
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                    id="name"
                    name="name"
                    type="text"
                    value={values.name}
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
                    <label className="font-bold">Price</label> <br />
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                      id="price"
                      name="price"
                      type="number"
                      value={values.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {(touched.price && errors.price) ? (
                      <div className="text-red-500">
                        {errors.price}
                      </div>
                    ) : (<div></div>)}
                  </div>
                  <div>
                    <label className="font-bold">Cost</label> <br />
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                      id="cost"
                      name="cost"
                      type="number"
                      value={values.cost}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.cost && errors.cost ? (
                      <div className="text-red-500">
                        {errors.cost}
                      </div>
                    ) : (<div></div>)}
                  </div>
                </div>

                <div className="flex items-center justify-start space-x-4">
                  <div>
                    <label className="font-bold">Item Code</label> <br />
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                      id="itemCode"
                      name="itemCode"
                      type="text"
                      value={values.itemCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {(touched.itemCode && errors.itemCode) ? (
                      <div className="text-red-500">
                        {errors.itemCode}
                      </div>
                    ) : (<div></div>)}
                  </div>
                  <div>
                    <label className="font-bold">Type</label>
                    <select
                      className="w-full p-2 border border-gray-300 bg-inherit rounded-md"
                      id="type"
                      name="type"
                      value={values.type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select Type</option>
                      <option value="Product">Product</option>
                      <option value="Service">Service</option>
                    </select>
                    {touched.type && errors.type ? (
                      <div className="text-red-500">
                        {errors.type}
                      </div>
                    ) : (<div></div>)}
                  </div>
                </div>
                <div>
                  <label className="font-bold">Description</label> <br />
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.description && errors.description && (
                    <div className="text-red-500">
                      {errors.description}
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