import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Sidenav,
  DashboardNavbar,
  Footer,
} from "@/widgets/layout";
import {StatisticsChart} from "@/widgets/charts";
import { Spinner } from "@material-tailwind/react";
import routes from "@/routes";
import { useMaterialTailwindController } from "@/context";
import { State } from "@/state/Context";
import { getUserDetails } from "@/services/getUserDetails";
import { toast } from "react-toastify";

export function Dashboard() {
  const { state, dispatch } = State();
  const navigate = useNavigate();
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const [Token, setToken] = useState('')
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const setImpProp = async () => {
      const token = JSON.parse(localStorage.getItem('Token'));
      if (token) {
        setToken(token)
        dispatch({ type: 'SET_TOKEN', payload: token });
        try {
          const UserInfo = await getUserDetails(token);
          if (UserInfo.status >= 200 && UserInfo.status <= 299) {
            const user = await UserInfo.json();
            dispatch({ type: 'SET_USER', payload: user });
            localStorage.setItem('User', JSON.stringify(user));
            dispatch({ type: 'SET_BUSINESS', payload: user.Business });
            localStorage.setItem('Business', JSON.stringify(user.Business));
          }
          else {
            try {
              const user = JSON.parse(localStorage.getItem('User'));
              const business = JSON.parse(localStorage.getItem('Business'));

              if (user !== null && business !== null) {
                dispatch({ type: 'SET_USER', payload: user });
                dispatch({ type: 'SET_BUSINESS', payload: user.Business });
                dispatch({ type: 'SET_TOKEN', payload: token });
              }
            } catch (error) {

            }
          }
        } catch (error) {
          toast.error("Something went wrong")
        }

      }
      if (!token) navigate('/auth/sign-in')
    }
    setImpProp();

  }, [])

  useEffect(() => {
    setInterval(() => {
      const sessionExp = JSON.parse(localStorage.getItem('sessionExp'));
      if (Date.now() > sessionExp) {
        localStorage.removeItem('Token');
        localStorage.removeItem('sessionExp');
        localStorage.removeItem('User');
        localStorage.removeItem('Business');
        dispatch({ type: 'RESET' });
        navigate('/auth/sign-in');
      }
    }, 1000)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, [])

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen">
        <Sidenav
          routes={routes}
          // brandImg={
          //   sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
          // }
        />
        {loading ?
          <Spinner className="mx-auto mt-[40vh] h-10 w-10 text-gray-900/50" />
          :
          <div className="p-4 xl:ml-72 ">
            <Routes>
              {routes.map(
                ({ layout, pages }) =>
                  layout === "dashboard" &&
                  pages.map(({ path, element }) => (
                    <Route exact path={path} element={element} />
                  ))
              )}
            </Routes>
          </div>

        }
      </div>
      {/* <div className="bg-blue-gray-50/50"> */}
      {/* <Footer /> */}
      {/* </div> */}
    </>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
