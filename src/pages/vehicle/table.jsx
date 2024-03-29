
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TruckIcon, TrashIcon } from "@heroicons/react/24/solid";
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
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MyPopUpForm from "./form";
import { fetchVehicles } from "@/services/fetchVehicles";
import { delVehicle } from "@/services/delVehicle";

const TABLE_HEAD = ["Make", "Model", "year", "Actions"];

export function Vehicles() {
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [finalItems, setFinalItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [refresh, setRefresh] = useState(false);

    // for edit of a vehicle 
    const [selectedItem, setSelectedItem] = useState(null);

    // Modify handleRowSelect to update the selected item's data
    const handleEditCustomer = (index) => {
        // Assuming currentItems holds the filtered rows for display
        const selected = currentItems[index];
        setSelectedItem(selected);
    };

    // Fetch data from API when the component mounts
    useEffect(() => {
        getVehicles();
    }, [refresh]);

    const getVehicles = async () => {
        const vehicles = await fetchVehicles();
        setFinalItems(await vehicles.json());
    }

    // Function to handle header checkbox change
    const handleSelectAll = (event) => {
        const checked = event.target.checked;
        setSelectAll(checked);

        if (checked) {
            const allRowsIndexes = currentItems.map((_, index) => indexOfFirstItem + index);
            setSelectedRows(allRowsIndexes);
        } else {
            setSelectedRows([]);
        }
    };

    // Function to handle individual row checkbox change
    const handleRowSelect = (index) => {
        const selectedIndex = selectedRows.indexOf(index);
        let newSelectedRows = [];

        if (selectedIndex === -1) {
            newSelectedRows = newSelectedRows.concat(selectedRows, index);
        } else if (selectedIndex === 0) {
            newSelectedRows = newSelectedRows.concat(selectedRows.slice(1));
        } else if (selectedIndex === selectedRows.length - 1) {
            newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedRows = newSelectedRows.concat(
                selectedRows.slice(0, selectedIndex),
                selectedRows.slice(selectedIndex + 1)
            );
        }

        setSelectedRows(newSelectedRows);
    };

    const filteredRows = finalItems.filter(
        ({ make, model, year }) =>
            make.toLowerCase().includes(searchQuery.toLowerCase()) ||
            model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            year.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate the indexes of the items to display based on pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

    // Function to handle items per page change
    const handleItemsPerPageChange = (event) => {
        const selectedItemsPerPage = parseInt(event.target.value, 10);
        setItemsPerPage(selectedItemsPerPage);
        setCurrentPage(1);
    };

    // Function to handle deletion of selected items
    const handleDelete = async (id) => {
        // Calculate the indexes of the selected rows within the full data set
        // const selectedIndexes = selectedRows.map((index) => {
        //   const startIndex = (currentPage - 1) * itemsPerPage;
        //   return startIndex + index;
        // });

        // Create a new array containing the rows that are not selected
        // const updatedItems = finalItems.filter((_, index) => !selectedIndexes.includes(index));

        // Update finalItems and clear selectedRows
        // setFinalItems(updatedItems);
        // setSelectedRows([]);
        // setSelectAll(false);

        try {
            const res = await delVehicle(id);
            setRefresh(!refresh);
        } catch (error) {
            console.log(error)
        }
    };


    // Function to handle pagination
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Popup state
    const [isOpen, setIsOpen] = useState(false);
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
                            <TruckIcon className="h-12 w-12 text-blueGray-500 ml-2" />
                            Vehicles
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
                                {/* <Button className="w-full bg-red-900 lg:w-auto" size="md" onClick={handleDelete} disabled={selectedRows.length == 0} >
                                    Delete
                                    </Button> */}
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
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox text-blue-500 rounded border-gray-400 shadow-sm ml-1"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                        />
                                    </label>
                                </th>
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
                            {currentItems.map(({ make, model, year, id }, index) => {
                                const isLast = index === currentItems.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";
                                const isChecked = selectedRows.includes(index);
                                return (
                                    <tr key={id}>
                                        <td className={classes}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleRowSelect(index)}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <Link
                                                to="#"
                                                className="text-blue-gray font-normal hover:underline"
                                                onClick={() => {
                                                    handleEditCustomer(index);
                                                    openPopup();
                                                }}
                                            >
                                                {make}
                                            </Link>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {model}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal opacity-70"
                                            >
                                                {year}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Tooltip content="Delete Customer">
                                                <IconButton variant="text" onClick={() => handleDelete(id)}>
                                                    <TrashIcon className="h-6 w-6 text-red-600" />
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
            <MyPopUpForm open={isOpen} close={closePopup} selectedItem={selectedItem} setSelectedItem={setSelectedItem} refresh={refresh} setRefresh={setRefresh} />
        </>
    );
}