import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    Typography,
    CardBody,
} from "@material-tailwind/react";

const INVOICE_TABLE_HEAD = ["Customer", "Status", "Payment Method", "Total", "Invoice Date", "Vehicle"];
const PRODUCT_TABLE_HEAD = ["Product", "Quantity", "Price", "Tax", "Amount"]

export default function printView({ business, printInvoice, componentRef, appliedTaxes, calculateTaxAmount, totalAmountWithTax }) {
    const currentDate = new Date().toLocaleDateString();

    const formatCreatedAt = (createdAt) => {
        const date = new Date(createdAt);
        return date.toLocaleString();
    };

    const calculateAmount = (price, quantity) => {
        return price * quantity;
    };

    const calculateTotalAmount = (products) => {
        let total = 0;
        products.forEach((item) => {
            total += calculateAmount(item.price, item.invoice_product.quantity);
        });
        return total;
    };

    if (printInvoice.length !== 0) {

        return (
            <div ref={componentRef} className="hidden print:block">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                        <img src={business?.logo} className="rounded-xl h-[60px] w-[60px]" alt="Business logo" width={60} height={60} />
                        <div className="flex flex-col items-center">
                            <h3 className="text-2xl font-bold">Sales4x</h3>
                            <span className="text-sm font-normal text-gray-600">({business?.name})</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold">Invoice Receipt</h2>
                    <p className="text-sm">{currentDate}</p>
                </div>
                <Card className="h-full w-full ">
                    <CardBody className="p-2 px-0">
                        <table className=" w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {INVOICE_TABLE_HEAD.map((head) => (
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
                            <tbody>
                                {printInvoice.length !== 0 ?
                                    <tr key={printInvoice.id}>
                                        <td>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal p-2"
                                            >
                                                {printInvoice.Customer.firstName} {printInvoice.Customer.lastName}
                                            </Typography>
                                        </td>

                                        <td>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal p-2"
                                            >
                                                {printInvoice.paymentStatus}
                                            </Typography>
                                        </td>

                                        <td>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal p-2"
                                            >
                                                {printInvoice.paymentMethod}
                                            </Typography>
                                        </td>

                                        <td>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal p-2"
                                            >
                                                {printInvoice.totalAmount}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal p-2"
                                            >
                                                {formatCreatedAt(printInvoice.createdAt)}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal p-2"
                                            >
                                                {`${printInvoice.CustomerVehicle.make} ${printInvoice.CustomerVehicle.model} ${printInvoice.CustomerVehicle.year}`}
                                            </Typography>
                                        </td>
                                    </tr>
                                    :
                                    null
                                }
                            </tbody>
                        </table>
                    </CardBody>
                </Card>

                <Card className=" w-full">
                    <CardBody className="p-2">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {PRODUCT_TABLE_HEAD.map((head) => (
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
                                {printInvoice.Product.map((item, index) => (
                                    <tr key={index}>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                {item.name}
                                            </Typography>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                {item.invoice_product.quantity}
                                            </Typography>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                {item.price}
                                            </Typography>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={item.taxable}
                                                readOnly
                                            />
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal opacity-70"
                                            >
                                                {calculateAmount(item.price, item.invoice_product.quantity)}
                                            </Typography>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </CardBody>
                </Card>
                <div className="flex ">
                    <div className="basis-[50%] max-w-[50%]">
                    </div>
                    
                    <div className="basis-[50%] max-w-[50%]">
                        <div className="flex items-center justify-between mx-10">
                            <div className="text-1xl mt-5">
                                <h1>Subtotal</h1>
                            </div>
                            <div className="text-1xl mt-5">
                                <h1>{calculateTotalAmount(printInvoice.Product)} $</h1>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mx-10 my-2">     
                        {appliedTaxes.map((tax, index) => (
                            <div key={index} className="flex justify-between">
                                <span className="rounded border w-min p-2 whitespace-nowrap self-center" >{tax.name}</span>
                                <span className="w-fit p-2 border border-gray-300 rounded-md text-black self-center" >{tax.rate} {tax.type}</span>
                                <div className="flex items-center justify-center">
                                    <div className="text-1xl mt-2">
                                        <h1>{calculateTaxAmount(tax)} $</h1>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                        <div className="flex items-center justify-between mx-10">
                            <div className="text-1xl mt-2">
                                <h1>Total</h1>
                            </div>
                            <div className="text-1xl mt-2">
                                <h1>{totalAmountWithTax} $</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}   