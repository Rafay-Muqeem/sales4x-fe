import React, { useEffect, useState } from 'react';
import { Typography } from '@material-tailwind/react';
import Taxes from './taxes/taxes';
import Users from './users/users';
import Profile from './general/general';
import {
  Cog8ToothIcon
} from "@heroicons/react/24/solid";
import { State } from '@/state/Context';
import Vehicles from './vehicles/vehicles';

export function Settings() {
  const { state } = State();
  const [activeSection, setActiveSection] = useState('profile');

  const sections = {
    profile: {
      title: 'General Settings',
      component: <Profile />
    },
    tax: {
      title: 'Tax Settings',
      component: <Taxes />
    },
    Users: {
      title: 'Users Settings',
      component: <Users />
    },
    Vehicles: {
      title: 'Vehicles Settings',
      component: <Vehicles />
    }
  };

  const handleSectionClick = (section) => setActiveSection(section);

    return (
      <div>
        <div className="flex items-center mb-2">
          <Typography variant="h5" color="blue-gray" className="flex items-center">
            <Cog8ToothIcon className='h-12 w-12 text-blueGray-500 ml-2' />
            Settings
          </Typography>
        </div>
        {Object.keys(state.userInfo).length !== 0 && (state.userInfo.Permission.some(obj => obj.name === "IS_ADMIN" || obj.name === "IS_SUPER_ADMIN") ?
          <div className='flex flex-row w-full gap-4 mt-5'>
            <div className='bg-white px-4 py-2 rounded-md shadow-md h-max w-1/3 sm:w-1/2 lg:w-1/3'>
              <nav>
                <ul>
                  {Object.keys(sections).map((section) => (
                    <li key={section}>
                      <button
                        onClick={() => handleSectionClick(section)}
                        className={`px-4 py-2 rounded-md font-semibold
                              ${activeSection === section ? 'bg-gray-200 text-gray-800' : 'text-gray-500'}`}
                      >
                        {sections[section].title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className='bg-white p-4 rounded-md shadow-md flex-grow w-2/3 sm:w-full lg:w-2/3'>
              <div className='overflow-y-auto h-[70vh]'>
                {/* <Typography className='border-b border-gray-300 mr-10 pb-2' variant="h4" color="black">{sections[activeSection].title}</Typography> */}
                {sections[activeSection].component}
              </div>
            </div>
          </div>
          :
          null)}
      </div>
    );
};

export default Settings;
