import {
  Cog8ToothIcon,
  DocumentTextIcon,
  WrenchIcon,
  CubeIcon,
  ChartBarIcon,
  UserGroupIcon,
  PencilSquareIcon
} from "@heroicons/react/24/solid";
import { Customers, Invoice, Product, Tables, Inspection, Appointments, Settings  } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Customers",
        path: "/customers",
        element: <Customers />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Invoices",
        path: "/invoice",
        element: <Invoice />,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "Products",
        path: "/products",
        element: <Product />,
      },
      {
        icon: <PencilSquareIcon {...icon} />,
        name: "Appointments",
        path: "/appointments",
        element: <Appointments />,
      },
      {
        icon: <WrenchIcon {...icon} />,
        name: "Inspections",
        path: "/inspection",
        element: <Inspection />,
      },
      {
        icon: <ChartBarIcon {...icon} />,
        name: "Reports",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <Cog8ToothIcon {...icon} />,
        name: "Settings",
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
  {
    layout: "auth",
    pages: [
      {
        icon: <Cog8ToothIcon {...icon} />,
        name: "Settings",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <Cog8ToothIcon {...icon} />,
        name: "Settings",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
