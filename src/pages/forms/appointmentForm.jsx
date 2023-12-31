import React, { useEffect, useState, useRef } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react";
import { addAppointment } from "@/services/addAppointment";
import { updateAppointment } from "@/services/updateAppointment";
import { delAppointment } from "@/services/delAppointment";

function AppointmentForm({ appointmentData, setAppointmentData, open, handleOpen, refresh, setRefresh }) {

    const modalRef = useRef(null);

    const [id, setId] = useState('');
    const [formData, setFormData] = useState({
        customerName: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
    });
    const [currentDate, setCurrentDate] = useState(getCurrentDateTimeForInput());
    const [update, setUpdate] = useState(false);
    const [error, setError] = useState(false);

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
        if (appointmentData !== '') {
            setUpdate(true);
            setId(appointmentData.id);
            setFormData({
                customerName: appointmentData.customerName,
                description: appointmentData.description,
                startDateTime: correctDateFormat(appointmentData.startDateTime),
                endDateTime: correctDateFormat(appointmentData.endDateTime),
            })
        }
        setAppointmentData('');
    })

    const correctDateFormat = (date) => {
        const parsedDate = new Date(date);
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const hours = String(parsedDate.getHours()).padStart(2, '0');
        const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
        const seconds = String(parsedDate.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    useEffect(() => {
        let currentDate = new Date();
        setInterval(() => {
            const now = new Date();
            if (now.getMinutes() !== currentDate.getMinutes()) {
                setCurrentDate(getCurrentDateTimeForInput);
            }
        }, 1000)
    }, []);

    useEffect(() => {
    }, [error])

    const setErrorFalse = () => {
        setTimeout(() => {
            setError(false)
        }, 5000)
    }

    function getCurrentDateTimeForInput() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };


    const handleAdd = async () => {

        const inputStartDate = formData.startDateTime.split('T')[0];
        const inputStartTime = (parseInt(formData.startDateTime.split('T')[1].split(':')[0], 10) * 60) + parseInt(formData.startDateTime.split('T')[1].split(':')[1], 10);
        const inputEndDate = formData.endDateTime.split('T')[0];
        const inputEndTime = (parseInt(formData.endDateTime.split('T')[1].split(':')[0], 10) * 60) + parseInt(formData.endDateTime.split('T')[1].split(':')[1], 10);
        const currDate = currentDate.split('T')[0];
        const currentTime = (parseInt(currentDate.split('T')[1].split(':')[0], 10) * 60) + parseInt(currentDate.split('T')[1].split(':')[1], 10);

        console.log(currDate)
        console.log(inputStartDate)
        console.log(inputEndDate)

        if (inputStartTime >= inputEndTime || inputStartDate > inputEndDate) {
            console.log('here')
            setError(true);
            setErrorFalse();
        }

        else if (inputStartTime <= currentTime && inputStartDate === currDate) {
            console.log('here2')
            setError(true);
            setErrorFalse();
        }

        else if (inputEndTime <= currentTime && inputEndDate === currDate) {
            console.log('here3')
            setError(true);
            setErrorFalse();
        }

        else {
            try {
                const res = await addAppointment(formData);
                const appointment = await res.json();
                resetFields();
                setRefresh(!refresh);
                handleOpen();
            } catch (error) {
                console.log(error)
            }
        }
    };

    const handleUpdate = async () => {

        const inputStartDate = formData.startDateTime.split('T')[0];
        const inputStartTime = (parseInt(formData.startDateTime.split('T')[1].split(':')[0], 10) * 60) + parseInt(formData.startDateTime.split('T')[1].split(':')[1], 10);
        const inputEndDate = formData.endDateTime.split('T')[0];
        const inputEndTime = (parseInt(formData.endDateTime.split('T')[1].split(':')[0], 10) * 60) + parseInt(formData.endDateTime.split('T')[1].split(':')[1], 10);
        const currDate = currentDate.split('T')[0];
        const currentTime = (parseInt(currentDate.split('T')[1].split(':')[0], 10) * 60) + parseInt(currentDate.split('T')[1].split(':')[1], 10);


        if (inputStartTime >= inputEndTime || inputStartDate > inputEndDate) {
            console.log('here')
            setError(true);
            setErrorFalse();
        }

        else if (inputStartTime <= currentTime && inputStartDate === currDate) {
            console.log('here2')
            setError(true);
            setErrorFalse();
        }

        else if (inputEndTime <= currentTime && inputEndDate === currDate) {
            console.log('here3')
            setError(true);
            setErrorFalse();
        }

        else {
            try {
                const res = await updateAppointment(id, formData);
                const appointment = await res.json();
                resetFields();
                setAppointmentData('');
                setUpdate(false);
                setRefresh(!refresh)
                handleOpen();
            } catch (error) {
                console.log(error)
            }
        }
    };

    const resetFields = () => {
        setFormData({
            customerName: '',
            description: '',
            startDateTime: '',
            endDateTime: '',
        });
        setUpdate(false);
    }

    async function handleDel(id) {
        const appointment = await delAppointment(id);
        resetFields()
        handleOpen()
        setRefresh(!refresh)
    }

    return (
        <>
            <Dialog ref={modalRef} size="sm" open={open} handler={handleOpen}>
                <DialogHeader className={error ? 'text-red-500' : ''}>{update ? 'Update' : 'Add'} Appointment</DialogHeader>
                <DialogBody>
                    <form className="flex flex-col space-y-4 ">
                        <Input
                            label="Customer Name"
                            type="text"
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, ['customerName']: e.target.value })}
                            size="md"
                        />
                        <Input
                            label="Description"
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, ['description']: e.target.value })}
                            size="md"
                        />
                        <Input
                            label="Date & Time"
                            type="datetime-local"
                            value={formData.startDateTime}
                            onChange={(e) => setFormData({ ...formData, ['startDateTime']: e.target.value })}
                            min={currentDate}
                            size="md"
                        />
                        <Input
                            label="Date & Time"
                            type="datetime-local"
                            value={formData.endDateTime}
                            onChange={(e) => setFormData({ ...formData, ['endDateTime']: e.target.value })}
                            min={currentDate}
                            size="md"
                        />
                    </form>
                </DialogBody>
                <DialogFooter>
                    {update ?
                        <Button onClick={() => handleDel(id)} className="mr-auto" variant="gradient" color="red">
                            <span>Delete</span>
                        </Button>
                        :
                        null}
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

export default AppointmentForm;