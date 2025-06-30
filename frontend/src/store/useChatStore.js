import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(
        `messages/send/${selectedUser._id}`,
        messageData
      ); // sending message data to the api which will save it in the database
      set({ messages: [...messages, res.data] }); // keep prev messages and add the new message to the end of the array
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return; //no selected chat return
    const socket= useAuthStore.getState().socket;

    socket.on("newMessage",(newMessage)=>{ 
      if(newMessage.senderId !== selectedUser._id) return; // If the new message is not from the selected user, do not update the messages state

      set({messages: [...get().messages, newMessage] });
      // If the new message is from the selected user, update the messages state
    })
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket; // Get the socket instance from the auth store
    socket.off("newMessage"); // Unsubscribe from the newMessage event
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));
