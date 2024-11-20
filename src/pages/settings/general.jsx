import React, { useEffect, useState } from "react";
import { Input, Select, Button, Option } from "@material-tailwind/react";
import { State } from '../../state/Context'

function Profile() {
    const { state, dispatch } = State();
    const [invoice, setInvoice] = useState(state.Settings.General.invoice);
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

    const invoiceOptions = [
        { value: 'current', label: 'current' },
        { value: 'all', label: 'all' },
    ];

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSave = (formType) => {
        console.log(`${formType} Data Saved:`, formData);
    };

    const handleSaveClick = async () => {
        dispatch({ type: 'SET_INVOICE', payload: invoice });
    }

    useEffect(() => {
        setFormData({
            name: state.business.name,
            logo: state.business.logo,
            defaultMargin: state.business.defaultMargin,
            address: state.business.address,
            city: state.business.city,
            state: state.business.state,
            zipCode: state.business.zipCode,
            tel: state.business.tel,
            fax: state.business.fax,
            licenseNumber: state.business.licenseNumber,
            permitNumber: state.business.permitNumber,
        });
    }, [])

    // useEffect(() => {
    //     console.log(state);
    // }, [state.Settings])

    return (
        <div className="flex flex-col w-full bg-transparent rounded-md divide-y-2 scroll-smooth">
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
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <Input
                        label="License Number"
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                    />
                    <Input
                        label="Permit Number"
                        type="text"
                        name="permitNumber"
                        value={formData.permitNumber}
                        onChange={handleChange}
                    />
                    <Input
                        label="Logo"
                        type="file"
                        name="logo"
                        onChange={handleChange}
                    />
                    <Input
                        label="Default Margin"
                        type="number"
                        name="defaultMargin"
                        value={formData.defaultMargin}
                        onChange={handleChange}
                    />
                </div>
                <Button
                    className="mt-4 px-6 py-3 text-white rounded float-right"
                    onClick={() => handleSave("Other")}
                >
                    Save
                </Button>
            </div>

            <div className="py-5 w-2/5">
                {/* Address Form */}
                <h3 className="text-lg font-bold mb-4">Address:</h3>
                <div className="flex flex-col gap-5">
                    <Input
                        label="Address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <Input
                        label="City"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                    <Input
                        label="State"
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                    />
                    <Input
                        label="Zip Code"
                        type="text"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleChange}
                    />
                </div>
                <Button
                    className="mt-4 px-6 py-3 text-white rounded float-right"
                    onClick={() => handleSave("Address")}
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
                        value={formData.tel}
                        onChange={handleChange}
                    />
                    <Input
                        label="Fax"
                        type="tel"
                        name="fax"
                        value={formData.fax}
                        onChange={handleChange}
                    />
                </div>
                <Button
                    className="mt-4 px-6 py-3 text-white rounded float-right"
                    onClick={() => handleSave("Phone")}
                >
                    Save
                </Button>
            </div>
        </div>
    );
}

export default Profile;