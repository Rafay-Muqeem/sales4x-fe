import React from "react";
import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Card,
  Typography,
  CardBody,
  Dialog
} from "@material-tailwind/react";
import {
  XCircleIcon
} from "@heroicons/react/24/outline";
import { fetchProducts } from "@/services/fetchProducts";
import { fetchCustomers } from "@/services/fetchCustomers";
import { fetchTaxes } from "@/services/fetchTaxes";
import { addInvoice } from "@/services/addInvoice";
import { fetchVehicles } from "@/services/fetchVehicles";
import { updateInvoice } from "@/services/updateInvoice";
import PrintView from "./printView";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import { State } from "@/state/Context";
import { fetchBusinesses } from "@/services/fetchBusinesses";

const TABLE_HEAD = [
  "Product",
  "Quantity",
  "Price",
  "Tax",
  "Amount",
  "Action"
]

const schema = Yup.object().shape({
  customer: Yup.string().required("Customer is required"),
  vehicle: Yup.string().required("Vehicle is required"),
  paymentMethod: Yup.string().required("Payment Method is required"),
});

const MyPopUpForm = ({ refresh, setRefresh, open, close, selectedInvoice, setSelectedInvoice }) => {
  const componentRef = useRef();
  const { state } = State();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [taxes, setTaxes] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([{
    product: "",
    quantity: 1,
    price: 0,
    taxable: false
  }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceId, setInvoiceId] = useState('');
  const [edit, setEdit] = useState(false);
  const [printInvoice, setPrintInvoice] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [business, setBusiness] = useState(null);
  const [appliedTaxes, setAppliedTaxes] = useState([]);

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

  // close popup
  const handleClose = () => {
    setSelectedCustomer(null)
    setSelectedVehicle(null)
    setSelectedInvoice(null)
    setSelectedProducts([{
      product: "",
      quantity: 1,
      price: 0,
      taxable: false
    }]);
    setAppliedTaxes([]);
    clearForm(formikProps);
    setEdit(false)
    setBusiness(null);
    close();
  };

  // get businesses
  const getBusinesses = async () => {
    try {
      const res = await fetchBusinesses(state.userToken);
      const businesses = await res.json();
      setBusiness(businesses[0].id)
      setBusinesses(businesses)
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    getBusinesses();
    getProducts();
    getCustomers();
    getTaxes();
  }, []);

  useEffect(() => {
    if (selectedInvoice) {
      setPrintInvoice(selectedInvoice);
      setInvoiceId(selectedInvoice.id)
      setSelectedCustomer(selectedInvoice.Customer)
      setSelectedVehicle(selectedInvoice.CustomerVehicle)
      setProducts(selectedInvoice.Product)
      setValues({ ...values, ['customer']: selectedInvoice.CustomerId, ['vehicle']: selectedInvoice.CustomerVehicleId, ['paymentMethod']: selectedInvoice.paymentMethod })
      setEdit(true)
      setBusiness(selectedInvoice.BusinessId);

      let selectedProd = [...selectedProducts]
      const productTaxes = [];
      selectedInvoice.Product.forEach((prod) => {
        const aProd = {
          product: prod.id,
          id: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: prod.invoice_product.quantity,
          taxable: prod.taxable
        }
        selectedProd = [aProd, ...selectedProd];
        prod.Tax?.forEach(productTax => {
          productTaxes.some(tax => tax.id === productTax.id)? null : productTaxes.push(productTax);
        })
      })
      setAppliedTaxes(productTaxes);
      setSelectedProducts(selectedProd);
      setSelectedInvoice(null)
    }

  }, [selectedInvoice])

  // handle submit
  const onSubmit = async (values) => {

    const selectedProductIds = selectedProducts.map((product) => `${product.id}:${product.quantity}`);
    selectedProductIds.pop();
   
    const data = {
      invoiceData: {        
        totalAmount: calculateTotalAmountWithTax(),
        paymentMethod: values.paymentMethod,
        paymentStatus: "Paid",
        CustomerId: selectedCustomer.id,
        CustomerVehicleId: selectedVehicle.id,
        BusinessId: null
      },
      "products": selectedProductIds,
    };

    let updatedData = {};
    if (state.userInfo.role === 'super_admin') {
      updatedData = { ...data, invoiceData: { ...data.invoiceData, BusinessId: business } };
    }
    else {
      updatedData = { ...data, invoiceData: { ...data.invoiceData, BusinessId: state.business.id } };
    }

    if (edit) {
      const res = await updateInvoice(invoiceId, updatedData, state.userToken)
      const invoice = await res.json();
      if (res.status === 200) {
        showToastMessage('success', invoice.message)
      }
      else if (res.status === 404) {
        showToastMessage('info', invoice.message)
      }
      else if (res.status === 409) {
        showToastMessage('error', invoice.message)
      }
    }
    else {
      const res = await addInvoice(updatedData, state.userToken)
      const invoice = await res.json();
      if (res.status === 200) {
        showToastMessage('success', invoice.message)
      }
      else if (res.status === 409) {
        showToastMessage('error', invoice.message)
      }
    }
    setRefresh(!refresh);
    handleClose();
  };

  // get products
  const getProducts = async () => {
    try {
      const fetchedProducts = await fetchProducts(state.userToken);
      const productsData = await fetchedProducts.json();
      setProducts(productsData);
    } catch (error) {
      console.log(error.message);
      showToastMessage('error', 'Something went wrong');
    }
  };

  // handle product change
  const handleProductChange = async (index, quantity, selectedProId) => {
    const updatedItems = [...selectedProducts];
    updatedItems[index].product = selectedProId; // Assign the selected product's ID to product

    const existingProductIndex = selectedProducts.findIndex(prod => prod.id === selectedProId);

    if (existingProductIndex !== -1) {
      const updatedItems = [...selectedProducts];
      updatedItems[existingProductIndex].quantity += quantity;

      updatedItems[index].product = ""; // Reset to empty string or default value
      setSelectedProducts(updatedItems);
    }
    else {
      const selectedProductDetails = products.find(
        (product) => product.id === selectedProId
      );

      // adding taxes
      const productTaxes = [];
      selectedProductDetails.Tax?.forEach(productTax => {
        productTaxes.some(tax => tax.id === productTax.id)? null : productTaxes.push(productTax);
      })
      setAppliedTaxes(productTaxes);
      
      if (selectedProductDetails) {
        updatedItems[index].id = selectedProductDetails.id; // Assign the selected product's ID
        updatedItems[index].name = selectedProductDetails.name;
        updatedItems[index].quantity = quantity;
        updatedItems[index].price = selectedProductDetails.price;
        updatedItems[index].taxable = selectedProductDetails.taxable;
      } else {
        updatedItems[index].id = "";
        updatedItems[index].name = "";
        updatedItems[index].quantity = 1;
        updatedItems[index].price = 0;
        updatedItems[index].taxable = false;
      }

      setSelectedProducts(updatedItems);

      const isLastRow = index === selectedProducts.length - 1;
      const isNewProductSelected = selectedProId !== "";

      if (isLastRow && isNewProductSelected) {
        const newItem = {
          id: "",
          product: "",
          name: "",
          quantity: 1,
          price: 0,
          taxable: false,
        };
        setSelectedProducts([...updatedItems, newItem]);
      }
    }

  };

  // handle quantity change
  const handleQuantityChange = (index, quantity) => {
    const updatedItems = [...selectedProducts];
    updatedItems[index].quantity = Number(quantity);
    setSelectedProducts(updatedItems);
  };

  // calculate amount
  const calculateAmount = (price, quantity) => {
    return price * quantity;
  };

  // handle taxable change
  const handleTaxableChange = (index, isChecked) => {
    const updatedItems = [...selectedProducts];
    updatedItems[index].taxable = isChecked;
    setSelectedProducts(updatedItems);
  };

  // handle remove product
  const handleRemoveProduct = (index) => {
    if (selectedProducts.length > 1) {
      const updatedItems = [...selectedProducts];
      updatedItems.splice(index, 1);
      setSelectedProducts(updatedItems);
      setAppliedTaxes([]);
    }
  };

  // get customers
  const getCustomers = async () => {
    const fetchedCustomers = await fetchCustomers(state.userToken);
    const customersData = await fetchedCustomers.json();
    setCustomers(customersData);
  };

  // handle customer change
  const handleCustomerChange = (customerId) => {
    const foundCustomer = customers.find(
      (customer) => `${customer.id}` === customerId
    );
    setSelectedCustomer(foundCustomer);
    if (foundCustomer && foundCustomer.Vehicle.length > 0) {
      setSelectedVehicle(foundCustomer.Vehicle[0]);
      setValues({ ...values, ['customer']: customerId, ['vehicle']: foundCustomer.Vehicle[0].id })
    };
    // setValues({ ...values, ['customer']: customerId })
  };

  // handle vehicle change
  const handleVehicleChange = (vehicleId) => {
    const foundVehicle = selectedCustomer.Vehicle.find(
      (vehicle) => `${vehicle.id}` === vehicleId
    );
    setSelectedVehicle(foundVehicle);
    setValues({ ...values, ['vehicle']: vehicleId })
  };

  // calculate total amount
  const calculateTotalAmount = () => {
    let total = 0;
    selectedProducts.forEach((item) => {
      total += calculateAmount(item.price, item.quantity);
    });
    return total;
  };

  const calculateTaxAmount = (tax) => {
    if (tax) {
      if (tax.type === '$') {
        return tax.rate;
      } else if (tax.type === '%') {
          const taxableProducts = selectedProducts.filter(product => product.taxable === true);
          const totalTaxableAmount = taxableProducts.reduce((acc, product) => {
            return acc + (product.price * product.quantity);
          }, 0);
          return ((totalTaxableAmount * tax.rate) / 100).toFixed(2);
        }
      };
  }

  // calculate tax amount
  const calculateTotalTaxAmount = () => {
    let totalTaxAmount=0;
    if (appliedTaxes.length > 0) {
      appliedTaxes.forEach((tax) => {
        if (tax.type === '$') {
          totalTaxAmount+=tax.rate;
        } else if (tax.type === '%') {
          const taxableProducts = selectedProducts.filter(product => product.taxable === true);
          const totalTaxableAmount = taxableProducts.reduce((acc, product) => {
            return acc + (product.price * product.quantity);
          }, 0);

          totalTaxAmount+=(totalTaxableAmount * tax.rate) / 100;
        }
      });
      return totalTaxAmount;
    }
    return 0;
  };

  // calculate total amount with tax
  const calculateTotalAmountWithTax = () => {
    return (totalAmount + calculateTotalTaxAmount()).toFixed(2);
  };

  useEffect(() => {
    const total = calculateTotalAmount();
    setTotalAmount(total);
  }, [selectedProducts]);

  // get taxes
  const getTaxes = async () => {
    try {
      const fetchedTaxes = await fetchTaxes(state.userToken);
      const taxesData = await fetchedTaxes.json();
      setTaxes(taxesData);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong")
    }
  };

  // handle tax change
  const handleTaxChange = (taxId) => {
    const foundTax = taxes.find(
      (tax) => `${tax.id}` === taxId
    );
    const isTaxAlreadyApplied = appliedTaxes.some(tax => tax.id === foundTax.id);
    if (!isTaxAlreadyApplied) setAppliedTaxes([...appliedTaxes, foundTax]);
  };

  // set default tax
  useEffect(() => {
    if (taxes.length > 0) {
      const foundtax = taxes.find(
        (tax) => tax.default === true
      );

      // setAppliedTaxes([foundtax]);
    }
  }, [taxes]);

  const clearForm = (formikProps) => {
    formikProps.resetForm({
      values: {
        customer: "",
        vehicle: "",
        paymentMethod: "",
      },
      errors: {
        customer: "",
        vehicle: "",
        paymentMethod: "",
      },
    });
    setSelectedCustomer(null);
    setSelectedVehicle(null);
    setSelectedProducts([{
      product: "",
      quantity: 1,
      price: 0,
      taxable: false
    }])
  };

  const formikProps = useFormik({
    initialValues: {
      customer: "",
      vehicle: "",
      paymentMethod: "",
    },
    validationSchema: schema,
    onSubmit,
  });

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    setValues,
  } = formikProps;

  return (
    <>
      <Dialog open={open} size="lg">
        {open && (
          <form onSubmit={handleSubmit}>
            <div className="">
              <div className="bg-white rounded shadow-xl">
                <div className="flex items-center justify-between sticky bg-gradient-to-br from-gray-800 to-gray-700">
                  <div></div>
                  <div className="text-white text-center text-lg">
                    {edit ? "EDIT INVOICE" : "NEW INVOICE"}
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

                <div className="overflow-y-auto h-[80vh] overflow-x-hidden p-2">
                  <div className="flex gap-4">
                    <div className="basis-[40%] max-w-[40%]">
                      <label className="p-2 font-bold">Customer</label> <br />
                      <select
                        id="customer"
                        name="customer"
                        className="w-48 lg:w-80 m-2 p-2 border border-gray-300 bg-inherit rounded-md"
                        value={values.customer}
                        onChange={(e) =>
                          handleCustomerChange(e.target.value)
                        }
                        onBlur={handleBlur}
                      >
                        <option value="">Select Customer</option>
                        {customers.map((customer) => (
                          <option
                            key={customer.id}
                            value={customer.id}
                          >
                            {customer.firstName} {customer.lastName}
                          </option>
                        ))}
                      </select>
                      {touched.customer && errors.customer ? (
                        <div className="text-red-500">
                          {errors.customer}
                        </div>
                      ) : (<div></div>)} <br />

                      <label className="p-2 font-bold">Name</label> <br />
                      <input
                        className="w-48 lg:w-72 m-2 p-2 border border-gray-300 rounded-md text-black"
                        id="email"
                        name="email"
                        type="email"
                        value={selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : ''}
                        disabled
                      /> <br />

                      <label className="p-2 font-bold">Email</label> <br />
                      <input
                        className="w-48 lg:w-72 m-2 p-2 border border-gray-300 rounded-md text-black"
                        id="email"
                        name="email"
                        type="email"
                        value={selectedCustomer ? selectedCustomer.email : ''}
                        disabled
                      /> <br />

                      <label className="p-2 font-bold">Phone</label> <br />

                      <input
                        className="w-48 lg:w-72 m-2 p-2 border border-gray-300 rounded-md text-black"
                        id="phone"
                        name="phone"
                        type="text"
                        value={selectedCustomer ? selectedCustomer.phone : ''}
                        disabled
                      /> <br />

                      <div>
                        <label className="p-2 font-bold">Address</label> <br />

                        <textarea
                          className="w-48 lg:w-80 m-2 p-2 border border-gray-300 rounded-md text-black"
                          id="address"
                          name="address"
                          type="text"
                          value={selectedCustomer ? `${selectedCustomer.Address.street}, ${selectedCustomer.Address.city}` : ''}
                          disabled
                        />
                      </div>
                    </div>                    

                    <div className="basis-[60%] max-w-[60%]">
                      <label className="p-2 font-bold">Vehicle</label> <br />
                      <select
                        id="vehicle"
                        name="vehicle"
                        className="w-48 lg:w-72 m-2 p-2 border border-gray-300 bg-inherit rounded-md"
                        value={values.vehicle}
                        onChange={(e) =>
                          handleVehicleChange(e.target.value)
                        }
                        onBlur={handleBlur}
                      >

                        {selectedCustomer && selectedCustomer.Vehicle.length > 0? selectedCustomer.Vehicle.map((vehicle) => (
                          <option
                            key={vehicle.id}
                            value={vehicle.id}
                          >
                            {vehicle.make} {vehicle.model}
                          </option>
                        ))
                        :
                          <option value="">Select Vehicle</option>
                        }
                      </select>
                      {touched.vehicle && errors.vehicle ? (
                        <div className="text-red-500">
                          {errors.vehicle}
                        </div>
                      ) : (<div></div>)} <br />
                      <div className="flex gap-5">
                        <div className="flex flex-col">
                          <div>
                          <label className="p-2 font-bold">Make</label> <br />
                          <input
                            className="w-48 lg:w-72 m-2 p-2 border border-gray-300 rounded-md text-black"
                            id="make"
                            name="make"
                            type="text"
                            value={selectedVehicle ? selectedVehicle.make : ''}
                            disabled
                          /> <br />
                          </div>

                          <div>
                          <label className="p-2 font-bold">Model</label> <br /> 
                          <input
                            className="w-48 lg:w-72 m-2 p-2 border border-gray-300 rounded-md text-black"
                            id="model"
                            name="model"
                            type="text"
                            value={selectedVehicle ? selectedVehicle.model : ''}
                            disabled
                          /> <br />
                          </div>
                        </div>
                        <div className="flex flex-col" >
                          <div>
                          <label className="p-2 font-bold">Year</label> <br /> 
                          <input
                            className="w-48 lg:w-72 m-2 p-2 border border-gray-300 rounded-md text-black"
                            id="year"
                            name="year"
                            type="number"
                            value={selectedVehicle ? selectedVehicle.year : ''}
                            disabled
                          /> <br /> 
                          </div>

                          <div>
                          <label className="p-2 font-bold">Color</label> <br /> 
                          <input
                            className="w-48 lg:w-72 m-2 p-2 border border-gray-300 rounded-md text-black"
                            id="color"
                            name="color"
                            type="text"
                            value={selectedVehicle ? selectedVehicle.color : ''}
                            disabled
                          /> <br />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-5">
                        <div className="flex flex-col" >
                          <div>
                          <label className="p-2 font-bold">Odometer</label> <br /> 
                          <input
                            className="w-48 lg:w-72 m-2 p-2 border border-gray-300 rounded-md text-black"
                            id="year"
                            name="year"
                            type="number"
                            value={selectedVehicle ? selectedVehicle.odometer : ''}
                            disabled
                          /> <br /> 
                          </div>

                          <div>
                          <label className="p-2 font-bold">License No.</label> <br /> 
                          <input
                            className="w-48 lg:w-72 m-2 p-2 border border-gray-300 rounded-md text-black"
                            id="color"
                            name="color"
                            type="text"
                            value={selectedVehicle ? selectedVehicle.licenseNo : ''}
                            disabled
                          /> <br />
                          </div>
                        </div>
                        <div className="flex flex-col ml-3 place-self-end">
                          <div className="text-5xl mt-5">
                            <h1>$  {calculateTotalAmountWithTax()}</h1>
                          </div>

                          <div className="mt-3">
                            {/* <label className="p-2 font-bold">Date</label> <br />
                          <input
                            className="w-48 lg:w-72 m-2 p-2 border border-gray-300 rounded-md text-black"
                            id="date"
                            name="date"
                            type="date"
                          /> */}
                            <label className="p-2 font-bold">Payment Method</label> <br />
                            <select
                              id="paymentMethod"
                              name="paymentMethod"
                              className="w-48 lg:w-72 m-2 p-2 border border-gray-300 bg-inherit rounded-md"
                              value={values.paymentMethod}
                              onChange={(e) =>
                                setValues({ ...values, ['paymentMethod']: e.target.value })
                              }
                              onBlur={handleBlur}
                            >
                              <option value="">Select Payment Method</option>
                              <option value="Cash">Cash</option>
                              <option value="Check">Check</option>
                              <option value="Card">Card</option>
                            </select>
                            {touched.paymentMethod && errors.paymentMethod ? (
                              <div className="text-red-500">
                                {errors.paymentMethod}
                              </div>
                            ) : (<div></div>)}

                            {state.userInfo.role === 'super_admin' && (
                              <div>
                                <label className="p-2 font-bold">Select Business</label> <br />
                                <select
                                  className="w-48 p-2 border border-gray-300 bg-inherit rounded-md"
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
                                >
                                  {businesses ?
                                    businesses.map((business) => (
                                      <option key={business.id} value={business.id}>{business.name}, {business.location}</option>
                                    )) : []}
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                                                                  
                    </div>                  
                  </div>

                  <Card className=" w-full">
                    <CardBody className="p-2">
                      <table className="w-full min-w-max table-auto text-left ">
                        <thead>
                          <tr>
                            {TABLE_HEAD.map((head) => (
                              <th
                                key={head}
                                className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                              >
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal leading-none opacity-70"
                                >
                                  {head}
                                </Typography>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedProducts.map((item, index) => (
                            <tr key={index}>
                              <td className="p-4 border-b border-blue-gray-50">
                                <div>
                                  <select
                                    className="w-full p-2 border border-gray-300 bg-inherit rounded-md"
                                    value={item.product}
                                    onChange={(e) =>
                                      handleProductChange(index, item.quantity, e.target.value)
                                    }
                                  >
                                    <option value="">Select Product</option>
                                    {products.map((product) => (
                                      <option
                                        key={product.id}
                                        value={product.id}
                                      >
                                        {product.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </td>
                              <td className="p-4 border-b border-blue-gray-50">
                                <input
                                  type="number"
                                  min={1}
                                  className="w-14 p-2 border rounded-md text-black"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(index, e.target.value)
                                  }
                                />
                              </td>
                              <td className="p-4 border-b border-blue-gray-50">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal opacity-70"
                                >
                                  {item.price}
                                </Typography>
                              </td>
                              <td className="p-4 border-b border-blue-gray-50">
                                <input
                                  type="checkbox"
                                  checked={item.taxable}
                                  readOnly
                                  onChange={(e) => handleTaxableChange(index, e.target.checked)}
                                />
                              </td>
                              <td className="p-4 border-b border-blue-gray-50">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal opacity-70"
                                >

                                  {calculateAmount(item.price, item.quantity)}
                                </Typography>
                              </td>
                              <td className="p-4 border-b border-blue-gray-50 text-center px-4 py-2">
                                {index !== selectedProducts.length - 1 ?
                                  <XCircleIcon
                                    onClick={() => handleRemoveProduct(index)}
                                    className="h-6 w-6 text-gray-600 hover:text-red-500 cursor-pointer"
                                  />
                                  :
                                  null
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>

                      </table>
                    </CardBody>
                  </Card>

                  <div className="flex">
                    <div className="basis-[50%] max-w-[50%]">
                    </div>

                    <div className="basis-[50%] max-w-[50%]">
                      <div className="flex items-center justify-between mx-10">
                        <div className="text-1xl mt-5 px-1">
                          <h1>Subtotal</h1>
                        </div>
                        <div className="text-1xl mt-5">
                          <h1>{totalAmount} $</h1>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 mx-10 my-2">
                        {appliedTaxes.map((tax) => (
                          <div className="flex justify-between">
                            <span className="rounded border w-min p-2 whitespace-nowrap self-center" >{tax.name}</span>
                            <span className="w-fit p-2 border border-gray-300 rounded-md text-black self-center" >{tax.rate} {tax.type}</span>
                            <div className="flex items-center justify-center">                              
                              {/* <p className="w-9 p-2 text-black" >{tax.type}</p> */}
                              <div className="text-1xl mt-2">
                                <h1>{calculateTaxAmount(tax)} $</h1>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between mx-10">
                        <div className="w-min" >
                          <select
                            className="w-min p-2 border border-gray-300 bg-inherit rounded-md outline-none"
                            value={""}
                            onChange={(e) =>
                              handleTaxChange(e.target.value)
                            }
                          >
                            <option value="">Select Tax</option>
                            {taxes.map((tax) => (
                              <option
                                key={tax.id}
                                value={tax.id}
                              >
                                {tax.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div></div>
                        {/* <div className="flex items-center justify-between mx-10">
                          <div className="flex items-center ">
                            <input
                              className="w-9 p-2 border border-gray-300 rounded-md text-black"
                              id="phone"
                              name="phone"
                              type="text"
                              value={selectedTax && selectedTax.rate}
                              disabled
                            />
                            <p className="w-9 p-2  text-black" >{selectedTax && selectedTax.type}</p>
                          </div>
                          <div className="text-1xl mt-2">
                            <h1>{calculateTaxAmount()}</h1>
                          </div>
                        </div> */}
                      </div>

                      <div className="flex items-center justify-between mx-10">
                        <div className="text-1xl mt-2 px-1">
                          <h1>Total</h1>
                        </div>
                        <div className="text-1xl mt-2">
                          <h1>{calculateTotalAmountWithTax()} $</h1>
                        </div>
                      </div>

                    </div>
                              
                    
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2 sticky bg-gradient-to-br from-gray-800 to-gray-700">
                  {edit && (
                    <ReactToPrint
                      trigger={() => <button
                        className=" w-32 bg-gray-600 hover:bg-gray-900 text-white font-bold py-2 px-4"
                        type="button"
                      >
                        Print
                      </button>}
                      content={() => componentRef.current}
                    />
                  )}

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
                    {edit ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

          </form>

        )}
      </Dialog>
      <PrintView business={state.business} printInvoice={printInvoice} componentRef={componentRef} appliedTaxes={appliedTaxes} calculateTaxAmount={calculateTaxAmount} totalAmountWithTax={calculateTotalAmountWithTax()} />
    </>
  );
};

export default MyPopUpForm;
