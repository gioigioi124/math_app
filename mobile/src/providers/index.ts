// Providers - State Management
// UserProvider: Guest-first user management
// ProgressProvider: Learning progress tracking

export { UserProvider, useUser } from "./UserProvider";
export type { GuestUser, AuthenticatedUser, User } from "./UserProvider";

export { ProgressProvider, useProgress } from "./ProgressProvider";
export type { LessonProgress } from "./ProgressProvider";
