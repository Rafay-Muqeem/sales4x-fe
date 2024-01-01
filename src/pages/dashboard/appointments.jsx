import React, { useEffect, useState } from 'react';
import { PlusCircleIcon, ArrowLeftCircleIcon, ArrowRightCircleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { format, parseISO, isSameDay, setMonth } from 'date-fns';
import AppointmentForm from '../forms/appointmentForm';
import { fetchAppointments } from '@/services/fetchAppointments';
import { Card, CardHeader, CardBody, Typography, Button, Tooltip, IconButton } from '@material-tailwind/react';

export function Appointments() {

    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [selected, setSelected] = useState('');
    const [monthDays, setMonthDays] = useState(0);
    const [firstDay, setFirstDay] = useState(0);
    const [loopTotal, setLoopTotal] = useState(0);

    const currentDate = new Date();
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1);

    let weekDaysList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
        const appointments = await fetchAppointments();
        setAppointments(await appointments.json());
    }

    const handleOpen = () => setOpen(!open);

    const handleEdit = (data) => {
        setSelectedItem(data)
        handleOpen()
    }

    const renderAppointmentsForDate = (date) => {
        const filteredAppointments = appointments.filter((appointment) =>
            isSameDay(appointment.startDateTime, date)
        );

        return filteredAppointments.map((appointment, index) => (
            <div onClick={() => handleEdit(appointment)} key={index} className="mt-1 px-1 flex text-white text-sm bg-blue-600 rounded-md cursor-pointer">
                <div className='mr-1 w-min'>{format(parseISO(appointment.startDateTime), 'HH:mm')}</div>
                <span>{appointment.customerName.split(' ')[0]}</span>
            </div>
        ));
    };

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
                            <h2 className="text-lg font-semibold">Calendar</h2>
                        </div>
                        <h1 className="text-lg font-semibold uppercase">{selected}</h1>
                        <div className="flex items-center mb-4">
                            <Tooltip content="Prev">
                                <IconButton variant="text" onClick={() => decreNumber()}>
                                    <ArrowLeftCircleIcon className='h-8 w-8 text-blue-600 cursor-pointer' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip content="Next">
                                <IconButton variant="text" onClick={() => increNumber()}>
                                    <ArrowRightCircleIcon className='h-8 w-8 text-blue-600 cursor-pointer' />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="grid grid-cols-7">
                        {weekDaysList.map((day, index) => (
                            <div key={index} className="p-1 border border-gray-300 h-8 text-center bg-blue-gray-50/50">
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
                                            {renderAppointmentsForDate(format(new Date(currentYear, currentMonth, 0).setDate(i - (firstDay-1)), 'yyyy-MM-dd'))}
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
            <AppointmentForm selectedItem={selectedItem} setSelectedItem={setSelectedItem} open={open} handleOpen={handleOpen} refresh={refresh} setRefresh={setRefresh} />
        </Card >
    );
};

export default Appointments;
