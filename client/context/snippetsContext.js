"use client";

import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useGlobalContext } from "./globalContext";
import { useUserContext } from "./userContext";
import { useRealTime } from "./realTimeContext";

const SnippetsContext = createContext();

export const SnippetsProvider = ({ children }) => {
  const { closeModal } = useGlobalContext();
  const { emitSnippetCreated } = useRealTime();
  const serverUrl = "https://snippet-master-harsh810.onrender.com/api/v1";

  const userId = useUserContext().user?._id;

  const [publicSnippets, setPublicSnippets] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userSnippets, setUserSnippets] = useState([]);
  const [likedSnippets, setLikedSnippets] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [popularSnippets, setPopularSnippets] = useState([]);

  const createSnippet = async (data) => {
    try {
      const res = await axios.post(`${serverUrl}/create-snippet`, data);

      // Add the new snippet to the beginning of the list
      setPublicSnippets(prevSnippets => [res.data, ...prevSnippets]);

      emitSnippetCreated(res.data);

      toast.success("Snippet created successfully");

      closeModal();
    } catch (error) {
      console.log("Error creating snippet", error);
      toast.error(error.response.data.message);
    }
  };

  const updateSnippet = async (data) => {
    try {
      const res = await axios.patch(`${serverUrl}/snippet/${data._id}`, data);

      // Update the snippet in the local state
      setPublicSnippets(prevSnippets => 
        prevSnippets.map(snippet => 
          snippet._id === data._id ? res.data : snippet
        )
      );

      toast.success("Snippet updated successfully");
    } catch (error) {
      console.log("Error updating snippet", error);
    }
  };

  const getPublicSnippets = async (userId, tagId, searchQuery, page) => {
    try {
      const queryParams = new URLSearchParams();

      if (userId) {
        queryParams.append("userId", userId);
      }

      if (tagId) {
        queryParams.append("tagId", tagId);
      }

      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }

      if (page) {
        queryParams.append("page", page);
      }

      const res = await axios.get(
        `${serverUrl}/snippets/public?${queryParams.toString()}`
      );

      if (res.data && res.data.snippets) {
        setPublicSnippets(res.data.snippets);
        return res.data.snippets;
      } else {
        console.log("No public snippets found");
        return res.data.snippets;
      }
    } catch (error) {
      console.log("Error fetching public snippets", error);
      return [];
    }
  };

  const getUserSnippets = async (tagId, search) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (tagId) {
        queryParams.append("tagId", tagId);
      }

      if (search) {
        queryParams.append("search", search);
      }

      const res = await axios.get(
        `${serverUrl}/snippets?${queryParams.toString()}`,
        {
          withCredentials: true,
        }
      );

      setLoading(false);

      setUserSnippets(res.data);

      return res.data;
    } catch (error) {
      console.log("Error fetching user snippets", error);
    }
  };

  const getLikedSnippets = async (tagId, search) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (tagId) {
        queryParams.append("tagId", tagId);
      }

      if (search) {
        queryParams.append("search", search);
      }

      const res = await axios.get(
        `${serverUrl}/snippets/liked?${queryParams.toString()}`,
        {
          withCredentials: true,
        }
      );

      setLoading(false);
      setLikedSnippets(res.data);
      return res.data;
    } catch (error) {
      console.log("Error fetching liked snippets", error);
    }
  };

  const getPublicSnippetById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/snippet/public/${id}`);

      setLoading(false);
      return res.data;
    } catch (error) {
      console.log("Error fetching snippet by id", error);
    }
  };

  const getTags = async () => {
    try {
      const res = await axios.get(`${serverUrl}/tags`);

      setTags(res.data);
    } catch (error) {
      console.log("Error fetching tags", error);
    }
  };

  const likeSnippet = async (id) => {
    try {
      await axios.patch(`${serverUrl}/snippet/like/${id}`);
    } catch (error) {
      console.log("Error liking snippet", error);
      toast.error(error.response.data.message);
    }
  };

  const deleteSnippet = async (id) => {
    try {
      await axios.delete(`${serverUrl}/snippet/${id}`);
      
      // Remove the snippet from the local state
      setPublicSnippets(prevSnippets => 
        prevSnippets.filter(snippet => snippet._id !== id)
      );
      
      toast.success("Snippet deleted successfully");
    } catch (error) {
      console.log("Error deleting snippet", error);
      toast.error(error.response.data.message);
    }
  };

  // get leaderboard
  const getLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/leaderboard`);

      setLoading(false);
      setLeaderboard(res.data);

      return res.data;
    } catch (error) {
      console.log("Error fetching leaderboard", error);
    }
  };

  // popular snippets
  const getPopularSnippets = async (tagId, search) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (tagId) {
        queryParams.append("tagId", tagId);
      }

      if (search) {
        queryParams.append("search", search);
      }

      const res = await axios.get(
        `${serverUrl}/snippets/popular?${queryParams.toString()}`
      );

      setLoading(false);

      setPopularSnippets(res.data);

      return res.data;
    } catch (error) {
      console.log("Error fetching popular snippets", error);
    }
  };

  const gradients = {
    buttonGradient1:
      "linear-gradient(110.42deg, rgba(107, 190, 146, 0.1) 29.2%, rgba(245, 102, 146, 0.1) 63.56%)",
    buttonGradient2:
      "linear-gradient(110.42deg, rgba(25, 151, 222, 0.1) 29.2%, rgba(168, 85, 247, 0.1) 63.56%)",
    buttonGradient3:
      "linear-gradient(110.42deg, rgba(25, 151, 222, 0.1) 29.2%, rgba(168, 85, 247, 0.1) 63.56%)",
    buttonGradient4:
      "linear-gradient(110.42deg, rgba(168, 85, 247, 0.1) 29.2%, rgba(245, 102, 146, 0.1) 63.56%)",
    buttonGradient5:
      "linear-gradient(110.42deg, rgba(25, 151, 222, 0.1) 29.2%, rgba(168, 85, 247, 0.1) 63.56%)",
    buttonGradient6:
      "linear-gradient(110.42deg, rgba(25, 151, 222, 0.1) 29.2%, rgba(168, 85, 247, 0.1) 63.56%)",
    buttonGradient7:
      "linear-gradient(110.42deg, rgba(41, 25, 222, 0.1) 29.2%, rgba(235, 87, 87, 0.1) 63.56%)",
    buttonGradient8:
      "linear-gradient(110.42deg, rgba(25, 151, 222, 0.1) 29.2%, rgba(168, 85, 247, 0.1) 63.56%)",
    buttonGradient9:
      "linear-gradient(110.42deg, rgba(226, 195, 33, 0.1) 29.2%, rgba(247, 104, 85, 0.1) 63.56%)",
    buttonGradient10:
      "linear-gradient(110.42deg, rgba(235, 87, 87, 0.1) 29.2%, rgba(189, 68, 166, 0.1) 53.82%, rgba(247, 85, 143, 0.1) 63.56%)",
    buttonGradient11:
      "linear-gradient(110.42deg, rgba(25, 151, 222, 0.1) 29.2%, rgba(168, 85, 247, 0.1) 63.56%)",
    buttonGradient12:
      "linear-gradient(110.42deg, rgba(226, 195, 33, 0.1) 29.2%, rgba(247, 104, 85, 0.1) 63.56%)",
    buttonGradient13:
      "linear-gradient(110.42deg, rgba(226, 195, 33, 0.1) 29.2%, rgba(99, 3, 255, 0.1) 63.56%)",
    buttonGradient14:
      "linear-gradient(110.42deg, rgba(41, 25, 222, 0.1) 29.2%, rgba(235, 87, 87, 0.1) 63.56%)",
  };

  const randomButtonColor =
    Object.values(gradients)[
      Math.floor(Math.random() * Object.values(gradients).length)
    ];

  const randomTagColor =
    Object.values(gradients)[
      Math.floor(Math.random() * Object.values(gradients).length)
    ];

  // memo
  const useBtnColorMemo = useMemo(() => randomButtonColor, []);
  const useTagColorMemo = useMemo(() => randomTagColor, []);

  useEffect(() => {
    getPublicSnippets();
    getTags();
    getLeaderboard();
    getPopularSnippets();
  }, []);

  // Listen for real-time snippet updates
  useEffect(() => {
    const handleNewSnippet = (event) => {
      const newSnippet = event.detail;
      // Check if snippet already exists to prevent duplicates
      setPublicSnippets(prevSnippets => {
        const exists = prevSnippets.some(snippet => snippet._id === newSnippet._id);
        if (exists) {
          return prevSnippets; // Don't add if already exists
        }
        return [newSnippet, ...prevSnippets];
      });
    };

    const handleSnippetUpdated = (event) => {
      const updatedSnippet = event.detail;
      // Update the snippet in the list
      setPublicSnippets(prevSnippets => 
        prevSnippets.map(snippet => 
          snippet._id === updatedSnippet._id ? updatedSnippet : snippet
        )
      );
    };

    const handleSnippetDeleted = (event) => {
      const deletedSnippetId = event.detail;
      // Remove the snippet from the list
      setPublicSnippets(prevSnippets => 
        prevSnippets.filter(snippet => snippet._id !== deletedSnippetId)
      );
    };

    // Listen for the custom events dispatched by realTimeContext
    window.addEventListener("new-snippet", handleNewSnippet);
    window.addEventListener("snippet-updated", handleSnippetUpdated);
    window.addEventListener("snippet-deleted", handleSnippetDeleted);

    return () => {
      window.removeEventListener("new-snippet", handleNewSnippet);
      window.removeEventListener("snippet-updated", handleSnippetUpdated);
      window.removeEventListener("snippet-deleted", handleSnippetDeleted);
    };
  }, []);

  console.log("Leaderboard", leaderboard);

  console.log("Popular Snippets", popularSnippets);

  return (
    <SnippetsContext.Provider
      value={{
        publicSnippets,
        setPublicSnippets,
        getPublicSnippets,
        useBtnColorMemo,
        useTagColorMemo,
        createSnippet,
        tags,
        updateSnippet,
        deleteSnippet,
        likeSnippet,
        getPublicSnippetById,
        loading,
        getUserSnippets,
        userSnippets,
        getLikedSnippets,
        likedSnippets,
        getLeaderboard,
        leaderboard,
        getPopularSnippets,
        popularSnippets,
        getTags,
      }}
    >
      {children}
    </SnippetsContext.Provider>
  );
};

export const useSnippetContext = () => {
  return useContext(SnippetsContext);
};
