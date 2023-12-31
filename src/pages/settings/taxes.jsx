import React, { useEffect, useState } from "react";
import { XCircleIcon, PencilIcon, CheckIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Card } from "@material-tailwind/react";
import TaxForm from "../forms/taxForm";
import { fetchTaxes } from "@/services/fetchTaxes";
import { delTax } from "@/services/delTax";

function Taxes() {

  const [open, setOpen] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const [data, setData] = useState('');
  const [refresh, setRefresh] = useState(false);

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    getTaxes();
  }, [refresh])

  const getTaxes = async () => {
    const taxes = await fetchTaxes();
    setTaxes(await taxes.json());
  }

  async function handleDel(id) {
    const tax = await delTax(id);
    setRefresh(!refresh)
  }

  const handleEdit = (data) => {
    setData(data)
    handleOpen()
  }

  if (taxes) {
    return (
      <div className="flex flex-col w-full bg-transparent rounded-md p-4">
        <TaxForm taxData={data} setTaxData={setData} open={open} handleOpen={handleOpen} refresh={refresh} setRefresh={setRefresh} />
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-semibold">Tax Rates</h2>
          <PlusCircleIcon onClick={handleOpen} className="ml-4 mr-1 h-7 w-7 text-blue-600 cursor-pointer" />
          <span className="text-base">Add new tax rate</span>
        </div>
        <Card className="h-full w-full">
          <table className="border-collapse w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-2 w-1/2">Tax Name</th>
                <th className="text-center px-4 py-2 w-1/4">Rate</th>
                <th className="text-center px-4 py-2 w-1/4">Default</th>
              </tr>
            </thead>
            <tbody>
              {taxes.map((tax) => (
                <tr key={tax.id} className="border-b border-gray-200">
                  <td className="text-left px-4 py-2"><PencilIcon onClick={() => handleEdit(tax)} className="inline-block mr-2 h-5 w-5 text-blue-700 cursor-pointer" />{tax.name}</td>
                  <td className="text-center px-4 py-2">{tax.rate}{tax.type}</td>
                  <td className="text-center px-4 py-2">{tax.default ? <div className="flex items-center justify-center"> <CheckIcon className="inline-block mr-2 h-6 w-6 text-green-600" /></div> : ""}</td>
                  <td className="text-center px-4 py-2 cursor-pointer"><XCircleIcon onClick={() => handleDel(tax.id)} className="h-6 w-6 text-gray-600 hover:text-red-500" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }
}

export default Taxes;