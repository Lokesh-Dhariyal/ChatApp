import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { motion } from "framer-motion";

export function RegisterPage() {
  useEffect(()=>{
    currentUser()
  },[])
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { register, setLoading, currentUser } = useUser();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.password !== formData.confirmPassword) return;

    const res = await register(formData);
    setLoading(false);
    if (res.success) navigate("/home");
    else alert(res.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-2">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className=" bg-black/80 border border-white/20 p-10 rounded-2xl shadow-lg w-full lg:max-w-2xl"
      >
        <motion.h2
          className="text-3xl font-extrabold mb-6 text-center text-white/80 tracking-wide"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
        Create an Account
        </motion.h2>

        <div className="space-y-5">
          {[
            { name: "username", placeholder: "Username", type: "text" },
            { name: "fullName", placeholder: "Full Name", type: "text" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "password", placeholder: "Password", type: "password" },
            { name: "confirmPassword", placeholder: "Confirm Password", type: "password" },
          ].map((field, idx) => (
            <motion.input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              onChange={handleChange}
              required
              maxLength={20}
              className="w-full p-3 bg-black/70 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/70"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1, type: "spring" }}
            />
          ))}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="w-full mt-6 bg-white/80 hover:bg-white-70 transition-all text-black py-3 rounded-lg font-semibold tracking-wide shadow-md hover:cursor-pointer"
        >
          Register
        </motion.button>

        <motion.p
          className="mt-6 text-sm text-center text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </motion.p>
      </motion.form>
    </div>
  );
}
