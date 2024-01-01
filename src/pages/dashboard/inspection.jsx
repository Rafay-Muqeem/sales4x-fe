import React, { useState, useRef } from 'react';
import { WrenchIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Button, Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { inspectionReport } from "../../data/inspection-report";
import ReactToPrint from 'react-to-print';

export function Inspection() {

    const componentRef = useRef();
    const [data, setData] = useState(inspectionReport);

    const handleStatusInputs = (index, fieldName, newValue) => {
        // const newData = [...data];
        // data[index]['good'] = false;
        // data[index]['fair'] = false;
        // data[index]['poor'] = false;
        // data[index][fieldName] = newValue;

        // setData(newData)
        setData(prevData => {
            const newData = prevData.map((item, idx) => {
                if (idx === index) {
                    return {
                        ...item,
                        good: false,
                        fair: false,
                        poor: false,
                        [fieldName]: newValue,
                    };
                }
                return item;
            });
            return newData;
        });
    }

    const Reset = () => {
        setData(inspectionReport)
    }

    const handleDetailInput = (index, fieldName, newValue) => {
        const newData = [...data];
        newData[index][fieldName] = newValue;
        setData(newData);
    }

    const handleDel = (index) => {
        const newData = data.filter(item => item !== data[index]);
        setData(newData);
    }

    const currentDate = new Date().toLocaleDateString();

    return (
        <Card className="h-full w-full ">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-4 sm:mb-0 flex items-center">
                    <Typography variant="h5" color="blue-gray" className="flex items-center">
                        <WrenchIcon className="h-12 w-12 text-blueGray-500 ml-2" />
                        Inspection
                    </Typography>
                </div>
                <div className="flex flex-col lg:flex-row items-center w-full mt-5">
                    <div className="w-full lg:w-2/5 flex items-center justify-center lg:justify-start gap-2">
                        <div className="flex gap-2 lg:gap-4">
                            <Button className="w-full bg-green-600 lg:w-auto" size="md" onClick={Reset} >
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="p-4 px-0">
                <div className="overflow-auto">
                    <div ref={componentRef} >
                        <div className="hidden print:flex items-center justify-between p-4">
                            <h1 className="text-2xl font-bold">Sales4x</h1>
                            <p className="text-sm">Inspection Date: {currentDate}</p>
                        </div>
                        <table className="w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left px-4 py-2">Name</th>
                                    <th className="text-left px-4 py-2">Good</th>
                                    <th className="text-left px-4 py-2">Fair</th>
                                    <th className="text-left px-4 py-2">Poor</th>
                                    <th className="text-left px-4 py-2">Details</th>
                                    <th className="text-left px-4 py-2 print:hidden">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, idx) => (
                                    <tr id='table' key={idx} className={`w-full border-b border-gray-200 px-4 py-2 ${item.category ? 'bg-gradient-to-br from-gray-800 to-gray-700 text-white' : ''}`}>
                                        <td className="border-b border-gray-200 px-4 py-2">{item.name}</td>
                                        {!item.category ?
                                            <td className="border-b border-gray-200 px-4 py-2">
                                                <div onClick={() => handleStatusInputs(idx, 'good', !item.good)} className={`h-8 w-8 rounded-full cursor-pointer ${item.good ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                            </td> : <td></td>}
                                        {!item.category ?
                                            <td className="border-b border-gray-200 px-4 py-2">
                                                <div onClick={() => handleStatusInputs(idx, 'fair', !item.fair)} className={`h-8 w-8 rounded-full cursor-pointer ${item.fair ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                                            </td> : <td></td>}
                                        {!item.category ?
                                            <td className="border-b border-gray-200 px-4 py-2">
                                                <div onClick={() => handleStatusInputs(idx, 'poor', !item.poor)} className={`h-8 w-8 rounded-full cursor-pointer ${item.poor ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                                            </td> : <td></td>}
                                        {!item.category ?
                                            <td className="border-b border-gray-200 px-4 py-2 print:hidden">
                                                <input
                                                    id='inputField'
                                                    variant="static"
                                                    type="text"
                                                    placeholder="Enter details..."
                                                    className="px-2 py-1 w-full focus:outline-none focus:border-blue-500"
                                                    value={item.detail}
                                                    onChange={(e) => handleDetailInput(idx, 'detail', e.target.value)}
                                                />
                                            </td> : <td></td>}
                                        <td className="hidden print:inline text-sm text-gray-900 my-auto"><span>{item.detail}</span></td>
                                        {!item.category ?
                                            <td className="border-b border-gray-200 px-4 py-2 print:hidden">
                                                <TrashIcon   id='delButton' onClick={() => handleDel(idx)} className='h-6 w-6 text-red-500 cursor-pointer' />
                                            </td> : <td></td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end m-4">
                        <ReactToPrint
                            trigger={() => <Button className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">Print</Button>}
                            content={() => componentRef.current}
                        />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default Inspection;
