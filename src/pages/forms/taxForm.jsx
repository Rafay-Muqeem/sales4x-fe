import React, { useEffect, useState, useRef } from "react";
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

function TaxForm({ taxData, setTaxData, open, handleOpen, refresh, setRefresh }) {

    const modalRef = useRef(null);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [rate, setRate] = useState('');
    const [type, setType] = useState('');
    const [Default, setDefault] = useState(false);
    const [update, setUpdate] = useState(false);

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            resetFields();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        if (taxData !== '') {
            setUpdate(true);
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
            default: Default
        }

        try {
            const res = await addTax(data);
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
            const res = await updateTax(id, data);
            const tax = await res.json();
            resetFields();
            setTaxData('');
            setUpdate(false);
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
        setUpdate(false);
    }

    const options = [
        { value: '%', label: '%' },
        { value: '$', label: '$' },
    ];

    return (
        <>
            <Dialog ref={modalRef} size="sm" open={open} handler={handleOpen}>
                <DialogHeader>Tax Rate</DialogHeader>
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
                    <Button variant="gradient" color="green" onClick={update ? handleUpdate : handleAdd} >
                        <span>{update ? 'Update' : 'Add'}</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default TaxForm;