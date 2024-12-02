import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog, DialogHeader, DialogFooter, DialogBody, Button, Input } from "@material-tailwind/react";
import { addVehicle } from "@/services/addVehicle";
import { updateVehicle } from "@/services/updateVehicle";
import { toast } from 'react-toastify';
import { State } from "@/state/Context";

const schema = Yup.object().shape({
    make: Yup.string().required("Make is required"),
    model: Yup.string().required("Model is required"),
});

const MyPopUpForm = ({ open, close, selectedItem, setSelectedItem, refresh, setRefresh }) => {
    const { state } = State();
    const [edit, setEdit] = useState(false);

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


    const clearForm = (formikProps) => {
        formikProps.resetForm({
            values: {
                make: "",
                model: "",
            },
            errors: {
                make: "",
                model: "",
            },
        });
    };

    const formikProps = useFormik({
        initialValues: {
            make: "",
            model: "",
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
            <form onSubmit={handleSubmit} autoComplete="new" >
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                    <div className="bg-white rounded shadow-xl">
                        <DialogHeader>{!edit ? "ADD VEHICLE" : "EDIT VEHICLE"}</DialogHeader>
                        {/* <DialogBody> */}
                            <div className="p-6">
                                <div className="flex items-center justify-start space-x-4">
                                    <div className="relative">
                                        <Input
                                            label="Make"
                                            className="w-full p-2 border border-gray-300 rounded-md text-black font-small"
                                            id="make"
                                            name="make"
                                            type="text"
                                            value={values.make}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            disabled={values.year !== '' ? false : true}
                                        />

                                        {(touched.make && errors.make) ? (
                                            <div className="text-red-500">
                                                {errors.make}
                                            </div>
                                        ) : (<div></div>)}
                                    </div>
                                    <div className="relative">
                                        <Input
                                            label="Model"
                                            className="w-full p-2 border border-gray-300 rounded-md text-black font-small"
                                            id="model"
                                            name="model"
                                            type="text"
                                            value={values.model}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            disabled={values.make !== '' ? false : true}
                                        />
                                        {touched.model && errors.model ? (
                                            <div className="text-red-500">
                                                {errors.model}
                                            </div>
                                        ) : (<div></div>)}
                                    </div>
                                </div>
                            </div>
                        {/* </DialogBody> */}
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    onClick={() => handleClose()}
                    className="mr-1"
                >
                    <span>Cancel</span>
                </Button>
                <Button type="submit" variant="gradient" color="green" >
                    <span>{edit ? 'Update' : 'Add'}</span>
                </Button>
            </DialogFooter>
                        
                    </div>
                </div>
            </form>
        </Dialog>
    );
};
export default MyPopUpForm;