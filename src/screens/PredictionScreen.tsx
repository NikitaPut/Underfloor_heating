import { useAppStore } from '../store/appStore';

export default function PredictionScreen() {
  const store = useAppStore();

  const last3 = store.history.slice(-3);
  const avg = last3.reduce((a, b) => a + b, 0) / last3.length;
  const needsPrediction = store.predictEnabled && avg < store.tDay - 2;

  // Chart dimensions
  const chartW = 340;
  const chartH = 180;
  const padL = 30;
  const padR = 10;
  const padT = 20;
  const padB = 30;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const maxTemp = Math.max(...store.history, store.tDay) + 2;
  const minTemp = Math.min(...store.history) - 2;

  const getX = (i: number) => padL + (i / (store.history.length - 1)) * plotW;
  const getY = (temp: number) => padT + plotH - ((temp - minTemp) / (maxTemp - minTemp)) * plotH;

  // Smooth curve path
  const linePath = store.history.map((t, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(t)}`).join(' ');
  const areaPath = `${linePath} L ${getX(store.history.length - 1)} ${padT + plotH} L ${padL} ${padT + plotH} Z`;

  return (
    <div className="px-4 py-6 animate-fade-in">
      {/* Large Title */}
      <h1 className="text-[34px] font-bold mb-6 px-1" style={{ color: 'var(--text-primary)' }}>
        Прогноз
      </h1>

      {/* Prediction Card (Weather-style) */}
      <div className={`rounded-[20px] p-6 mb-4 shadow-lg animate-scale-in ${
        needsPrediction
          ? 'bg-gradient-to-br from-purple-500 to-pink-500'
          : store.predictEnabled
          ? 'bg-gradient-to-br from-green-400 to-emerald-500'
          : 'bg-gradient-to-br from-gray-400 to-gray-500'
      }`} style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[15px] text-white/80 font-medium mb-1">
              {needsPrediction ? '⚠️ Требуется прогрев' : store.predictEnabled ? '✅ Всё в норме' : '⏸️ Отключено'}
            </div>
            <div className="text-[22px] font-bold text-white">
              {needsPrediction 
                ? `Завтра в ${store.nextStart}` 
                : store.predictEnabled 
                ? `Завтра в ${store.nextStart}`
                : 'По расписанию'}
            </div>
          </div>
          <div className="text-4xl">
            {needsPrediction ? '❄️' : store.predictEnabled ? '☀️' : '⏸️'}
          </div>
        </div>
        <div className="text-[13px] text-white/70 leading-relaxed">
          {needsPrediction
            ? `На ${store.warmupMinutes} мин раньше, т.к. 3 дня было холодно. Среднее: ${avg.toFixed(1)}°C`
            : store.predictEnabled
            ? `Работа по расписанию. Среднее за 3 дня: ${avg.toFixed(1)}°C`
            : 'Прогноз отключён. Работа по стандартному расписанию.'}
        </div>
      </div>

      {/* Chart Card */}
      <div className="ios-card p-4 mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[17px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            История температур
          </span>
          <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Последние 7 дней
          </span>
        </div>
        
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ maxHeight: '200px' }}>
          {/* Grid lines */}
          {[minTemp, Math.round((minTemp + maxTemp) / 2), maxTemp].map((temp, i) => (
            <g key={i}>
              <line
                x1={padL} y1={getY(temp)} x2={padL + plotW} y2={getY(temp)}
                stroke="var(--separator)" strokeDasharray="3 3"
              />
              <text x={padL - 4} y={getY(temp) + 3} fill="var(--text-secondary)" fontSize="10" textAnchor="end">
                {temp}°
              </text>
            </g>
          ))}

          {/* Target temp line */}
          <line
            x1={padL} y1={getY(store.tDay)} x2={padL + plotW} y2={getY(store.tDay)}
            stroke="var(--danger)" strokeDasharray="5 3" strokeWidth="1.5"
          />
          <text x={padL + plotW - 2} y={getY(store.tDay) - 4} fill="var(--danger)" fontSize="9" textAnchor="end">
            Цель: {store.tDay}°
          </text>

          {/* Threshold line */}
          <line
            x1={padL} y1={getY(store.tDay - 2)} x2={padL + plotW} y2={getY(store.tDay - 2)}
            stroke="var(--warning)" strokeDasharray="2 2" strokeWidth="1" opacity="0.5"
          />

          {/* Area fill */}
          <path d={areaPath} fill="url(#predAreaGrad)" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="url(#predLineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {store.history.map((temp, i) => (
            <g key={i}>
              <circle
                cx={getX(i)} cy={getY(temp)} r="4"
                fill={temp < store.tDay - 2 ? 'var(--danger)' : 'var(--accent)'}
                stroke="white" strokeWidth="2"
              />
              <text
                x={getX(i)} y={padT + plotH + 16}
                fill="var(--text-secondary)" fontSize="10" textAnchor="middle"
              >
                Д{i + 1}
              </text>
            </g>
          ))}

          {/* Gradient defs */}
          <defs>
            <linearGradient id="predLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--info)" />
            </linearGradient>
            <linearGradient id="predAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Settings Section */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="ios-section-header">НАСТРОЙКИ ПРОГНОЗА</div>
        <div className="ios-grouped-list">
          {/* Predict toggle */}
          <div className="ios-list-item">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[17px]" style={{ color: 'var(--text-primary)' }}>
                  Умный прогноз
                </div>
                <div className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                  Анализ истории температур
                </div>
              </div>
              <button
                onClick={() => store.setPredictEnabled(!store.predictEnabled)}
                className={`ios-switch ${store.predictEnabled ? 'active' : ''}`}
              >
                <div className="ios-switch-thumb" />
              </button>
            </div>
          </div>

          {/* Warmup slider */}
          <div className="ios-list-item">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[17px]" style={{ color: 'var(--text-primary)' }}>
                Время прогрева
              </div>
              <div className="text-[17px] font-semibold" style={{ color: 'var(--accent)' }}>
                {store.warmupMinutes} мин
              </div>
            </div>
            <input
              type="range"
              min={10}
              max={90}
              step={5}
              value={store.warmupMinutes}
              onChange={(e) => store.setWarmupMinutes(Number(e.target.value))}
              className="w-full"
              style={{
                background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((store.warmupMinutes - 10) / 80) * 100}%, var(--separator) ${((store.warmupMinutes - 10) / 80) * 100}%, var(--separator) 100%)`
              }}
            />
          </div>

          {/* Status */}
          <div className="ios-list-item">
            <div className="flex items-center justify-between">
              <div className="text-[17px]" style={{ color: 'var(--text-primary)' }}>
                Статус данных
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[15px]" style={{ color: store.history.length >= 3 ? 'var(--success)' : 'var(--warning)' }}>
                  {store.history.length >= 3 ? 'Достаточно' : 'Недостаточно'}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
