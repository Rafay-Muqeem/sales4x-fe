import React, { useEffect, useState } from "react";
import { Input, Select, Button, Option } from "@material-tailwind/react";
import { State } from '../../../state/Context'
import { updateBusiness } from "@/services/updateBusiness";
import { toast } from "react-toastify";
import dummyImage from "../../../assets/dummyImage.png"

function Profile() {
    const { state, dispatch } = State();
    const [invoice, setInvoice] = useState(state.Settings.General.invoice);
    const [busiensslogo, setBusiensslogo] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        logo: null,
        defaultMargin: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
        tel: "",
        fax: "",
        licenseNumber: "",
        permitNumber: "",
    });

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

    const invoiceOptions = [
        { value: 'current', label: 'current' },
        { value: 'all', label: 'all' },
    ];

    const handleChange = (e) => {
        let { name, value, files } = e.target;
        const REQUIRED_WIDTH = 300;
        const REQUIRED_HEIGHT = 300;

        if (files) {
            const img = new Image();
            img.src = URL.createObjectURL(e.target.files[0]);

            img.onload = () => {
            if (img.width === REQUIRED_WIDTH && img.height === REQUIRED_HEIGHT) {
                showToastMessage('success', 'Image uploaded successfully');
            } else {
                showToastMessage('error', `Invalid dimensions! Please upload an image of ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}px.`);
            }
            URL.revokeObjectURL(img.src)
            }
        }
        if (name === 'defaultMargin' || name === 'zipcode') value = parseInt(value);
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSave = async () => {
        const isUpdated = Object.values(formData).some((value) => !Object.values(state.business).includes(value));
        if (isUpdated) {
            const businessData = new FormData();
            const avoidFields = ['updated_at', 'created_at', 'id'];
            Object.values(formData).forEach((value, index) => {
                if (value !== null && !avoidFields.includes(Object.keys(formData)[index])) {
                    businessData.append(Object.keys(formData)[index], value);
                }
            });
            const res = await updateBusiness(state.business.id, businessData, state.userToken);
            if (res.status === 200) {
                const business = await res.json();
                const { logo, ...rest } = business.data;
                setBusiensslogo(logo);
                setFormData(rest);
                dispatch({ type: 'SET_BUSINESS', payload: business.data });
                showToastMessage('success', 'Business Details Updated Successfully');
                setFormData({ lg: null, ...business.data });
                return;
            }
            showToastMessage('error', 'Failed to update Business Details');
        }
    };

    // for invoice setting!!
    const handleSaveClick = async () => {
        dispatch({ type: 'SET_INVOICE', payload: invoice });
    }

    useEffect(() => {
        const { logo } = state.business;
        setBusiensslogo(logo);
        setFormData(state.business);
    }, [])

    // for invoice setting!!
    // useEffect(() => {
    //     console.log(state);
    // }, [state.Settings])

    return (
        <div className="flex flex-col w-full bg-transparent rounded-md divide-y-2 scroll-smooth">
            {/* General Form */}
            <div className="py-5 w-2/5">
                <h2 className="text-lg font-semibold mb-4">General:</h2>
                {/* <form className="flex flex-col space-y-4 w-48">
                    <Select
                        label="Invoice Setting"
                        animate={{
                            mount: { y: 0 },
                            unmount: { y: 25 },
                        }}
                        value={state.Settings.General.invoice}
                        onChange={(value) => setInvoice(value)}
                        size="md"
                    >
                        {invoiceOptions.map((option) => (
                            <Option key={option.value} value={option.value}>{option.label}</Option>
                        ))}
                    </Select>

                    <Button onClick={handleSaveClick}>Save</Button>
                </form> */}
                <div className="flex flex-col gap-5">
                    <Input
                        label="Name"
                        type="text"
                        name="name"
                        value={formData?.name}
                        onChange={handleChange}
                    />
                    <Input
                        label="License Number"
                        type="text"
                        name="licenseNumber"
                        value={formData?.licenseNumber}
                        onChange={handleChange}
                    />
                    <Input
                        label="Permit Number"
                        type="text"
                        name="permitNumber"
                        value={formData?.permitNumber}
                        onChange={handleChange}
                    />
                    <Input
                        label="Default Margin"
                        type="number"
                        name="defaultMargin"
                        value={formData?.defaultMargin}
                        onChange={handleChange}
                    />
                    <Input
                        label="Logo"
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={(e) => { handleChange(e); setBusiensslogo(URL.createObjectURL(e.target.files[0])) }}
                    />
                    <div className="basis-[50%] max-h-[150px] max-w-[150px] bg-auto bg-center overflow-hidden">
                        <img className="" src={busiensslogo ? busiensslogo : dummyImage} alt="Business logo" width={150} height={150} />
                    </div>
                </div>
                <Button
                    className="mt-4 px-6 py-3 text-white rounded float-right"
                    onClick={() => handleSave()}
                >
                    Save
                </Button>
            </div>
            {/* Address Form */}
            <div className="py-5 w-2/5">
                {/* Address Form */}
                <h3 className="text-lg font-bold mb-4">Address:</h3>
                <div className="flex flex-col gap-5">
                    <Input
                        label="Address"
                        type="text"
                        name="address"
                        value={formData?.address}
                        onChange={handleChange}
                    />
                    <Input
                        label="City"
                        type="text"
                        name="city"
                        value={formData?.city}
                        onChange={handleChange}
                    />
                    <Input
                        label="State"
                        type="text"
                        name="state"
                        value={formData?.state}
                        onChange={handleChange}
                    />
                    <Input
                        label="Zip Code"
                        type="text"
                        name="zipcode"
                        value={formData?.zipcode}
                        onChange={handleChange}
                    />
                </div>
                <Button
                    className="mt-4 px-6 py-3 text-white rounded float-right"
                    onClick={() => handleSave()}
                >
                    Save
                </Button>
            </div>
            {/* Phone Form */}
            <div className="py-5 w-2/5">
                <h3 className="text-lg font-bold mb-4">Phone:</h3>
                <div className="flex flex-col gap-5">
                    <Input
                        label="Telephone"
                        type="tel"
                        name="tel"
                        value={formData?.tel}
                        onChange={handleChange}
                    />
                    <Input
                        label="Fax"
                        type="tel"
                        name="fax"
                        value={formData?.fax}
                        onChange={handleChange}
                    />
                </div>
                <Button
                    className="mt-4 px-6 py-3 text-white rounded float-right"
                    onClick={() => handleSave()}
                >
                    Save
                </Button>
            </div>
        </div>
    );
}

export default Profile;