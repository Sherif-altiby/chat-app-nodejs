import { create } from "zustand";
import { AxiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AuthState, LoginFormData, RegisterFormData } from "../types/type";



export const useAuthStore = create<AuthState>((set) => ({
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
}));