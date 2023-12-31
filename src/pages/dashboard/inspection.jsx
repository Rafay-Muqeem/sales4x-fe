import React, { useEffect, useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { Button, Input } from "@material-tailwind/react";

export function Inspection() {

    const [refresh, setRefresh] = useState(false);
    const [data, setData] = useState([
        {
            name: "Test Drive",
            category: true,
        },
        {
            name: "Engine Performance",
            category: false,
            good: false,
            fair: false,
            poor: false,
            detail: ''
        },
        {
            name: "Road Handling",
            category: false,
            good: false,
            fair: false,
            poor: false,
            detail: ''
        },
        {
            name: "Braking",
            category: false,
            good: false,
            fair: false,
            poor: false,
            detail: ''
        },
        {
            name: "Exterior Inspection",
            category: true,
        },
        {
            name: "Paint Finish",
            category: false,
            good: false,
            fair: false,
            poor: false,
            detail: ''
        },
        {
            name: "Body Damage",
            category: false,
            good: false,
            fair: false,
            poor: false,
            detail: ''
        },
        {
            name: "Rust",
            category: false,
            good: false,
            fair: false,
            poor: false,
            detail: ''
        },
    ]);

    const handleStatusInputs = (index, fieldName, newValue) => {
        const newData = [...data];
        newData[index]['good'] = false;
        newData[index]['fair'] = false;
        newData[index]['poor'] = false;
        newData[index][fieldName] = newValue;

        setData(newData)
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

    function printCurrentPage() {
        let printContents = document.getElementById('printableDiv');
        const tr = document.getElementById('table');
        const textInput = document.getElementById('inputField');
        const button = document.getElementById('delButton');
        const paragraph = document.createElement('p');
          
        paragraph.textContent = textInput.value;
        textInput.style.display = 'none';
        // button.style.display = 'none';
        printContents.appendChild(paragraph);

        let originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents.innerHTML;
        window.print();
        textInput.style.display = 'block';
        document.body.innerHTML = originalContents;
        setRefresh(!refresh)
    }

    useEffect(() => {

    }, [refresh])

    return (
        <div id='printableDiv' className="overflow-auto">
            <table className="w-full bg-white border border-gray-200">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left px-4 py-2">Name</th>
                        <th className="text-left px-4 py-2">Good</th>
                        <th className="text-left px-4 py-2">Fair</th>
                        <th className="text-left px-4 py-2">Poor</th>
                        <th className="text-left px-4 py-2">Details</th>
                        <th className="text-left px-4 py-2">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, idx) => (
                        <tr id='table' key={idx} className={`w-full border-b border-gray-200 px-4 py-2 ${item.category ? 'bg-blue-500' : ''}`}>
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
                                <td className="border-b border-gray-200 px-4 py-2">
                                    <Input
                                        id='inputField'
                                        variant="static"
                                        type="text"
                                        placeholder="Enter details..."
                                        className="px-2 py-1 w-full focus:outline-none focus:border-blue-500"
                                        value={item.detail}
                                        onChange={(e) => handleDetailInput(idx, 'detail', e.target.value)}
                                    />
                                </td> : <td></td>}
                            {!item.category ?
                                <td className="border-b border-gray-200 px-4 py-2">
                                    <XCircleIcon id='delButton' onClick={() => handleDel(idx)} className='h-6 w-6 text-red-500 cursor-pointer' />
                                </td> : <td></td>}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-end">
                <Button onClick={() => printCurrentPage()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Print
                </Button>
            </div>
        </div>
    );
};

export default Inspection;
