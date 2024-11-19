import React, { useEffect, useState } from "react";
import { XCircleIcon, PencilIcon, CheckIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Card } from "@material-tailwind/react";
import TaxForm from "./taxForm";
import { fetchTaxes } from "@/services/fetchTaxes";
import { delTax } from "@/services/delTax";
import { State } from "@/state/Context";
import { toast } from "react-toastify";

function Taxes() {

  const { state } = State();
  const [open, setOpen] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const [data, setData] = useState('');
  const [refresh, setRefresh] = useState(false);

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    getTaxes();
  }, [refresh])

  const getTaxes = async () => {
    try {
      const taxes = await fetchTaxes(state.userToken);
      setTaxes(await taxes.json());
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong")
    }
  }

  async function handleDel(id) {
    try {
      const res = await delTax(id, state.userToken);
      const tax = await res.json();
      setRefresh(!refresh)

    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = (data) => {
    setData(data)
    handleOpen()
  }

  return (
    <div className="flex flex-col w-full bg-transparent rounded-md p-4">
      <TaxForm taxData={data} setTaxData={setData} open={open} handleOpen={handleOpen} refresh={refresh} setRefresh={setRefresh} />
      <div className="flex items-center mb-2">
        <h2 className="text-lg font-semibold">Tax Rates</h2>
        <PlusCircleIcon onClick={handleOpen} className="ml-4 mr-1 h-7 w-7 text-blue-600 cursor-pointer" />
        <span className="text-base">Add new tax rate</span>
      </div>
      <Card className="w-full h-full">
        <table className="border-collapse w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 py-2 w-1/2">NAME</th>
              <th className="text-center px-4 py-2 w-1/5">RATE</th>
              {/* <th className="text-center px-4 py-2 w-1/5">DEFAULT</th> */}
              {state.userInfo.role === 'super_admin' && (
                <th
                  className="text-center px-4 py-2 w-1/5"
                >
                  BUSINESS
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {taxes.map((tax) => (
              <tr key={tax.id} className="border-b border-gray-200">
                <td className="text-left px-4 py-2"><PencilIcon onClick={() => handleEdit(tax)} className="inline-block mr-2 h-5 w-5 text-blue-700 cursor-pointer" />{tax.name}</td>
                <td className="text-center px-4 py-2">{tax.rate}{tax.type}</td>
                {/* <td className="text-center px-4 py-2">{tax.default ? <div className="flex items-center justify-center"> <CheckIcon className="inline-block mr-2 h-6 w-6 text-green-600" /></div> : ""}</td> */}
                {state.userInfo.role === 'super_admin' && (
                  <td>
                    {tax.Business.name}
                  </td>
                )}
                <td className="text-center px-4 py-2 cursor-pointer"><XCircleIcon onClick={() => handleDel(tax.id)} className="h-6 w-6 text-gray-600 hover:text-red-500" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default Taxes;