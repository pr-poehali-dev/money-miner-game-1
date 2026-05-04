import { useState } from 'react';
import Icon from '@/components/ui/icon';
import HomePage from './HomePage';
import MinerPage from './MinerPage';
import BalancePage from './BalancePage';
import DepositPage from './DepositPage';
import WithdrawalPage from './WithdrawalPage';
import HistoryPage from './HistoryPage';
import ProfilePage from './ProfilePage';
import AdminPage from './AdminPage';
import AviatorPage from './AviatorPage';
import SupportPage from './SupportPage';

type Page = 'home' | 'miner' | 'aviator' | 'balance' | 'deposit' | 'withdrawal' | 'history' | 'profile' | 'admin' | 'support';

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'miner', label: 'Майнер', icon: 'Pickaxe' },
  { id: 'aviator', label: 'Авиатрикс', icon: 'PlaneTakeoff' },
  { id: 'deposit', label: 'Пополнить', icon: 'Plus' },
  { id: 'support', label: 'Чат', icon: 'MessageCircle' },
];

export default function Index() {
  const [page, setPage] = useState<Page>('home');
  const [balance, setBalance] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (p: string) => {
    setPage(p as Page);
    setMenuOpen(false);
  };

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage onNavigate={navigate} balance={balance} />;
      case 'miner': return <MinerPage balance={balance} onBalanceChange={setBalance} />;
      case 'aviator': return <AviatorPage balance={balance} onBalanceChange={setBalance} />;
      case 'balance': return <BalancePage balance={balance} onNavigate={navigate} />;
      case 'deposit': return <DepositPage />;
      case 'withdrawal': return <WithdrawalPage balance={balance} />;
      case 'history': return <HistoryPage />;
      case 'profile': return <ProfilePage onNavigate={navigate} />;
      case 'admin': return <AdminPage />;
      case 'support': return <SupportPage />;
      default: return <HomePage onNavigate={navigate} balance={balance} />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-rubik">
      <header
        className="sticky top-0 z-50 border-b border-border"
        style={{ backdropFilter: 'blur(16px)', background: 'rgba(15, 18, 30, 0.92)' }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate('home')} className="font-oswald text-xl font-bold gradient-text-gold tracking-wider">
            💎 MINEWIN
          </button>
          <div className="flex items-center gap-3">
            <div className="glass-card px-3 py-1.5 rounded-lg">
              <span className="font-oswald font-bold text-gold text-sm">₽ {balance.toLocaleString('ru-RU')}</span>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors">
              <Icon name={menuOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
          <div
            className="absolute right-0 top-14 bottom-0 w-64 flex flex-col py-4 px-3 gap-1"
            style={{ background: 'hsl(222 25% 9%)', borderLeft: '1px solid hsl(222 20% 18%)' }}
            onClick={e => e.stopPropagation()}
          >
            {([
              { id: 'home', label: 'Главная', icon: 'Home' },
              { id: 'miner', label: 'Майнер', icon: 'Pickaxe' },
              { id: 'aviator', label: 'Авиатрикс', icon: 'PlaneTakeoff' },
              { id: 'balance', label: 'Баланс', icon: 'Wallet' },
              { id: 'deposit', label: 'Пополнить', icon: 'Plus' },
              { id: 'withdrawal', label: 'Вывод', icon: 'ArrowUpRight' },
              { id: 'history', label: 'История', icon: 'Clock' },
              { id: 'profile', label: 'Профиль', icon: 'User' },
              { id: 'support', label: 'Поддержка', icon: 'MessageCircle' },
            ] as { id: Page; label: string; icon: string }[]).map(item => (
              <button key={item.id} onClick={() => navigate(item.id)}
                className={`nav-item flex items-center gap-3 px-4 py-3 text-left ${page === item.id ? 'active' : 'text-muted-foreground hover:text-foreground'}`}>
                <Icon name={item.icon} fallback="Circle" size={18} />
                <span className="font-rubik text-sm font-medium">{item.label}</span>
              </button>
            ))}
            <div className="border-t border-border mt-2 pt-2">
              <button onClick={() => navigate('admin')}
                className={`nav-item flex items-center gap-3 px-4 py-3 text-left w-full ${page === 'admin' ? 'active' : 'text-muted-foreground hover:text-foreground'}`}>
                <Icon name="Shield" size={18} />
                <span className="font-rubik text-sm font-medium">Админ-панель</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-lg mx-auto px-4 py-5 pb-24">
        {renderPage()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40"
        style={{ background: 'rgba(15, 18, 30, 0.96)', borderTop: '1px solid hsl(222 20% 18%)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-lg mx-auto flex">
          {navItems.map(item => (
            <button key={item.id} onClick={() => navigate(item.id)}
              className={`relative flex-1 flex flex-col items-center gap-1 py-3 transition-all ${page === item.id ? 'text-gold' : 'text-muted-foreground hover:text-foreground'}`}>
              <Icon name={item.icon} fallback="Circle" size={20} />
              <span className="text-[10px] font-rubik">{item.label}</span>
              {page === item.id && <div className="absolute bottom-0 w-6 h-0.5 rounded-full bg-gold" />}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
