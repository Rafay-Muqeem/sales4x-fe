import React, {useState, useEffect} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Sidenav,
  DashboardNavbar,
  Footer,
} from "@/widgets/layout";
import {  Spinner} from "@material-tailwind/react";
import routes from "@/routes";
import { useMaterialTailwindController } from "@/context";

export function Dashboard() {
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const [Token, setToken] = useState('')
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('Token'));
    if (token) setToken(token)
    if (!token) navigate('/auth/sign-in')
  }, [])

  useEffect(() => {
    setInterval(() => {
      const sessionExp = JSON.parse(localStorage.getItem('sessionExp'));
      if (Date.now() > sessionExp) {
        localStorage.removeItem('Token');
        localStorage.removeItem('sessionExp');
        navigate('/auth/sign-in')
      }
    }, 60000)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  if (loading) {
    return <Spinner className="mx-auto mt-[40vh] h-10 w-10 text-gray-900/50" />
  }
  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen">
        <Sidenav
          routes={routes}
          brandImg={
            sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
          }
        />
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
      </div>
      {/* <div className="bg-blue-gray-50/50"> */}
      <Footer />
      {/* </div> */}
    </>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
