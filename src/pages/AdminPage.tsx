import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import {
  getBalance, setBalance,
  getDeposits, saveDeposits,
  getWithdrawals, saveWithdrawals,
  type DepositRequest, type WithdrawalRequest,
} from '@/lib/store';

type PaymentStatus = 'pending' | 'approved' | 'rejected';
type AdminTab = 'deposits' | 'withdrawals';

const ADMIN_PASSWORD = '2007';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [wrongPass, setWrongPass] = useState(false);
  const [deposits, setDeposits] = useState<DepositRequest[]>(() => getDeposits());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => getWithdrawals());
  const [tab, setTab] = useState<AdminTab>('deposits');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => {
      setDeposits(getDeposits());
      setWithdrawals(getWithdrawals());
    }, 2000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setDeposits(getDeposits());
      setWithdrawals(getWithdrawals());
    } else {
      setWrongPass(true);
      setTimeout(() => setWrongPass(false), 2000);
    }
  };

  const approveDeposit = (id: string) => {
    const dep = deposits.find(d => d.id === id);
    if (!dep) return;
    const updated = deposits.map(d => d.id === id ? { ...d, status: 'approved' as const } : d);
    saveDeposits(updated);
    setDeposits(updated);
    setBalance(getBalance() + dep.amount);
  };

  const rejectDeposit = (id: string) => {
    const updated = deposits.map(d => d.id === id ? { ...d, status: 'rejected' as const } : d);
    saveDeposits(updated);
    setDeposits(updated);
  };

  const confirmWithdrawal = (id: string) => {
    const updated = withdrawals.map(w => w.id === id ? { ...w, status: 'done' as const } : w);
    saveWithdrawals(updated);
    setWithdrawals(updated);
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

      </div>
    );
  }

  const pendingDeposits = deposits.filter(d => d.status === 'pending').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;

  const filteredDeposits = deposits.filter(d => filter === 'all' || d.status === filter);
  const filteredWithdrawals = withdrawals.filter(w =>
    filter === 'all' || (filter === 'approved' && w.status === 'done') || (filter === 'pending' && w.status === 'pending')
  );

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
            ₽ {deposits.filter(d => d.status === 'approved').reduce((a, d) => a + d.amount, 0).toLocaleString('ru-RU')}
          </div>
          <div className="text-muted-foreground text-xs">Принято</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('deposits')}
          className={`flex-1 py-2.5 rounded-xl font-oswald font-bold transition-all ${tab === 'deposits' ? 'btn-gold' : 'glass-card text-muted-foreground'}`}>
          Пополнения {pendingDeposits > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs">{pendingDeposits}</span>}
        </button>
        <button onClick={() => setTab('withdrawals')}
          className={`flex-1 py-2.5 rounded-xl font-oswald font-bold transition-all ${tab === 'withdrawals' ? 'btn-gold' : 'glass-card text-muted-foreground'}`}>
          Выводы {pendingWithdrawals > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs">{pendingWithdrawals}</span>}
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-rubik transition-all ${filter === s ? 'btn-gold' : 'glass-card text-muted-foreground'}`}>
            {s === 'all' ? 'Все' : s === 'pending' ? '⏳ Ожидают' : s === 'approved' ? '✅ Одобрены' : '❌ Отклонены'}
          </button>
        ))}
      </div>

      {/* Payments list */}
      <div className="space-y-3">
        {tab === 'deposits' ? (
          filteredDeposits.length === 0
            ? <div className="card-game p-8 text-center text-muted-foreground">Нет заявок</div>
            : filteredDeposits.map((dep) => (
            <div key={dep.id} className={`card-game p-4 ${dep.status === 'pending' ? 'border-yellow-500/30' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-oswald font-bold text-gold text-sm">#{dep.id.slice(-6)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      dep.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      dep.status === 'approved' ? 'bg-green-500/20 text-neon-green' :
                      'bg-red-500/20 text-neon-red'
                    }`}>
                      {dep.status === 'pending' ? '⏳ Ожидает' : dep.status === 'approved' ? '✅ Одобрен' : '❌ Отклонён'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{dep.time}</p>
                </div>
                <div className="font-oswald text-xl font-bold text-gold">₽ {dep.amount.toLocaleString('ru-RU')}</div>
              </div>
              <div className="glass-card p-2 rounded-lg mb-3 text-sm">
                <span className="text-muted-foreground text-xs">Метод</span>
                <p className="font-medium mt-0.5">🟡 Билайн · +7 (962) 903-15-56</p>
              </div>
              {dep.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => approveDeposit(dep.id)}
                    className="flex-1 py-2.5 rounded-lg btn-green font-oswald font-bold text-sm flex items-center justify-center gap-1.5">
                    <Icon name="Check" size={16} /> ОДОБРИТЬ
                  </button>
                  <button onClick={() => rejectDeposit(dep.id)}
                    className="flex-1 py-2.5 rounded-lg font-oswald font-bold text-sm flex items-center justify-center gap-1.5"
                    style={{ background: 'rgba(220,60,60,0.15)', border: '1px solid rgba(220,60,60,0.3)', color: 'hsl(var(--neon-red))' }}>
                    <Icon name="X" size={16} /> ОТКЛОНИТЬ
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          filteredWithdrawals.length === 0
            ? <div className="card-game p-8 text-center text-muted-foreground">Нет заявок</div>
            : filteredWithdrawals.map((w) => (
            <div key={w.id} className="card-game p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-oswald font-bold text-gold text-sm">#{w.id.slice(-6)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${w.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-neon-green'}`}>
                      {w.status === 'pending' ? '⏳ Ожидает' : '✅ Выполнен'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{w.time}</p>
                </div>
                <div>
                  <div className="font-oswald text-xl font-bold text-gold">₽ {w.amount.toLocaleString('ru-RU')}</div>
                  <div className="text-neon-green text-xs text-right">→ ₽ {w.payout.toLocaleString('ru-RU')}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="glass-card p-2 rounded-lg">
                  <span className="text-muted-foreground text-xs">Телефон СБП</span>
                  <p className="font-medium mt-0.5 text-xs">{w.phone}</p>
                </div>
                <div className="glass-card p-2 rounded-lg">
                  <span className="text-muted-foreground text-xs">Банк</span>
                  <p className="font-medium mt-0.5">{w.bank}</p>
                </div>
              </div>
              {w.status === 'pending' && (
                <button onClick={() => confirmWithdrawal(w.id)}
                  className="w-full py-2.5 rounded-lg btn-green font-oswald font-bold text-sm flex items-center justify-center gap-1.5">
                  <Icon name="Send" size={16} /> ПОДТВЕРДИТЬ ПЕРЕВОД
                </button>
              )}
            </div>
          ))
        )}

      </div>
    </div>
  );
}