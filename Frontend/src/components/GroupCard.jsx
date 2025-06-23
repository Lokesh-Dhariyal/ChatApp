import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../Features/socketContext';
import { useNavigate } from 'react-router-dom';

export function GroupCard({group}) {
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
        key={group.groupName}
        className="flex items-center p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#2a2a2a] transition shadow-md cursor-pointer space-x-4"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        onClick={()=>navigate(`/group/${group._id}`)}
      >
        <img
          src={group.groupPhoto}
          alt={group.groupName}
          className="w-12 h-12 rounded-full object-cover border-2 border-white/50"
        />
        <div>
          <p className="text-white font-semibold">{group.groupName}</p>
        </div>
      </motion.div>
    );
}
