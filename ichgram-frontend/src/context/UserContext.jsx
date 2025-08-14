
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    navigate("/");
  };

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Fehler beim Laden des Profils");

        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error("fetchUser Fehler:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updateUserProfile = async (newData) => {
    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Unbekannter Serverfehler");
      }

      const updatedUser = await res.json();
      updateUser(updatedUser);
    } catch (error) {
      console.error("updateUserProfile error:", error);
    }
  };

  const addPostToUser = (newPost) => {
    if (!user) return;

    const updatedPosts = [...(user.posts || []), newPost];
    const updatedUser = {
      ...user,
      posts: updatedPosts,
      postCount: (user.postCount || 0) + 1,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };


  // NEU: Passwort ändern
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await fetch(`${API_URL}/api/profile/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Passwortänderung fehlgeschlagen");
      }

      return await res.json();
    } catch (error) {
      console.error("changePassword error:", error);
      throw error;
    }
  };

  if (loading) return null;

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        logout,
        updateUser,
        updateUserProfile,
        addPostToUser,
        changePassword, 
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
