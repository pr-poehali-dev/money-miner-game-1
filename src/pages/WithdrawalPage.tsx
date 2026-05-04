import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { getBalance, setBalance, getWithdrawals, saveWithdrawals } from '@/lib/store';

interface WithdrawalPageProps {
  balance: number;
}

const AMOUNTS = [500, 1000, 2000, 5000];

export default function WithdrawalPage({ balance }: WithdrawalPageProps) {
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [bank, setBank] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : amount;
  const commission = Math.round(finalAmount * 0.05);
  const payout = finalAmount - commission;

  const banks = ['Сбербанк', 'Тинькофф', 'ВТБ', 'Альфа-банк', 'Райффайзен', 'Другой'];

  const canSubmit = finalAmount >= 500 && finalAmount <= balance && phone.length >= 10 && bank;

  if (submitted) {
    return (
      <div className="animate-slide-up flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
        <div className="text-6xl animate-float">📤</div>
        <h2 className="font-oswald text-2xl font-bold text-gold">ЗАЯВКА ПРИНЯТА</h2>
        <p className="text-muted-foreground max-w-xs">
          Средства будут переведены на указанный номер в течение 24 часов
        </p>
        <div className="card-game p-4 w-full rounded-xl space-y-2">
          <div className="flex justify-between text-sm py-1.5">
            <span className="text-muted-foreground">Сумма вывода</span>
            <span className="font-bold text-gold">₽ {finalAmount.toLocaleString('ru-RU')}</span>
          </div>
          <div className="flex justify-between text-sm py-1.5">
            <span className="text-muted-foreground">Комиссия (5%)</span>
            <span className="text-neon-red">-₽ {commission.toLocaleString('ru-RU')}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between text-sm">
            <span className="text-muted-foreground">К получению</span>
            <span className="font-bold text-neon-green text-base">₽ {payout.toLocaleString('ru-RU')}</span>
          </div>
          <div className="flex justify-between text-sm py-1.5">
            <span className="text-muted-foreground">Телефон</span>
            <span>{phone}</span>
          </div>
          <div className="flex justify-between text-sm py-1.5">
            <span className="text-muted-foreground">Банк</span>
            <span>{bank}</span>
          </div>
          <div className="flex justify-between text-sm py-1.5">
            <span className="text-muted-foreground">Статус</span>
            <span className="text-yellow-400">На обработке</span>
          </div>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="glass-card px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground transition-all"
        >
          ← Назад
        </button>
      </div>
    );
  }

  return (
    <div className="animate-slide-up space-y-5">
      <h1 className="font-oswald text-2xl font-bold gradient-text-gold tracking-wide">ВЫВОД СРЕДСТВ</h1>

      {/* Balance */}
      <div className="card-game p-4 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs">Доступно для вывода</p>
          <p className="font-oswald text-2xl font-bold text-gold">₽ {balance.toLocaleString('ru-RU')}</p>
        </div>
        <Icon name="Wallet" size={32} className="text-gold opacity-40" />
      </div>

      {/* Amount */}
      <div className="card-game p-5">
        <p className="text-muted-foreground text-sm mb-3">Сумма вывода</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {AMOUNTS.map(a => (
            <button
              key={a}
              onClick={() => { setAmount(a); setCustomAmount(''); }}
              disabled={a > balance}
              className={`py-2.5 rounded-lg font-oswald font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                amount === a && !customAmount
                  ? 'btn-gold'
                  : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              ₽ {a.toLocaleString('ru-RU')}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-oswald">₽</span>
          <input
            type="number"
            placeholder="Своя сумма..."
            value={customAmount}
            onChange={e => setCustomAmount(e.target.value)}
            className="w-full pl-8 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-rubik focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <p className="text-muted-foreground text-xs mt-2">Минимум ₽ 500</p>
      </div>

      {/* Commission */}
      {finalAmount >= 500 && (
        <div className="glass-card p-4 rounded-xl space-y-2 animate-fade-in">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Сумма вывода</span>
            <span>₽ {finalAmount.toLocaleString('ru-RU')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Комиссия 5%</span>
            <span className="text-neon-red">-₽ {commission.toLocaleString('ru-RU')}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-medium">К получению</span>
            <span className="font-oswald font-bold text-neon-green text-lg">₽ {payout.toLocaleString('ru-RU')}</span>
          </div>
        </div>
      )}

      {/* Bank details */}
      <div className="card-game p-5 space-y-4">
        <p className="text-muted-foreground text-sm">Реквизиты для вывода (СБП)</p>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Номер телефона</label>
          <input
            type="tel"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-rubik focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Банк получателя</label>
          <div className="grid grid-cols-2 gap-2">
            {banks.map(b => (
              <button
                key={b}
                onClick={() => setBank(b)}
                className={`py-2 px-3 rounded-lg text-sm transition-all text-left ${
                  bank === b
                    ? 'border border-gold bg-yellow-900/20 text-gold'
                    : 'glass-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          if (!canSubmit) return;
          const newBalance = getBalance() - finalAmount;
          setBalance(newBalance);
          const list = getWithdrawals();
          list.unshift({
            id: `W${Date.now()}`,
            amount: finalAmount,
            payout,
            phone,
            bank,
            time: new Date().toLocaleString('ru-RU'),
            status: 'pending',
          });
          saveWithdrawals(list);
          setSubmitted(true);
        }}
        disabled={!canSubmit}
        className="w-full py-4 rounded-xl font-oswald text-xl font-bold btn-gold glow-gold disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ВЫВЕСТИ ₽ {payout.toLocaleString('ru-RU')}
      </button>

      <div className="glass-card p-3 rounded-xl flex items-start gap-2">
        <Icon name="Clock" size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-muted-foreground text-xs">
          Выводы обрабатываются вручную администратором. Время: до 24 часов в будние дни.
        </p>
      </div>
    </div>
  );
}