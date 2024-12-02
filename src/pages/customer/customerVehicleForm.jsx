import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog, Spinner } from "@material-tailwind/react";
import { updateVehicle } from "@/services/updateVehicle";
import { toast } from 'react-toastify';
import { State } from "@/state/Context";
import { fetchVehicles } from "@/services/fetchVehicles";
import { addCustomerVehicle } from "@/services/addCustomerVehicle";

const schema = Yup.object().shape({
    year: Yup.number().required("Year is required"),
    vehicle: Yup.string().required("Vehicle is required"),
    odometer: Yup.number().required("Odometer is required"),
    licenseNo: Yup.string().required("license No. is required"),
    engineSize: Yup.number().required("Engine Size is required"),
    color: Yup.string(),
    notes: Yup.string(),
});

const CustomerVehicleForm = ({ open, close, refresh, setRefresh, CustomerId, getCustomerDetails }) => {
    const vehicleInputRef = useRef(null);
    const { state } = State();
    const [edit, setEdit] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [showVehicleSuggestions, setShowVehicleSuggestions] = useState(false);

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

    const handleClose = () => {
        clearForm(formikProps);
        setEdit(false);
        close();
    };

    // useEffect(() => {
    //     if (selectedItem) {
    //         formikProps.setValues(selectedItem);
    //         setEdit(true);
    //         console.log(formikProps.values);
    //     }
    // }, [selectedItem]);

    const onSubmit = async (values) => {
        try {
            if (!edit) {
                values = {...values, CustomerId}               
                const res = await addCustomerVehicle(values, state.userToken)
                const vehicle = await res.json();
                if (res.status === 200) {
                    showToastMessage('success', vehicle.message)
                    getCustomerDetails();
                }
                else if (res.status === 409) {
                    showToastMessage('error', vehicle.message)
                }
            }
            else {
                const res = await updateVehicle(selectedItem.id, values, state.userToken)
                const vehicle = await res.json();
                if (res.status === 200) {
                    showToastMessage('success', vehicle.message)
                }
                else if (res.status === 404) {
                    showToastMessage('info', vehicle.message)
                }
                else if (res.status === 409) {
                    showToastMessage('error', vehicle.message)
                }
            }

            setRefresh(!refresh);
            handleClose();
        } catch (error) {
            console.log(error)
        }
    };

    // Fetch data from API when the component mounts
    useEffect(() => {
        getVehicles();
    }, [refresh]);

    const getVehicles = async () => {
        try {
            const vehicles = await fetchVehicles(state.userToken);
            setVehicles(await vehicles.json());
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
    }

    const handleInputChange = (inputName, event) => {
        const inputValue = event.target.value;
        setValues({ ...values, [inputName]: inputValue });
    };

    const clearForm = (formikProps) => {
        formikProps.resetForm({
            values: {
                year: "",
                vehicle: "",
                odometer: "",
                license: "",
                engine_size: "",
                color: "",
                notes: "",                
            },
            errors: {
                year: "",
                vehicle: "",
                odometer: "",
                license: "",
                engine_size: "",
                color: "",
                notes: "",  
            },
        });
    };

    const formikProps = useFormik({
        initialValues: {
            year: "",
            vehicle: "",
            odometer: "",
            license: "",
            engine_size: "",
            color: "",
            notes: "",  
        },
        validationSchema: schema,
        onSubmit,
    });

    const {
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setValues,
    } = formikProps;

    useEffect(() => {
        function handleClickOutside(event) {
            if (vehicleInputRef.current && !vehicleInputRef.current.contains(event.target)) {
                setShowVehicleSuggestions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const startYear = import.meta.env.VITE_START_YEAR;
    const endYear = import.meta.env.VITE_END_YEAR;
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }

    useEffect(() => {

    }, [values.vehicle]);
    return (
        <Dialog open={open}>
            {open && (
                <form onSubmit={handleSubmit} autoComplete="new" >
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                        <div className="bg-white rounded shadow-xl">
                            <div className="flex items-center justify-between sticky bg-gradient-to-br from-gray-800 to-gray-700">
                                <div></div>
                                <div className="text-white text-center text-lg">
                                    {edit ? "EDIT VEHICLE" : "NEW VEHICLE"}
                                </div>
                                <button
                                    className="bg-transparent hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
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

                            <div className="p-6">
                                <div className="flex items-center justify-start space-x-4">

                                    <div>
                                        <label className="font-bold">Year</label> <br />
                                        <select
                                            className="w-full p-2 border border-gray-300 rounded-md text-black font-small"
                                            id="year"
                                            name="year"
                                            type="number"
                                            value={values.year}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select a year</option>
                                            {years.map((year) => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>

                                        {(touched.year && errors.year) ? (
                                            <div className="text-red-500">
                                                {errors.year}
                                            </div>
                                        ) : (<div></div>)}
                                    </div>

                                    <div className="relative" ref={vehicleInputRef}>
                                        <label className="font-bold">Vehicle</label> <br />
                                        <input
                                            className="w-full p-2 border border-gray-300 rounded-md text-black font-small"
                                            id="vehicle"
                                            name="vehicle"
                                            type="text"
                                            value={values.vehicle}
                                            onClick={() => setShowVehicleSuggestions(true)}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                        />

                                        {(touched.make && errors.make) ? (
                                            <div className="text-red-500">
                                                {errors.make}
                                            </div>
                                        ) : (<div></div>)}
                                        {showVehicleSuggestions && (
                                            <ul className="d-block absolute z-50 bg-white border border-slate-700 w-full mt-1 overflow-y-auto min-h-24 max-h-48">
                                                {vehicles.length > 0 ?
                                                    vehicles.filter(vehicle => `${vehicle.make.toLowerCase()} ${vehicle.model.toLowerCase()}`.includes(values.vehicle.trim().toLowerCase())).map((vehicle) => (
                                                        <li key={vehicle.id} className="cursor-pointer px-2 py-1 rounded-sm hover:bg-gray-200" onClick={() => { setValues({...values, vehicle: `${vehicle.make} ${vehicle.model}`}); setShowVehicleSuggestions(false)}}>
                                                            {vehicle.make} {vehicle.model}
                                                        </li>
                                                    ))
                                                    :
                                                    <Spinner className="mx-auto my-auto h-6 w-6 text-blue-900/50" />
                                                }
                                            </ul>
                                        )}
                                    </div>
                                    {/* <div className="relative" ref={modelInputRef}>
                                        <label className="font-bold">Model</label> <br />
                                        <input
                                            className="w-full p-2 border border-gray-300 rounded-md text-black font-small"
                                            id="model"
                                            name="model"
                                            type="text"
                                            value={values.model}
                                            onClick={() => setShowModelSuggestions(true)}
                                            onChange={(e) => handleInputChange('model', e)}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            disabled={values.make !== '' && values.year !== '' ? false : true}
                                        />
                                        {touched.model && errors.model ? (
                                            <div className="text-red-500">
                                                {errors.model}
                                            </div>
                                        ) : (<div></div>)}
                                        {showModelSuggestions && (
                                            <ul className="d-block absolute z-50 bg-white border border-slate-700 w-full mt-1 overflow-y-auto max-h-48">
                                                {modelLoading ?
                                                    <Spinner className="mx-auto my-auto h-6 w-6 text-blue-900/50" />
                                                    :
                                                    filteredModels.map((model) => (
                                                        <li key={model.model_name} className="cursor-pointer px-2 py-1 rounded-sm hover:bg-gray-200" onClick={() => { setValues({ ...values, model: model.model_name }); setFilteredModels([]); setShowModelSuggestions(false) }}>
                                                            {model.model_name}
                                                        </li>
                                                    ))}
                                            </ul>
                                        )}
                                    </div> */}
                                    <div>
                                        <label className="font-bold">Odometer</label> <br />
                                        <input
                                            className="w-full p-2 border border-gray-300 rounded-md text-black font-small"
                                            id="odometer"
                                            name="odometer"
                                            type="number"
                                            value={values.odometer}
                                            onChange={(e) => handleInputChange('odometer', e)}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                        />
                                        {touched.odometer && errors.odometer ? (
                                            <div className="text-red-500">
                                                {errors.odometer}
                                            </div>
                                        ) : (<div></div>)}
                                    </div>
                                </div>

                                <div className="flex items-center justify-start space-x-4 mt-4">
                                    <div>
                                        <label className="font-bold">License No.</label> <br />
                                        <input
                                            className="w-full p-2 border border-gray-300 rounded-md text-black font-small"
                                            id="licenseNo"
                                            name="licenseNo"
                                            type="text"
                                            value={values.licenseNo}
                                            onChange={(e) => handleInputChange('licenseNo', e)}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                        />
                                        {touched.licenseNo && errors.licenseNo ? (
                                            <div className="text-red-500">
                                                {errors.licenseNo}
                                            </div>
                                        ) : (<div></div>)}
                                    </div>
                                    <div>
                                        <label className="font-bold">Engine Size</label> <br />
                                        <input
                                            className="w-full p-2 border border-gray-300 rounded-md text-black font-small"
                                            id="engineSize"
                                            name="engineSize"
                                            type="number"
                                            value={values.engineSize}
                                            onChange={(e) => handleInputChange('engineSize', e)}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                        />
                                        {touched.engineSize && errors.engineSize ? (
                                            <div className="text-red-500">
                                                {errors.engineSize}
                                            </div>
                                        ) : (<div></div>)}
                                    </div>
                                    <div>
                                        <label className="font-bold">Color</label> <br />
                                        <input
                                            className="w-full p-2 border border-gray-300 rounded-md text-black font-small"
                                            id="color"
                                            name="color"
                                            type="text"
                                            value={values.color}
                                            onChange={(e) => handleInputChange('color', e)}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                        />
                                        {touched.color && errors.color ? (
                                            <div className="text-red-500">
                                                {errors.color}
                                            </div>
                                        ) : (<div></div>)}
                                    </div>

                                </div>
                                <div className="mt-4">
                                    <label className="font-bold">Notes</label> <br />
                                    <textarea
                                        className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                                        id="notes"
                                        name="notes"
                                        value={values.notes}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {touched.notes && errors.notes && (
                                        <div className="text-red-500">
                                            {errors.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-end space-x-2 sticky bg-gradient-to-br from-gray-800 to-gray-700">
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
                                    {edit ? "Update" : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </Dialog>
    );
};
export default CustomerVehicleForm;