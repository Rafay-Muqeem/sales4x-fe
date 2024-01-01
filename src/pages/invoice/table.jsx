import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import {  DocumentTextIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import MyPopUpForm from "./form";
import { fetchInvoices } from "@/services/fetchInvoices";
import { delInvoice } from "@/services/delInvoice";


const TABLE_HEAD = ["Customer", "View", "Status", "Total", "Invoice Date", "Make", "Model", "Year", "Actions"];

export function Invoice() {
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [refresh, setRefresh] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getInvoices();
  }, [refresh]);

  const handleEditInvoice = (index) => {
    // Assuming currentItems holds the filtered rows for display
    const selected = currentItems[index];
    setSelectedInvoice(selected);
  };
  const getInvoices = async () => {
    const fetchedInvoices = await fetchInvoices();
    setInvoices(await fetchedInvoices.json());
  };





  const handleDeleteInvoice = async (index) => {
    const updatedInvoices = invoices.filter((_, rowIndex) => rowIndex !== index);
    const deletedInvoiceId = invoices.find((_, rowIndex) => rowIndex === index);
    setInvoices(updatedInvoices);
    try {
      const res = await delInvoice(deletedInvoiceId['id']);
      setRefresh(!refresh);
  } catch (error) {
      console.log(error)
  }
  };

  const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleString();
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;
  const filteredRows = invoices.filter(
    ({ Customer }) =>
      Customer['first_name'].toLowerCase().includes(searchQuery.toLowerCase()) || 
      Customer['last_name'].toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

  const handleItemsPerPageChange = (event) => {
    const selectedItemsPerPage = parseInt(event.target.value, 10);
    setItemsPerPage(selectedItemsPerPage);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openPopup = () => {
    setIsOpen(true);
  };
  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Card className="h-full w-full ">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 sm:mb-0 flex items-center">
            <Typography variant="h5" color="blue-gray" className="flex items-center">
              <DocumentTextIcon className="h-12 w-12 text-blueGray-500 ml-2" />
              Invoices
            </Typography>
          </div>
          <div className="flex flex-col lg:flex-row items-center w-full mt-5">
            <div className="w-full lg:w-2/5 flex items-center justify-center lg:justify-start gap-2">
              <div className="w-full lg:flex-1 lg:mr-4">
                <Input
                  label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
              <div className="flex gap-2 lg:gap-4">
                <Button className="w-full bg-blue-900 lg:w-auto" size="md" onClick={openPopup} >
                  New
                </Button>

              </div>
            </div>
            <div className="flex items-center mt-4 lg:mt-0 lg:ml-auto">
              <Typography variant="small" color="blue-gray" className="mr-2">
                Items per page:
              </Typography>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-2 py-1 border border-blue-gray-300 rounded bg-white text-blue-gray-700"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-2 overflow-scroll px-0">
          <table className=" w-full min-w-max table-auto text-left">
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
            <tbody>
              {currentItems.map(({ Customer, paymentStatus, id,totalAmount,createdAt,Vehicle }, index) => {
                const isLast = index === currentItems.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={id}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                       
                      >
                        {Customer['first_name']} {Customer['last_name']}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {id}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {paymentStatus}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {totalAmount}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal "
                      >
                        {formatCreatedAt(createdAt)}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal "
                      >
                        {Vehicle['make']}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal "
                      >
                        {Vehicle['model']}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal "
                      >
                        {Vehicle['year']}
                      </Typography>
                    </td>
                   
                    <td className={classes}>
                      <Tooltip content="Edit Invoice">
                        <IconButton variant="text"  onClick={() => {
                          handleEditInvoice(index);
                          openPopup(); 
                        }}>
                          <PencilIcon className="h-6 w-6" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Delete Invoice">
                        <IconButton variant="text"  onClick={() => {
                          handleDeleteInvoice(index)
                        }}>
                          <TrashIcon className="h-6 w-6" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              },
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredRows.length)} of {filteredRows.length}
          </Typography>
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {currentPage} of {Math.ceil(filteredRows.length / itemsPerPage)}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              disabled={indexOfLastItem >= filteredRows.length}
              onClick={() => paginate(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </CardFooter>

      </Card>
     <MyPopUpForm open={isOpen} close={closePopup} selectedInvoice={selectedInvoice} />
    </>
  );
}