import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Head from 'next/head';
import { useUser } from '../contexts/UserContext';
import { Paperclip, Smile, Mic } from 'lucide-react';

let socket;

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);
  const { user } = useUser();
  const didMountRef = useRef(false);
  const lastMessageFromMe = useRef(false);

  const scrollToBottom = () => {
    const chatBody = chatBodyRef.current;
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
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
    if (didMountRef.current) {
      // Only scroll if the chat body is overflowing
      const chatBody = chatBodyRef.current;
      if (chatBody && chatBody.scrollHeight > chatBody.clientHeight) {
        scrollToBottom();
      }
      lastMessageFromMe.current = false;
    } else {
      didMountRef.current = true;
    }
  }, [messages]);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io('/', { path: '/api/socket' });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
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
      lastMessageFromMe.current = true;
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
      <div className="min-h-screen flex bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Chat Container Only, no left sidebar */}
        <div className="flex-1 flex flex-col items-center justify-center pt-0 pb-8">
          <div className="w-full max-w-2xl h-[80vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden relative">
            {/* Header - white background, horizontal line */}
            <div className="bg-white rounded-t-lg p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold text-gray-900">Community Chat</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-700">
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {onlineUsers} users online
                  </div>
                </div>
              </div>
            </div>
            {/* Messages */}
            <div ref={chatBodyRef} className="flex-1 px-6 py-4 overflow-y-auto flex flex-col gap-2 bg-white custom-scroll">
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
                      className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm break-words ${
                        isMyMessage(msg)
                          ? 'bg-[oklch(59.6%_0.145_163.225)] text-white rounded-br-md'
                          : 'bg-[oklch(88%_0.07_145)] text-gray-900 rounded-bl-md'
                      }`}
                    >
                      {!isMyMessage(msg) && (
                        <div className="text-xs text-gray-500 mb-1 font-medium">{msg.username}</div>
                      )}
                      <div>{msg.text}</div>
                      <div className={`text-[11px] mt-1 ${isMyMessage(msg) ? 'text-green-50' : 'text-gray-500'}`}>{formatTime(msg.timestamp)}</div>
                    </div>
                  </div>
                ))
              )}
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-[oklch(88%_0.07_145)] text-gray-500 px-4 py-2 rounded-2xl text-sm">
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
            {/* Input */}
            <form onSubmit={sendMessage} className="px-6 py-4 bg-white/80 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleTyping}
                onKeyUp={handleStopTyping}
                onBlur={handleStopTyping}
                placeholder="Type a message"
                className="flex-1 bg-transparent text-gray-900 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[oklch(59.6%_0.145_163.225)] border border-transparent focus:border-[oklch(59.6%_0.145_163.225)] shadow-sm transition-all"
                disabled={!isConnected}
              />
              <button
                type="submit"
                disabled={!message.trim() || !isConnected}
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 disabled:transform-none font-semibold shadow"
              >
                Send
              </button>
              </div>
              <div className="text-xs text-gray-500 text-center">
                Send as anonymous
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 