import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export function Header() {
  const navigate = useNavigate();

  const {isAuthenticated,logout,loading} = useUser()

  const handelLogout = async()=>{
    const res = await logout()
    if(res.success){
      navigate("/")
    }
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
      className="w-full px-6 md:px-12 py-2 bg-black fixed top-0 z-50 bg-opacity-60 border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
      <Link to={"/"}><motion.img
          src="/logo.png"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          className="w-14 lg:w-17 h-12 lg:h-15 rounded-xl"
        /></Link>

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
            className="px-2 lg:px-6 py-1 lg:py-3 rounded-lg lg:border bg-white lg:bg-black border-white text-black lg:text-white font-semibold lg:text-lg shadow-lg hover:shadow-white/10 transition-all 
            duration-300 hover:bg-white hover:text-black hover:cursor-pointer"
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
        <a href="https://www.lokeshdhariyal.me/" target="_blank">
              <button type="button"
                className="inline-flex p-0.5 mb-2 text-sm font-medium text-white rounded-full bg-gradient-to-br from-blue-400 to-blue-800 hover:from-blue-800 hover:to-blue-400 hover:text-white hover:cursor-pointer"
              >
                <span
                  className="px-5 py-2.5 bg-black rounded-full"
                >
                  Portfolio
                </span>
              </button>
            </a>
        </motion.nav>))}
        
      </div>
    </motion.header>
  );
}
