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
    Chip,
} from "@material-tailwind/react";
import { addUser } from "@/services/addUser";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { updateUser } from "@/services/updateUser";

function UserForm({ businesses, permissions, userData, setUserData, open, handleOpen, refresh, setRefresh }) {

    const modalRef = useRef(null);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: '',
        dob: '',
        BusinessId: '',
    });
    const [selectPerms, setSelectPerms] = useState([]);
    const [id, setId] = useState('');
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
        if (userData !== '') {
            setUpdate(true);
            setFormData({
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                password: '',
                role: userData.role,
                dob: userData.dob,
                BusinessId: userData.BusinessId,
            })
            setSelectPerms(userData.Permission);
            setId(userData.id)
        }
        setUserData('');
    })

    const handleAdd = async () => {
        const data = {
            user: formData,
            permissions: selectPerms.map((perm) => (perm.id)),
        }

        try {
            const res = await addUser(data);
            const user = await res.json();
            console.log(user)
            resetFields();
            setRefresh(!refresh);
            handleOpen();
        } catch (error) {
            console.log(error)
        }
    };

    const handleUpdate = async () => {
        const data = {
            user: formData,
            permissions: selectPerms.map((perm) => (perm.id)),
        }

        try {
            const res = await updateUser(id, data);
            const user = await res.json();

            resetFields();
            setUserData('');
            setUpdate(false);
            setRefresh(!refresh)
            handleOpen();
        } catch (error) {
            console.log(error)
        }
    };

    const handlePermission = (value) => {
        if (!selectPerms.some(perm => perm.id === value.id)) {
            setSelectPerms([...selectPerms, value]);
        }

    }

    const resetFields = () => {
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            role: '',
            dob: '',
            BusinessId: '',
        })
        setSelectPerms([])
        setUpdate(false);
    }

    const options = [
        { value: 'Admin', label: 'Admin' },
        { value: 'Salesman', label: 'Salesman' },
    ];

    return (
        <>
            <Dialog ref={modalRef} size="sm" open={open} handler={handleOpen}>
                <DialogHeader>User</DialogHeader>
                <DialogBody>
                    <form id="form" className="flex flex-col space-y-4 mb-4 pb-4 border-b-2">
                        <Input
                            label="First Name"
                            type="text"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, ['first_name']: e.target.value })}
                            size="md"
                        />
                        <Input
                            label="Last Name"
                            type="text"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, ['last_name']: e.target.value })}
                            size="md"
                        />
                        <Input
                            label="name@mail.com"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, ['email']: e.target.value })}
                            size="md"
                        />
                        <Input
                            label="*******"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, ['password']: e.target.value })}
                            size="md"
                        />
                        <Select
                            label="Select Role"
                            animate={{
                                mount: { y: 0 },
                                unmount: { y: 25 },
                            }}
                            value={formData.role}
                            onChange={(value) => setFormData({ ...formData, ['role']: value })}
                            size="md"
                        >
                            {options.map((option) => (
                                <Option key={option.value} value={option.value}>{option.label}</Option>
                            ))}
                        </Select>
                        <Input
                            label="DOB"
                            type="date"
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, ['dob']: e.target.value })}
                        />
                        <Select
                            label="Select Business"
                            animate={{
                                mount: { y: 0 },
                                unmount: { y: 25 },
                            }}
                            value={formData.BusinessId}
                            onChange={(value) => setFormData({ ...formData, ['BusinessId']: value })}
                            size="md"
                        >
                            {businesses ?
                                businesses.map((business) => (
                                    <Option key={business.id} value={business.id}>{business.name}, {business.location}</Option>
                                )) : []}
                        </Select>
                    </form>
                    {selectPerms.map((perm) => (
                        <Chip key={perm.id} className="mr-2 w-48 inline" value={perm.name} icon={<XMarkIcon className="cursor-pointer" onClick={() => setSelectPerms(selectPerms.filter(item => item.id !== perm.id))} />} />
                    ))}
                    <form id="form2" className="mt-4">
                        <Select
                            label="Permissions"
                            animate={{
                                mount: { y: 0 },
                                unmount: { y: 25 },
                            }}
                            onChange={(value) => handlePermission(JSON.parse(value))}
                            size="md"
                        >
                            {permissions ?
                                permissions.map((permission) => (
                                    <Option key={permission.id} value={JSON.stringify(permission)}>{permission.name}</Option>
                                )) : []}
                        </Select>
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

export default UserForm;