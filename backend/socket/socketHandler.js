import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export const setupSocketIO = (io) => {
  // Authentication middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'findyy-secret-key');
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(`user_${socket.userId}`);

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
    });

    // Handle new message
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, receiverId, content, listingId } = data;

        // Create message in database
        const message = await Message.create({
          conversation: conversationId,
          sender: socket.userId,
          receiver: receiverId,
          content,
          listing: listingId || null,
        });

        // Update conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          lastMessageAt: new Date(),
        });

        await message.populate('sender', 'name avatar');
        await message.populate('receiver', 'name avatar');

        // Emit to conversation room
        io.to(`conversation_${conversationId}`).emit('new_message', {
          success: true,
          data: message,
        });

        // Emit notification to receiver
        io.to(`user_${receiverId}`).emit('message_notification', {
          success: true,
          data: message,
        });
      } catch (error) {
        console.error('Socket message error:', error);
        socket.emit('error', {
          success: false,
          message: 'Error sending message',
        });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
        userId: socket.userId,
        userName: socket.user.name,
        conversationId: data.conversationId,
      });
    });

    socket.on('stop_typing', (data) => {
      socket.to(`conversation_${data.conversationId}`).emit('user_stop_typing', {
        userId: socket.userId,
        conversationId: data.conversationId,
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};
