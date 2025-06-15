import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export function Header() {
  const navigate = useNavigate();

  const {isAuthenticated,logout,loading} = useUser()

  const handelLogout = async()=>{
    const res = await logout()
    if(res.success){
      navigate("/login")
    }
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
      className="w-full px-6 md:px-12 py-4 bg-black fixed top-0 z-50 bg-opacity-60 border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.h1
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 text-transparent bg-clip-text"
        >
          Chatwa
        </motion.h1>

        {!loading&&(isAuthenticated?(
          <motion.nav
          className="space-x-4 md:space-x-6 text-sm md:text-base text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            to="/home"
            className="hover:text-white transition duration-300 hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link
            to="/profile"
            className="hover:text-white transition duration-300 hover:underline underline-offset-4"
          >
            Profile
          </Link>
          <button
            onClick={handelLogout}
            className="px-2 lg:px-6 py-1 lg:py-3 rounded-lg border border-white text-white font-semibold text-lg shadow-lg hover:shadow-white/10 transition-all duration-300 hover:bg-white hover:text-black"
          >
            Logout
          </button>
        </motion.nav>
        ):(<motion.nav
          className="space-x-4 md:space-x-6 text-sm md:text-base text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
        <Link
            to="/login"
            className="hover:text-white transition duration-300 hover:underline underline-offset-4"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="hover:text-white transition duration-300 hover:underline underline-offset-4"
          >
            Register
          </Link>
        <a href="https://www.lokeshdhariyal.me/" target="_blank"  className=" text-[#bdbcbc] hover:text-[#a8a8a8]">
                Portfolio
            </a>
        </motion.nav>))}
        
      </div>
    </motion.header>
  );
}
