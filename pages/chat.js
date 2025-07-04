import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Head from 'next/head';
import { useUser } from '../contexts/UserContext';

let socket;

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const { user } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socketInitializer();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io('/', { path: '/api/socket' });

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('user count', (count) => {
      setOnlineUsers(count);
    });

    socket.on('typing', (data) => {
      setTypingUsers((prev) => {
        if (!prev.find(u => u.socketId === data.socketId)) {
          return [...prev, data];
        }
        return prev;
      });
    });

    socket.on('stop typing', (data) => {
      setTypingUsers((prev) => prev.filter(u => u.socketId !== data.socketId));
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      const messageData = {
        text: message,
        username: user?.name || 'Anonymous',
        userId: user?.id || 'anonymous',
        timestamp: new Date().toISOString()
      };
      
      socket.emit('chat message', messageData);
      setMessage('');
    }
  };

  const handleTyping = () => {
    if (socket && !isTyping) {
      setIsTyping(true);
      socket.emit('typing', {
        username: user?.name || 'Anonymous',
        socketId: socket.id
      });
    }
  };

  const handleStopTyping = () => {
    if (socket && isTyping) {
      setIsTyping(false);
      socket.emit('stop typing', {
        username: user?.name || 'Anonymous',
        socketId: socket.id
      });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isMyMessage = (msg) => {
    return msg.userId === user?.id || msg.socketId === socket?.id;
  };

  return (
    <>
      <Head>
        <title>Chat - FoodBridge</title>
        <meta name="description" content="Real-time chat for FoodBridge community" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-800 rounded-t-lg p-4 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Community Chat</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-300">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  {onlineUsers} users online
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 bg-gray-800 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isMyMessage(msg)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    {!isMyMessage(msg) && (
                      <div className="text-xs text-gray-300 mb-1">
                        {msg.username}
                      </div>
                    )}
                    <div className="text-sm">{msg.text}</div>
                    <div className={`text-xs mt-1 ${isMyMessage(msg) ? 'text-green-200' : 'text-gray-400'}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span>
                      {typingUsers.map(u => u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-gray-800 rounded-b-lg p-4 border-t border-gray-700">
            <form onSubmit={sendMessage} className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleTyping}
                onKeyUp={handleStopTyping}
                onBlur={handleStopTyping}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={!isConnected}
              />
              <button
                type="submit"
                disabled={!message.trim() || !isConnected}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Send
              </button>
            </form>
            <div className="text-xs text-gray-400 mt-2">
              {!isConnected && 'Disconnected from chat server'}
              {isConnected && user?.name && `Chatting as ${user.name}`}
              {isConnected && !user?.name && 'Chatting as Anonymous'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 