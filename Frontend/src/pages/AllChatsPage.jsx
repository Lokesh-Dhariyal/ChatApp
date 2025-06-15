import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../Features/socketContext';


const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

export function AllChatsPage() {
    const {searchUser,currentUser,allChats} = useUser()
    const {setMessages} = useSocket()
    const [chats,setChats] = useState([])
    useEffect(()=>{
      const getData = async()=>{
        await currentUser()
        const chat = await allChats()
        console.log(chat)
        setChats(chat.data)
        setMessages([])
      }
      getData()
    },[])

  const [searchWord, setSearchWord] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            if(searchWord){
            const result = await searchUser({"search":searchWord.toString()||""});
            setSearchResults(result.data || []);
            }
        } catch (err) {
            console.error("Search error:", err);
        }
    };
    
    fetchUsers();
    
  }, [searchWord]);


  const renderUserCard = (user, i) => (
    <motion.div
      key={user.username}
      className="flex items-center p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#2a2a2a] transition shadow-md cursor-pointer space-x-4"
      custom={i}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      onClick={()=>navigate(`/chat/${user._id}`)}
    >
      <img
        src={user.profilePhoto}
        alt={user.username}
        className="w-12 h-12 rounded-full object-cover border-2 border-white"
      />
      <div>
        <p className="text-white font-semibold">{user.fullName}</p>
        <p className="text-sm text-gray-400">@{user.username}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-black text-white h-fit p-6 font-sans mt-22">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.h1
          className="text-3xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Chats
        </motion.h1>

        <motion.input
          type="text"
          name='search'
          onChange={(e)=>setSearchWord(e.target.value)}
          placeholder="Search users..."
          className="w-full p-3 rounded-xl bg-[#121212] text-white placeholder-gray-400 border border-[#2e2e2e] focus:outline-none focus:ring-2 focus:ring-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        <AnimatePresence>
          {searchWord && searchResults.length > 0 && (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-semibold">Search Results</h2>
              {searchResults.map(renderUserCard)}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Your Chats</h2>
          <AnimatePresence>
            {chats?.map(renderUserCard)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
