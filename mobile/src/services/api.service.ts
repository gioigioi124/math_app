import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Update this with your backend URL
// For local development: http://localhost:5000 or your computer's IP
// For production: your deployed backend URL
const API_URL = "http://192.168.10.91:5000/api"; // Backend API server

// Auth API
export interface RegisterData {
  childName: string;
  phone: string;
  password: string;
  grade?: number;
}

export interface LoginData {
  phone: string;
  password: string;
}

export interface AuthResponse {
  _id: string;
  childName: string;
  phone: string;
  grade?: number;
  type: string;
  avatar?: string;
  coins?: number;
  xp?: number;
  level?: number;
  token: string;
}

// Guest API
export interface GuestResponse {
  user: {
    _id: string;
    type: "guest" | "user";
    deviceId: string;
    grade: number;
    coins: number;
    xp: number;
    level: number;
  };
}

export interface UpgradeGuestData {
  deviceId: string;
  childName: string;
  phone: string;
  password: string;
}

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem("authToken");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = await this.getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đã xảy ra lỗi");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Không thể kết nối đến server");
    }
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Save token
    if (response.token) {
      await AsyncStorage.setItem("authToken", response.token);
      await AsyncStorage.setItem("userId", response._id);
      await AsyncStorage.setItem("userType", response.type);
    }

    return response;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Save token
    if (response.token) {
      await AsyncStorage.setItem("authToken", response.token);
      await AsyncStorage.setItem("userId", response._id);
      await AsyncStorage.setItem("userType", response.type);
    }

    return response;
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      "authToken",
      "userId",
      "userType",
      "parentPhone",
      "childName",
    ]);
  }

  // Update user grade
  async updateGrade(grade: number): Promise<{ grade: number }> {
    const response = await this.request<{ grade: number }>("/user/grade", {
      method: "PUT",
      body: JSON.stringify({ grade }),
    });

    // Update local storage
    await AsyncStorage.setItem("selectedGrade", grade.toString());

    return response;
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    return !!token;
  }

  // Guest endpoints
  async createGuest(deviceId: string, grade: number): Promise<GuestResponse> {
    const response = await this.request<GuestResponse>("/guest", {
      method: "POST",
      body: JSON.stringify({ deviceId, grade }),
    });

    // Save guest data locally
    if (response.user) {
      await AsyncStorage.setItem("guestUserId", response.user._id);
      await AsyncStorage.setItem("deviceId", deviceId);
      await AsyncStorage.setItem("selectedGrade", grade.toString());
    }

    return response;
  }

  async getGuest(deviceId: string): Promise<GuestResponse> {
    return this.request<GuestResponse>(`/guest/${deviceId}`);
  }

  async upgradeGuest(data: UpgradeGuestData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/guest/upgrade", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Save token and user data
    if (response.token) {
      await AsyncStorage.setItem("authToken", response.token);
      await AsyncStorage.setItem("userId", response._id);
      await AsyncStorage.setItem("userType", "user");
      // Remove guest data
      await AsyncStorage.removeItem("guestUserId");
    }

    return response;
  }
}

export const apiService = new ApiService();
