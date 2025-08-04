'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import io, { Socket } from 'socket.io-client';
import { 
  User, 
  Post, 
  Notification, 
  CreateUserRequest, 
  CreatePostRequest, 
  CreateCommentRequest, 
  CreateLikeRequest 
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPost, setNewPost] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    // Initialize socket connection
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    const newSocket = io(wsUrl);
    setSocket(newSocket);

    // Load initial data
    loadUsers();
    loadPosts();

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && selectedUser) {
      socket.emit('join', selectedUser.id);
      
      socket.on('notification', (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      loadNotifications();
    }
  }, [socket, selectedUser]);

  const loadUsers = async (): Promise<void> => {
    try {
      const response = await axios.get<User[]>(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadPosts = async (): Promise<void> => {
    try {
      const response = await axios.get<Post[]>(`${API_BASE_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const loadNotifications = async (): Promise<void> => {
    if (!selectedUser) return;
    
    try {
      const response = await axios.get<Notification[]>(`${API_BASE_URL}/notifications?userId=${selectedUser.id}`);
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const createUser = async (): Promise<void> => {
    const username = prompt('Enter username:');
    const email = prompt('Enter email:');
    
    if (!username || !email) return;

    try {
      const userData: CreateUserRequest = { username, email };
      const response = await axios.post<User>(`${API_BASE_URL}/users`, userData);
      setUsers(prev => [...prev, response.data]);
      alert('User created successfully!');
    } catch (error: any) {
      alert('Error creating user: ' + error.response?.data?.error);
    }
  };

  const createPost = async (): Promise<void> => {
    if (!selectedUser || !newPost.trim()) return;

    try {
      const postData: CreatePostRequest = {
        content: newPost,
        authorId: selectedUser.id
      };
      const response = await axios.post<Post>(`${API_BASE_URL}/posts`, postData);
      setPosts(prev => [response.data, ...prev]);
      setNewPost('');
    } catch (error: any) {
      alert('Error creating post: ' + error.response?.data?.error);
    }
  };

  const likePost = async (postId: string): Promise<void> => {
    if (!selectedUser) return;

    try {
      const likeData: CreateLikeRequest = {
        userId: selectedUser.id
      };
      await axios.post(`${API_BASE_URL}/posts/${postId}/like`, likeData);
      loadPosts(); // Reload posts to get updated like count
    } catch (error: any) {
      alert('Error liking post: ' + error.response?.data?.error);
    }
  };

  const commentOnPost = async (postId: string): Promise<void> => {
    if (!selectedUser || !newComment.trim()) return;

    try {
      const commentData: CreateCommentRequest = {
        content: newComment,
        authorId: selectedUser.id
      };
      const response = await axios.post(`${API_BASE_URL}/posts/${postId}/comment`, commentData);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [...(post.comments || []), response.data] }
          : post
      ));
      setNewComment('');
    } catch (error: any) {
      alert('Error commenting: ' + error.response?.data?.error);
    }
  };

  const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Notification System POC
        </h1>

        {/* User Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select User</h2>
          <div className="flex gap-4 items-center">
            <select 
              value={selectedUser?.id || ''} 
              onChange={(e) => {
                const user = users.find(u => u.id === e.target.value);
                setSelectedUser(user || null);
              }}
              className="border rounded px-3 py-2 flex-1"
            >
              <option value="">Select a user...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
            <button 
              onClick={createUser}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create User
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Posts Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Posts</h2>
              
              {/* Create Post */}
              {selectedUser && (
                <div className="mb-6 p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Create Post as {selectedUser.username}</h3>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full border rounded px-3 py-2 mb-2"
                    rows={3}
                  />
                  <button 
                    onClick={createPost}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Post
                  </button>
                </div>
              )}

              {/* Posts List */}
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="font-medium">{post.author?.username}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mb-3">{post.content}</p>
                    
                    {/* Actions */}
                    <div className="flex gap-4 mb-3">
                      <button 
                        onClick={() => likePost(post.id)}
                        className="text-blue-500 hover:text-blue-700"
                        disabled={!selectedUser}
                      >
                        ❤️ Like ({post.likes?.length || 0})
                      </button>
                    </div>

                    {/* Comments */}
                    <div className="space-y-2">
                      {post.comments?.map(comment => (
                        <div key={comment.id} className="bg-gray-50 p-2 rounded">
                          <span className="font-medium text-sm">{comment.author?.username}:</span>
                          <span className="ml-2">{comment.content}</span>
                        </div>
                      ))}
                      
                      {selectedUser && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 border rounded px-2 py-1 text-sm"
                          />
                          <button 
                            onClick={() => commentOnPost(post.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            Comment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm notification-badge">
                  {unreadCount}
                </span>
              )}
            </div>
            
            {selectedUser ? (
              <div className="space-y-2">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg border ${
                      notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <p className="text-sm">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                      {!notification.isRead && (
                        <button 
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="text-xs text-blue-500 hover:text-blue-700"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No notifications yet</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Select a user to see notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 