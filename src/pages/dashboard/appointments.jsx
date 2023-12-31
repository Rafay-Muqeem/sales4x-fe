import React, { useEffect, useState } from 'react';
import { PlusCircleIcon, ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { format, parseISO, isSameDay, setMonth } from 'date-fns';
import AppointmentForm from '../forms/appointmentForm';
import { fetchAppointments } from '@/services/fetchAppointments';

export function Appointments() {

    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [data, setData] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [selected, setSelected] = useState('');
    const [monthDays, setMonthDays] = useState(0);
    const [firstDay, setFirstDay] = useState(0);

    const currentDate = new Date();
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1);

    let weekDaysList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        if (currentMonth > 0 && currentMonth <= 12) {
            const allDays = new Date(currentYear, currentMonth, 0).getDate();
            setSelected(monthList[currentMonth - 1] + ` ${currentYear}`);
            setMonthDays(allDays);
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
        setData(data)
        handleOpen()
    }

    const renderAppointmentsForDate = (date) => {
        const filteredAppointments = appointments.filter((appointment) =>
            isSameDay(appointment.startDateTime, date)
        );

        return filteredAppointments.map((appointment, index) => (
            <div onClick={() => handleEdit(appointment)} key={index} className="mt-1 flex items-center justify-center text-sm bg-blue-600 rounded-md cursor-pointer">
                <div className='mr-1 w-min'>{format(parseISO(appointment.startDateTime), 'HH:mm')}</div>
                <span>{appointment.customerName.split(' ')[0]}</span>
            </div>
        ));
    };

    return (
        <div className="p-4 border rounded-md shadow-md bg-white">
            <AppointmentForm appointmentData={data} setAppointmentData={setData} open={open} handleOpen={handleOpen} refresh={refresh} setRefresh={setRefresh} />
            <div className='flex justify-between'>
                <div className="flex items-center mb-4">
                    <h2 className="text-lg font-semibold">Appointments Calendar</h2>
                    <PlusCircleIcon onClick={handleOpen} className='ml-4 h-8 w-8 text-blue-600 cursor-pointer' />
                </div>
                <h1 className="text-lg font-semibold">{selected}</h1>
                <div className="flex items-center mb-4">
                    <ArrowLeftCircleIcon onClick={() => decreNumber()} className='h-8 w-8 text-blue-600 cursor-pointer' />
                    <ArrowRightCircleIcon onClick={() => increNumber()} className='h-8 w-8 text-blue-600 cursor-pointer' />
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2">

                {Array.from({ length: monthDays }, (_, i) => {
                    const currentDate = new Date(currentYear, currentMonth, 0);
                    currentDate.setDate(i + 1);
                    const formattedDate = format(currentDate, 'yyyy-MM-dd');

                    return (
                        <div key={i} className="p-2 text-center border rounded-md">
                            <div>{i + 1}</div>
                            <div className="mt-1">
                                {renderAppointmentsForDate(formattedDate)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Appointments;
