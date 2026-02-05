import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

// @desc    Create or get conversation
// @route   POST /api/messages/conversation
// @access  Private
export const createOrGetConversation = async (req, res) => {
  try {
    const { receiverId, listingId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide receiver ID',
      });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] },
      listing: listingId || null,
    })
      .populate('participants', 'name avatar email')
      .populate('listing', 'title image price')
      .populate('lastMessage');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, receiverId],
        listing: listingId || null,
      });

      await conversation.populate('participants', 'name avatar email');
      if (listingId) {
        await conversation.populate('listing', 'title image price');
      }
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('Conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating conversation',
      error: error.message,
    });
  }
};

// @desc    Get user's conversations
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate('participants', 'name avatar email')
      .populate('listing', 'title image price')
      .populate('lastMessage')
      .sort('-lastMessageAt')
      .sort('-updatedAt');

    res.json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message,
    });
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/conversation/:conversationId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId,
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort('createdAt');

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        receiver: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message,
    });
  }
};

// @desc    Send message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, content, listingId } = req.body;

    if (!conversationId || !receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide conversation ID, receiver ID, and content',
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      receiver: receiverId,
      content,
      listing: listingId || null,
    });

    // Update conversation last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
    });

    await message.populate('sender', 'name avatar');
    await message.populate('receiver', 'name avatar');

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message,
    });
  }
};
