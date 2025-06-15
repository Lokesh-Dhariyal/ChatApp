import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { useSocket } from '../Features/socketContext';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function ChatPage() {
  const { currentUser, user, conversation, someUser } = useUser();
  const { sendMessage, messages, setMessages, typing, typingUser } = useSocket();
  const [text, setText] = useState('');
  const { userId } = useParams();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await currentUser();
      const convo = await conversation(userId);
      setMessages(convo.data);
      const data = await someUser(userId);
      setUserData(data.data);
    };
    fetchData();
  }, [userId]);

  const handelSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(userId, text.trim());
    setText('');
  };
  const bottomRef = new useRef()
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages,typingUser]);
  

  return (
    <div className="lg:w-5/6 mx-auto h-screen bg-black text-white flex flex-col pt-18 lg:pt-21 pb-2 lg:px-4">
      
      {/* Header */}
      <motion.div
        className="flex items-center gap-4 p-2 lg:p-4 border-b border-gray-800 bg-[#111] rounded-t-xl shadow"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/chat"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <img
          src={userData?.profilePhoto || '/default.png'}
          alt={userData?.username}
          className="w-12 h-12 rounded-full object-cover border border-white"
        />
        <div>
          <h2 className="text-lg font-semibold">{userData?.fullName || 'User'}</h2>
          <p className="text-sm text-gray-400">@{userData?.username}</p>
        </div>
        {userData?.online?(<div className='h-full pt-2'>
          <div className='w-3 h-3 rounded-full bg-lime-500'></div>
        </div>):(<div className='h-full pt-8'>
          <div className='w-3 h-3 rounded-full bg-red-500'></div>
        </div>)}
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-scroll px-2 py-4 space-y-3 custom-scrollbar ">
        <AnimatePresence initial={false}>
          {messages?.map((m, i) => (
            <motion.div
              key={i}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`lg:max-w-[35%] max-w-[80%] w-fit h-fit px-4 py-2 rounded-xl break-words ${
                m.sender === user?._id
                  ? 'ml-auto bg-white text-black'
                  : 'bg-gray-800 text-white'
              }`}
            >
              {m.content}
            </motion.div>
          ))}
        </AnimatePresence>
        {typingUser === userId && (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className=" text-gray-400 px-2 py-1 animate-pulse"
          >
            typing...
            </motion.div>
          )}
          <div ref={bottomRef}/>

      </div>

      {/* Input */}
      <motion.form
        onSubmit={handelSubmit}
        className="flex items-center gap-3 p-4 border-t border-gray-800 bg-[#111] rounded-b-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <input
          type="text"
          onFocus={()=>typing(userId)}
          value={text}
          onChange={(e) => {setText(e.target.value)
            typing(userId)
          }}
          placeholder="Type your message..."
          className="flex-1 bg-[#222] text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
        />
        <motion.button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded-xl hover:bg-gray-200 transition"
          whileTap={{ scale: 0.95 }}
        >
          Send
        </motion.button>
      </motion.form>
    </div>
  );
}

export { ChatPage };
