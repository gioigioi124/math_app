import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        const savedUser = await AsyncStorage.getItem(GUEST_USER_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
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
      await AsyncStorage.setItem(GUEST_USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const upgradeToUser = async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    // TODO: Call backend API to upgrade guest to user
    // For now, just update local state
    if (user && user.type === "guest") {
      const upgradedUser: AuthenticatedUser = {
        id: user.id,
        type: "user",
        grade: user.grade,
        username: userData.username,
        email: userData.email,
        avatar: "",
        coins: 0,
        xp: 0,
        level: 1,
      };
      await AsyncStorage.setItem(GUEST_USER_KEY, JSON.stringify(upgradedUser));
      setUser(upgradedUser);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(GUEST_USER_KEY);
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
