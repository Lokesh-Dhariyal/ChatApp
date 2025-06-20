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
  const [showUserData,setShowUserData] = useState(false)

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
    <div className="lg:w-5/6 mx-auto h-screen bg-black text-white flex flex-col pt-18 lg:pt-21 pb-2 lg:px-4"
      onClick={()=>{
        if(showUserData){
          setShowUserData(false)
        }
      }}
    >
      
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
        
        <div className="relative w-12 h-12 hover:cursor-pointer"
          onClick={()=>setShowUserData(!showUserData)}
          >
          <img
            src={userData?.profilePhoto}
            alt={userData?.username}
            className="w-full h-full rounded-full object-cover border border-white"
          />
          
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-black"
              style={{ backgroundColor: userData?.online ? '#84cc16' : '#ef4444' }}>
          </div>
        </div>
        
        <div onClick={()=>setShowUserData(!showUserData)} className='hover:cursor-pointer'>
          <h2 className="text-lg font-semibold">{userData?.fullName || 'User'}</h2>
          <p className="text-sm text-gray-400">@{userData?.username}</p>
        </div>
        
      </motion.div>

      <AnimatePresence>
        {showUserData && (
          <motion.div
            className="absolute border border-white/20 rounded-3xl lg:h-60 lg:w-120 mt-15 lg:mt-17 ml-1 p-5 flex backdrop-blur-3xl lg:backdrop-blur-md"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-35 h-35 lg:w-50 lg:h-50 border border-white rounded-full overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={userData?.profilePhoto}
                alt={userData?.username}
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
              />
            </motion.div>
            <div className="mx-8 mt-10">
              <h2 className="text-4xl font-extrabold tracking-wide text-gray-300">{userData?.fullName}</h2>
              <p className="text-xl text-gray-400">@{userData?.username}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


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
