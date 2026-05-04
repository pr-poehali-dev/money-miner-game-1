import { useState } from 'react';
import Icon from '@/components/ui/icon';

const AMOUNTS = [200, 500, 1000, 2000, 5000];

export default function DepositPage() {
  const [method, setMethod] = useState<'sber' | 'beeline'>('sber');
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep] = useState<'select' | 'instructions' | 'pending'>('select');

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : amount;

  const sberDetails = {
    phone: '+7 (900) 123-45-67',
    name: 'Александр В.',
    bank: 'Сбербанк',
  };
  const beelineDetails = {
    phone: '+7 (915) 987-65-43',
    comment: `MINE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
  };

  if (step === 'pending') {
    return (
      <div className="animate-slide-up flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
        <div className="text-6xl animate-float">⏳</div>
        <h2 className="font-oswald text-2xl font-bold text-gold">ОЖИДАЕМ ПЛАТЁЖ</h2>
        <p className="text-muted-foreground max-w-xs">
          После перевода администратор проверит платёж и зачислит деньги на баланс в течение 15 минут
        </p>
        <div className="card-game p-4 w-full rounded-xl">
          <div className="flex justify-between text-sm py-2">
            <span className="text-muted-foreground">Сумма</span>
            <span className="font-bold text-gold">₽ {finalAmount.toLocaleString('ru-RU')}</span>
          </div>
          <div className="flex justify-between text-sm py-2">
            <span className="text-muted-foreground">Метод</span>
            <span>{method === 'sber' ? '🟢 Сбербанк' : '🟡 Билайн'}</span>
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
          <h1 className="font-oswald text-2xl font-bold gradient-text-gold tracking-wide">
            {method === 'sber' ? '🟢 СБЕРБАНК' : '🟡 БИЛАЙН'}
          </h1>
        </div>

        <div className="rounded-xl p-4 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(40,200,100,0.1), rgba(40,200,100,0.03))', border: '1px solid rgba(40,200,100,0.2)' }}>
          <p className="text-muted-foreground text-sm">Сумма к переводу</p>
          <p className="font-oswald text-4xl font-bold text-neon-green">₽ {finalAmount.toLocaleString('ru-RU')}</p>
        </div>

        {method === 'sber' ? (
          <div className="space-y-3">
            <div className="card-game p-4">
              <p className="text-muted-foreground text-sm mb-3">Переведите деньги по номеру телефона:</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Телефон</span>
                  <div className="flex items-center gap-2">
                    <span className="font-oswald text-lg font-bold text-gold">{sberDetails.phone}</span>
                    <button className="text-muted-foreground hover:text-gold transition-colors" onClick={() => navigator.clipboard?.writeText(sberDetails.phone)}>
                      <Icon name="Copy" size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Получатель</span>
                  <span className="font-medium">{sberDetails.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Банк</span>
                  <span className="font-medium">{sberDetails.bank}</span>
                </div>
              </div>
            </div>
            <div className="glass-card p-3 rounded-xl">
              <div className="flex gap-2 items-start">
                <span className="text-yellow-400 text-lg">⚠️</span>
                <p className="text-muted-foreground text-sm">
                  В комментарии к переводу ничего писать не нужно. Отправляйте точную сумму.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="card-game p-4">
              <p className="text-muted-foreground text-sm mb-3">Переведите деньги на номер Билайн:</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Номер</span>
                  <div className="flex items-center gap-2">
                    <span className="font-oswald text-lg font-bold text-gold">{beelineDetails.phone}</span>
                    <button className="text-muted-foreground hover:text-gold transition-colors" onClick={() => navigator.clipboard?.writeText(beelineDetails.phone)}>
                      <Icon name="Copy" size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Код платежа</span>
                  <div className="flex items-center gap-2">
                    <span className="font-oswald text-lg font-bold text-yellow-400">{beelineDetails.comment}</span>
                    <button className="text-muted-foreground hover:text-gold transition-colors" onClick={() => navigator.clipboard?.writeText(beelineDetails.comment)}>
                      <Icon name="Copy" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-card p-3 rounded-xl">
              <div className="flex gap-2 items-start">
                <span className="text-red-400 text-lg">❗</span>
                <p className="text-muted-foreground text-sm">
                  <strong className="text-foreground">Обязательно</strong> укажи код платежа в комментарии к переводу, иначе платёж не будет идентифицирован.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="card-game p-4">
          <h3 className="font-oswald text-sm font-bold text-gold mb-3">КАК ПЕРЕВЕСТИ</h3>
          <div className="space-y-2">
            {(method === 'sber' ? [
              'Открой приложение Сбербанк Онлайн',
              'Нажми «Платежи» → «Переводы»',
              `Введи номер ${sberDetails.phone}`,
              `Укажи сумму ₽ ${finalAmount.toLocaleString('ru-RU')}`,
              'Подтверди перевод',
            ] : [
              'Открой приложение Мой Билайн',
              'Выбери «Перевод на номер»',
              `Введи номер ${beelineDetails.phone}`,
              `Укажи сумму ₽ ${finalAmount.toLocaleString('ru-RU')}`,
              `В комментарии укажи код: ${beelineDetails.comment}`,
            ]).map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-gold font-oswald font-bold text-sm flex-shrink-0">{i + 1}.</span>
                <span className="text-sm text-muted-foreground">{step}</span>
              </div>
            ))}
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

      {/* Method selection */}
      <div className="card-game p-5">
        <p className="text-muted-foreground text-sm mb-3">Способ оплаты</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMethod('sber')}
            className={`p-4 rounded-xl transition-all ${
              method === 'sber'
                ? 'border-2 border-green-500 bg-green-900/20'
                : 'glass-card hover:border-green-500/50'
            }`}
          >
            <div className="text-3xl mb-2">🟢</div>
            <div className="font-oswald font-bold">Сбербанк</div>
            <div className="text-muted-foreground text-xs">Перевод СБП</div>
          </button>
          <button
            onClick={() => setMethod('beeline')}
            className={`p-4 rounded-xl transition-all ${
              method === 'beeline'
                ? 'border-2 border-yellow-500 bg-yellow-900/20'
                : 'glass-card hover:border-yellow-500/50'
            }`}
          >
            <div className="text-3xl mb-2">🟡</div>
            <div className="font-oswald font-bold">Билайн</div>
            <div className="text-muted-foreground text-xs">С баланса телефона</div>
          </button>
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
        <p className="text-muted-foreground text-xs mt-2">
          Минимум ₽ 200 · Максимум ₽ 50 000
        </p>
      </div>

      {/* Info */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <Icon name="Clock" size={18} className="text-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Время зачисления</p>
            <p className="text-muted-foreground text-xs mt-1">
              Платёж проверяется администратором вручную. Обычно до 15 минут в рабочее время (9:00–23:00).
            </p>
          </div>
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
