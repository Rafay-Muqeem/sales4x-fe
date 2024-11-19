import React, { useEffect, useState } from 'react';
import { HomeIcon } from '@heroicons/react/24/solid';
import {
    Typography,
    Card,
    CardHeader,
    CardBody,
    Spinner,
} from "@material-tailwind/react";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { ClockIcon } from "@heroicons/react/24/solid";
import {
    statisticsCardsData,
    statisticsChartsData,
} from "@/data";
import { toast } from 'react-toastify';
import { fetchInvoices } from '@/services/fetchInvoices';
import { State } from '@/state/Context';
import { fetchAppointments } from '@/services/fetchAppointments';
import { fetchCustomers } from '@/services/fetchCustomers';
import { fetchProducts } from '@/services/fetchProducts';

export function Home() {
    const { state } = State();
    const [loading, setLoading] = useState(true);
    const [cardsData, setCardsData] = useState(statisticsCardsData);

    const currentDate = new Date().toISOString().split('T')[0];
    useEffect(() => {
        getInvoices();
        getCustomers();
        getProducts();

        setLoading(false);
    }, [])

    const getInvoices = async () => {
        try {
            const fetchedInvoices = await fetchInvoices(state.userToken);
            let totalInvoices = await fetchedInvoices.json();

            if (state.Settings.General.invoice === 'all') {
            }
            else if (state.Settings.General.invoice === 'current') {
                totalInvoices = totalInvoices.filter(invoice => invoice.current === true);
            }

            const invoicesWithCurrentDate = totalInvoices.filter(obj => obj.createdAt.split('T')[0] === currentDate);
            let money = 0;
            invoicesWithCurrentDate.forEach(invoice => {
                money += Number(invoice.totalAmount)
            })

            const newArray = [...cardsData];

            newArray[0].value = `$${money}`;
            newArray[1].value = invoicesWithCurrentDate.length;
            setCardsData(newArray)

        } catch (error) {
            console.log(error.message);
            toast.error("Something went wrong");
        }
    };

    const getCustomers = async () => {
        try {
            const res = await fetchCustomers(state.userToken);
            const customers = await res.json();

            const newArray = [...cardsData];
            newArray[2].value = customers.length
            setCardsData(newArray)

        } catch (error) {
            console.log(error.message);
            showToastMessage('error', 'Something went wrong')
        }
    }

    const getProducts = async () => {
        try {
            const res = await fetchProducts(state.userToken);
            const products = await res.json();
            
            const newArray = [...cardsData];
            newArray[3].value = products.length
            setCardsData(newArray)
        } catch (error) {
            console.log(error.message);
            showToastMessage('error', "Something went wrong");
        }
    }

    // const getAppointments = async () => {
    //     try {
    //         const res = await fetchAppointments(state.userToken);
    //         const appointments = await res.json();

    //         const appointmentsWithCurrentDate = appointments.filter(obj => obj.startDateTime.split('T')[0] === currentDate);

    //         console.log(appointmentsWithCurrentDate);
    //         const newArray = [...cardsData];
    //         newArray[2].value = appointmentsWithCurrentDate.length
    //         setCardsData(newArray)

    //     } catch (error) {
    //         console.log(error);
    //         toast.error("Something went wrong");
    //     }
    // }

    if (loading) {
        return <Spinner className="mx-auto mt-[30vh] h-10 w-10 text-gray-900/50" />
    }
    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-4 sm:mb-0 flex items-center">
                    <Typography variant="h5" color="blue-gray" className="flex items-center">
                        <HomeIcon className="h-10 w-10 text-blueGray-500 ml-2 mb-4" />
                        Home
                    </Typography>
                </div>
            </CardHeader>
            <CardBody className="p-4 px-0">
                <div className="mt-12">
                    <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                        {cardsData.length !== 0 && (cardsData.map(({ icon, title, footer, ...rest }) => (
                            <StatisticsCard
                                key={title}
                                {...rest}
                                title={title}
                                icon={React.createElement(icon, {
                                    className: "w-6 h-6 text-white",
                                })}
                            // footer={
                            //     <Typography className="font-normal text-blue-gray-600">
                            //         <strong className={footer.color}>{footer.value}</strong>
                            //         &nbsp;{footer.label}
                            //     </Typography>
                            // }
                            />
                        )))}
                    </div>
                    <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
                        {statisticsChartsData.map((props) => (
                            <StatisticsChart
                                key={props.title}
                                {...props}
                            // footer={
                            //     <Typography
                            //         variant="small"
                            //         className="flex items-center font-normal text-blue-gray-600"
                            //     >
                            //         <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                            //         &nbsp;{props.footer}
                            //     </Typography>
                            // }
                            />
                        ))}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default Home;
