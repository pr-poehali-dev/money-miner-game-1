import Icon from '@/components/ui/icon';

interface HomePageProps {
  onNavigate: (page: string) => void;
  balance: number;
}

const stats = [
  { label: 'Выплачено сегодня', value: '₽ 48 200', icon: 'TrendingUp', color: 'text-neon-green' },
  { label: 'Игроков онлайн', value: '1 247', icon: 'Users', color: 'text-neon-blue' },
  { label: 'Макс. выигрыш', value: '×24.3', icon: 'Zap', color: 'text-gold' },
];

const recentWins = [
  { user: 'Алекс***', amount: '+₽ 3 400', mult: '×8.5', time: '2 мин назад' },
  { user: 'Мария***', amount: '+₽ 1 200', mult: '×4.0', time: '5 мин назад' },
  { user: 'Дмитр***', amount: '+₽ 7 800', mult: '×15.6', time: '8 мин назад' },
  { user: 'Олег***', amount: '+₽ 500', mult: '×2.5', time: '12 мин назад' },
  { user: 'Серг***', amount: '+₽ 12 000', mult: '×24.0', time: '15 мин назад' },
];

export default function HomePage({ onNavigate, balance }: HomePageProps) {
  return (
    <div className="animate-slide-up space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, hsl(222 25% 11%) 0%, hsl(240 30% 9%) 50%, hsl(200 30% 9%) 100%)',
          border: '1px solid rgba(255, 190, 30, 0.2)'
        }}>
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,190,30,0.4) 0%, transparent 70%)'
          }} />
        <div className="relative z-10">
          <div className="text-6xl mb-4 animate-float">💎</div>
          <h1 className="font-oswald text-5xl font-bold gradient-text-gold mb-2 tracking-wide">MINEWIN</h1>
          <p className="text-muted-foreground text-lg mb-6">Найди алмазы — забери деньги</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => onNavigate('miner')}
              className="btn-gold px-8 py-3 rounded-xl text-lg glow-gold"
            >
              🎮 Играть сейчас
            </button>
            <button
              onClick={() => onNavigate('deposit')}
              className="glass-card px-8 py-3 rounded-xl text-lg text-gold border-gold hover:glow-gold transition-all"
            >
              + Пополнить
            </button>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="card-game p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-rubik">Ваш баланс</p>
            <p className="font-oswald text-3xl font-bold text-gold">₽ {balance.toLocaleString('ru-RU')}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onNavigate('deposit')} className="btn-green px-4 py-2 rounded-lg text-sm">
              + Пополнить
            </button>
            <button onClick={() => onNavigate('withdrawal')} className="glass-card px-4 py-2 rounded-lg text-sm text-foreground hover:border-gold transition-all">
              Вывести
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="card-game p-4 text-center">
            <Icon name={s.icon} fallback="Star" size={22} className={`mx-auto mb-2 ${s.color}`} />
            <div className={`font-oswald text-lg font-bold ${s.color}`}>{s.value}</div>
            <div className="text-muted-foreground text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* How to play */}
      <div className="card-game p-5">
        <h2 className="font-oswald text-xl font-bold text-gold mb-4 tracking-wide">КАК ИГРАТЬ</h2>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Пополни баланс через Билайн или Сбербанк', icon: '💳' },
            { step: '2', text: 'Выбери размер ставки', icon: '🎯' },
            { step: '3', text: 'Открывай ячейки — каждый алмаз увеличивает множитель', icon: '💎' },
            { step: '4', text: 'Заберай выигрыш в любой момент или рискни дальше', icon: '🏆' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, hsl(45 100% 55%), hsl(38 90% 42%))' }}>
                <span className="text-background">{item.step}</span>
              </div>
              <span className="text-sm text-muted-foreground">{item.icon} {item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent wins */}
      <div className="card-game p-5">
        <h2 className="font-oswald text-xl font-bold text-gold mb-4 tracking-wide">ПОСЛЕДНИЕ ВЫИГРЫШИ</h2>
        <div className="space-y-2">
          {recentWins.map((win, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm">
                  👤
                </div>
                <div>
                  <div className="text-sm font-medium">{win.user}</div>
                  <div className="text-xs text-muted-foreground">{win.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-neon-green font-bold text-sm">{win.amount}</div>
                <div className="text-gold text-xs">{win.mult}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}