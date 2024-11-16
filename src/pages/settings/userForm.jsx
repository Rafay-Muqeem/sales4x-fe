import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Typography,
} from "@material-tailwind/react";
import { addUser } from "@/services/addUser";
import { updateUser } from "@/services/updateUser";
import { State } from "@/state/Context";
import { toast } from "react-toastify";
import { fetchBusiness } from "@/services/fetchBusiness";

function UserForm({ permissions, userData, setUserData, open, handleOpen, refresh, setRefresh }) {
    
    const { state } = State();
    const [formData, setFormData] = useState({
        first_name: null,
        last_name: null,
        email: null,
        password: null,
        role: null,
        dob: null,
        BusinessId: null,
    });

    const [selectPerms, setSelectPerms] = useState([]);
    const [id, setId] = useState(null);
    const [edit, setEdit] = useState(false);
    const [business, setBusiness] = useState(null);
    const [businesses, setBusinesses] = useState(null);
    const [error, setError] = useState(false);


    useEffect(() => {
        getBusinesses();
    }, [])

    const getBusinesses = async () => {
        try {
            const res = await fetchBusiness(state.userToken);
            const businesses = await res.json();
            console.log(businesses);

            setBusinesses(businesses)
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        if (userData !== null) {
            setEdit(true);
            setFormData({
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                password: '',
                role: userData.role,
                dob: userData.dob,
                BusinessId: userData.BusinessId,
            })
            setBusiness(userData.BusinessId);
            setSelectPerms(userData.Permission.map((perm) => (perm.id)));
            setId(userData.id)
        }
        setUserData(null);
    })

    const handleSubmit = async () => {
        let updatedData = {};
        if (state.userInfo.role === 'super-admin') {
            updatedData = { ...formData, BusinessId: business }
        }
        else {
            updatedData = { ...formData, BusinessId: state.business.id }
        }
        const data = {
            user: updatedData,
            permissions: selectPerms,
        }

        try {
            if (!edit) {
                if (!(Object.values((({ ['dob']: _, ...rest }) => rest)(updatedData)).some(value => !value))) {
                    const res = await addUser(data, state.userToken);
                    const user = await res.json();

                    if (res.status === 400) {
                        toast.info(user.message);
                    }
                    else if (res.status === 409) {
                        toast.info(user.message)
                    }

                    setError(false);
                    resetFields();
                    setEdit(false);
                    setRefresh(!refresh);
                    handleOpen();
                }
                else {
                    setError(true);
                }
            }
            else {
                if (!(Object.values((({ ['dob']: _, ['password']: __, ...rest }) => rest)(updatedData)).some(value => !value))) {
                    const res = await updateUser(id, data, state.userToken);
                    const user = await res.json();

                    if (res.status === 400) {
                        toast.info(user.message);
                    }
                    else if (res.status === 409) {
                        toast.info(user.message)
                    }

                    setError(false);
                    resetFields();
                    setEdit(false);
                    setRefresh(!refresh);
                    handleOpen();
                }
                else {
                    setError(true);
                }
            }

        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    };

    const handlePermission = (value, event) => {
        const isChecked = event.target.checked;

        if (isChecked) {
            setSelectPerms([...selectPerms, value]);
        } else {
            setSelectPerms(selectPerms.filter(id => id !== value));
        }

    }

    const resetFields = () => {
        setFormData({
            first_name: null,
            last_name: null,
            email: null,
            password: null,
            role: null,
            dob: null,
            BusinessId: null,
        })
        setBusiness(null)
        setSelectPerms([])
        setEdit(false);
        setError(false)
    }

    const userRoles = [
        { value: 'Admin', label: 'Admin' },
        { value: 'Manager', label: 'Manager' },
        { value: 'Cashier', label: 'Cashier' },
        { value: 'Salesman', label: 'Salesman' },
    ];

    return (
        <>
            <Dialog dismiss={{ enabled: false }} size="sm" open={open} handler={handleOpen}>
                <DialogHeader>{!edit ? "ADD USER" : "EDIT USER"}</DialogHeader>
                <Typography variant="h6" color="red" className="ml-4 font-normal">{error && ("Please fill all required fields")}</Typography>
                <DialogBody>
                    <form id="form" className="flex flex-col space-y-4 mb-2 border-b-2 pb-4" onSubmit={handleSubmit} autoComplete="new" >
                        <div className="flex items-center justify-start space-x-4">
                            <Input
                                className="w-48"
                                id="first_name"
                                label="First Name"
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, ['first_name']: e.target.value })}
                                size="md"
                                required
                            />
                            <Input
                                className="w-48"
                                id="last_name"
                                label="Last Name"
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, ['last_name']: e.target.value })}
                                size="md"
                                required
                            />

                        </div>
                        <div className="flex items-center justify-start space-x-4">
                            <Input
                                className="w-48"
                                id="email"
                                label="name@mail.com"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, ['email']: e.target.value })}
                                size="md"
                                required
                            />

                            <Input
                                className="w-48"
                                id="password"
                                label="*******"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, ['password']: e.target.value })}
                                size="md"
                                required
                            />

                        </div>
                        <div className="flex items-center justify-start space-x-4">
                            <select
                                id="role"
                                className="w-56 p-2 border border-gray-400 bg-inherit rounded-md text-gray-600 font-normal"
                                label="Select Role"
                                animate={{
                                    mount: { y: 0 },
                                    unmount: { y: 25 },
                                }}
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, ['role']: e.target.value })}
                                size="md"
                                required
                            >
                                <option key={''} value={''} disabled selected>Select Role</option>
                                {state.userInfo.role === 'super-admin' ?
                                    userRoles.map((role) => (
                                        <option key={role.value} value={role.value}>{role.label}</option>
                                    ))
                                    :
                                    userRoles.filter((role) => role.label !== 'Admin').map(filteredRole => (
                                        <option key={filteredRole.value} value={filteredRole.value}>{filteredRole.label}</option>
                                    ))
                                }
                            </select>

                            <Input
                                className="w-48"
                                id="dob"
                                label="DOB"
                                type="date"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, ['dob']: e.target.value })}
                            />
                        </div>
                        {state.userInfo.role === 'super-admin' && (
                            <select
                                className="w-full p-2 border border-gray-400 bg-inherit rounded-md text-gray-600 font-normal"
                                value={business}
                                onChange={(e) => setBusiness(e.target.value)}
                                size="md"
                                aria-required
                            >
                                <option key={''} value={''}>Select Business</option>
                                {businesses ?
                                    businesses.map((business) => (
                                        <option key={business.id} value={business.id}>{business.name}, {business.location}</option>
                                    )) : []}
                            </select>
                        )}
                    </form>
                    
                    <span className="font-bold text-xl text-gray-900">PERMISSIONS</span>

                    <form id="form2" className="mt-3 h-32 overflow-y-auto">
                        
                        {permissions &&
                            permissions.map((permission) => (
                                
                                <div key={permission.id} className="mb-1 flex">
                                    <input
                                        className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out cursor-pointer"
                                        type="checkbox"
                                        id={`permission-${permission.id}`}
                                        value={JSON.stringify(permission)}
                                        checked={selectPerms.includes(permission.id)}
                                        onChange={(e) => handlePermission(permission.id, e)}
                                    />
                                    <span className="ml-2 font-medium text-base" htmlFor={`permission-${permission.id}`}>{permission.name}</span>
                                </div>
                            ))}
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
                    <Button variant="gradient" color="green" onClick={() => handleSubmit()} >
                        <span>{edit ? 'Update' : 'Add'}</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default UserForm;