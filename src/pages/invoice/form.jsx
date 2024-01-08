import React from "react";
import { useState, useEffect } from "react";
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



const TABLE_HEAD = [
  "Product",
  "Quantity",
  "Price",
  "Tax",
  "Amount",
  "Action"
]
const MyPopUpForm = ({ refresh, setRefresh, open, close,selectedInvoice }) => {
  console.log(selectedInvoice);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [taxes, setTaxes] = useState([]);
  const [selectedTax, setSelectedTax] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleClose = () => {
    close();
  };

  useEffect(() => {
    getProducts();
    getCustomers();
    getTaxes();
    setSelectedProducts([
      {
        product: "",
        quantity: 1,
        price: 0,
        taxable: false
      }
    ]);
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    const selectedProductIds = selectedProducts.map((product) => product.id);
    const data = {
      "invoiceData":{
        
        
        "totalAmount":calculateTotalAmountWithTax(),
        "paymentMethod": "Card....",
        "paymentStatus": "paid....",
        
        "CustomerId": selectedCustomer.id,
        "VehicleId": "c8b88990-25f6-4262-9795-6e8cca895706",
      },
      
      "products":selectedProductIds,
    };
    const res = await addInvoice(data)
    setRefresh(!refresh);
    handleClose();
    console.log(res);
    
  };

  const getProducts = async () => {
    const fetchedProducts = await fetchProducts();
    const productsData = await fetchedProducts.json();
    setProducts(productsData);

  };

  const handleProductChange = async (index, selectedProId) => {
    const updatedItems = [...selectedProducts];
    updatedItems[index].product = selectedProId; // Assign the selected product's ID to product
  
    const selectedProductDetails = products.find(
      (product) => product.id === selectedProId
    );
  
    if (selectedProductDetails) {
      updatedItems[index].id = selectedProductDetails.id; // Assign the selected product's ID
      updatedItems[index].name = selectedProductDetails.name;
      updatedItems[index].price = selectedProductDetails.price;
      updatedItems[index].taxable = selectedProductDetails.taxable;
    } else {
      updatedItems[index].id = "";
      updatedItems[index].name = "";
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
  };
  
  const handleQuantityChange = (index, quantity) => {
    const updatedItems = [...selectedProducts];
    updatedItems[index].quantity = quantity;
    setSelectedProducts(updatedItems);
  };



  const calculateAmount = (price, quantity) => {
    return price * quantity;
  };
  const handleTaxableChange = (index, isChecked) => {
    const updatedItems = [...selectedProducts];
    updatedItems[index].taxable = isChecked;
    setSelectedProducts(updatedItems);
  };
  const handleRemoveProduct = (index) => {
    if (selectedProducts.length > 1) {
      const updatedItems = [...selectedProducts];
      updatedItems.splice(index, 1);
      setSelectedProducts(updatedItems);
    }
  };


  const getCustomers = async () => {
    const fetchedCustomers = await fetchCustomers();
    const customersData = await fetchedCustomers.json();
    setCustomers(customersData);

  };

  const handleCustomerChange = (customerId) => {
    const foundCustomer = customers.find(
      (customer) => `${customer.id}` === customerId
    );

    setSelectedCustomer(foundCustomer);

  };

  const calculateTotalAmount = () => {
    let total = 0;
    selectedProducts.forEach((item) => {
      total += calculateAmount(item.price, item.quantity);
    });
    return total;
  };

  const calculateTaxAmount = () => {
    if (selectedTax.type === '$') {
      return selectedTax.rate; 
    } else if (selectedTax.type === '%') {
      const taxableProducts = selectedProducts.filter(product => product.taxable === true);
      const totalTaxableAmount = taxableProducts.reduce((acc, product) => {
        return acc + (product.price * product.quantity);
      }, 0);
      return (totalTaxableAmount * selectedTax.rate) / 100; 
    }
    return 0;
  };
  
  
  const calculateTotalAmountWithTax = () => {

    return totalAmount + calculateTaxAmount();;
  };
  useEffect(() => {
    const total = calculateTotalAmount();
    setTotalAmount(total);
  }, [selectedProducts]);


  const getTaxes = async () => {
    const fetchedTaxes = await fetchTaxes();
    const taxesData = await fetchedTaxes.json();
    setTaxes(taxesData);

  };

  const handleTaxChange = (taxId) => {
    const foundtax = taxes.find(
      (tax) => `${tax.id}` === taxId
    );

    setSelectedTax(foundtax);

  };

  useEffect(() => {
    const foundtax = taxes.find(
      (tax) => tax.default === true
    );
    setSelectedTax(foundtax);
  }, [taxes]);


  return (
    <Dialog open={open}>
      {open && (
        <form onSubmit={handleSave} >
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="bg-white rounded shadow-xl">
              <div className="flex items-center justify-between sticky bg-gradient-to-br from-gray-800 to-gray-700">
                <div></div>
                <div className="text-white text-center text-lg">
                  Invoice
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="p-2 font-bold">Customer</label> <br />
                  <select
                    className="w-52 m-2 p-2 border border-gray-300 bg-inherit rounded-md"
                    // value={item.product}
                    onChange={(e) =>
                      handleCustomerChange(e.target.value)
                    }
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
                  </select> <br />
                  <label className="p-2 font-bold">Email</label> <br />
                  <input
                    className="w-52 m-2 p-2 border border-gray-300 rounded-md text-black"
                    id="email"
                    name="email"
                    type="email"
                    value={selectedCustomer ? selectedCustomer.email : ''}
                    disabled
                  /> <br />
                  <label className="p-2 font-bold">Phone</label> <br />

                  <input
                    className="w-52 m-2 p-2 border border-gray-300 rounded-md text-black"
                    id="phone"
                    name="phone"
                    type="text"
                    value={selectedCustomer ? selectedCustomer.phone : ''}
                    disabled
                  /> <br />

                </div>




                <div className="flex flex-col ">
                  <div className="text-5xl mt-5">
                    <h1>$   {calculateTotalAmountWithTax()}</h1>
                  </div>

                  <div className="mt-3">
                    <label className="p-2 font-bold">Date</label> <br />
                    <input
                      className="w-52 m-2 p-2 border border-gray-300 rounded-md text-black"
                      id="date"
                      name="date"
                      type="date"
                    />
                  </div>
                  <div>
                    <label className="p-2 font-bold">Address</label> <br />

                    <input
                      className="w-52 m-2 p-2 border border-gray-300 rounded-md text-black"
                      id="address"
                      name="address"
                      type="text"
                      value={selectedCustomer ? selectedCustomer.address : ''}
                      disabled
                    />
                  </div>
                </div>

              </div>

              <Card className="h-full w-full">
                <CardBody className="p-2 overflow-y-auto max-h-80">
                  <table className="w-full min-w-max table-auto text-left">
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
                                  handleProductChange(index, e.target.value)
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
                          <td className="p-4 border-b border-blue-gray-50 text-center px-4 py-2 cursor-pointer">
                            <XCircleIcon
                              onClick={() => handleRemoveProduct(index)}
                              className="h-6 w-6 text-gray-600 hover:text-red-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </CardBody>
              </Card>

              <div className="grid grid-cols-2 ">
                <div>
                </div>

                <div className="flex items-center justify-between mx-10">
                  <div className="text-1xl mt-5">
                    <h1>Subtotal</h1>
                  </div>
                  <div className="text-1xl mt-5">
                    <h1>{totalAmount}</h1>
                  </div>
                </div>

                <div className="flex justify-end">
                  <select
                    className="w-32 p-2 border border-gray-300 bg-inherit rounded-md"
                    value={selectedTax && selectedTax.id}
                    onChange={(e) =>
                      handleTaxChange(e.target.value)
                    }
                  >
                    
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

                <div className="flex items-center justify-between mx-10">
                  <div className="flex items-center justify-between ">
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
                </div>

                <div>
                </div>
                <div className="flex items-center justify-between mx-10">
                  <div className="text-1xl mt-2">
                    <h1>Subtotal</h1>
                  </div>
                  <div className="text-1xl mt-2">
                    <h1>{calculateTotalAmountWithTax()}</h1>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 sticky bg-gradient-to-br from-gray-800 to-gray-700">
                <button
                  className="w-32 bg-gray-600 hover:bg-gray-900 text-white font-bold py-2 px-4"
                  type="submit"
                >
                  Save
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
