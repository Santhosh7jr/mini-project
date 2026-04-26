import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Login() {

  const [form, setForm] = useState({email : "", password : ""});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful");

      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }

  };

  return ( 
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4 text-center">Login</h2>

        <input type="email" placeholder="Email" className="border p-2 mb-3 w-full" onChange={(e) => {
          setForm({
            ...form, email : e.target.value
          })
        }}/>

        <input type="password" placeholder="Password" className="border p-2 mb-3 w-full" onChange={(e) => {
          setForm({
            ...form, password : e.target.value
          })
        }}/>

        <button className="bg-blue-500 text-white w-full py-2">Login</button>
      </form>
    </div>
  );

}