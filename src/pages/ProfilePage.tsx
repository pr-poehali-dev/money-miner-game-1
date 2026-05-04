import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [name, setName] = useState('Игрок #4821');
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const stats = [
    { label: 'Игр сыграно', value: '142' },
    { label: 'Побед', value: '89' },
    { label: 'Лучший множитель', value: '×24.3' },
    { label: 'Дней на платформе', value: '23' },
  ];

  return (
    <div className="animate-slide-up space-y-5">
      <h1 className="font-oswald text-2xl font-bold gradient-text-gold tracking-wide">ПРОФИЛЬ</h1>

      {/* Avatar & Name */}
      <div className="card-game p-6 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl"
            style={{ background: 'linear-gradient(135deg, hsl(45 100% 55%), hsl(38 90% 42%))' }}>
            💎
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-neon-green flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-background" />
          </div>
        </div>

        {editing ? (
          <div className="flex gap-2 items-center justify-center">
            <input
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              className="px-3 py-2 rounded-lg bg-secondary border border-gold text-foreground font-rubik text-center focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => { setName(tempName); setEditing(false); }}
              className="btn-gold px-3 py-2 rounded-lg text-sm"
            >
              <Icon name="Check" size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h2 className="font-oswald text-xl font-bold">{name}</h2>
            <button onClick={() => { setTempName(name); setEditing(true); }} className="text-muted-foreground hover:text-gold transition-colors">
              <Icon name="Pencil" size={14} />
            </button>
          </div>
        )}
        <p className="text-muted-foreground text-sm mt-1">ID: 4821</p>
        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full"
          style={{ background: 'rgba(255, 190, 30, 0.1)', border: '1px solid rgba(255, 190, 30, 0.3)' }}>
          <span className="text-gold text-xs font-oswald font-bold">ИГРОК</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(s => (
          <div key={s.label} className="card-game p-4 text-center">
            <div className="font-oswald text-2xl font-bold text-gold">{s.value}</div>
            <div className="text-muted-foreground text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="card-game overflow-hidden">
        {[
          { icon: 'History', label: 'История игр', page: 'history', color: 'text-gold' },
          { icon: 'Wallet', label: 'Баланс', page: 'balance', color: 'text-neon-green' },
          { icon: 'CreditCard', label: 'Пополнить', page: 'deposit', color: 'text-neon-blue' },
          { icon: 'ArrowUpRight', label: 'Вывести средства', page: 'withdrawal', color: 'text-yellow-400' },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => onNavigate(item.page)}
            className="w-full flex items-center justify-between px-5 py-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon name={item.icon} size={18} className={item.color} />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Support */}
      <div className="card-game p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <Icon name="MessageCircle" size={18} className="text-gold" />
        </div>
        <div>
          <p className="text-sm font-medium">Поддержка</p>
          <p className="text-muted-foreground text-xs">Telegram: @minewin_support</p>
        </div>
      </div>

      <button className="w-full py-3 rounded-xl glass-card text-muted-foreground hover:text-neon-red transition-colors text-sm font-rubik">
        Выйти из аккаунта
      </button>
    </div>
  );
}
