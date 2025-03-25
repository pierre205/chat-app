import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import  { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    isCheckingAuth:true,
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser:res.data});
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({authUser:null});
        } finally {
            set({isCheckingAuth:false});
        }
    },

    signup: async (data) => {
        set({isSigningUp:true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser:res.data});
            toast.success("Account created successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in signup", error);
        } finally {
            set({isSigningUp:false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logout successful");

            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in logout", error);
        }
    },

    login: async (data) => {
        set({isLoggingIn:true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser:res.data});
            toast.success("Login successful");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in login", error);
        } finally {
            set({isLoggingIn:false});
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          // La fonction prend déjà un objet "data" qui peut contenir
          // profilePic, fullName, email ou n'importe quels autres champs à mettre à jour
          const res = await axiosInstance.put("/auth/update-profile", data);
          
          // Mise à jour de l'état utilisateur avec les données retournées par le serveur
          set({ authUser: res.data });
          
          // Message de succès
          toast.success("Profile updated successfully");
          
          return res.data; // Retourner les données mises à jour pour une utilisation potentielle
        } catch (error) {
          // Gestion d'erreur
          console.log("error in update profile:", error);
          const errorMessage = error.response?.data?.message || "Failed to update profile";
          toast.error(errorMessage);
          throw error; // Rethrow pour permettre aux composants de gérer l'erreur si nécessaire
        } finally {
          set({ isUpdatingProfile: false });
        }
    },
    

    connectSocket: () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({socket:socket});

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers:userIds});
        });
    },

    disconnectSocket: () => {
        if(get().socket?.connected) {
            get().socket.disconnect();
        }
    },
}));