import { createBrowserRouter, Navigate } from "react-router-dom"
import App from "../App.jsx"
import { useUser } from "../hooks/useUser.js";
import { useEffect } from "react";
import { LoadingPage } from "../pages/LoadingPage.jsx";
import { RegisterPage } from "../pages/RegisterPage.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { HomePage } from "../pages/HomePage.jsx";
import { ChatPage } from "../pages/ChatPage.jsx";
import { UserProfilePage } from "../pages/UserProfilePage.jsx";
import { AllChatsPage } from "../pages/AllChatsPage.jsx";
import { CreateGroupPage } from "../pages/createGroupPage.jsx";
import { GroupChatPage } from "../pages/GroupChatPage.jsx";

function AuthRedirect() {
  const { isAuthenticated, loading,currentUser,updateToken } = useUser();

  useEffect(()=>{
    currentUser()
    updateToken()
  },[])

  if (loading) return <LoadingPage/>;

  return isAuthenticated
    ? <Navigate to="/home" />
    : <Navigate to="/login" />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <AuthRedirect/>,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path:"/login",
        element:<LoginPage/>
      },
      {
        path:"/home",
        element:<HomePage/>
      },
      {
        path:"/chat",
        element:<AllChatsPage/>
      },
      {
        path:"/profile",
        element:<UserProfilePage/>
      },
      {
        path:'/chat/:userId',
        element:<ChatPage/>
      },
      {
        path:'/create-group',
        element:<CreateGroupPage/>
      },
      {
        path:'/group/:groupId',
        element:<GroupChatPage/>
      }
    ],
  },
]);