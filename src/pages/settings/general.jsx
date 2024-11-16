import React, { useEffect, useState } from "react";
import { Input, Select, Button, Option } from "@material-tailwind/react";
import { State } from '../../state/Context'
function Profile() {
    const { state, dispatch } = State();
    const [invoice, setInvoice] = useState(state.Settings.General.invoice);
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [reEnterPass, setReEnterPass] = useState('');

    const invoiceOptions = [
        { value: 'current', label: 'current' },
        { value: 'all', label: 'all' },
    ];

    const handleSaveClick = async () => {
        dispatch({ type: 'SET_INVOICE', payload: invoice });
    }

    useEffect(() => {
        console.log(state.Settings.General.invoice);
    }, [state.Settings])

    return (
        <div className="flex flex-col w-full bg-transparent rounded-md">
            <div className="border-b-2 pb-4 mt-5 mr-10">
                <h2 className="text-lg font-semibold mb-4">General:</h2>
                <form className="flex flex-col space-y-4 w-48">
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
                </form>
            </div>

            <div className="border-b-2 pb-4 mt-10 mr-10">
                
                
            </div>
        </div>
    );
}

export default Profile;