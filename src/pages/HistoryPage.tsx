import { useState } from 'react';

type FilterType = 'all' | 'wins' | 'losses' | 'deposits' | 'withdrawals';

const allHistory = [
  { type: 'win', label: 'Выигрыш в майнере', amount: '+₽ 3 400', time: '05.05.2026, 14:32', mult: '×8.5', mines: 5, opened: 7 },
  { type: 'deposit', label: 'Пополнение Сбербанк', amount: '+₽ 2 000', time: '05.05.2026, 12:15', mult: null, mines: null, opened: null },
  { type: 'lose', label: 'Проигрыш в майнере', amount: '-₽ 500', time: '05.05.2026, 11:50', mult: null, mines: 7, opened: 3 },
  { type: 'withdrawal', label: 'Вывод СБП', amount: '-₽ 1 500', time: '04.05.2026, 20:10', mult: null, mines: null, opened: null },
  { type: 'win', label: 'Выигрыш в майнере', amount: '+₽ 1 200', time: '04.05.2026, 18:45', mult: '×4.0', mines: 3, opened: 5 },
  { type: 'deposit', label: 'Пополнение Билайн', amount: '+₽ 1 000', time: '04.05.2026, 14:20', mult: null, mines: null, opened: null },
  { type: 'win', label: 'Выигрыш в майнере', amount: '+₽ 7 800', time: '03.05.2026, 22:15', mult: '×15.6', mines: 5, opened: 12 },
  { type: 'lose', label: 'Проигрыш в майнере', amount: '-₽ 200', time: '03.05.2026, 21:50', mult: null, mines: 10, opened: 2 },
  { type: 'win', label: 'Выигрыш в майнере', amount: '+₽ 500', time: '03.05.2026, 19:30', mult: '×2.5', mines: 3, opened: 3 },
  { type: 'deposit', label: 'Пополнение Сбербанк', amount: '+₽ 5 000', time: '03.05.2026, 15:00', mult: null, mines: null, opened: null },
];

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'wins', label: '🏆 Победы' },
  { key: 'losses', label: '💣 Проигрыши' },
  { key: 'deposits', label: '💳 Пополнения' },
  { key: 'withdrawals', label: '↗ Выводы' },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = allHistory.filter(h => {
    if (filter === 'all') return true;
    if (filter === 'wins') return h.type === 'win';
    if (filter === 'losses') return h.type === 'lose';
    if (filter === 'deposits') return h.type === 'deposit';
    if (filter === 'withdrawals') return h.type === 'withdrawal';
    return true;
  });

  const totalWon = allHistory.filter(h => h.type === 'win').reduce((acc, h) => acc + parseInt(h.amount.replace(/[^\d]/g, '')), 0);
  const totalLost = allHistory.filter(h => h.type === 'lose').reduce((acc, h) => acc + parseInt(h.amount.replace(/[^\d]/g, '')), 0);

  return (
    <div className="animate-slide-up space-y-5">
      <h1 className="font-oswald text-2xl font-bold gradient-text-gold tracking-wide">ИСТОРИЯ</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-game p-4">
          <div className="text-neon-green text-xs mb-1">Всего выиграно</div>
          <div className="font-oswald text-xl font-bold text-neon-green">₽ {totalWon.toLocaleString('ru-RU')}</div>
        </div>
        <div className="card-game p-4">
          <div className="text-neon-red text-xs mb-1">Всего проиграно</div>
          <div className="font-oswald text-xl font-bold text-neon-red">₽ {totalLost.toLocaleString('ru-RU')}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg font-rubik text-sm whitespace-nowrap transition-all flex-shrink-0 ${
              filter === f.key
                ? 'btn-gold'
                : 'glass-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="card-game p-4 space-y-1">
        {filtered.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                item.type === 'win' ? 'bg-green-900/30' :
                item.type === 'deposit' ? 'bg-blue-900/30' :
                item.type === 'lose' ? 'bg-red-900/30' : 'bg-yellow-900/30'
              }`}>
                {item.type === 'win' ? '🏆' : item.type === 'deposit' ? '💳' : item.type === 'lose' ? '💣' : '↗'}
              </div>
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.time}</div>
                {item.mines !== null && (
                  <div className="text-xs text-muted-foreground">
                    {item.mines} мин · открыто {item.opened}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={`font-bold text-sm ${
                item.amount.startsWith('+') ? 'text-neon-green' : 'text-neon-red'
              }`}>{item.amount}</div>
              {item.mult && <div className="text-gold text-xs">{item.mult}</div>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            Записей не найдено
          </div>
        )}
      </div>
    </div>
  );
}
