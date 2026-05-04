import { useState } from 'react';
import Icon from '@/components/ui/icon';

type PaymentStatus = 'pending' | 'approved' | 'rejected';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  method: 'sber' | 'beeline';
  amount: number;
  time: string;
  status: PaymentStatus;
  phone?: string;
  comment?: string;
}

const initialPayments: Payment[] = [
  { id: 'P001', userId: '4821', userName: 'Игрок #4821', method: 'sber', amount: 2000, time: '05.05.2026 12:15', status: 'pending' },
  { id: 'P002', userId: '3312', userName: 'Игрок #3312', method: 'beeline', amount: 500, time: '05.05.2026 11:40', status: 'pending', comment: 'MINE-AB3X7Y' },
  { id: 'P003', userId: '7754', userName: 'Игрок #7754', method: 'sber', amount: 5000, time: '05.05.2026 10:22', status: 'pending' },
  { id: 'P004', userId: '2200', userName: 'Игрок #2200', method: 'beeline', amount: 1000, time: '04.05.2026 22:50', status: 'approved', comment: 'MINE-QW9Z12' },
  { id: 'P005', userId: '9901', userName: 'Игрок #9901', method: 'sber', amount: 300, time: '04.05.2026 20:10', status: 'rejected' },
];

const withdrawals = [
  { id: 'W001', userName: 'Игрок #4821', amount: 1500, phone: '+7 (900) 123-45-67', bank: 'Сбербанк', time: '04.05.2026 20:10', status: 'pending' as PaymentStatus },
  { id: 'W002', userName: 'Игрок #3312', amount: 3000, phone: '+7 (915) 987-65-43', bank: 'Тинькофф', time: '04.05.2026 18:30', status: 'approved' as PaymentStatus },
];

