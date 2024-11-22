import React from "react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog } from "@material-tailwind/react";
import { addProduct } from "@/services/addProduct";
import { updateProduct } from "@/services/updateProduct";
import { toast } from 'react-toastify';
import { State } from "@/state/Context";
import { fetchTaxes } from "@/services/fetchTaxes";
import dummyImage from "../../assets/dummyImage.png"

const schema = Yup.object().shape({
  type: Yup.string().required("Type is required"),
  name: Yup.string().required("Name is required"),
  cost: Yup.string().required("Cost is required"),
  margin: Yup.string().required("Margin is required"),
  price: Yup.string().required("Price is required"),
  itemCode: Yup.string(),
  description: Yup.string(),
  taxable: Yup.boolean(true).required("Field is required"),
  image: Yup.mixed().test(
      'fileType',
      'Only image files are allowed',
      (value) => {
        if (!value) return true;
        if (typeof value === 'string') return true;
        return (
          !value ||
          (value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type.toLowerCase()))
        );
      }
    )
});
const MyPopUpForm = ({ refresh, setRefresh, open, close, selectedItem, setSelectedItem }) => {

  const { state } = State();
  const [edit, setEdit] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const [selectedTaxes, setSelectedTaxes] = useState([]);
  const [productPreviewPic, setProductPreviewPic] = useState(null);
  
  const handleClose = () => {
    clearForm(formikProps);
    setEdit(false);
    setSelectedItem(null);
    setSelectedTaxes([]);
    setProductPreviewPic(null);
    close();
  };

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
    if (selectedItem) {
      console.log(selectedItem)
      // separating image from product data
      const { image, ...restItemData } = selectedItem;
      setProductPreviewPic(image);
      formikProps.setValues(selectedItem);
      setSelectedTaxes(selectedItem.Tax.map((tax) => (tax.id)))
      setEdit(true);
    }
  }, [selectedItem]);

  useEffect(() => {
    getTaxes();
  }, [])

  const getTaxes = async () => {
    const fetchedTaxes = await fetchTaxes(state.userToken);
    const taxesData = await fetchedTaxes.json();
    setTaxes(taxesData);
  };

  const onSubmit = async (values) => {
    const productData = new FormData();
    productData.append('name', values.name);
    productData.append('cost', values.cost);
    productData.append('margin', values.margin);
    productData.append('price', values.price);
    productData.append('itemCode', values.itemCode);
    productData.append('type', values.type);
    productData.append('description', values.description);
    productData.append('taxable', values.taxable);
    productData.append('image', values.image);
    productData.append('taxes', JSON.stringify(selectedTaxes));

    try {
      // const productData = {
      //   name: values.name,
      //   cost: values.cost,
      //   price: values.price,
      //   itemCode: values.itemCode, 
      //   type: values.type,
      //   description: values.description,
      //   taxable: values.taxable,
      //   taxes: selectedTaxes,
      // }
      // const data = {
      //   productDetails: JSON.stringify(productData),
      //   productImage: productImageFile
      // }

      if (!edit) {
        const res = await addProduct(productData, state.userToken);
        const product = await res.json();
        if (res.status === 200) {
          showToastMessage('success', product.message)
        }
        else if (res.status === 409) {
          showToastMessage('error', product.message)
        }
      }
      else {
        const res = await updateProduct(selectedItem.id, productData, state.userToken);
        const product = await res.json();
        if (res.status === 200) {
          showToastMessage('success', product.message)
        }
        else if (res.status === 404) {
          showToastMessage('info', product.message)
        }
        else if (res.status === 409) {
          showToastMessage('error', product.message)
        }
      }

      setRefresh(!refresh);
      handleClose();
    } catch (error) {
      console.log(error)
    }
  };


  const handleTax = (value, event) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedTaxes([...selectedTaxes, value]);
    } else {
      setSelectedTaxes(selectedTaxes.filter(id => id !== value));
    }

  }


  const clearForm = (formikProps) => {
    formikProps.resetForm({
      values: {
        name: "",
        cost: "",
        margin: state.business.defaultMargin || 10,
        price: "",
        itemCode: "",
        type: "",
        description: "",
        taxable: false,
        image: productPreviewPic
      },
      errors: {
        name: "",
        cost: "",
        margin: state.business.defaultMargin || 10,
        price: "",
        itemCode: "",
        type: "",
        description: "",
        taxable: false,
        image: ""
      },
    });
  };

  const formikProps = useFormik({
    initialValues: {
      name: "",
      cost: "",
      margin: state.business.defaultMargin || 10,
      price: "",
      itemCode: "",
      type: "",
      description: "",
      taxable: false,
      image: ""
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
    setFieldValue,
  } = formikProps;

  return (
    <Dialog open={open}>
      {open && (
        <form onSubmit={ (e) => handleSubmit(e)} autoComplete="new">
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

              <div className="p-6 overflow-y-auto max-h-[80vh]">
                <div className="flex justify-between space-x-4 mb-3 w-full">
                  <div className="basis-[50%]">
                    <label className="font-bold">Image</label>
                    <input
                      className="w-full p-2 border border-gray-300 bg-inherit rounded-md"
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setProductPreviewPic(URL.createObjectURL(e.target.files[0]))
                        setFieldValue('image', e.target.files[0]);
                      }}
                    />
                    {touched.image && errors.image ? (
                      <div className="text-red-500">{errors.image}</div>
                    ) : null}
                  </div>
                  <div className="basis-[50%] max-h-[150px] overflow-hidden max-w-fit">
                    <img src={productPreviewPic? productPreviewPic : dummyImage} alt="Product" width={150} height={150} />
                  </div>
                </div>
                <div className="flex items-center justify-start space-x-4 mb-3 w-full">
                  <div className="basis-[33.33%]">
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

                  <div className="basis-[33.33%]">
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
                    {touched.name && errors.name && (
                      <div className="text-red-500">
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="basis-[33.33%]">
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
                </div>

                <div className="flex items-center justify-start space-x-4 mb-3 w-full">
                  <div className="basis-[33.33%]">
                    <label className="font-bold">Cost</label> <br />
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                      id="cost"
                      name="cost"
                      type="number"
                      value={values.cost}
                      onChange={(e) => setValues({ ...values, cost: parseFloat(e.target.value) || '', price: parseFloat(e.target.value) + ((parseFloat(e.target.value) * values.margin) / 100) })}
                      onBlur={handleBlur}
                    />
                    {touched.cost && errors.cost ? (
                      <div className="text-red-500">
                        {errors.cost}
                      </div>
                    ) : (<div></div>)}
                  </div>
                  <div className="basis-[33.33%]">
                    <label className="font-bold">Margin %</label> <br />
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                      id="margin"
                      name="margin"
                      type="number"
                      value={values.margin}
                      onChange={(e) => setValues({ ...values, margin: parseFloat(e.target.value) || 0, price: values.cost + ((values.cost * parseFloat(e.target.value) || 0) / 100) })}
                      onBlur={handleBlur}
                    />
                    {(touched.margin && errors.margin) ? (
                      <div className="text-red-500">
                        {errors.margin}
                      </div>
                    ) : (<div></div>)}
                  </div>

                  <div className="basis-[33.33%]">
                    <label className="font-bold">Price</label> <br />
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                      id="price"
                      name="price"
                      type="number"
                      value={values.price}
                      onBlur={handleBlur}
                      disabled={true}
                    />
                    {(touched.price && errors.price) ? (
                      <div className="text-red-500">
                        {errors.price}
                      </div>
                    ) : (<div></div>)}
                  </div>
                </div>
                <div className="w-full">
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

                <div >
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

                {values.taxable &&
                  taxes &&
                  taxes.map((tax) => (

                    <div key={tax.id} className="mb-1 flex">
                      <input
                        className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out cursor-pointer"
                        type="checkbox"
                        id={`permission-${tax.id}`}
                        value={JSON.stringify(tax)}
                        checked={selectedTaxes.includes(tax.id)}
                        onChange={(e) => handleTax(tax.id, e)}
                      />
                      <span className="ml-2 font-medium text-base" htmlFor={`permission-${tax.id}`}>{tax.name}</span>
                    </div>
                  ))
                }



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