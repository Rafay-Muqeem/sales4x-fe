import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    Typography,
    CardBody,
} from "@material-tailwind/react";

const INVOICE_TABLE_HEAD = ["Customer", "Total", "Quotation Date", "Vehicle"];
const PRODUCT_TABLE_HEAD = ["Product", "Quantity", "Price", "Tax", "Amount"]

export default function printView({ printInvoice, componentRef, selectedTax, taxAmount, totalAmountWithTax }) {
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
            total += calculateAmount(item.price, item.quotation_product.quantity);
        });
        return total;
    };

    useEffect(() => {
        console.log(printInvoice);
        console.log(selectedTax);
    }, [printInvoice])

    if (printInvoice.length !== 0) {
        return (
            <div ref={componentRef} className="hidden print:block">
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-2xl font-bold">Sales4x</h1>
                    <h2 className="text-2xl">Quotation Receipt</h2>
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
                                                {`${printInvoice.Vehicle.make} ${printInvoice.Vehicle.model} ${printInvoice.Vehicle.year}`}
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
                                                {item.quotation_product.quantity}
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
                                                {calculateAmount(item.price, item.quotation_product.quantity)}
                                            </Typography>
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
                            <h1>{calculateTotalAmount(printInvoice.Product)}</h1>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <input
                            className="w-20 p-2 border border-gray-300 rounded-md text-black"
                            type="text"
                            value={selectedTax && `${selectedTax.name} tax`}
                            disabled
                        />
                    </div>

                    <div className="flex items-center justify-between mx-10">
                        <div className="flex items-center justify-between ">
                            <input
                                className="w-9 p-2 border border-gray-300 rounded-md text-black"
                                type="text"
                                value={selectedTax && selectedTax.rate}
                                disabled
                            />
                            <p className="w-9 p-2  text-black" >{selectedTax && selectedTax.type}</p>
                        </div>
                        <div className="text-1xl mt-2">
                            <h1>{taxAmount}</h1>
                        </div>
                    </div>

                    <div>
                    </div>
                    <div className="flex items-center justify-between mx-10">
                        <div className="text-1xl mt-2">
                            <h1>Total</h1>
                        </div>
                        <div className="text-1xl mt-2">
                            <h1>{totalAmountWithTax}</h1>
                        </div>
                    </div>
                </div>
            </ div>
        );
    }
}   