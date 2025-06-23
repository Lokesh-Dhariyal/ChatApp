import React, { useEffect,useState } from 'react'
import { UserCard } from '../components/UserCard';
import { useUser } from '../hooks/useUser';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingPage } from './LoadingPage';
import { useNavigate } from 'react-router-dom';


export function CreateGroupPage() {
      const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
        }),
      };

    const {searchUser,currentUser,user,loading,createGroup} = useUser()
    useEffect(()=>{
        currentUser()
    },[])

    const navigate = useNavigate()

    const [searchWord, setSearchWord] = useState('');
    const [searchResults, setSearchResults] = useState([]);

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


  const [members,setMembers] = useState([])
  const [groupName,setGroupName] = useState('')
  const [isCreating,setIsCreating] = useState(false)

  useEffect(()=>{
    setMembers([user])
  },[user])

  const addMember = (member)=>{
    setMembers((prev)=>{
        if (prev.some((m) => m._id === member._id)) {
            return prev;
        }
        return [...prev,member]
    })
  }

  const removeMember = (member)=>{
    setMembers((prev)=>prev.filter((m)=>m._id!==member._id))
  }

  const createGroupHandle = async()=>{
      if(groupName.trim()===''){
          alert("enter group name")
          return
        }
        if(members.length < 2){
            alert("Plese add members")
            return
        }
        setIsCreating(true)
    const membersId = members.map((m)=>m._id)
    const group = await createGroup({"members":membersId,"groupName":groupName})
    console.log({"members":membersId,"groupName":groupName})
    if (!group) {
        alert("Something went wrong while creating the group");
        return;
    }
    navigate('/chat')
    setIsCreating(false)
  }

  if(loading || !user)return (<LoadingPage/>)

  return (
    <div className="bg-black text-white h-fit p-6 font-sans mt-22">
      <div className="max-w-4xl mx-auto space-y-3 lg:space-y-6">
        <motion.label className='text-xl block lg:inline lg:text-3xl font-bold'>Group Name:</motion.label>
        <motion.input
          type="text"
          name='groupname'
          maxLength={24}
          onChange={(e)=>setGroupName(e.target.value)}
          placeholder="Group Name"
          className="w-1/2 lg:mx-2 p-2 rounded-xl bg-[#121212] text-white placeholder-gray-400 border border-[#2e2e2e] focus:outline-none focus:ring-2 focus:ring-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
         <motion.button 
            className='border border-white text-black w-fit h-10 bg-white rounded-2xl font-semibold py-1 px-2 mx-3 lg:mx-1 hover:bg-black hover:text-white transition ease-in-out hover:cursor-pointer'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            disabled={isCreating}
            onClick={createGroupHandle}
            >{isCreating?"Creating...":"Create Group"}
        </motion.button>
        <div className='flex'>
        <motion.h1
          className="text-xl lg:text-3xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Members: 
        </motion.h1>
        <div className='w-full h-fit flex flex-wrap'> 
            {members.map((member,i)=>(
                <div 
                key={member?.username || i}
                className='border border-white w-fit lg:h-9 rounded-2xl py-1 px-3 mx-1 lg:my-1 '>
                {member?.fullName}
                <span onClick={() => {
                    removeMember(member)
                    }}
                    className="ml-1 cursor-pointer text-red-400"
                    hidden={member===user}>×</span>
                </div>
            ))}
        </div>
        </div>


        <motion.input
          type="text"
          name='search'
          onChange={(e)=>setSearchWord(e.target.value)}
          placeholder="Search users..."
          className="w-full lg:w-1/2 p-3 rounded-xl bg-[#121212] text-white placeholder-gray-400 border border-[#2e2e2e] focus:outline-none focus:ring-2 focus:ring-white"
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
              {searchResults.map((ResultUser)=>{
                const isAlreadyMember = members.some((m) => m._id === ResultUser._id);
              return(
                <motion.div
                        key={ResultUser.username}
                        className="flex items-center w-full lg:w-1/2 p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#2a2a2a] transition shadow-md space-x-4"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                      >
                        <img
                          src={ResultUser.profilePhoto}
                          alt={ResultUser.username}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white"
                        />
                        <div>
                          <p className="text-white font-semibold">{ResultUser.fullName}</p>
                          <p className="text-sm text-gray-400">@{ResultUser.username}</p>
                        </div>
                        <div className='ml-auto cursor-pointer'
                        hidden={isAlreadyMember}
                        onClick={()=>{
                            addMember(ResultUser)
                        }}
                        >Add</div>
                      </motion.div>
              )})}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
