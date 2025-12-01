import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { MessageList } from '../components/MessageList';
import { InputArea } from '../components/InputArea';
import { SuggestedPrompts } from '../components/SuggestedPrompts';
import { SidebarC } from '../components/SidebarC';
import { ItineraryModal } from '../components/ItineraryModal';
import { MapModal } from '../components/MapModal';
import { sendMessage } from '../services/geminiServiceC';
import { TRANSLATIONS } from '../constant';

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

const Chat = () => {
  // State
  const [language, setLanguage] = useState('English');
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Refs
  const chatSessionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Current Session Helpers
  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const currentMessages = currentSession?.messages || [];

  // Load from local storage
  useEffect(() => {
    const savedSessions = localStorage.getItem('jh_tourist_sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
        if (parsed.length > 0) {
          setCurrentSessionId(parsed[parsed.length - 1].id);
        } else {
          createNewSession('English');
        }
      } catch {
        createNewSession('English');
      }
    } else {
      createNewSession('English');
    }
    // Always open a new chat on application load
    createNewSession('English');
  }, []);

  // Save to local storage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(
        'jh_tourist_sessions',
        JSON.stringify(sessions)
      );
    }
  }, [sessions]);

  // Restore chat session
  useEffect(() => {
    const initChat = async () => {
      if (!currentSession) return;
      const history = currentSession.messages.filter((m) => !m.isError);
      try {
        
      } catch (error) {
        console.error('Failed to restore chat session', error);
      }
    };
    initChat();
  }, [currentSessionId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, isLoading]);

  const createNewSession = (lang) => {
    const newId = generateId();
    const welcomeMsg = {
      id: 'welcome',
      role: 'assistant',
      content: TRANSLATIONS[lang].greeting,
      timestamp: Date.now()
    };

    const newSession = {
      id: newId,
      title: 'New Trip',
      messages: [welcomeMsg],
      language: lang,
      updatedAt: Date.now()
    };

    setSessions((prev) => [...prev, newSession]);
    setCurrentSessionId(newId);
    setLanguage(lang);

    
  };

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    const newSessions = sessions.filter((s) => s.id !== sessionId);
    setSessions(newSessions);
    localStorage.setItem(
      'jh_tourist_sessions',
      JSON.stringify(newSessions)
    );

    if (currentSessionId === sessionId) {
      if (newSessions.length > 0) {
        setCurrentSessionId(
          newSessions[newSessions.length - 1].id
        );
      } else {
        createNewSession(language);
      }
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);

    if (
      currentSession &&
      currentSession.messages.length === 1 &&
      currentSession.messages[0].id === 'welcome'
    ) {
      const updatedSessions = sessions.map((s) => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            language: newLang,
            messages: [
              {
                ...s.messages[0],
                content: TRANSLATIONS[newLang].greeting
              }
            ]
          };
        }
        return s;
      });
      setSessions(updatedSessions);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || !currentSessionId) return;

    if (!chatSessionRef.current) {
      
    }

    const userMsg = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    updateSessionMessages(currentSessionId, [
      ...currentMessages,
      userMsg
    ]);
    setIsLoading(true);

    try {
      const responseText = await sendMessage(
  currentMessages,
  text,
  language
);


      const botMsg = {
        id: generateId(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };

      setSessions((prev) =>
        prev.map((session) => {
          if (session.id === currentSessionId) {
            const updatedMessages = [
              ...currentMessages,
              userMsg,
              botMsg
            ];
            let title = session.title;
            if (currentMessages.length === 1 && text) {
              title =
                text.slice(0, 30) +
                (text.length > 30 ? '...' : '');
            }
            return {
              ...session,
              messages: updatedMessages,
              title,
              updatedAt: Date.now()
            };
          }
          return session;
        })
      );
    } catch (error) {
      const errorMsg = {
        id: generateId(),
        role: 'assistant',
        content:
          'Sorry, I encountered an error connecting to the service.',
        timestamp: Date.now(),
        isError: true
      };
      updateSessionMessages(currentSessionId, [
        ...currentMessages,
        userMsg,
        errorMsg
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMessage = async (msgId, newText) => {
    if (!currentSessionId || !currentSession) return;

    const msgIndex = currentSession.messages.findIndex(
      (m) => m.id === msgId
    );
    if (msgIndex === -1) return;

    const historyToKeep = currentSession.messages.slice(0, msgIndex);
    

    const editedMsg = {
      ...currentSession.messages[msgIndex],
      content: newText,
      timestamp: Date.now()
    };

    updateSessionMessages(currentSessionId, [
      ...historyToKeep,
      editedMsg
    ]);
    setIsLoading(true);

    try {
      const responseText = await sendMessage(
  historyToKeep,
  newText,
  language
);


      const botMsg = {
        id: generateId(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };

      updateSessionMessages(currentSessionId, [
        ...historyToKeep,
        editedMsg,
        botMsg
      ]);
    } catch (error) {
      const errorMsg = {
        id: generateId(),
        role: 'assistant',
        content: "Sorry, I couldn't regenerate the response.",
        timestamp: Date.now(),
        isError: true
      };

      updateSessionMessages(currentSessionId, [
        ...historyToKeep,
        editedMsg,
        errorMsg
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSessionMessages = (sessionId, newMessages) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, messages: newMessages, updatedAt: Date.now() }
          : s
      )
    );
  };

  const handleItinerarySelect = (itineraryTitle) => {
    handleSendMessage(
      `Tell me more about the "${itineraryTitle}" itinerary. Provide a detailed day-by-day plan.`
    );
  };

  return (
    <div className="flex h-screen w-full bg-stone-50 overflow-hidden">
      <SidebarC
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onCreateSession={() => createNewSession(language)}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative shadow-2xl border-x border-stone-200 bg-white rounded-lg overflow-hidden">
        <Header
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
          onToggleSidebar={() =>
            setIsSidebarOpen(!isSidebarOpen)
          }
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMap={() => setIsMapOpen(true)}
        />

        <main className="flex-1 overflow-y-auto scrollbar-hide p-4 pb-32 bg-stone-50">
          <MessageList
            messages={currentMessages}
            isLoading={isLoading}
            onEdit={handleEditMessage}
          />

          {currentMessages.length === 1 && (
            <SuggestedPrompts
              prompts={TRANSLATIONS[language].prompts}
              onSelectPrompt={handleSendMessage}
            />
          )}
          <div ref={messagesEndRef} />
        </main>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-50 via-stone-50 to-transparent pt-10 pb-4 px-4">
          <InputArea
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            language={language}
          />
        </div>

        <ItineraryModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectItinerary={handleItinerarySelect}
        />

        <MapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          onSelectLocation={handleItinerarySelect}
        />
      </div>
    </div>
  );
};

export default Chat;
