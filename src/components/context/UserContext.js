import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { BASE_API } from "../../utils/api";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const { token } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setUserLoading(true);
      try {
        const res = await fetch(`${BASE_API}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserProfile(data);
      } catch (e) {
        // handle error
      } finally {
        setUserLoading(false);
      }
    }
    if (token) fetchProfile();
    else setUserLoading(false);
  }, [token]);

  return (
    <UserContext.Provider value={{ userProfile, userLoading }}>
      {children}
    </UserContext.Provider>
  );
}
