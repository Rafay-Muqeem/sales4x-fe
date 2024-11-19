import React, { useEffect, useState } from 'react';
import { PencilSquareIcon, ArrowLeftIcon, ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { format, parseISO, isSameDay } from 'date-fns';
import MyPopUpForm from './form';
import { fetchAppointments } from '@/services/fetchAppointments';
import { Card, CardHeader, CardBody, Typography, Button, Tooltip, IconButton, Spinner } from '@material-tailwind/react';
import { State } from '@/state/Context';
import { toast } from "react-toastify";
import { delAppointment } from '@/services/delAppointment';

export function Appointments() {

    const { state } = State();
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [selected, setSelected] = useState('');
    const [monthDays, setMonthDays] = useState(0);
    const [firstDay, setFirstDay] = useState(0);
    const [loopTotal, setLoopTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const currentDate = new Date();
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1);

    let weekDaysList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

    useEffect(() => {
        if (currentMonth > 0 && currentMonth <= 12) {
            const allDays = new Date(currentYear, currentMonth, 0).getDate();
            // get first day of month
            const firstDay = new Date(`${currentMonth}` + ',01,' + `${currentYear}`).getDay();
            setFirstDay(firstDay);
            setSelected(monthList[currentMonth - 1] + ` ${currentYear}`);
            setMonthDays(allDays);

            if ((firstDay + allDays) <= 35) {
                setLoopTotal(35);
            }
            else {
                setLoopTotal(42);
            }
        }
        else if (currentMonth < 1) {
            setCurrentMonth(12);
            setCurrentYear(currentYear => currentYear - 1);
        }
        else if (currentMonth > 12) {
            setCurrentMonth(1);
            setCurrentYear(currentYear => currentYear + 1);
        }
    }, [currentMonth, currentYear])

    function increNumber() {
        setCurrentMonth(currentMonth => currentMonth + 1);
    }

    function decreNumber() {
        setCurrentMonth(currentMonth => currentMonth - 1);
    }

    useEffect(() => {
        getAppointments();
    }, [refresh])

    const getAppointments = async () => {
        try {
            const res = await fetchAppointments(state.userToken);
            const appointments = await res.json();
            setAppointments(appointments);
            setLoading(false);
        } catch (error) {
            console.log(error);
            showToastMessage('error', 'Something went wrong')
        }
    }

    const handleOpen = () => {
        if (state.userInfo.Permission.some(obj => obj.name === "CAN_ADD_APPOINTMENT" || obj.name === "IS_ADMIN" || obj.name === "IS_SUPER_ADMIN")) {
            setOpen(!open);
        }
        else {
            toast.error("You are not allowed to create an appointment");
        }
    }

    const handleEdit = (data) => {
        if (state.userInfo.Permission.some(obj => obj.name === "CAN_EDIT_APPOINTMENT" || obj.name === "IS_ADMIN" || obj.name === "IS_SUPER_ADMIN")) {
            setSelectedItem(data)
            handleOpen()
        }
        else {
            toast.error("You are not allowed to update an appointment");
        }
    }

    async function handleDel(id) {
        if (state.userInfo.Permission.some(obj => obj.name === "CAN_DELETE_APPOINTMENT" || obj.name === "IS_ADMIN" || obj.name === "IS_SUPER_ADMIN")) {
            try {
                const res = await delAppointment(id, state.userToken);
                const appointment = await res.json();
                if (res.status === 200) {
                    showToastMessage('success', appointment.message)
                }
                else if (res.status === 404) {
                    showToastMessage('info', appointment.message)
                }
                else if (res.status === 500) {
                    showToastMessage('error', "Something went wrong");
                }
                setRefresh(!refresh)
            } catch (error) {
                console.log(error);
                showToastMessage('error', "Something went wrong");
            }
        }
        else {
            toast.error("You are not allowed to delete an appointment");
        }

    }

    const renderAppointmentsForDate = (date) => {
        const filteredAppointments = appointments.filter((appointment) =>
            isSameDay(appointment.startDateTime, date)
        );

        return filteredAppointments.map((appointment, index) => (
            <div key={index} className="mt-1 px-1 flex justify-center bg-blue-600 rounded-md">
                <div className='text-white text-sm cursor-pointer' onClick={() => handleEdit(appointment)}>
                    <div className='mr-1 w-min'>{format(parseISO(appointment.startDateTime), 'HH:mm')}</div>
                    <span>{appointment.customerName.split(' ')[0]}</span>
                </div>
                <XMarkIcon onClick={() => handleDel(appointment.id)} className="h-4 w-4 text-white mb-auto ml-auto cursor-pointer" />
            </div>
        ));
    };

    if (loading) {
        return <Spinner className="mx-auto mt-[30vh] h-10 w-10 text-gray-900/50" />
    }
    return (
        <Card className="h-full w-full ">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-4 sm:mb-0 flex items-center">
                    <Typography variant="h5" color="blue-gray" className="flex items-center">
                        <PencilSquareIcon className="h-12 w-12 text-blueGray-500 ml-2" />
                        Appointments
                    </Typography>
                </div>
                <div className="flex flex-col lg:flex-row items-center w-full mt-5">
                    <div className="w-full lg:w-2/5 flex items-center justify-center lg:justify-start gap-2">
                        <div className="flex gap-2 lg:gap-4">
                            <Button className="w-full bg-blue-900 lg:w-auto" size="md" onClick={handleOpen} >
                                New
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="p-4 px-0">
                <div className="p-2">
                    <div className='flex justify-between'>
                        <div className="flex items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-700">Calendar</h2>
                        </div>
                        <h1 className="text-lg font-semibold text-gray-700 uppercase">{selected}</h1>
                        <div className="flex items-center mb-4">
                            <Tooltip content="Prev">
                                <IconButton variant="text" onClick={() => decreNumber()}>
                                    <ArrowLeftIcon className='h-8 w-8 text-gray-700 cursor-pointer' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip content="Next">
                                <IconButton variant="text" onClick={() => increNumber()}>
                                    <ArrowRightIcon className='h-8 w-8 text-gray-700 cursor-pointer' />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="grid grid-cols-7">
                        {weekDaysList.map((day, index) => (
                            <div key={index} className="p-1 font-semibold border border-gray-300 h-8 text-center bg-blue-gray-50/50">
                                {day}
                            </div>
                        ))}
                        {Array.from({ length: loopTotal }, (_, i) => {
                            return (
                                <div key={i} className="p-1 border border-gray-300 h-28 max-h-44">
                                    {i >= firstDay && i < firstDay + monthDays ?
                                        <>
                                            <div className=''>{i - (firstDay - 1)}</div>
                                            <div className="mt-1">
                                                {renderAppointmentsForDate(format(new Date(currentYear, currentMonth, 0).setDate(i - (firstDay - 1)), 'yyyy-MM-dd'))}
                                            </div>
                                        </>
                                        :
                                        ''
                                    }
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardBody>
            <MyPopUpForm selectedItem={selectedItem} setSelectedItem={setSelectedItem} open={open} handleOpen={handleOpen} refresh={refresh} setRefresh={setRefresh} />
        </Card >
    );
};

export default Appointments;
