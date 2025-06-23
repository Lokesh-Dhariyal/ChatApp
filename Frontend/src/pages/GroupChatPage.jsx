import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { useSocket } from '../Features/socketContext';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function GroupChatPage() {
  const { currentUser, user, groupChat,groupData, leaveGroup,updateGroupPhoto } = useUser();
  const { sendGroupMessage, setGroupMessages, groupMessages, joinRoom } = useSocket();
  const [text, setText] = useState('');
  const { groupId } = useParams();
  const [finalGroupData, setFinalGroupData] = useState({});
  const [showfinalGroupData,setShowGroupData] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
    if (groupId) {
        joinRoom(groupId);
    }
      await currentUser();
      const convo = await groupChat(groupId);
      setGroupMessages(convo.data);
      const data = await groupData(groupId);
      setFinalGroupData(data.data);
    };
    fetchData();
  }, [groupId]);


  const handelSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendGroupMessage(groupId, text.trim());
    setText('');
  };
  const bottomRef = new useRef()
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupMessages]);

  //group photo update
  const [groupPhoto,setGroupPhoto] = useState(null)
  const [isUploading,setIsUploading] = useState(false)

  const inputRef = useRef()

  const UploadHandler = async(e)=>{
    e.preventDefault()
    setIsUploading(true)
    const formData = new FormData()
    formData.append("groupPhoto", groupPhoto)
    await updateGroupPhoto(groupId,formData)
    await currentUser()
    if(inputRef.current.value){ inputRef.current.value = ""; }
    setGroupPhoto(null)
    setIsUploading(false)
    window.location.reload();
  }

  return (
    <div className="lg:w-5/6 mx-auto h-screen bg-black text-white flex flex-col pt-18 lg:pt-21 pb-2 lg:px-4"
      onClick={()=>{
        if(showfinalGroupData){
          setShowGroupData(false)
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
          onClick={()=>setShowGroupData(!showfinalGroupData)}
          >
          <img
            src={finalGroupData?.groupPhoto}
            alt={finalGroupData?.groupName}
            className="w-full h-full rounded-full object-cover border border-white"
          />
        </div>
        
        <div onClick={()=>setShowGroupData(!showfinalGroupData)} className='hover:cursor-pointer'>
          <h2 className="text-lg font-semibold">{finalGroupData?.groupName || 'Group'}</h2>
        </div>
        
      </motion.div>

      <AnimatePresence>
        {showfinalGroupData && (
          <motion.div
          className="absolute border border-white/20 rounded-3xl lg:h-fit w-100 lg:w-160 mt-15 lg:mt-17 ml-1 p-5 flex flex-wrap backdrop-blur-3xl lg:backdrop-blur-md"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="relative w-30 h-30 lg:w-50 lg:h-50 border border-white rounded-full group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {groupPhoto ? (
              <img
                src={URL.createObjectURL(groupPhoto)}
                alt="Preview"
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                />
              )
              :(<img
              src={finalGroupData?.groupPhoto}
              alt={finalGroupData?.groupName}
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
              />)}
    
            <button
              onClick={() => inputRef.current.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="text-white text-sm font-bold">Edit</span>
            </button>
    
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={inputRef}
              onChange={(e) => setGroupPhoto(e.target.files[0])}
            />
          </motion.div>
    
          <div className="lg:mx-8 mx-2 mt-10 h-fit">
            <h2 className="text-xl w-40 lg:text-4xl font-extrabold tracking-wide text-gray-300">
              {finalGroupData?.groupName}
            </h2>
          </div>
    
          <div
            onClick={async () => {
              await leaveGroup(groupId);
              navigate('/chat');
            }}
            className="border border-black w-fit h-7 lg:h-10 ml-auto rounded-md lg:rounded-2xl lg:pt-2 lg:pb-3 px-1 lg:px-3 bg-red-600 text-black font-semibold hover:border-white/10 hover:bg-red-500 cursor-pointer"
          >
            Leave
          </div>
    
          {/* Members List */}
          <div className="flex flex-wrap gap-1 w-full lg:w-fit pl-25 lg:pl-45">
            {finalGroupData?.members.map((m, i) => (
              <div key={i} className="w-fit h-7 lg:h-10 text-xs lg:text-lg text-white border border-white/30 mr-1 pt-1 px-3 rounded-full">
                {m.fullName}
              </div>
            ))}
          </div>
  
          {groupPhoto && (
            <div className="absolute top-30 lg:top-50 left-11 lg:left-18">
              <button
                className="bg-green-600 w-17 lg:w-23 lg:fit hover:bg-green-500 cursor-pointer text-xs lg:text-lg text-white font-semibold py-1 px-4 rounded-lg shadow-md"
                onClick={UploadHandler}
              >
                {isUploading?"...":"Upload"}
              </button>
            </div>
          )}
        </motion.div>
        )}
      </AnimatePresence>


      {/* Messages */}
      <div className="flex-1 overflow-y-scroll px-2 py-4 space-y-3 custom-scrollbar ">
      <AnimatePresence initial={false}>
        {groupMessages?.map((m, i) => {
            const isSelf = m.senderId?._id === user?._id;

            return (
            <motion.div
                key={i}
                className={`flex items-end gap-2 ${
                isSelf ? 'justify-end' : 'justify-start'
                }`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                {!isSelf && (
                <img
                    src={m.senderId?.profilePhoto}
                    alt={m.senderId?.fullName}
                    className="w-9 h-9 rounded-full object-cover border border-gray-500"
                />
                )}
                <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] lg:max-w-[40%] break-words ${
                    isSelf
                    ? 'bg-white text-black ml-auto'
                    : 'bg-gray-800 text-white'
                }`}
                >
                {!isSelf && (
                    <p className="text-sm font-semibold text-gray-300 mb-1">
                    {m.senderId?.fullName}
                    </p>
                )}
                <p>{m.content}</p>
                </div>
            </motion.div>
            );
        })}
        </AnimatePresence>

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
          value={text}
          onChange={(e) => {setText(e.target.value)
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

export { GroupChatPage };
