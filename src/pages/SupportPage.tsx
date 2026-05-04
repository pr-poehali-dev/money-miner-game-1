import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  from: 'user' | 'admin';
  time: string;
  read: boolean;
}

const CHAT_STORAGE_KEY = 'minewin_support_chat';

const getInitialMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.warn('chat load error', e);
  }
  return [
    {
      id: 1,
      text: 'Привет! Чем могу помочь? 👋',
      from: 'admin',
      time: formatTime(new Date()),
      read: true,
    },
  ];
};

function formatTime(date: Date) {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg: Message = {
      id: Date.now(),
      text,
      from: 'user',
      time: formatTime(new Date()),
      read: false,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    inputRef.current?.focus();
  };

  const quickReplies = [
    'Как пополнить баланс?',
    'Когда зачислят деньги?',
    'Как вывести средства?',
    'Не могу войти в аккаунт',
  ];

  return (
    <div className="animate-slide-up flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, hsl(45 100% 55%), hsl(38 90% 42%))' }}>
            🎮
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-neon-green border-2 border-background" />
        </div>
        <div>
          <h1 className="font-oswald text-lg font-bold text-gold leading-none">ПОДДЕРЖКА MINEWIN</h1>
          <p className="text-neon-green text-xs mt-0.5">● Онлайн</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.from === 'admin' && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 self-end mb-1"
                style={{ background: 'linear-gradient(135deg, hsl(45 100% 55%), hsl(38 90% 42%))' }}>
                🎮
              </div>
            )}
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.from === 'user'
                ? 'rounded-br-sm text-white'
                : 'rounded-bl-sm text-foreground'
            }`}
              style={msg.from === 'user'
                ? { background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }
                : { background: 'hsl(222 25% 14%)', border: '1px solid hsl(222 20% 20%)' }
              }>
              <p>{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[10px] opacity-60">{msg.time}</span>
                {msg.from === 'user' && (
                  <Icon name={msg.read ? 'CheckCheck' : 'Check'} size={10} className="opacity-60" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {messages.length <= 2 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {quickReplies.map((q) => (
            <button key={q} onClick={() => setInput(q)}
              className="glass-card px-3 py-1.5 rounded-full text-xs text-muted-foreground hover:text-gold hover:border-gold/40 transition-all">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mt-3 flex gap-2 items-end">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Напишите сообщение..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            className="w-full px-4 py-3 pr-4 rounded-2xl bg-secondary border border-border text-foreground font-rubik text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <button
          onClick={send}
          disabled={!input.trim()}
          className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all disabled:opacity-40 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
        >
          <Icon name="Send" size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}