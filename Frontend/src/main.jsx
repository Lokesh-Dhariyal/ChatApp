import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './Features/userContext.jsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/appRoutes.jsx'
import { SocketProvider } from './Features/socketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router}/>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>,
)
