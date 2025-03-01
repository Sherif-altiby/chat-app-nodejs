export type UserType = {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    createdAt: string;
}

export interface AuthState {
    authUser: UserType | null;
    isRegistering: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;
    checkAuth: () => Promise<void>;
    registerUser: (formData: RegisterFormData) => Promise<void>;
    loginUser: (formData: LoginFormData) => Promise<void>;
    userLogout: () => Promise<void>;
    userUpadteAvatar: ({avatar}: {avatar: File}) => Promise<void>;
    onlineUsers: any[]
}

export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface ThemeState {
    theme: string;
    setTheme: (theme: string) => void;
}

export interface ChatState {
    messages: any[],
    users: any[],
    selectedUser: UserType | null;
    isUsersLoading: boolean,
    isMessagesLoading: boolean,
    getUsers: () => Promise<void>
    sendMessage: (messageData: string) => Promise<void>,
    setSelectedUser: (selectedUser: UserType) => void,
    getMessages: (userId: string) => Promise<void>
}