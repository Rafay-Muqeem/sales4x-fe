import { useLocation, useNavigate } from "react-router-dom";
import {
  Navbar,
  Button,
  IconButton,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";

export function DashboardNavbar() {
  const navigate = useNavigate()
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const logout = () => {
    localStorage.removeItem('Token');
    localStorage.removeItem('sessionExp');
    navigate('/auth/sign-in')
  }

  return (
    <Navbar
      color="white"
      className="mb-5 sticky top-0 z-40 border-blue-gray-900 "
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-row">
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
            >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

        <div className="flex w-full flex-row justify-end">
          <Button
            variant="text"
            color="blue-gray"
            className=" items-center gap-1 px-4 xl:flex hidden normal-case"
            onClick={logout}
          >
            <UserCircleIcon className="h-7 w-7 text-blue-gray-500" />
            Sign Out
          </Button>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={logout}
            >
            <UserCircleIcon className="h-7 w-7 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
