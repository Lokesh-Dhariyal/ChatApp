import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../Features/socketContext';
import { UserCard } from '../components/UserCard';
import { GroupCard } from '../components/GroupCard';
import { LoadingPage } from './LoadingPage';

export function AllChatsPage() {
    const {searchUser,currentUser,allChats,allGroups,user,loading} = useUser()
    const {setMessages} = useSocket()
    const [chats,setChats] = useState([])
    const [groups,setGroups] = useState([])
    useEffect(()=>{
      const getData = async()=>{
        await currentUser()
        const chat = await allChats()
        const groups = await allGroups()
        setChats(chat.data)
        setGroups(groups.data)
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

  if(loading || !user)return <LoadingPage/>

  return (
    <div className="bg-black text-white h-fit p-1 lg:p-6 font-sans mt-22">
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
          className="w-3/4 lg:w-5/6 p-3 rounded-xl bg-[#121212] text-white placeholder-gray-400 border border-[#2e2e2e] focus:outline-none focus:ring-2 focus:ring-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        <motion.button 
        className='border border-white text-black w-fit h-10 bg-white rounded-2xl text-xs lg:text-md font-semibold py-1 px-2 lg:px-2 ml-1 lg:mx-3 hover:bg-black hover:text-white transition ease-in-out hover:cursor-pointer'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        onClick={()=>{navigate('/create-group')}}
        >Create Group</motion.button>

        <AnimatePresence>
          {searchWord && searchResults.length > 0 && (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-semibold">Search Results</h2>
              {searchResults.map((user,i)=>(
                <UserCard 
                key={user._id || i}
                user={user}/>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          hidden={(chats?.length!=0||groups?.length!=0)||(searchResults?.length > 0 && searchWord)} 
          className='text-6xl font-bold text-center pt-20'>No Chats
          </motion.div>

          <h2 hidden={!chats?.length!=0} className="text-xl font-semibold">Your Chats</h2>
          <AnimatePresence>
            {chats?.map((user,i)=>(
              <UserCard 
              key={user._id || i}
              user={user}/>
            ))}
          </AnimatePresence>

          <h2 hidden={!groups?.length!=0} className="text-xl font-semibold">Your Groups</h2>
          <AnimatePresence>
            {groups?.map((group,i)=>(
              <GroupCard 
              key={group._id || i}
              group={group}/>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
