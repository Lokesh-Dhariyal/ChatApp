import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { motion } from "framer-motion";

export function LoginPage() {
  useEffect(()=>{
    currentUser()
  },[])
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    credentials: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { login,currentUser } = useUser();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData);
    if (!res.success) {
      alert(res.message);
      throw new Error("Login failed");
    }
    if (res.success) {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-2">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className=" bg-black/80 border border-white/20 p-10 rounded-2xl shadow-xl w-full lg:max-w-2xl"
      >
        <motion.h2
          className="text-3xl font-extrabold mb-6 text-center text-white/80 tracking-wide"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Login
        </motion.h2>

        <div className="space-y-5">
          {[
            { name: "credentials", placeholder: "Username or Email", type: "text" },
            { name: "password", placeholder: "Password", type: "password" },
          ].map((field, idx) => (
            <motion.input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              onChange={handleChange}
              required
              className="w-full p-3 bg-black/70 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/70"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
            />
          ))}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-6 bg-white/80 hover:bg-white/70 transition-all text-black py-3 rounded-lg font-semibold tracking-wide shadow-md hover:cursor-pointer"
        >
          Login
        </motion.button>

        <motion.p
          className="mt-6 text-sm text-center text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          Don’t have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </motion.p>
      </motion.form>
    </div>
  );
}
