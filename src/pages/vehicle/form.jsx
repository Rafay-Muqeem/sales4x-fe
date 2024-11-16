import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog, Spinner } from "@material-tailwind/react";
import { addVehicle } from "@/services/addVehicle";
import { updateVehicle } from "@/services/updateVehicle";
import { toast } from 'react-toastify';
import { State } from "@/state/Context";
import jsonp from "jsonp";

const schema = Yup.object().shape({
    make: Yup.string().required("Make is required"),
    model: Yup.string().required("Model is required"),
    year: Yup.number().required("Year is required"),
});

const MyPopUpForm = ({ open, close, selectedItem, setSelectedItem, refresh, setRefresh }) => {

    const Makes = [
        'Mercedes',
        'Dodge',
        'Chevrolet',
        'BMW',
        'Audi',
        'Porche',
        'Toyota',
        'Honda',
        'Ford',
    ]

    const makeInputRef = useRef(null);
    const modelInputRef = useRef(null);
    const { state } = State();
    const [edit, setEdit] = useState(false);
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [filteredMakes, setFilteredMakes] = useState([]);
    const [filteredModels, setFilteredModels] = useState([]);
    const [showMakeSuggestions, setShowMakeSuggestions] = useState(false);
    const [showModelSuggestions, setShowModelSuggestions] = useState(false);
    const [makeLoading, setMakeLoading] = useState(false);
    const [modelLoading, setModelLoading] = useState(false);

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
        setSelectedItem(null);
        setMakes([]);
        setModels([]);
        close();
    };

    useEffect(() => {
        if (selectedItem) {
            formikProps.setValues(selectedItem);
            setEdit(true);
            console.log(formikProps.values);
        }
    }, [selectedItem]);

    const onSubmit = async (values) => {
        try {
            if (!edit) {
                const res = await addVehicle(values, state.userToken)
                const vehicle = await res.json();
                if (res.status === 200) {
                    showToastMessage('success', vehicle.message)
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

    const fetchMakes = async (year) => {
        try {
            setShowMakeSuggestions(true);
            setMakeLoading(true);
            const apiUrl = `https://www.carqueryapi.com/api/0.3/?cmd=getMakes&year=${year}&sold_in_us=&body=`;

            jsonp(apiUrl, null, (err, data) => {
                if (err) {
                    fetchMakes(year);
                    setMakeLoading(false);
                    toast.error("Something went wrong");
                } else {
                    setMakes(data.Makes)
                    setFilteredMakes(data.Makes)
                    setMakeLoading(false);
                }
            });            

        } catch (error) {
            console.log(error);
            setMakeLoading(false);
            toast.error("Something went wrong");
        }
    }

    const fetchModels = (make, year) => {
        try {
            setShowModelSuggestions(true);
            setModelLoading(true);
            const apiUrl = `https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${make.toLowerCase()}&year=${year}&sold_in_us=&body=`;

            jsonp(apiUrl, null, (err, data) => {
                if (err) {
                    setModelLoading(false);
                    toast.error("Something went wrong");
                } else {
                    setModels(data.Models)
                    setFilteredModels(data.Models)
                    setModelLoading(false);
                }
            });

        } catch (error) {
            console.log(error);
            setModelLoading(false);
            toast.error("Something went wrong");
        }
    }

    const handleInputChange = (inputName, event) => {
        const inputValue = event.target.value;
        setValues({ ...values, [inputName]: inputValue });

        if (inputName === 'make') {
            const filtered = makes.filter((make) =>
                make.make_display.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredMakes(filtered);
            setShowMakeSuggestions(true);
        }
        else if (inputName === 'model') {
            const filtered = models.filter((model) =>
                model.model_name.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredModels(filtered);
            setShowModelSuggestions(true);
        }
        else if (inputName === 'year') {
            fetchMakes(inputValue)
        }
    };


    const clearForm = (formikProps) => {
        formikProps.resetForm({
            values: {
                make: "",
                model: "",
                year: "",
            },
            errors: {
                make: "",
                model: "",
                year: "",
            },
        });
    };

    const formikProps = useFormik({
        initialValues: {
            make: "",
            model: "",
            year: "",
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
            if (makeInputRef.current && !makeInputRef.current.contains(event.target)) {
                setShowMakeSuggestions(false);
            }

            if (modelInputRef.current && !modelInputRef.current.contains(event.target)) {
                setShowModelSuggestions(false);
            }
        }


        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const startYear = 1950;
    const endYear = 2022;
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }

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
                                            onChange={(e) => handleInputChange('year', e)}
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

                                    <div className="relative" ref={makeInputRef}>
                                        <label className="font-bold">Make</label> <br />
                                        <input
                                            className="w-full p-2 border border-gray-300 rounded-md text-black font-small"
                                            id="make"
                                            name="make"
                                            type="text"
                                            value={values.make}
                                            onClick={() => setShowMakeSuggestions(true)}
                                            onChange={(e) => handleInputChange('make', e)}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            disabled={values.year !== '' ? false : true}
                                        />

                                        {(touched.make && errors.make) ? (
                                            <div className="text-red-500">
                                                {errors.make}
                                            </div>
                                        ) : (<div></div>)}
                                        {showMakeSuggestions && (
                                            <ul className="d-block absolute z-50 bg-white border border-slate-700 w-full mt-1 overflow-y-auto min-h-24 max-h-48">
                                                {makeLoading ?
                                                    <Spinner className="mx-auto my-auto h-6 w-6 text-blue-900/50" />
                                                    :
                                                    filteredMakes.map((make) => (
                                                        <li key={make.make_display} className="cursor-pointer px-2 py-1 rounded-sm hover:bg-gray-200" onClick={() => { setValues({ ...values, make: make.make_display }); setFilteredMakes([]); setShowMakeSuggestions(false); fetchModels(make.make_display, values.year) }}>
                                                            {make.make_display}
                                                        </li>
                                                    ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-start space-x-4">
                                    <div className="relative" ref={modelInputRef}>
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
                                    </div>
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
export default MyPopUpForm;