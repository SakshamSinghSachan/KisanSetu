import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiPaperAirplane, HiSearch } from 'react-icons/hi';

const Chat = () => {
  const { user, API } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => { fetchChats(); }, []);

  useEffect(() => {
    if (activeChat) fetchMessages(activeChat._id);
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChats = async () => {
    try {
      const { data } = await API.get('/chat');
      setChats(data);
      if (data.length > 0) setActiveChat(data[0]);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const fetchMessages = async (chatId) => {
    try {
      const { data } = await API.get(`/chat/${chatId}/messages`);
      setMessages(data);
    } catch (error) { console.error(error); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    try {
      const { data } = await API.post(`/chat/${activeChat._id}/messages`, { content: newMessage });
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) { console.error(error); }
  };

  const otherUser = activeChat?.participants?.find(p => p._id !== user?.id);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card-premium overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
          <div className="flex h-full">
            <div className="w-80 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg mb-3">Messages</h2>
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" className="w-full pl-9 pr-3 py-2 rounded-lg border-gray-200 text-sm" placeholder="Search conversations..." />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => {
                  const other = chat.participants?.find(p => p._id !== user?.id);
                  return (
                    <button key={chat._id} onClick={() => setActiveChat(chat)} className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition border-b ${activeChat?._id === chat._id ? 'bg-primary-50' : ''}`}>
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{other?.name?.charAt(0) || '?'}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{other?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500 truncate">{chat.lastMessage?.content || 'No messages yet'}</div>
                      </div>
                    </button>
                  );
                })}
                {chats.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <p className="text-sm">No conversations yet</p>
                    <p className="text-xs mt-1">Start chatting with sellers</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              {activeChat ? (
                <>
                  <div className="p-4 border-b bg-white flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{otherUser?.name?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{otherUser?.name || 'Unknown'}</h3>
                      <p className="text-xs text-green-500">Online</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg) => (
                      <div key={msg._id} className={`flex ${msg.sender?._id === user?.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender?._id === user?.id ? 'bg-primary-600 text-white rounded-br-md' : 'bg-white shadow-sm rounded-bl-md'}`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender?._id === user?.id ? 'text-white/70' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={sendMessage} className="p-4 bg-white border-t flex items-center space-x-3">
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 input-field !rounded-full" placeholder="Type a message..." />
                    <button type="submit" className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition">
                      <HiPaperAirplane className="w-5 h-5" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-lg font-semibold">Select a conversation</h3>
                    <p className="text-sm">Choose a chat to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
