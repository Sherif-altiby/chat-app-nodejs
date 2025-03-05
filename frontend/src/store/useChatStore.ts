import { create } from "zustand";
import { ChatState, UserType } from "../types/type";
import { AxiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";



export  const useChatStore  = create<ChatState>((set, get) => ({
        messages: [],
        users: [],
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false,
    
        getUsers:  async () => {
               set({
                   isUsersLoading: true
               })

               try {
                const res = await AxiosInstance.get("/messages/users")
                set({
                    users: res.data.data
                })
               } catch (error: any) {
                  toast.error(error.response.data.message)
               } finally{
                  set({
                    isUsersLoading: false
                  })
               }
        },

        getMessages: async (userId: string) => {
                    set({
                        isMessagesLoading: true
                    });
                try {
                    
                    const res = await AxiosInstance.get(`/messages/${userId}`);
                    set({
                        messages: res.data.data
                    })
                } catch (error: any) {
                    toast.error(error.response.data.message)   
                } finally{
                    set({
                        isMessagesLoading: false
                    });
                }
        },

        sendMessage: async (text: string) => {
            const { selectedUser, messages } = get();

            try {
                 const res = await AxiosInstance.post(`/messages/send/${selectedUser?._id}`, { text });
                 set({
                    messages:[...messages, res.data.data]
                 })
            } catch (error: any) {
                  toast.error(error.response.data.message)
            }
        },

        setSelectedUser: (selectedUser: UserType | null) => set({ selectedUser }),
 
        subscribeToMessages: () => {
            const { selectedUser } = get();
            if(!selectedUser) return;

            const socket = useAuthStore.getState().socket;


            socket.on("newMessage", (newMessage: any) => {
                const isMessageSentFromSelectedUser = newMessage.sender === selectedUser._id;
                if (!isMessageSentFromSelectedUser) return;

                set({
                    messages: [...get().messages, newMessage],
                 });
            })
        },

        unsubscribeFromMessages: () => {
            const socket = useAuthStore.getState().socket;
            socket.off("newMessage");
        },

}))