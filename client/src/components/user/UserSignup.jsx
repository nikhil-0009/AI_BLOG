import React, { useState } from "react";
import { useAppContext } from "../../../context/AppContext";

const UserSignup = () => {
  const {navigate,axios}=useAppContext()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      const res = await axios.post("/api/user/signup", {
        name,
        email,
        password,
      });
      if(res.data.success){
        alert("Signup successful! You can now login.");
        navigate("/user");
      }
      else{
        alert(res.data.message || "Signup failed");
      }
    } catch (error) {
      alert(err.response?.data?.message || "Something went wrong.");
      console.error(err);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">User</span> SignUp
            </h1>
            <p className="font-light">
              {" "}
              Enter your Credentials to Access the User Panel
            </p>
          </div>
          <form className="mt-6 w-full sm:max-w-md text-gray-600" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label> Name</label>
              <input
                type="name"
                required
                placeholder="Enter Your Name"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label>Email</label>
              <input
                type="email"
                required
                placeholder="Your Email id"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="Your Password"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
