import React, { useState } from "react";
import { Input, Select, Button, Option, Alert } from "@material-tailwind/react";

function Profile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [business, setBusiness] = useState('');
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [reEnterPass, setReEnterPass] = useState('');


    const options = [
        { value: 'A, California', label: 'Business A' },
        { value: 'B, Texas', label: 'Business B' },
        { value: 'C, Dallas', label: 'Business C' },
    ];

    const handleSaveClick = () => {
        console.log(firstName)
        console.log(email)
        console.log(business)
        setFirstName("");
        setLastName("");
        setEmail("");
        setBusiness("");
    }

    return (
        <div className="flex flex-col w-full bg-transparent rounded-md">
            <div className="border-b-2 pb-4 mt-5 mr-10">
                <h2 className="text-lg font-semibold mb-4">Contact:</h2>
                <form className="flex flex-col space-y-4 w-48">
                    <Input
                        label="First Name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        size="md"
                    />

                    <Input
                        label="Last Name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        size="md"
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        size="md"
                    />

                    <Select
                        label="Select Business"
                        animate={{
                            mount: { y: 0 },
                            unmount: { y: 25 },
                        }}
                        value={business}
                        onChange={(value) => setBusiness(value)}
                        size="md"
                    >
                        {options.map((option) => (
                            <Option key={option.value} value={option.value}>{option.label}</Option>
                        ))}
                    </Select>

                    <Button onClick={handleSaveClick}>Save</Button>
                </form>
            </div>

            <div className="border-b-2 pb-4 mt-10 mr-10">
                <h2 className="text-lg font-semibold mb-4 ">Change Login:</h2>
                <form className="flex flex-col space-y-4 w-48">
                    <Input
                        label="Current Password"
                        type="password"
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                    />

                    <Input
                        label="New Password"
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                    />

                    <Input
                        label="Re-enter Password"
                        type="password"
                        value={reEnterPass}
                        onChange={(e) => setReEnterPass(e.target.value)}
                    />

                    <Button onClick={handleSaveClick}>Save</Button>
                </form>
            </div>
        </div>
    );
}

export default Profile;