import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { messagesAPI } from '../services/api';
import { io } from 'socket.io-client';
import { Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (token) {
      // Connect to Socket.io
      const newSocket = io('http://localhost:5000', {
        auth: { token },
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
      });

      newSocket.on('new_message', (data) => {
        setMessages((prev) => [...prev, data.data]);
      });

      newSocket.on('message_notification', (data) => {
        // Show notification
        console.log('New message notification:', data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      if (socket) {
        socket.emit('join_conversation', selectedConversation._id);
      }
    }
  }, [selectedConversation, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await messagesAPI.getMessages(conversationId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const receiver = selectedConversation.participants.find(
        (p) => p._id !== user._id
      );

      const response = await messagesAPI.sendMessage(
        selectedConversation._id,
        receiver._id,
        newMessage,
        selectedConversation.listing?._id
      );

      setMessages((prev) => [...prev, response.data]);
      setNewMessage('');

      if (socket) {
        socket.emit('send_message', {
          conversationId: selectedConversation._id,
          receiverId: receiver._id,
          content: newMessage,
          listingId: selectedConversation.listing?._id,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-6 py-8">
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft size={20} />
          <span className="uppercase text-sm font-medium tracking-wider">Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 border border-white/10 bg-white/5 overflow-y-auto">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-2xl font-bold">Messages</h2>
            </div>
            <div className="divide-y divide-white/10">
              {conversations.map((conversation) => {
                const otherUser = conversation.participants.find(
                  (p) => p._id !== user._id
                );
                return (
                  <motion.div
                    key={conversation._id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${
                      selectedConversation?._id === conversation._id
                        ? 'bg-white/10'
                        : ''
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        {otherUser?.name?.[0] || 'U'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{otherUser?.name || 'User'}</p>
                        <p className="text-sm text-gray-400 truncate">
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 border border-white/10 bg-white/5 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-xl font-bold">
                    {selectedConversation.participants.find(
                      (p) => p._id !== user._id
                    )?.name || 'User'}
                  </h3>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.sender._id === user._id;
                    return (
                      <motion.div
                        key={message._id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded ${
                            isOwn
                              ? 'bg-white text-black'
                              : 'bg-white/10 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs mt-1 opacity-60">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-white/10 flex gap-2"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                  />
                  <motion.button
                    type="submit"
                    className="px-6 py-2 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={20} />
                  </motion.button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
