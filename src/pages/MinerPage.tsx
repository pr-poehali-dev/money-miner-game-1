import { useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';

interface MinerPageProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const GRID_SIZE = 5;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

const MINE_OPTIONS = [3, 5, 7, 10];
const BET_OPTIONS = [50, 100, 200, 500, 1000, 2000];

const getMultiplierTable = (mines: number, opened: number): number => {
  const safe = TOTAL_CELLS - mines;
  let mult = 1;
  for (let i = 0; i < opened; i++) {
    mult *= (TOTAL_CELLS - mines - i) / (TOTAL_CELLS - i);
  }
  return Math.round((1 / mult) * 0.95 * 100) / 100;
};

type CellState = 'hidden' | 'gem' | 'bomb';

export default function MinerPage({ balance, onBalanceChange }: MinerPageProps) {
  const [mines, setMines] = useState(5);
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [cells, setCells] = useState<CellState[]>(Array(TOTAL_CELLS).fill('hidden'));
  const [bombPositions, setBombPositions] = useState<Set<number>>(new Set());
  const [openedCount, setOpenedCount] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [winAmount, setWinAmount] = useState(0);
  const [lastResult, setLastResult] = useState<'win' | 'lose' | null>(null);

  const generateBombs = useCallback((count: number): Set<number> => {
    const positions = new Set<number>();
    while (positions.size < count) {
      positions.add(Math.floor(Math.random() * TOTAL_CELLS));
    }
    return positions;
  }, []);

  const startGame = () => {
    if (balance < bet) return;
    const bombs = generateBombs(mines);
    setBombPositions(bombs);
    setCells(Array(TOTAL_CELLS).fill('hidden'));
    setOpenedCount(0);
    setCurrentMultiplier(1);
    setWinAmount(0);
    setGameState('playing');
    setLastResult(null);
    onBalanceChange(balance - bet);
  };

  const openCell = (index: number) => {
    if (gameState !== 'playing' || cells[index] !== 'hidden') return;

    const isBomb = bombPositions.has(index);
    const newCells = [...cells];

    if (isBomb) {
      newCells[index] = 'bomb';
      const revealedCells = newCells.map((c, i) =>
        c === 'hidden' && bombPositions.has(i) ? 'bomb' : c
      ) as CellState[];
      setCells(revealedCells);
      setGameState('lost');
      setLastResult('lose');
    } else {
      newCells[index] = 'gem';
      const newOpened = openedCount + 1;
      setOpenedCount(newOpened);
      const mult = getMultiplierTable(mines, newOpened);
      setCurrentMultiplier(mult);
      setWinAmount(Math.round(bet * mult));
      setCells(newCells);

      const safeCells = TOTAL_CELLS - mines;
      if (newOpened === safeCells) {
        setGameState('won');
        setLastResult('win');
        onBalanceChange(balance - bet + Math.round(bet * mult));
      }
    }
  };

  const cashOut = () => {
    if (gameState !== 'playing' || openedCount === 0) return;
    onBalanceChange(balance - bet + winAmount);
    setGameState('won');
    setLastResult('win');
  };

  const resetGame = () => {
    setCells(Array(TOTAL_CELLS).fill('hidden'));
    setGameState('idle');
    setOpenedCount(0);
    setCurrentMultiplier(1);
    setWinAmount(0);
  };

  const nextMult = gameState === 'playing' ? getMultiplierTable(mines, openedCount + 1) : getMultiplierTable(mines, 1);

  return (
    <div className="animate-slide-up space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-oswald text-2xl font-bold gradient-text-gold tracking-wide">МАЙНЕР</h1>
        <div className="glass-card px-4 py-2 rounded-xl">
          <span className="text-muted-foreground text-xs">Баланс: </span>
          <span className="font-oswald font-bold text-gold">₽ {balance.toLocaleString('ru-RU')}</span>
        </div>
      </div>

      {/* Result banner */}
      {lastResult === 'win' && (
        <div className="rounded-xl p-4 text-center animate-fade-in"
          style={{ background: 'linear-gradient(135deg, rgba(40,200,100,0.15), rgba(40,200,100,0.05))', border: '1px solid rgba(40,200,100,0.4)' }}>
          <div className="font-oswald text-2xl text-neon-green font-bold">🏆 ВЫИГРЫШ!</div>
          <div className="text-neon-green text-xl font-bold">+₽ {winAmount.toLocaleString('ru-RU')}</div>
        </div>
      )}
      {lastResult === 'lose' && (
        <div className="rounded-xl p-4 text-center animate-fade-in"
          style={{ background: 'linear-gradient(135deg, rgba(220,60,60,0.15), rgba(220,60,60,0.05))', border: '1px solid rgba(220,60,60,0.4)' }}>
          <div className="font-oswald text-2xl text-neon-red font-bold">💥 ВЗРЫВ!</div>
          <div className="text-muted-foreground text-sm">Не повезло. Попробуй снова!</div>
        </div>
      )}

      {/* Game Settings */}
      {gameState === 'idle' && (
        <div className="card-game p-5 space-y-4">
          <div>
            <p className="text-muted-foreground text-sm mb-2">Количество мин</p>
            <div className="grid grid-cols-4 gap-2">
              {MINE_OPTIONS.map(m => (
                <button
                  key={m}
                  onClick={() => setMines(m)}
                  className={`py-2 rounded-lg font-oswald font-bold transition-all ${
                    mines === m
                      ? 'btn-gold'
                      : 'glass-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  💣 {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-sm mb-2">Ставка (₽)</p>
            <div className="grid grid-cols-3 gap-2">
              {BET_OPTIONS.map(b => (
                <button
                  key={b}
                  onClick={() => setBet(b)}
                  className={`py-2 rounded-lg font-oswald font-bold transition-all ${
                    bet === b
                      ? 'btn-gold'
                      : 'glass-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  ₽ {b.toLocaleString('ru-RU')}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            disabled={balance < bet}
            className="w-full py-4 rounded-xl font-oswald text-xl font-bold btn-gold glow-gold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            🎮 НАЧАТЬ ИГРУ — ₽ {bet.toLocaleString('ru-RU')}
          </button>
          {balance < bet && (
            <p className="text-neon-red text-sm text-center">Недостаточно средств</p>
          )}
        </div>
      )}

      {/* Multiplier display */}
      {gameState === 'playing' && (
        <div className="grid grid-cols-3 gap-3">
          <div className="card-game p-3 text-center">
            <div className="text-muted-foreground text-xs mb-1">Ставка</div>
            <div className="font-oswald text-lg font-bold text-gold">₽ {bet.toLocaleString('ru-RU')}</div>
          </div>
          <div className="card-game p-3 text-center multiplier-badge">
            <div className="text-muted-foreground text-xs mb-1">Множитель</div>
            <div className="font-oswald text-lg font-bold text-gold">×{currentMultiplier}</div>
          </div>
          <div className="card-game p-3 text-center">
            <div className="text-muted-foreground text-xs mb-1">Следующий</div>
            <div className="font-oswald text-lg font-bold text-neon-green">×{nextMult}</div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="card-game p-4">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
          {cells.map((cell, index) => (
            <button
              key={index}
              onClick={() => openCell(index)}
              className={`mine-cell ${
                cell === 'hidden' ? 'mine-cell-default' :
                cell === 'gem' ? 'mine-cell-gem' : 'mine-cell-bomb'
              }`}
              style={{ height: '60px' }}
            >
              {cell === 'gem' && <span className="text-2xl">💎</span>}
              {cell === 'bomb' && <span className="text-2xl">💣</span>}
              {cell === 'hidden' && gameState === 'playing' && (
                <span className="text-muted-foreground text-xs opacity-40">?</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cash out / Reset */}
      {gameState === 'playing' && (
        <button
          onClick={cashOut}
          disabled={openedCount === 0}
          className="w-full py-4 rounded-xl font-oswald text-xl font-bold btn-green glow-green disabled:opacity-40 disabled:cursor-not-allowed"
        >
          💰 ЗАБРАТЬ ₽ {winAmount.toLocaleString('ru-RU')} (×{currentMultiplier})
        </button>
      )}

      {(gameState === 'won' || gameState === 'lost') && (
        <button
          onClick={resetGame}
          className="w-full py-4 rounded-xl font-oswald text-xl font-bold btn-gold"
        >
          🎮 ИГРАТЬ СНОВА
        </button>
      )}

      {/* Info */}
      <div className="glass-card p-3 rounded-xl flex items-center gap-2">
        <Icon name="Info" size={16} className="text-muted-foreground flex-shrink-0" />
        <p className="text-muted-foreground text-xs">
          Поле {GRID_SIZE}×{GRID_SIZE} · {mines} мин · {TOTAL_CELLS - mines} алмазов · RTP 95%
        </p>
      </div>
    </div>
  );
}
