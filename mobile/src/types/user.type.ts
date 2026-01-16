export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  coins: number;
  xp: number;
  level: number;
}

export interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  token: string;
}
