import { useState } from 'react';
import { useAppStore } from '../store/appStore';

export default function SettingsScreen() {
  const store = useAppStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-4 py-6 animate-fade-in">
      {/* Large Title */}
      <h1 className="text-[34px] font-bold mb-6 px-1" style={{ color: 'var(--text-primary)' }}>
        Настройки
      </h1>

      {/* Section 1: Temperature */}
      <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div className="ios-section-header">ТЕМПЕРАТУРА</div>
        <div className="ios-grouped-list mb-6">
          {/* Day temp */}
          <div className="ios-list-item">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--danger)', opacity: 0.15 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--danger)">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="12" y1="21" x2="12" y2="23" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-[17px]" style={{ color: 'var(--text-primary)' }}>Дневная</span>
              </div>
              <span className="text-[17px] font-semibold" style={{ color: 'var(--accent)' }}>{store.tDay}°</span>
            </div>
            <input
              type="range" min={10} max={30} step={1}
              value={store.tDay}
              onChange={(e) => store.setTDay(Number(e.target.value))}
              className="w-full"
              style={{ background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((store.tDay - 10) / 20) * 100}%, var(--separator) ${((store.tDay - 10) / 20) * 100}%, var(--separator) 100%)` }}
            />
          </div>

          {/* Night temp */}
          <div className="ios-list-item">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--info)', opacity: 0.15 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--info)">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                </div>
                <span className="text-[17px]" style={{ color: 'var(--text-primary)' }}>Ночная</span>
              </div>
              <span className="text-[17px] font-semibold" style={{ color: 'var(--accent)' }}>{store.tNight}°</span>
            </div>
            <input
              type="range" min={10} max={25} step={1}
              value={store.tNight}
              onChange={(e) => store.setTNight(Number(e.target.value))}
              className="w-full"
              style={{ background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((store.tNight - 10) / 15) * 100}%, var(--separator) ${((store.tNight - 10) / 15) * 100}%, var(--separator) 100%)` }}
            />
          </div>

          {/* Light temp */}
          <div className="ios-list-item">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--warning)', opacity: 0.15 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--warning)">
                    <circle cx="12" cy="12" r="5"/>
                  </svg>
                </div>
                <span className="text-[17px]" style={{ color: 'var(--text-primary)' }}>При свете</span>
              </div>
              <span className="text-[17px] font-semibold" style={{ color: 'var(--accent)' }}>{store.tLight}°</span>
            </div>
            <input
              type="range" min={15} max={30} step={1}
              value={store.tLight}
              onChange={(e) => store.setTLight(Number(e.target.value))}
              className="w-full"
              style={{ background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((store.tLight - 15) / 15) * 100}%, var(--separator) ${((store.tLight - 15) / 15) * 100}%, var(--separator) 100%)` }}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Schedule */}
      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="ios-section-header">РАСПИСАНИЕ</div>
        <div className="ios-grouped-list mb-6">
          <div className="ios-list-item">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--warning)', opacity: 0.15 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--warning)">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-[17px]" style={{ color: 'var(--text-primary)' }}>День начинается</span>
              </div>
              <span className="text-[17px] font-semibold" style={{ color: 'var(--accent)' }}>{store.hDay}:00</span>
            </div>
            <input
              type="range" min={4} max={12} step={1}
              value={store.hDay}
              onChange={(e) => store.setHDay(Number(e.target.value))}
              className="w-full"
              style={{ background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((store.hDay - 4) / 8) * 100}%, var(--separator) ${((store.hDay - 4) / 8) * 100}%, var(--separator) 100%)` }}
            />
          </div>

          <div className="ios-list-item">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--info)', opacity: 0.15 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--info)">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                </div>
                <span className="text-[17px]" style={{ color: 'var(--text-primary)' }}>Ночь начинается</span>
              </div>
              <span className="text-[17px] font-semibold" style={{ color: 'var(--accent)' }}>{store.hNight}:00</span>
            </div>
            <input
              type="range" min={18} max={24} step={1}
              value={store.hNight}
              onChange={(e) => store.setHNight(Number(e.target.value))}
              className="w-full"
              style={{ background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((store.hNight - 18) / 6) * 100}%, var(--separator) ${((store.hNight - 18) / 6) * 100}%, var(--separator) 100%)` }}
            />
          </div>
        </div>
      </div>

      {/* Section 3: Mode */}
      <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <div className="ios-section-header">РЕЖИМ</div>
        <div className="ios-grouped-list mb-6 p-4">
          {/* Segmented Control */}
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--separator)' }}>
            {([
              { id: 'eco' as const, label: 'Эконом' },
              { id: 'normal' as const, label: 'Норма' },
              { id: 'boost' as const, label: 'Турбо' },
            ]).map((m) => (
              <button
                key={m.id}
                onClick={() => store.setMode(m.id)}
                className={`flex-1 py-2.5 text-[13px] font-medium transition-all ${
                  store.mode === m.id
                    ? 'text-white'
                    : ''
                }`}
                style={{
                  backgroundColor: store.mode === m.id ? 'var(--accent)' : 'transparent',
                  color: store.mode === m.id ? 'white' : 'var(--text-primary)',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Air Limits */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="ios-section-header">ЛИМИТЫ ВОЗДУХА</div>
        <div className="ios-grouped-list mb-6">
          <div className="ios-list-item">
            <div className="flex items-center justify-between">
              <span className="text-[17px]" style={{ color: 'var(--text-primary)' }}>Днём</span>
              <div className="flex items-center gap-2">
                <input
                  type="number" min={15} max={30}
                  value={store.airDay}
                  onChange={(e) => store.setAirDay(Number(e.target.value))}
                  className="w-16 text-right text-[17px] font-semibold bg-transparent outline-none"
                  style={{ color: 'var(--accent)' }}
                />
                <span className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>°C</span>
              </div>
            </div>
          </div>
          <div className="ios-list-item">
            <div className="flex items-center justify-between">
              <span className="text-[17px]" style={{ color: 'var(--text-primary)' }}>Ночью</span>
              <div className="flex items-center gap-2">
                <input
                  type="number" min={10} max={25}
                  value={store.airNight}
                  onChange={(e) => store.setAirNight(Number(e.target.value))}
                  className="w-16 text-right text-[17px] font-semibold bg-transparent outline-none"
                  style={{ color: 'var(--accent)' }}
                />
                <span className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
        <button
          onClick={handleSave}
          className={`ios-button transition-all ${saved ? 'scale-95' : ''}`}
          style={{ backgroundColor: saved ? 'var(--success)' : 'var(--accent)' }}
        >
          {saved ? '✓ Сохранено в EEPROM' : 'Сохранить'}
        </button>
        <div className="text-center mt-2 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          Настройки будут отправлены на устройство
        </div>
      </div>
    </div>
  );
}
