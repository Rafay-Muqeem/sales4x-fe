import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option,
    Checkbox,
} from "@material-tailwind/react";
import { addTax } from "@/services/addTax";
import { updateTax } from "@/services/updateTax";
import { State } from "@/state/Context";

function TaxForm({ taxData, setTaxData, open, handleOpen, refresh, setRefresh }) {

    const {state} = State();
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [rate, setRate] = useState('');
    const [type, setType] = useState('');
    const [Default, setDefault] = useState(false);
    const [BusinessId, setBusinessId] = useState('');
    const [edit, setEdit] = useState(false);


    useEffect(() => {
        if (taxData !== '') {
            setEdit(true);
            setId(taxData.id);
            setName(taxData.name);
            setRate(taxData.rate);
            setType(taxData.type);
            setDefault(taxData.default);
        }
        setTaxData('');
    })

    const handleAdd = async () => {
        const data = {
            name: name,
            rate: rate,
            type: type,
            default: Default,
            BusinessId: state.business.id
        }

        console.log(state.business.id);
        try {
            const res = await addTax(data, state.userToken);
            const tax = await res.json();
            resetFields();
            setRefresh(!refresh);
            handleOpen();
        } catch (error) {
            console.log(error)
        }

    };

    const handleUpdate = async () => {
        const data = {
            name: name,
            rate: rate,
            type: type,
            default: Default
        }

        try {
            const res = await updateTax(id, data, state.userToken);
            const tax = await res.json();
            resetFields();
            setTaxData('');
            setEdit(false);
            setRefresh(!refresh)
            handleOpen();
        } catch (error) {
            console.log(error)
        }
    };

    const resetFields = () => {
        setName('');
        setRate('');
        setType('');
        setDefault(false);
        setTaxData('');
        setEdit(false);
    }

    const options = [
        { value: '%', label: '%' },
        { value: '$', label: '$' },
    ];

    return (
        <>
            <Dialog dismiss={{enabled:false}} size="sm" open={open} handler={handleOpen}>
                <DialogHeader>{!edit ? "ADD TAX" : "EDIT TAX"}</DialogHeader>
                <DialogBody>
                    <form className="flex flex-col space-y-4 ">
                        <Input
                            label="Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            size="md"
                        />
                        <Input
                            label="Rate"
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            size="md"
                        />
                        <Select
                            label="Select Type"
                            animate={{
                                mount: { y: 0 },
                                unmount: { y: 25 },
                            }}
                            value={type}
                            onChange={(value) => setType(value)}
                            size="md"
                        >
                            {options.map((option) => (
                                <Option key={option.value} value={option.value}>{option.label}</Option>
                            ))}
                        </Select>
                        <Checkbox label="Set as Default" onChange={() => setDefault(!Default)} checked={Default} />
                    </form>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => { resetFields(); handleOpen(); }}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={edit ? handleUpdate : handleAdd} >
                        <span>{edit ? 'Update' : 'Add'}</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default TaxForm;