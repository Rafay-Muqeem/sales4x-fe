import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "@/services/signIn";


export function SignIn() {

  useEffect(() => {
    try {
      const token = JSON.parse(localStorage.getItem('Token'));
      console.log(token)
      if (token) navigate('/dashboard');
    } catch (error) {
      console.log(error)
    }

  }, []);

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  async function handleSignIn() {

    const data = {
      email: email,
      password: password
    }
    try {
      const res = await signIn(data);
      const user = await res.json();
      if (res.status !== 404) {
        setEmail('');
        setPassword('');
        localStorage.setItem('Token', JSON.stringify(user.token));
        localStorage.setItem('sessionExp', JSON.stringify(user.sessionExpire));
        navigate('/dashboard')
      }
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    setTimeout( () => {
      setLoading(false)
    }, 2000)
  }, [])

  if (loading) {
    return <Spinner className="mx-auto mt-[40vh] h-10 w-10 text-gray-900/50" />
  }
  return (
    <section className="w-full mt-24">
      <div className="text-center">
        <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
        <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
      </div>
      <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/4">
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
            Your email
          </Typography>
          <Input
            size="lg"
            placeholder="name@mail.com"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
            Password
          </Typography>
          <Input
            type="password"
            size="lg"
            placeholder="********"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button onClick={handleSignIn} className="mt-6" fullWidth>
          Sign In
        </Button>

        <div className="flex items-center justify-end gap-2 mt-6">

          <Typography variant="small" className="font-medium text-gray-900">
            <a href="#">
              Forgot Password
            </a>
          </Typography>
        </div>
      </form>
    </section>
  );
}

export default SignIn;
