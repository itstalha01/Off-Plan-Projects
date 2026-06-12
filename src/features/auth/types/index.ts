export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};
