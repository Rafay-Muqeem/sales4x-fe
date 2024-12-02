import PropTypes from "prop-types";
import { Link, NavLink, useLinkClickHandler } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { State } from '../../state/Context'

export function Sidenav({ routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const { state } = State();

  return (
    <aside
      className={`bg-gradient-to-br from-gray-800 to-gray-800 ${openSidenav ? "translate-x-0" : "-translate-x-80"
        } fixed inset-0 z-50  h-[calc(100vh-0px)] w-72 transition-transform duration-300 xl:translate-x-0 `}
    >
      <div
        className={`relative`}
      >
        <div className="flex items-center space-x-2 p-2">
          <img className="rounded-xl h-[60px] w-[60px]" src={state.business?.logo} alt="Business logo" width={60} height={60} />
          <Link to="/" className="w-full text-center">
            <Typography
              variant="h6"
              color="white"
              className="flex flex-col items-start justify-center"
            // color={sidenavType === "dark" ? "white" : "blue-gray"}
            >
              <span>Sales4x</span> <span className="text-xs font-normal whitespace-nowrap">({state.business?.name})</span>
            </Typography>
          </Link>
        </div>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (

          <ul key={key} className="mb-4 flex flex-col gap-1">
            {layout === 'dashboard' &&
              pages.map(({ icon, name, path }) => (
                <li key={name}>
                  <NavLink to={`/${layout}${path}`}>
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color={
                          isActive
                            ? sidenavColor
                            : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                        }
                        className="flex items-center gap-4 px-4 capitalize"
                        fullWidth
                      >
                        {icon}
                        <Typography
                          color="inherit"
                          className="font-medium capitalize"
                        >
                          {name}
                        </Typography>
                      </Button>
                    )}
                  </NavLink>
                </li>
              ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};


export default Sidenav;
