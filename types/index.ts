// API Types
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
  comments?: Comment[];
  likes?: Like[];
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
  post?: Post;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
  user?: User;
  post?: Post;
}

export interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  targetId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  user?: User;
}

export enum NotificationType {
  POST_LIKE = 'POST_LIKE',
  POST_COMMENT = 'POST_COMMENT',
  COMMENT_LIKE = 'COMMENT_LIKE'
}

// API Request Types
export interface CreateUserRequest {
  username: string;
  email: string;
}

export interface CreatePostRequest {
  content: string;
  authorId: string;
}

export interface CreateCommentRequest {
  content: string;
  authorId: string;
}

export interface CreateLikeRequest {
  userId: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Component Props Types
export interface UserSelectorProps {
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User | null) => void;
  onCreateUser: () => void;
}

export interface PostFormProps {
  selectedUser: User | null;
  onSubmit: (content: string) => void;
}

export interface PostListProps {
  posts: Post[];
  selectedUser: User | null;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

export interface PostItemProps {
  post: Post;
  selectedUser: User | null;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

export interface NotificationListProps {
  notifications: Notification[];
  selectedUser: User | null;
  onMarkAsRead: (notificationId: string) => void;
}

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => void;
}

// Socket Types
export interface SocketEvents {
  join: (userId: string) => void;
  notification: (notification: Notification) => void;
}

// Hook Types
export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  loadNotifications: () => Promise<void>;
}

export interface UseSocketReturn {
  socket: any;
  isConnected: boolean;
  joinUser: (userId: string) => void;
} 