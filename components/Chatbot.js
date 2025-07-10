"use client"
import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello! I'm your AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');

    // Call the API route
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{
      width: 400,
      background: '#fff',
      borderRadius: 24,
      boxShadow: '0 4px 32px 0 rgba(60, 60, 60, 0.08)',
      padding: '24px 16px 16px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Header Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 22,
            marginBottom: 6,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(90deg, #16A34A 30%, #4FC3F7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            textAlign: 'center',
          }}
        >
          Welcome to FoodBridge Chatbot
        </div>
        <div style={{ color: '#6B7280', fontSize: 15, marginBottom: 12, fontWeight: 500 }}>
          Your AI assistant for FoodBridge
        </div>
        <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, #E6F2EA 0%, #F0F1F3 100%)', marginBottom: 18 }} />
      </div>
      {/* End Header Section */}
      <div style={{
        width: '100%',
        height: 280,
        overflowY: 'auto',
        background: '#F6FBF8',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        boxSizing: 'border-box',
        border: '1px solid #E6F2EA',
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
            <div style={{
              background: msg.sender === 'user' ? '#D1FADF' : '#F0F1F3',
              color: '#222',
              borderRadius: 18,
              padding: '10px 18px',
              maxWidth: '75%',
              fontSize: 16,
              boxShadow: msg.sender === 'user' ? '0 1px 4px #d1fadf55' : '0 1px 4px #f0f1f355',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your message"
          style={{
            flex: 1,
            border: '1.5px solid #E6F2EA',
            outline: 'none',
            fontSize: 16,
            padding: '14px 18px',
            borderRadius: 16,
            background: '#F6FBF8',
            marginRight: 0,
            transition: 'border 0.2s',
            minWidth: '320px',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            background: 'transparent',
            border: 'none',
            borderRadius: 10,
            width: 120,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16A34A',
            fontSize: 18,
            fontWeight: 600,
            transition: 'color 0.2s',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Chatbot; 