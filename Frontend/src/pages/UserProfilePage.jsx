import { useEffect, useRef, useState } from "react";
import { useUser } from "../hooks/useUser"
import { LoadingPage } from "./LoadingPage";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function UserProfilePage() {
  const {user,loading, currentUser,updateProfilePhoto,changePassword,updateUserInfo} = useUser();
  useEffect(()=>{ currentUser() },[])

  const [upload,setUpload] = useState(false)
  const [isHovered,setIsHovered] = useState(false)
  const [photo,setPhoto] = useState(null)
  const [isUploading,setIsUploading] = useState(false)
  const inputRef = useRef()
  const navigate = useNavigate()

  const UploadHandler = async(e)=>{
    e.preventDefault()
    setIsUploading(true)
    const formData = new FormData()
    formData.append("profilePhoto", photo)
    await updateProfilePhoto(formData)
    await currentUser()
    if(inputRef.current.value){ inputRef.current.value = ""; }
    setPhoto(null)
    setUpload(false)
    setIsUploading(false)
  }

  const [showUserPassword, setShowUserPassword] = useState(false);
  const [passwordUploading,setPasswordUploading] = useState(false)
  const [formPassword, setFormPassword] = useState({ previousPassword:"", newPassword:"" })

  const [showUserInfo,setShowUserInfo] = useState(false)
  const [InfoUploading,setInfoUploading] = useState(false)
  const [formInfo,setFormInfo] = useState({fullName:user?.fullName,email:user?.email})

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordUploading(true)
    await changePassword(formPassword);
    setPasswordUploading(false);
    setShowUserPassword(false);
    navigate("/home")
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setPasswordUploading(true)
    await updateUserInfo(formInfo);
    setInfoUploading(false);
    setShowUserInfo(false);
    navigate("/home")
  };

  const handleInfoChange = (e) =>{
    const {name,value} = e.target;
    setFormInfo((prev)=>({...prev,[name]:value}))
}

  if(loading||!user) return <LoadingPage/>

  return (
    <motion.div className="min-h-screen pt-22  text-white"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-11/12 mx-auto py-10 px-4 flex flex-col lg:flex-row gap-10 border border-white/10 rounded-3xl shadow-2xl">

        <div onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)} className="relative w-[280px] h-[280px] mx-auto">
          <motion.img
            src={user?.profilePhoto}
            alt={user?.username}
            className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <AnimatePresence>
            {isHovered && (
              <motion.div
                onClick={()=>setUpload(!upload)}
                className="hover:cursor-pointer absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 border border-white rounded-full bg-black bg-opacity-70 text-white text-lg backdrop-blur-sm shadow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                Edit
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {upload && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="mt-5 w-full text-center backdrop-blur-md"
              >
                <input 
                  ref={inputRef}
                  name="content"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  id="picture" 
                  type="file" 
                  className="block w-full text-sm text-gray-300 border border-gray-600 rounded-md p-2 bg-black file:text-gray-400 file:border-0 file:p-1 file:bg-transparent"
                />
                <button type="submit" onClick={UploadHandler} className="mt-4 w-full py-2 bg-green-500 hover:bg-green-600 text-black rounded-xl text-lg transition-all duration-300">
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 mt-5 space-y-4 text-center lg:text-left">
          <h2 className="text-4xl font-extrabold tracking-wide text-gray-300">{user.fullName}</h2>
          <p className="text-xl text-gray-400">@{user.username}</p>
        </div>
        

        <div className="w-full max-w-md">
        <div className="w-full max-w-md h-fit mx-auto lg:mx-0 text-white bg-white/10 rounded-2xl p-6 shadow-xl mb-5">
          <button
            type="button"
            onClick={() => setShowUserPassword(!showUserPassword)}
            className="h-10 w-full py-2 px-4 bg-gray-300 hover:bg-gray-400 text-black rounded-md shadow transition duration-300"
          >
            {showUserPassword ? "Cancel" : "Update Password"}
          </button>

          <AnimatePresence>
            {showUserPassword && (
              <motion.form
                onSubmit={handlePasswordSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="mt-6 space-y-4"
              >
                <div>
                  <label htmlFor="previousPassword" className="block mb-1 text-sm font-semibold">Current Password:</label>
                  <input
                    type="password"
                    name="previousPassword"
                    className="w-full pl-3 pr-3 py-2 border border-white/30 rounded-lg text-gray-200 bg-black placeholder-gray-500 focus:outline-none"
                    placeholder="••••••••"
                    onChange={handlePasswordChange}
                    value={formPassword.previousPassword}
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block mb-1 text-sm font-semibold">New Password:</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="w-full pl-3 pr-3 py-2 border border-white/30 rounded-lg text-gray-200 bg-black placeholder-gray-500 focus:outline-none"
                    placeholder="••••••••"
                    onChange={handlePasswordChange}
                    value={formPassword.newPassword}
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-black rounded-md shadow transition duration-300"
                >
                  {passwordUploading ? "Updating..." : "Update Password"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full max-w-md h-fit mx-auto lg:mx-0 text-white bg-white/10 rounded-2xl p-6 shadow-xl">
          <button
            type="button"
            onClick={() => setShowUserInfo(!showUserInfo)}
            className="h-10 w-full py-2 px-4 bg-gray-300 hover:bg-gray-400 text-black rounded-md shadow transition duration-300"
          >
            {showUserInfo ? "Cancel" : "Update Info"}
          </button>

          <AnimatePresence>
            {showUserInfo && (
              <motion.form
                onSubmit={handleInfoSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="mt-6 space-y-4"
              >
                <div>
                  <label htmlFor="fullName" className="block mb-1 text-sm font-semibold">Full Name:</label>
                  <input
                    type="text"
                    name="fullName"
                    className="w-full pl-3 pr-3 py-2 border border-white/30 rounded-lg text-gray-200 bg-black placeholder-gray-500 focus:outline-none"
                    placeholder={user.fullName}
                    onChange={handleInfoChange}
                    value={formInfo.fullName}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1 text-sm font-semibold">Email :</label>
                  <input
                    type="text"
                    name="email"
                    className="w-full pl-3 pr-3 py-2 border border-white/30 rounded-lg text-gray-200 bg-black placeholder-gray-500 focus:outline-none"
                    placeholder={user.email}
                    onChange={handleInfoChange}
                    value={formInfo.email}
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-black rounded-md shadow transition duration-300"
                >
                  {InfoUploading ? "Updating..." : "Update Info"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        </div>
      </div>
    </motion.div>
  )
}

export {UserProfilePage}