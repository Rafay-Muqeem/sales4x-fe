import React, { useState } from "react";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog } from "@material-tailwind/react";
import { addVehicle } from "@/services/addVehicle";
import { updateVehicle } from "@/services/updateVehicle";
const schema = Yup.object().shape({
    make: Yup.string().required("Make is required"),
    model: Yup.string().required("Model is reuired"),
    year: Yup.number().required("Year is required"),
});
const MyPopUpForm = ({ open, close, selectedItem, setSelectedItem, refresh, setRefresh }) => {

    const [edit, setEdit] = useState(false);

    const handleClose = () => {
        clearForm(formikProps);
        setEdit(false);
        setSelectedItem(null);
        close();
    };

    useEffect(() => {
        if (selectedItem) {
            console.log(selectedItem);
            formikProps.setValues(selectedItem);
            setEdit(true);
            console.log(formikProps.values);
        }
    }, [selectedItem]);

    const onSubmit = async (values, actions) => {
        console.log(values);
        let res = '';
        try {
            if (!edit) {
                res = await addVehicle(values)
            }
            else {
                res = await updateVehicle(selectedItem.id, values)
            }
            const vehicle = await res.json();
            console.log(vehicle)
            setRefresh(!refresh);
            handleClose();
        } catch (error) {
            console.log(error)
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
                                        <label className="font-bold">Make</label> <br />
                                        <input
                                            className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                                            id="make"
                                            name="make"
                                            type="text"
                                            value={values.make}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {(touched.make && errors.make) ? (
                                            <div className="text-red-500">
                                                {errors.make}
                                            </div>
                                        ) : (<div></div>)}
                                    </div>
                                    <div>
                                        <label className="font-bold">Model</label> <br />
                                        <input
                                            className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                                            id="model"
                                            name="model"
                                            type="text"
                                            value={values.model}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {touched.model && errors.model ? (
                                            <div className="text-red-500">
                                                {errors.model}
                                            </div>
                                        ) : (<div></div>)}
                                    </div>
                                </div>

                                <div className="flex items-center justify-start space-x-4">
                                    <div>
                                        <label className="font-bold">Year</label> <br />
                                        <input
                                            className="w-full p-2 border border-gray-300 rounded-md text-black font-medium"
                                            id="year"
                                            name="year"
                                            type="number"
                                            value={values.year}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {(touched.year && errors.year) ? (
                                            <div className="text-red-500">
                                                {errors.year}
                                            </div>
                                        ) : (<div></div>)}
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