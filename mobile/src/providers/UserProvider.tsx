import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { apiService } from "../services/api.service";

// Types
export interface GuestUser {
  id: string;
  type: "guest";
  grade: number;
  createdAt: string;
}

export interface AuthenticatedUser {
  id: string;
  type: "user";
  grade: number;
  username: string;
  email: string;
  avatar?: string;
  coins: number;
  xp: number;
  level: number;
}

export type User = GuestUser | AuthenticatedUser;

interface UserContextType {
  user: User | null;
  loading: boolean;
  createGuestUser: (grade: number) => Promise<void>;
  updateGrade: (grade: number) => Promise<void>;
  upgradeToUser: (userData: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (userData: AuthenticatedUser) => Promise<void>;
  logout: () => Promise<void>;
  isGuest: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const GUEST_USER_KEY = "@guest_user";

// Generate simple unique ID for guest
const generateGuestId = () => {
  return (
    "guest_" + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
  );
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load saved user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          // Reconstruct user from storage
          const childName = await AsyncStorage.getItem("childName");
          const parentPhone = await AsyncStorage.getItem("parentPhone");
          const selectedGrade = await AsyncStorage.getItem("selectedGrade");
          const userId = await AsyncStorage.getItem("userId");

          setUser({
            id: userId || "user",
            type: "user",
            grade: selectedGrade ? parseInt(selectedGrade) : 1,
            username: childName || "Bạn nhỏ",
            email: parentPhone || "",
            avatar: "",
            coins: 0,
            xp: 0,
            level: 1,
          });
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const createGuestUser = async (grade: number) => {
    // Legacy support or if we want to re-enable guest later
    const newGuest: GuestUser = {
      id: generateGuestId(),
      type: "guest",
      grade,
      createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(GUEST_USER_KEY, JSON.stringify(newGuest));
    setUser(newGuest);
  };

  const updateGrade = async (grade: number) => {
    if (user) {
      const updatedUser = { ...user, grade };
      // Also update storage for persistence
      if (user.type === "guest") {
        await AsyncStorage.setItem(GUEST_USER_KEY, JSON.stringify(updatedUser));
      }
      setUser(updatedUser);
    }
  };

  const upgradeToUser = async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    // ... legacy implementation
  };

  const login = async (userData: AuthenticatedUser) => {
    setUser(userData);
  };

  const logout = async () => {
    // 1. Clear backend and local keys
    await apiService.logout();

    // 2. Clear context state
    setUser(null);
  };

  const isGuest = () => user?.type === "guest";

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        createGuestUser,
        updateGrade,
        upgradeToUser,
        login,
        logout,
        isGuest,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