const ADMIN_PASSWORD = '2007';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [wrongPass, setWrongPass] = useState(false);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [tab, setTab] = useState<'deposits' | 'withdrawals'>('deposits');
  const [filter, setFilter] = useState<PaymentStatus | 'all'>('pending');

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      setWrongPass(true);
      setTimeout(() => setWrongPass(false), 2000);
    }
  };

  const updateStatus = (id: string, status: PaymentStatus) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  if (!authenticated) {
    return (
      <div className="animate-slide-up flex flex-col items-center justify-center min-h-[70vh] space-y-5">
        <div className="text-5xl animate-float">🔐</div>
        <h1 className="font-oswald text-2xl font-bold text-gold">АДМИН-ПАНЕЛЬ</h1>
        <p className="text-muted-foreground text-sm">Доступ только для администраторов</p>
        <div className="card-game p-6 w-full max-w-xs space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Пароль</label>
            <input
              type="password"
              placeholder="Введите пароль..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              className={`w-full px-4 py-3 rounded-xl bg-secondary border text-foreground font-rubik focus:outline-none transition-colors ${
                wrongPass ? 'border-red-500' : 'border-border focus:border-gold'
              }`}
            />
            {wrongPass && <p className="text-neon-red text-xs mt-1">Неверный пароль</p>}
          </div>
          <button onClick={login} className="w-full py-3 rounded-xl font-oswald font-bold btn-gold">
            ВОЙТИ
          </button>
        </div>
        <p className="text-muted-foreground text-xs">Демо-пароль: 1234</p>
      </div>
    );
  }

  const pendingDeposits = payments.filter(p => p.status === 'pending').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;

  const filteredPayments = tab === 'deposits'
    ? payments.filter(p => filter === 'all' || p.status === filter)
    : withdrawals.filter(w => filter === 'all' || w.status === filter);

  return (
    <div className="animate-slide-up space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-oswald text-2xl font-bold gradient-text-gold tracking-wide">АДМИН-ПАНЕЛЬ</h1>
        <button onClick={() => setAuthenticated(false)} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
          Выйти
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-game p-3 text-center">
          <div className="font-oswald text-2xl font-bold text-yellow-400">{pendingDeposits}</div>
          <div className="text-muted-foreground text-xs">Пополнений</div>
        </div>
        <div className="card-game p-3 text-center">
          <div className="font-oswald text-2xl font-bold text-orange-400">{pendingWithdrawals}</div>
          <div className="text-muted-foreground text-xs">Выводов</div>
        </div>
        <div className="card-game p-3 text-center">
          <div className="font-oswald text-2xl font-bold text-neon-green">
            ₽ {payments.filter(p => p.status === 'approved').reduce((a, p) => a + p.amount, 0).toLocaleString('ru-RU')}
          </div>
          <div className="text-muted-foreground text-xs">Принято</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('deposits')}
          className={`flex-1 py-2.5 rounded-xl font-oswald font-bold transition-all ${tab === 'deposits' ? 'btn-gold' : 'glass-card text-muted-foreground'}`}
        >
          Пополнения {pendingDeposits > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs">{pendingDeposits}</span>
          )}
        </button>
        <button
          onClick={() => setTab('withdrawals')}
          className={`flex-1 py-2.5 rounded-xl font-oswald font-bold transition-all ${tab === 'withdrawals' ? 'btn-gold' : 'glass-card text-muted-foreground'}`}
        >
          Выводы {pendingWithdrawals > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs">{pendingWithdrawals}</span>
          )}
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-rubik transition-all ${
              filter === s ? 'btn-gold' : 'glass-card text-muted-foreground'
            }`}
          >
            {s === 'all' ? 'Все' : s === 'pending' ? '⏳ Ожидают' : s === 'approved' ? '✅ Одобрены' : '❌ Отклонены'}
          </button>
        ))}
      </div>

      {/* Payments list */}
      <div className="space-y-3">
        {tab === 'deposits' ? (
          (filteredPayments as Payment[]).map((payment) => (
            <div key={payment.id} className={`card-game p-4 ${payment.status === 'pending' ? 'border-yellow-500/30' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-oswald font-bold text-gold">#{payment.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      payment.status === 'approved' ? 'bg-green-500/20 text-neon-green' :
                      'bg-red-500/20 text-neon-red'
                    }`}>
                      {payment.status === 'pending' ? '⏳ Ожидает' : payment.status === 'approved' ? '✅ Одобрен' : '❌ Отклонён'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{payment.userName} · {payment.time}</p>
                </div>
                <div className="font-oswald text-xl font-bold text-gold">₽ {payment.amount.toLocaleString('ru-RU')}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="glass-card p-2 rounded-lg">
                  <span className="text-muted-foreground text-xs">Метод</span>
                  <p className="font-medium mt-0.5">{payment.method === 'sber' ? '🟢 Сбербанк' : '🟡 Билайн'}</p>
                </div>
                {payment.comment && (
                  <div className="glass-card p-2 rounded-lg">
                    <span className="text-muted-foreground text-xs">Код</span>
                    <p className="font-mono font-bold text-yellow-400 mt-0.5">{payment.comment}</p>
                  </div>
                )}
              </div>

              {payment.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(payment.id, 'approved')}
                    className="flex-1 py-2.5 rounded-lg btn-green font-oswald font-bold text-sm flex items-center justify-center gap-1.5"
                  >
                    <Icon name="Check" size={16} />
                    ОДОБРИТЬ
                  </button>
                  <button
                    onClick={() => updateStatus(payment.id, 'rejected')}
                    className="flex-1 py-2.5 rounded-lg font-oswald font-bold text-sm flex items-center justify-center gap-1.5"
                    style={{ background: 'rgba(220,60,60,0.15)', border: '1px solid rgba(220,60,60,0.3)', color: 'hsl(var(--neon-red))' }}
                  >
                    <Icon name="X" size={16} />
                    ОТКЛОНИТЬ
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          withdrawals.filter(w => filter === 'all' || w.status === filter).map((w) => (
            <div key={w.id} className="card-game p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-oswald font-bold text-gold">#{w.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      w.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      w.status === 'approved' ? 'bg-green-500/20 text-neon-green' :
                      'bg-red-500/20 text-neon-red'
                    }`}>
                      {w.status === 'pending' ? '⏳ Ожидает' : w.status === 'approved' ? '✅ Отправлен' : '❌ Отклонён'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{w.userName} · {w.time}</p>
                </div>
                <div className="font-oswald text-xl font-bold text-gold">₽ {w.amount.toLocaleString('ru-RU')}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="glass-card p-2 rounded-lg">
                  <span className="text-muted-foreground text-xs">Телефон СБП</span>
                  <p className="font-medium mt-0.5">{w.phone}</p>
                </div>
                <div className="glass-card p-2 rounded-lg">
                  <span className="text-muted-foreground text-xs">Банк</span>
                  <p className="font-medium mt-0.5">{w.bank}</p>
                </div>
              </div>
              {w.status === 'pending' && (
                <button className="w-full py-2.5 rounded-lg btn-green font-oswald font-bold text-sm flex items-center justify-center gap-1.5">
                  <Icon name="Send" size={16} />
                  ПОДТВЕРДИТЬ ПЕРЕВОД
                </button>
              )}
            </div>
          ))
        )}

        {filteredPayments.length === 0 && (
          <div className="card-game p-8 text-center text-muted-foreground">
            Нет записей
          </div>
        )}
      </div>
    </div>
  );
}