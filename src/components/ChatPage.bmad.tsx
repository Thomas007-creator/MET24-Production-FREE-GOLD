/**
 * Chat Page - BMAD Refactored
 * 
 * React component voor chat management
 * Refactored using BMAD composition patterns to eliminate monolithic structure
 * 
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Button, Input, Chip, Badge } from '@nextui-org/react';
import { 
  ArrowLeft, 
  Home, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Send, 
  Paperclip,
  Smile,
  Mic,
  Users,
  Check,
  CheckCheck
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';
import database from '../database/v14/database';
import v14AppSyncService from '../services/v14AppSyncService';
import discourseConnector from '../services/discourseConnector';

// ================================================
// BMAD Types
// ================================================

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  mbtiType?: string;
  isAI?: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'voice' | 'file';
  replyTo?: string;
}

interface ChatContextType {
  userData: any;
  contacts: ChatContact[];
  setContacts: (contacts: ChatContact[]) => void;
  selectedContact: ChatContact | null;
  setSelectedContact: (contact: ChatContact | null) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loadContacts: () => Promise<void>;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

// ================================================
// BMAD Chat Context & Provider
// ================================================

const ChatContext = createContext<ChatContextType | null>(null);

interface ChatProviderProps {
  children: React.ReactNode;
}

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { userData } = useAppStore();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load contacts from database
  const loadContacts = async () => {
    try {
      const contactsCollection = database.get('contacts');
      const allContacts = await contactsCollection.query().fetch();
      const userContacts = allContacts.filter((contact: any) => contact.userId === (userData?.id || ''));
      
      const chatContacts: ChatContact[] = userContacts.map((contact: any) => ({
        id: contact.contactId,
        name: contact.name,
        avatar: contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random`,
        lastMessage: contact.lastMessage || '',
        lastMessageTime: contact.lastMessageTime ? new Date(contact.lastMessageTime).toLocaleTimeString() : '',
        unreadCount: contact.unreadCount,
        isOnline: contact.isOnline,
        mbtiType: contact.mbtiType,
        isAI: contact.isAi,
      }));
      
      setContacts(chatContacts);
      logger.info('Contacts loaded from V14 database:', { count: chatContacts.length });
      
      await v14AppSyncService.syncTable('contacts');
      logger.info('Contacts synced to MCP-Bridge');
    } catch (error) {
      logger.error('Failed to load contacts:', undefined, error);
    }
  };

  // Load mock data
  useEffect(() => {
    if (userData?.id) {
      loadContacts();
    }
    
    const mockContacts: ChatContact[] = [
      {
        id: '1',
        name: 'Sarah van der Berg',
        avatar: '👩‍⚕️',
        lastMessage: 'Hoe voel je je vandaag?',
        lastMessageTime: '14:30',
        unreadCount: 2,
        isOnline: true,
        mbtiType: 'ENFJ',
        isAI: false
      },
      {
        id: '2',
        name: 'Mark de Vries',
        avatar: '👨‍💼',
        lastMessage: 'Bedankt voor de sessie gisteren!',
        lastMessageTime: '12:15',
        unreadCount: 0,
        isOnline: false,
        mbtiType: 'INTJ',
        isAI: false
      },
      {
        id: '3',
        name: 'AI Coach',
        avatar: '🤖',
        lastMessage: 'Ik heb een nieuwe oefening voor je',
        lastMessageTime: '10:45',
        unreadCount: 1,
        isOnline: true,
        mbtiType: 'AI',
        isAI: true
      },
      {
        id: '4',
        name: 'Lisa Chen',
        avatar: '👩‍🎓',
        lastMessage: 'Wanneer kunnen we afspreken?',
        lastMessageTime: 'Gisteren',
        unreadCount: 0,
        isOnline: true,
        mbtiType: 'ISFP',
        isAI: false
      }
    ];

    setContacts(mockContacts);
  }, [userData?.id]);

  // Load messages for selected contact
  useEffect(() => {
    if (selectedContact) {
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          senderId: selectedContact.id,
          content: selectedContact.lastMessage,
          timestamp: selectedContact.lastMessageTime,
          isRead: true,
          type: 'text'
        },
        {
          id: '2',
          senderId: 'current_user',
          content: 'Hallo! Hoe gaat het?',
          timestamp: '14:25',
          isRead: true,
          type: 'text'
        },
        {
          id: '3',
          senderId: selectedContact.id,
          content: 'Goed hoor, dank je! En met jou?',
          timestamp: '14:28',
          isRead: true,
          type: 'text'
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedContact]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'current_user',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        type: 'text'
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const contextValue: ChatContextType = {
    userData,
    contacts,
    setContacts,
    selectedContact,
    setSelectedContact,
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    searchQuery,
    setSearchQuery,
    loadContacts,
    handleSendMessage,
    handleKeyPress
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

// ================================================
// BMAD Chat Hook
// ================================================

const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

// ================================================
// BMAD Chat Header Component
// ================================================

const ChatHeader: React.FC = () => {
  const { userData } = useChat();

  const handleBackToMain = () => {
    window.history.back();
  };

  return (
    <div className='flex items-center justify-between p-6 border-b border-white/10'>
      <div className='flex items-center space-x-4'>
        <Button
          color='secondary'
          variant='bordered'
          startContent={<ArrowLeft />}
          onClick={handleBackToMain}
          className='bg-white/10 border-white/20 text-white hover:bg-white/20'
        >
          Terug
        </Button>
        <div>
          <h1 className='text-2xl font-bold text-white'>
            💬 Persoonlijke Chats
          </h1>
          <p className='text-gray-300'>
            Chat met bekenden en AI coaches
          </p>
        </div>
      </div>
      <div className='flex gap-3'>
        <Button
          color='primary'
          variant='bordered'
          startContent={<Home />}
          onClick={() => window.location.href = '/'}
          className='bg-white/10 border-white/20 text-white hover:bg-white/20'
        >
          Hoofdmenu
        </Button>
        <Button
          color='primary'
          variant='bordered'
          startContent={<Users />}
          onClick={() => window.location.href = '/communities'}
          className='bg-white/10 border-white/20 text-white hover:bg-white/20'
        >
          Community's
        </Button>
      </div>
    </div>
  );
};

// ================================================
// BMAD Discourse Live Chat Component
// ================================================

const DiscourseLiveChat: React.FC = () => {
  const { userData } = useChat();

  return (
    <div className='glass rounded-xl p-6 mb-6 border-2 border-blue-500/50'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-4'>
          <div className='text-4xl'>💬</div>
          <div>
            <h3 className='text-xl font-bold text-white mb-1'>
              🚀 Live Community Chat
            </h3>
            <p className='text-gray-300 text-sm'>
              Praat real-time met andere {userData?.mbtiType} types en de hele MET24 community
            </p>
          </div>
        </div>
        <div className='text-center'>
          <div className='text-green-400 text-sm font-semibold mb-1'>● LIVE</div>
          <div className='text-gray-400 text-xs'>Nu online</div>
        </div>
      </div>
      
      <div className='flex gap-3 flex-wrap'>
        <Button
          color='primary'
          variant='solid'
          size='lg'
          startContent={<Users />}
          onClick={() => discourseConnector.navigateToChat(userData?.mbtiType)}
          className='bg-blue-600 hover:bg-blue-700 text-white font-semibold'
        >
          💬 {userData?.mbtiType} Live Chat
        </Button>
        
        <Button
          color='secondary'
          variant='bordered'
          size='lg'
          onClick={() => discourseConnector.navigateToCommunities(userData?.mbtiType)}
          className='bg-white/10 border-white/20 text-white hover:bg-white/20'
        >
          👥 Alle Communities
        </Button>
      </div>
      
      <div className='mt-3 p-2 bg-white/5 rounded-lg'>
        <p className='text-xs text-gray-400 text-center'>
          🔄 Je profiel en voortgang blijven gesynchroniseerd tussen persoonlijke en community chats
        </p>
      </div>
    </div>
  );
};

// ================================================
// BMAD Contacts Sidebar Component
// ================================================

const ContactsSidebar: React.FC = () => {
  const { contacts, selectedContact, setSelectedContact, searchQuery, setSearchQuery } = useChat();

  return (
    <div className='w-full md:w-1/3 border-r border-white/10 flex flex-col'>
      {/* Search Bar */}
      <div className='p-4 border-b border-white/10'>
        <Input
          placeholder='Zoek contacten...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Search className='w-4 h-4' />}
          className='w-full'
        />
      </div>

      {/* Contacts List */}
      <div className='flex-1 overflow-y-auto'>
        {contacts
          .filter(contact => 
            contact.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((contact) => (
          <div
            key={contact.id}
            onClick={() => setSelectedContact(contact)}
            className='p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors'
          >
            <div className='flex items-center space-x-3'>
              <div className='relative'>
                <div className='w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl'>
                  {contact.avatar}
                </div>
                {contact.isOnline && (
                  <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900'></div>
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold text-white truncate'>{contact.name}</h3>
                  <span className='text-xs text-gray-400'>{contact.lastMessageTime}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <p className='text-sm text-gray-300 truncate'>{contact.lastMessage}</p>
                  {contact.unreadCount > 0 && (
                    <Badge content={contact.unreadCount} color='primary' size='sm'>
                      <div></div>
                    </Badge>
                  )}
                </div>
                {contact.mbtiType && (
                  <Chip
                    size='sm'
                    variant='flat'
                    className='mt-1 bg-white/10 text-white text-xs'
                  >
                    {contact.mbtiType}
                  </Chip>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ================================================
// BMAD Chat Header Component
// ================================================

const ChatAreaHeader: React.FC = () => {
  const { selectedContact, setSelectedContact } = useChat();

  if (!selectedContact) return null;

  return (
    <div className='p-4 border-b border-white/10 flex items-center justify-between'>
      <div className='flex items-center space-x-3'>
        <Button
          color='secondary'
          variant='light'
          startContent={<ArrowLeft />}
          onClick={() => setSelectedContact(null)}
          className='text-white'
        >
          Terug
        </Button>
        <div className='relative'>
          <div className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl'>
            {selectedContact.avatar}
          </div>
          {selectedContact.isOnline && (
            <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900'></div>
          )}
        </div>
        <div>
          <h3 className='font-semibold text-white'>{selectedContact.name}</h3>
          <p className='text-sm text-gray-400'>
            {selectedContact.isOnline ? 'Online' : 'Offline'}
            {selectedContact.mbtiType && ` • ${selectedContact.mbtiType}`}
          </p>
        </div>
      </div>
      <div className='flex space-x-2'>
        <Button
          color='secondary'
          variant='light'
          startContent={<Phone />}
          className='text-white'
        >
          Bellen
        </Button>
        <Button
          color='secondary'
          variant='light'
          startContent={<Video />}
          className='text-white'
        >
          Video
        </Button>
        <Button
          color='secondary'
          variant='light'
          startContent={<MoreVertical />}
          className='text-white'
        >
          Meer
        </Button>
      </div>
    </div>
  );
};

// ================================================
// BMAD Messages Area Component
// ================================================

const MessagesArea: React.FC = () => {
  const { messages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-4'>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.senderId === 'current_user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.senderId === 'current_user'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white'
            }`}
          >
            <p className='text-sm'>{message.content}</p>
            <div className='flex items-center justify-end mt-1 space-x-1'>
              <span className='text-xs opacity-70'>{message.timestamp}</span>
              {message.senderId === 'current_user' && (
                <div className='text-xs opacity-70'>
                  {message.isRead ? <CheckCheck className='w-3 h-3' /> : <Check className='w-3 h-3' />}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

// ================================================
// BMAD Message Input Component
// ================================================

const MessageInput: React.FC = () => {
  const { newMessage, setNewMessage, handleSendMessage, handleKeyPress } = useChat();

  return (
    <div className='p-4 border-t border-white/10'>
      <div className='flex items-center space-x-2'>
        <Button
          color='secondary'
          variant='light'
          startContent={<Paperclip />}
          className='text-white'
        >
          Bijlage
        </Button>
        <div className='flex-1'>
          <Input
            placeholder='Type een bericht...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            endContent={
              <div className='flex space-x-1'>
                <Button
                  color='secondary'
                  variant='light'
                  startContent={<Smile />}
                  className='text-white'
                >
                  Emoji
                </Button>
                <Button
                  color='secondary'
                  variant='light'
                  startContent={<Mic />}
                  className='text-white'
                >
                  Spraak
                </Button>
              </div>
            }
          />
        </div>
        <Button
          color='primary'
          variant='solid'
          startContent={<Send />}
          onClick={handleSendMessage}
          className='bg-purple-600 hover:bg-purple-700'
          disabled={!newMessage.trim()}
        >
          Verzend
        </Button>
      </div>
    </div>
  );
};

// ================================================
// BMAD Chat Area Component
// ================================================

const ChatArea: React.FC = () => {
  const { selectedContact } = useChat();

  if (!selectedContact) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>💬</div>
          <h2 className='text-2xl font-bold text-white mb-2'>Selecteer een chat</h2>
          <p className='text-gray-300'>Kies een contact om te beginnen met chatten</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col'>
      <ChatAreaHeader />
      <MessagesArea />
      <MessageInput />
    </div>
  );
};

// ================================================
// BMAD Main Chat Page Component
// ================================================

const ChatPageContent: React.FC = () => {
  const { selectedContact } = useChat();

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto h-screen flex flex-col'>
        <ChatHeader />
        <DiscourseLiveChat />
        
        {/* Main Content Area */}
        <div className='flex-1 flex overflow-hidden'>
          {!selectedContact && <ContactsSidebar />}
          <ChatArea />
        </div>
      </div>
    </div>
  );
};

// ================================================
// BMAD Main Chat Page Component with Provider
// ================================================

const ChatPage: React.FC = () => {
  return (
    <ChatProvider>
      <ChatPageContent />
    </ChatProvider>
  );
};

// ================================================
// BMAD Compound Components Export
// ================================================

export const ChatComponents = {
  Provider: ChatProvider,
  Page: ChatPage,
  Header: ChatHeader,
  DiscourseLiveChat,
  ContactsSidebar,
  ChatArea,
  ChatAreaHeader,
  MessagesArea,
  MessageInput,
  useChat
};

export default ChatPage;
