import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

interface AviatorPageProps {
  balance: number;
  onBalanceChange: (b: number) => void;
}

const BET_OPTIONS = [10, 50, 100, 200, 500, 1000];

type GameState = 'idle' | 'waiting' | 'flying' | 'crashed' | 'cashedout';

const recentRounds = [
  { mult: 1.24, color: 'text-muted-foreground' },
  { mult: 8.71, color: 'text-neon-green' },
  { mult: 2.03, color: 'text-gold' },
  { mult: 1.01, color: 'text-neon-red' },
  { mult: 14.5, color: 'text-neon-green' },
  { mult: 3.44, color: 'text-gold' },
  { mult: 1.67, color: 'text-muted-foreground' },
];

export default function AviatorPage({ balance, onBalanceChange }: AviatorPageProps) {
  const [bet, setBet] = useState(100);
  const [customBet, setCustomBet] = useState('');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [multiplier, setMultiplier] = useState(1.00);
  const [crashAt, setCrashAt] = useState(1.0);
  const [countdown, setCountdown] = useState(5);
  const [planeX, setPlaneX] = useState(10);
  const [planeY, setPlaneY] = useState(80);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const [history, setHistory] = useState(recentRounds);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const multRef = useRef(1.0);
  const crashRef = useRef(1.0);

  const finalBet = customBet ? parseInt(customBet) || 0 : bet;
  const winAmount = Math.floor(finalBet * multiplier);

  const generateCrashPoint = () => {
    const r = Math.random();
    if (r < 0.35) return 1.0 + Math.random() * 0.5;
    if (r < 0.65) return 1.5 + Math.random() * 2;
    if (r < 0.85) return 3.5 + Math.random() * 5;
    if (r < 0.95) return 8 + Math.random() * 10;
    return 18 + Math.random() * 20;
  };

  const clearTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const startGame = () => {
    if (finalBet < 10 || balance < finalBet) return;
    onBalanceChange(balance - finalBet);
    const crash = generateCrashPoint();
    crashRef.current = crash;
    setCrashAt(crash);
    setMultiplier(1.00);
    multRef.current = 1.00;
    setPlaneX(10);
    setPlaneY(80);
    setTrail([]);
    setCountdown(5);
    setGameState('waiting');

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          beginFlight(crash);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const beginFlight = (crash: number) => {
    setGameState('flying');
    multRef.current = 1.00;
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const newMult = Math.round((1 + elapsed * 0.4 + elapsed * elapsed * 0.05) * 100) / 100;
      multRef.current = newMult;
      setMultiplier(newMult);

      const progress = Math.min((newMult - 1) / (crash - 1 + 0.001), 1);
      const px = 10 + progress * 72;
      const py = 80 - progress * 68;
      setPlaneX(px);
      setPlaneY(py);
      setTrail(prev => [...prev.slice(-30), { x: px, y: py }]);

      if (newMult >= crash) {
        clearInterval(intervalRef.current!);
        setGameState('crashed');
        setHistory(prev => [{ mult: Math.round(crash * 100) / 100, color: crash < 2 ? 'text-neon-red' : crash < 5 ? 'text-gold' : 'text-neon-green' }, ...prev.slice(0, 6)]);
      }
    }, 80);
  };

  const cashOut = () => {
    if (gameState !== 'flying') return;
    clearTimers();
    const payout = Math.floor(finalBet * multRef.current);
    onBalanceChange(balance - finalBet + payout);
    setGameState('cashedout');
    setHistory(prev => [{ mult: Math.round(multRef.current * 100) / 100, color: 'text-neon-green' }, ...prev.slice(0, 6)]);
  };

  useEffect(() => () => clearTimers(), []);

  const multColor = multiplier >= 10 ? 'text-neon-green' : multiplier >= 3 ? 'text-gold' : 'text-foreground';

  return (
    <div className="animate-slide-up space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-oswald text-2xl font-bold tracking-wide" style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ✈️ АВИАТРИКС
        </h1>
        <div className="glass-card px-4 py-1.5 rounded-xl">
          <span className="text-muted-foreground text-xs">Баланс: </span>
          <span className="font-oswald font-bold text-gold">₽ {balance.toLocaleString('ru-RU')}</span>
        </div>
      </div>

      {/* History pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {history.map((h, i) => (
          <div key={i} className={`flex-shrink-0 glass-card px-3 py-1 rounded-full text-xs font-oswald font-bold ${h.color}`}>
            ×{h.mult.toFixed(2)}
          </div>
        ))}
      </div>

      {/* Flight canvas */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{
          height: '240px',
          background: 'linear-gradient(180deg, #0a0e1a 0%, #0d1525 40%, #0f1e3a 100%)',
          border: '1px solid rgba(96, 165, 250, 0.2)',
        }}>

        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${(i * 37 + 7) % 100}%`,
              top: `${(i * 53 + 11) % 60}%`,
              opacity: 0.3 + (i % 3) * 0.2,
            }} />
        ))}

        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {[20, 40, 60, 80].map(y => (
            <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="4 8" />
          ))}
          {[20, 40, 60, 80].map(x => (
            <line key={x} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="4 8" />
          ))}
        </svg>

        {/* Trail */}
        {trail.length > 1 && (
          <svg className="absolute inset-0 w-full h-full">
            <polyline
              points={trail.map(p => `${p.x}%,${p.y}%`).join(' ')}
              fill="none"
              stroke="rgba(96, 165, 250, 0.6)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <polyline
              points={trail.map(p => `${p.x}%,${p.y}%`).join(' ')}
              fill="none"
              stroke="rgba(167, 139, 250, 0.3)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Plane */}
        {(gameState === 'flying' || gameState === 'cashedout') && (
          <div
            className="absolute transition-none text-3xl"
            style={{
              left: `${planeX}%`,
              top: `${planeY}%`,
              transform: 'translate(-50%, -50%) rotate(-25deg)',
              filter: gameState === 'cashedout' ? 'drop-shadow(0 0 12px #4ade80)' : 'drop-shadow(0 0 8px #60a5fa)',
            }}
          >
            ✈️
          </div>
        )}

        {/* Explosion */}
        {gameState === 'crashed' && (
          <div className="absolute text-4xl animate-fade-in"
            style={{ left: `${planeX}%`, top: `${planeY}%`, transform: 'translate(-50%, -50%)' }}>
            💥
          </div>
        )}

        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {gameState === 'idle' && (
            <div className="text-center">
              <div className="text-5xl mb-2">✈️</div>
              <p className="text-muted-foreground text-sm">Сделай ставку и запускай!</p>
            </div>
          )}
          {gameState === 'waiting' && (
            <div className="text-center animate-fade-in">
              <div className="font-oswald text-6xl font-bold text-gold">{countdown}</div>
              <p className="text-muted-foreground text-sm mt-1">До старта...</p>
            </div>
          )}
          {gameState === 'flying' && (
            <div className="text-center">
              <div className={`font-oswald text-6xl font-bold transition-all ${multColor}`}
                style={{ textShadow: multiplier >= 3 ? '0 0 30px currentColor' : 'none' }}>
                ×{multiplier.toFixed(2)}
              </div>
              <p className="text-muted-foreground text-xs mt-1 animate-pulse">Летим...</p>
            </div>
          )}
          {gameState === 'crashed' && (
            <div className="text-center animate-fade-in">
              <div className="font-oswald text-4xl font-bold text-neon-red">КРЭШ</div>
              <div className="font-oswald text-3xl text-neon-red">×{crashAt.toFixed(2)}</div>
            </div>
          )}
          {gameState === 'cashedout' && (
            <div className="text-center animate-fade-in">
              <div className="font-oswald text-2xl font-bold text-neon-green">ЗАБРАЛ!</div>
              <div className="font-oswald text-4xl font-bold text-neon-green">+₽ {winAmount.toLocaleString('ru-RU')}</div>
              <div className="text-gold text-sm">×{multiplier.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Bet selection */}
      {(gameState === 'idle' || gameState === 'crashed' || gameState === 'cashedout') && (
        <div className="card-game p-4 space-y-3 animate-slide-up">
          <p className="text-muted-foreground text-sm">Ставка (мин. ₽10)</p>
          <div className="grid grid-cols-3 gap-2">
            {BET_OPTIONS.map(b => (
              <button key={b} onClick={() => { setBet(b); setCustomBet(''); }}
                className={`py-2 rounded-lg font-oswald font-bold transition-all ${
                  bet === b && !customBet ? 'btn-gold' : 'glass-card text-muted-foreground hover:text-foreground'
                }`}>
                ₽ {b.toLocaleString('ru-RU')}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-oswald">₽</span>
            <input type="number" placeholder="Своя сумма..."
              value={customBet} onChange={e => setCustomBet(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-rubik focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      {(gameState === 'idle' || gameState === 'crashed' || gameState === 'cashedout') && (
        <button onClick={startGame}
          disabled={finalBet < 10 || balance < finalBet}
          className="w-full py-4 rounded-xl font-oswald text-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', boxShadow: '0 0 20px rgba(96, 165, 250, 0.3)' }}>
          🚀 ЗАПУСТИТЬ — ₽ {finalBet.toLocaleString('ru-RU')}
        </button>
      )}

      {gameState === 'flying' && (
        <button onClick={cashOut}
          className="w-full py-4 rounded-xl font-oswald text-xl font-bold btn-green glow-green animate-pulse-gold">
          💰 ЗАБРАТЬ ₽ {winAmount.toLocaleString('ru-RU')} (×{multiplier.toFixed(2)})
        </button>
      )}

      {gameState === 'waiting' && (
        <div className="w-full py-4 rounded-xl font-oswald text-xl font-bold text-center text-muted-foreground glass-card">
          ⏳ Ставка принята — ₽ {finalBet.toLocaleString('ru-RU')}
        </div>
      )}

      {balance < finalBet && finalBet >= 10 && (
        <p className="text-neon-red text-sm text-center">Недостаточно средств</p>
      )}

      {/* Info */}
      <div className="glass-card p-3 rounded-xl flex items-start gap-2">
        <Icon name="Info" size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-muted-foreground text-xs">
          Успей забрать деньги до того, как самолёт упадёт. Чем дольше летит — тем выше коэффициент. RTP 95%.
        </p>
      </div>
    </div>
  );
}
