"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const RealTimeContext = createContext();

export const RealTimeProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useUserContext();

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("https://snippet-master-harsh810.onrender.com", {
      withCredentials: true,
    });

    setSocket(newSocket);

    // Connection events
    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      
      // Join public room for all users
      newSocket.emit("join-public-room");
      
      // Join user's personal room if logged in
      if (user?._id) {
        newSocket.emit("join-user-room", user._id);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Join user room when user changes
  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("join-user-room", user._id);
    }
  }, [socket, user?._id]);

  // Listen for real-time events
  useEffect(() => {
    if (!socket) return;

    // New snippet created
    socket.on("new-snippet", (snippet) => {
      toast.success(`New snippet: ${snippet.title}`, {
        duration: 3000,
        position: "top-right",
      });
      // Emit custom event to update the UI
      window.dispatchEvent(new CustomEvent("new-snippet", { detail: snippet }));
    });

    return () => {
      socket.off("new-snippet");
    };
  }, [socket]);

  const emitSnippetCreated = (snippet) => {
    if (socket) {
      socket.emit("snippet-created", snippet);
    }
  };

  return (
    <RealTimeContext.Provider
      value={{
        socket,
        isConnected,
        emitSnippetCreated,
      }}
    >
      {children}
    </RealTimeContext.Provider>
  );
};

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    // Return default values when context is not available (during SSR)
    return {
      socket: null,
      isConnected: false,
      emitSnippetCreated: () => {},
    };
  }
  return context;
}; 