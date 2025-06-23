import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function UserCard({user}) {
  const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};
const navigate = useNavigate()
  return (
      <motion.div
        key={user.username}
        className="flex items-center p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#2a2a2a] transition shadow-md cursor-pointer space-x-4"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        onClick={()=>navigate(`/chat/${user._id}`)}
      >
        <img
          src={user.profilePhoto}
          alt={user.username}
          className="w-12 h-12 rounded-full object-cover border-2 border-white/50"
        />
        <div>
          <p className="text-white font-semibold">{user.fullName}</p>
          <p className="text-sm text-gray-400">@{user.username}</p>
        </div>
      </motion.div>
    );
}

export {UserCard}