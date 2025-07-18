import React, {useState} from 'react'
 import loginAnimation from '../assets/login-animation.gif'
import {BiShow,BiHide} from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector } from 'react-redux'; 
import { loginRedux } from '../redux/userSlice';

//This file contains the login section

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword((preve) => !preve);
  };
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate()
//state changes
 const userData = useSelector(state => state)
 //send data to redux store
 const dispatch = useDispatch()

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
 
  const handleSubmit = async(e) =>{
    e.preventDefault()
    const {email,password} = data
    if(email.slice(0,5) === "admin" && password === "admin"){
      navigate("/admin-home")
    }

    else if(email && password){
      const fetchData = await fetch(
      `${process.env.REACT_APP_SERVER_DOMAIN}/login`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const dataRes = await fetchData.json();
      const userId = dataRes.data._id
      localStorage.setItem("id",userId)
      toast(dataRes.message)

      //success login
      //navigate to homepage approximately 1s
      if (dataRes.alert){
        dispatch(loginRedux(dataRes))
        setTimeout(() => {
          navigate("/")
        },1000);
        //console.log(userData)
      }
    }
    else{
      alert("Please Enter required fields")
    }
  }
  return (
    <div className="p-3 md:p-4">
    <div className="w-full max-w-sm bg-white m-auto flex items-center flex-col p-4">
      {/*<h1 className='text-center text-2xl'>Signup</h1>*/}
      <div className="w-20 overflow-hidden rounded-full drop-shadow-md shadow-md">
        {/*animated signup gif in form*/}
        <img src={loginAnimation} className="w-full" />
      </div>
      <form className="w-full py-3 flex flex-col"onSubmit={handleSubmit}>
       <label htmlFor="email">Email</label>
        <input
          type={"email"}
          id="email"
          name="email"
          className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-red-300"
          value={data.email}
          onChange={handleOnChange}
        />
        <label htmlFor="password">Password</label>
        <div className="flex px-2 py-1 rounded bg-slate-200 mt-1 mb-2 focus-within:outline focus-within:outline-red-300">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className=" w-full bg-slate-200 border-none outline-none"
            value={data.password}
            onChange={handleOnChange}
          />
          {/**react icons for hide and show */}
          <span className="flex cursor-pointer " onClick={handleShowPassword}>
            {showPassword ? <BiShow /> : <BiHide />}
          </span>
        </div>
        <button className="w-full max-w-[150px] m-auto bg-red-500 hover:bg-red-600 cursor-pointer text-white text-xl font-medium text-center py-1 rounded-full">
          Login
        </button>
      </form>
      <p className="text-sm mt-1">
        Don't have an account?
        <Link to={"/signup"} className="font-medium text-red-600 underline">
          Register
        </Link>
      </p>
    </div>
  </div>
);
}

export default Login
