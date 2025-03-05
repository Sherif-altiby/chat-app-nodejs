import { BrowserRouter , Routes , Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
function App() {
 
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
      checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
           <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div data-theme={theme} >
          <BrowserRouter  >
            <Navbar />
                <Routes>
                    <Route path="/" element={ authUser ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/login" element={ authUser ? <Navigate to="/" /> : <Login />} />
                    <Route path="/register" element={ authUser ? <Navigate to="/" /> : <Register />} />
                    <Route path="/settings" element={ authUser ? <Settings /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={ authUser ? <Profile /> : <Navigate to="/login" />} />
                </Routes>


                <Toaster />
          </BrowserRouter>
    </div>
  );
}

export default App;
