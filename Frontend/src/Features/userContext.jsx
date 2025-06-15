import { createContext, useState, useCallback } from "react";
import axios from "../components/axios";
import { socket } from "../socket";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user;

  const [loading, setLoading] = useState(true);

  const register = async (formData) => {
    try {
      const res = await axios.post("/user/register", formData);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };
  const login = async (formData) => {
    try {
      const res = await axios.post("/user/login", formData);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };

  const currentUser = useCallback(async () => {
    try {
      const res = await axios.get("/user/me");
      setUser(res.data.data);
    } catch (error) {
      console.error("Fetch user error:", error.response?.data || error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      const res = await axios.post("/user/logout");
      if (socket.connected) {
        socket.disconnect();
      }
      setUser(null);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };

  const updateToken = async () => {
    try {
      const res = await axios.post("/user/update-token");
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };
  const someUser = async (username) => {
    try {
      const res = await axios.get(`/user/profile/${username}`);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };

  const searchUser = async (search) => {
    try {
      const res = await axios.post("/user/search", search);
      console.log(res.data)
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };

  const updateProfilePhoto = async (formData) => {
    try {
      const res = await axios.post(`/user/update-profilephoto`, formData);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };
  const deleteProfilePhoto = async () => {
    try {
      const res = await axios.post(`/user/delete-profilephoto`);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };

  const updateUserInfo = async (formData) => {
    try {
      const res = await axios.post(`/user/update-userinfo`, formData);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };

  const changePassword = async (formData) => {
    try {
      const res = await axios.post(`/user/change-password`, formData);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };

  const conversation = async(userId)=>{
    try {
      const res = await axios.get(`/user/conversation/${userId}`);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  const allChats = async()=>{
    try {
      const res = await axios.get('/user/chats');
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setLoading,
        isAuthenticated,
        register,
        login,
        currentUser,
        logout,
        updateToken,
        someUser,
        searchUser,
        updateProfilePhoto,
        deleteProfilePhoto,
        updateUserInfo,
        changePassword,
        conversation,
        allChats
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
