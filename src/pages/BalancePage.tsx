import Icon from '@/components/ui/icon';

interface BalancePageProps {
  balance: number;
  onNavigate: (page: string) => void;
}

const transactions = [
  { type: 'win', label: 'Выигрыш в майнере', amount: '+₽ 3 400', time: '14:32', mult: '×8.5' },
  { type: 'deposit', label: 'Пополнение Сбербанк', amount: '+₽ 2 000', time: '12:15', mult: null },
  { type: 'lose', label: 'Проигрыш в майнере', amount: '-₽ 500', time: '11:50', mult: null },
  { type: 'withdrawal', label: 'Вывод СБП', amount: '-₽ 1 500', time: 'вчера', mult: null },
  { type: 'deposit', label: 'Пополнение Билайн', amount: '+₽ 1 000', time: 'вчера', mult: null },
];

export default function BalancePage({ balance, onNavigate }: BalancePageProps) {
  return (
    <div className="animate-slide-up space-y-5">
      <h1 className="font-oswald text-2xl font-bold gradient-text-gold tracking-wide">БАЛАНС</h1>

      {/* Main balance card */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-center"
        style={{
          background: 'linear-gradient(135deg, hsl(222 25% 12%) 0%, hsl(240 30% 10%) 100%)',
          border: '1px solid rgba(255, 190, 30, 0.3)'
        }}>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5"
          style={{ background: 'radial-gradient(circle, gold 0%, transparent 70%)' }} />
        <p className="text-muted-foreground text-sm mb-1">Доступный баланс</p>
        <p className="font-oswald text-5xl font-bold text-gold mb-4">
          ₽ {balance.toLocaleString('ru-RU')}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => onNavigate('deposit')} className="btn-green px-6 py-2.5 rounded-xl">
            <span className="flex items-center gap-2">
              <Icon name="Plus" size={16} />
              Пополнить
            </span>
          </button>
          <button onClick={() => onNavigate('withdrawal')} className="btn-gold px-6 py-2.5 rounded-xl">
            <span className="flex items-center gap-2">
              <Icon name="ArrowUp" size={16} />
              Вывести
            </span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-game p-4">
          <Icon name="TrendingUp" size={20} className="text-neon-green mb-2" />
          <div className="font-oswald text-2xl font-bold text-neon-green">₽ 12 800</div>
          <div className="text-muted-foreground text-xs mt-1">Всего выиграно</div>
        </div>
        <div className="card-game p-4">
          <Icon name="Target" size={20} className="text-gold mb-2" />
          <div className="font-oswald text-2xl font-bold text-gold">68%</div>
          <div className="text-muted-foreground text-xs mt-1">Процент побед</div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card-game p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-oswald text-lg font-bold text-gold tracking-wide">ТРАНЗАКЦИИ</h2>
          <button onClick={() => onNavigate('history')} className="text-muted-foreground text-xs hover:text-gold transition-colors">
            Все →
          </button>
        </div>
        <div className="space-y-1">
          {transactions.map((t, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                  t.type === 'win' ? 'bg-green-900/30' :
                  t.type === 'deposit' ? 'bg-blue-900/30' :
                  t.type === 'lose' ? 'bg-red-900/30' : 'bg-yellow-900/30'
                }`}>
                  {t.type === 'win' ? '🏆' : t.type === 'deposit' ? '💳' : t.type === 'lose' ? '💣' : '↗'}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold text-sm ${
                  t.amount.startsWith('+') ? 'text-neon-green' : 'text-neon-red'
                }`}>{t.amount}</div>
                {t.mult && <div className="text-gold text-xs">{t.mult}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
