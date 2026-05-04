import { useState } from 'react';
import Icon from '@/components/ui/icon';

const AMOUNTS = [200, 500, 1000, 2000, 5000];

const BEELINE_PHONE = '79629031556';
const BEELINE_PHONE_DISPLAY = '+7 (962) 903-15-56';

export default function DepositPage() {
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep] = useState<'select' | 'instructions' | 'pending'>('select');
  const [copied, setCopied] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : amount;
  const payCode = `MINE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (step === 'pending') {
    return (
      <div className="animate-slide-up flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
        <div className="text-6xl animate-float">⏳</div>
        <h2 className="font-oswald text-2xl font-bold text-gold">ОЖИДАЕМ ПЛАТЁЖ</h2>
        <p className="text-muted-foreground max-w-xs">
          После перевода администратор проверит платёж и зачислит деньги на баланс в течение 15 минут
        </p>
        <div className="card-game p-4 w-full rounded-xl space-y-1">
          <div className="flex justify-between text-sm py-2">
            <span className="text-muted-foreground">Сумма</span>
            <span className="font-bold text-gold">₽ {finalAmount.toLocaleString('ru-RU')}</span>
          </div>
          <div className="flex justify-between text-sm py-2">
            <span className="text-muted-foreground">Метод</span>
            <span>🟡 Билайн</span>
          </div>
          <div className="flex justify-between text-sm py-2">
            <span className="text-muted-foreground">Номер</span>
            <span className="font-mono">{BEELINE_PHONE_DISPLAY}</span>
          </div>
          <div className="flex justify-between text-sm py-2">
            <span className="text-muted-foreground">Статус</span>
            <span className="text-yellow-400">На проверке...</span>
          </div>
        </div>
        <button
          onClick={() => setStep('select')}
          className="glass-card px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground transition-all"
        >
          ← Назад
        </button>
      </div>
    );
  }

  if (step === 'instructions') {
    return (
      <div className="animate-slide-up space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep('select')} className="text-muted-foreground hover:text-gold transition-colors">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <h1 className="font-oswald text-2xl font-bold gradient-text-gold tracking-wide">🟡 ПОПОЛНЕНИЕ ЧЕРЕЗ БИЛАЙН</h1>
        </div>

        <div className="rounded-xl p-4 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(40,200,100,0.1), rgba(40,200,100,0.03))', border: '1px solid rgba(40,200,100,0.2)' }}>
          <p className="text-muted-foreground text-sm">Сумма к переводу</p>
          <p className="font-oswald text-4xl font-bold text-neon-green">₽ {finalAmount.toLocaleString('ru-RU')}</p>
        </div>

        {/* Реквизиты */}
        <div className="card-game p-4 space-y-4">
          <p className="text-muted-foreground text-sm">Пополни баланс телефона на номер:</p>

          <div className="flex items-center justify-between py-3 border border-gold/30 rounded-xl px-4"
            style={{ background: 'rgba(255,190,30,0.05)' }}>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Номер Билайн</p>
              <p className="font-oswald text-2xl font-bold text-gold">{BEELINE_PHONE_DISPLAY}</p>
            </div>
            <button
              onClick={() => copy(BEELINE_PHONE)}
              className="glass-card px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-all hover:border-gold"
            >
              <Icon name={copied ? 'Check' : 'Copy'} size={14} className={copied ? 'text-neon-green' : 'text-muted-foreground'} />
              <span className={copied ? 'text-neon-green' : 'text-muted-foreground'}>{copied ? 'Скопировано' : 'Копировать'}</span>
            </button>
          </div>
        </div>

        {/* Инструкция */}
        <div className="card-game p-4">
          <h3 className="font-oswald text-sm font-bold text-gold mb-3">КАК ПЕРЕВЕСТИ</h3>
          <div className="space-y-3">
            {[
              { text: 'Зайди на сайт или в приложение «Мой Билайн»', emoji: '📱' },
              { text: 'Выбери раздел «Перевод баланса»', emoji: '💸' },
              { text: `Введи номер получателя: ${BEELINE_PHONE_DISPLAY}`, emoji: '📞' },
              { text: `Укажи сумму: ₽ ${finalAmount.toLocaleString('ru-RU')}`, emoji: '💰' },
              { text: 'Подтверди перевод', emoji: '✅' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-lg flex-shrink-0">{item.emoji}</span>
                <div className="flex gap-2 items-start">
                  <span className="text-gold font-oswald font-bold text-sm flex-shrink-0">{i + 1}.</span>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-3 rounded-xl">
          <div className="flex gap-2 items-start">
            <span className="text-yellow-400 text-lg">⚠️</span>
            <p className="text-muted-foreground text-sm">
              Отправляй точную сумму. В комментарии ничего писать не нужно — платёж определяется по сумме и номеру.
            </p>
          </div>
        </div>

        <button
          onClick={() => setStep('pending')}
          className="w-full py-4 rounded-xl font-oswald text-xl font-bold btn-gold glow-gold"
        >
          ✅ Я ПЕРЕВЁЛ ДЕНЬГИ
        </button>
      </div>
    );
  }

  return (
    <div className="animate-slide-up space-y-5">
      <h1 className="font-oswald text-2xl font-bold gradient-text-gold tracking-wide">ПОПОЛНЕНИЕ</h1>

      {/* Method display */}
      <div className="card-game p-5">
        <p className="text-muted-foreground text-sm mb-3">Способ оплаты</p>
        <div className="rounded-xl p-4 flex items-center gap-4"
          style={{ background: 'rgba(255, 200, 0, 0.08)', border: '2px solid rgba(255, 200, 0, 0.35)' }}>
          <div className="text-4xl">🟡</div>
          <div>
            <div className="font-oswald font-bold text-lg">Билайн</div>
            <div className="text-muted-foreground text-sm">Перевод баланса мобильной связи</div>
            <div className="text-gold font-mono text-sm mt-1">{BEELINE_PHONE_DISPLAY}</div>
          </div>
        </div>
      </div>

      {/* Amount selection */}
      <div className="card-game p-5">
        <p className="text-muted-foreground text-sm mb-3">Сумма пополнения</p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {AMOUNTS.map(a => (
            <button
              key={a}
              onClick={() => { setAmount(a); setCustomAmount(''); }}
              className={`py-2.5 rounded-lg font-oswald font-bold transition-all ${
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
        <p className="text-muted-foreground text-xs mt-2">Минимум ₽ 200 · Максимум ₽ 50 000</p>
      </div>

      <div className="glass-card p-4 rounded-xl flex items-start gap-3">
        <Icon name="Clock" size={18} className="text-gold flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">Время зачисления</p>
          <p className="text-muted-foreground text-xs mt-1">
            Платёж проверяется администратором. Обычно до 15 минут в рабочее время (9:00–23:00).
          </p>
        </div>
      </div>

      <button
        onClick={() => finalAmount >= 200 && setStep('instructions')}
        disabled={finalAmount < 200}
        className="w-full py-4 rounded-xl font-oswald text-xl font-bold btn-gold glow-gold disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ДАЛЕЕ — ₽ {finalAmount.toLocaleString('ru-RU')}
      </button>
    </div>
  );
}
