import { create } from "zustand";
import { AxiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AuthState, LoginFormData, RegisterFormData } from "../types/type";
import io from "socket.io-client"

const SERVER_URL = "http://localhost:5000"

export const useAuthStore = create<AuthState>((set, get) => ({
    authUser: null, 
    isRegistering: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true, 
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const response = await AxiosInstance.get("/auth/check");
            set({
                authUser: response.data.data, 
            });

            get().connectSocket();
        } catch (error) {
            set({
                authUser: null, 
            });
        } finally {
            set({
                isCheckingAuth: false,
            });
        }
    },

    registerUser: async (formData: RegisterFormData) => {
        try {
            set({ isRegistering: true });
            const response = await AxiosInstance.post("/auth/register", formData);
            set({
                authUser: response.data.data,
            });
            toast.success("Account created successfully");

            get().connectSocket();
        } catch (error: any) {
            toast.error(error.response.data.message[0].msg);
        } finally {
            set({ isRegistering: false });
        }
    },

    loginUser: async (formData: LoginFormData) => {
        try {
            set({ isLoggingIn: true });
            const response = await AxiosInstance.post("/auth/login", formData);
            set({
                authUser: response.data.data,
            });
            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    userLogout: async () => {
        try {
            await AxiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");

            get().disConnectSocket()
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    },

    userUpadteAvatar: async ({ avatar }: { avatar: File }) => {
        try {
            set({ isUpdatingProfile: true });

            const formData = new FormData();
            formData.append("avatar", avatar);

            const response = await AxiosInstance.put("/auth/update-profile-avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            set({
                authUser: response.data.data,
            });

            toast.success("Avatar updated successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update avatar");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
         const { authUser } = get();
         if(!authUser || get().socket?.connected) return;

         const socket = io(SERVER_URL, {
            query: {
                userId: authUser._id
            }
         });
         socket.connect()

         set({
            socket: socket
         })

         socket.on("getOnlineUsers", (userIds) => {
             set({
                onlineUsers: userIds
             })
         })
    },

    disConnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect()
    },
}));