import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const runtimeBackendUrl = typeof window !== "undefined" ? window.__APP_CONFIG__?.BACKEND_URL : undefined;
const localDevBackendUrl = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "";
const backendUrl = import.meta.env.VITE_BACKEND_URL || runtimeBackendUrl || localDevBackendUrl || window.location.origin;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children })=>{
    
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    //Check if the user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if(data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsAuthReady(true);
        }
    }

    // Login function to handle user authentication and socket connection
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if(data.success){
                const nextToken = data.token;
                axios.defaults.headers.common["token"] = nextToken;
                setToken(nextToken);
                localStorage.setItem("token", nextToken);
                setAuthUser(data.userData);
                connectSocket(data.userData);
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    // Logout function to handle user logout and socket disconnection
    const logout = async () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["token"];
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        toast.success("Logged out succcessfully.");
        socket?.disconnect();
    }

    // Update profile function to handle user profile updates
    const updateProfile = async (body)=>{
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated successfully.");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Connect socket function to handle socket connection and online user updates
    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
            // console.log("Online users received from server:", userIds);
        })
    }

    useEffect(()=>{
        if (!token) {
            setIsAuthReady(true);
            delete axios.defaults.headers.common["token"];
            return;
        }

        axios.defaults.headers.common["token"] = token;
        checkAuth();
    }, [token])

    const value = {
        axios, authUser, isAuthReady, onlineUsers, socket, login, logout, updateProfile
    }

    return (
        <AuthContext.Provider value={value}> 
            {children}
        </AuthContext.Provider>
    )
}
