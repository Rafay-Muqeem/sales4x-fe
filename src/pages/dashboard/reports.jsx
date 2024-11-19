import React, { useState } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/solid';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";

export function Reports() {

    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-4 sm:mb-0 flex items-center">
                    <Typography variant="h5" color="blue-gray" className="flex items-center">
                        <ChartBarIcon className="h-12 w-12 text-blueGray-500 ml-2" />
                        Reports
                    </Typography>
                </div>
            </CardHeader>
            <CardBody className="p-4 px-0">
                <div>
                    
                </div>
            </CardBody>
        </Card>
    );
};

export default Reports;
