import { useAppStore } from '../store/appStore';

export default function DashboardScreen() {
  const store = useAppStore();

  // Determine gradient based on floor temperature
  const getTempGradient = (temp: number) => {
    if (temp < 18) return 'temp-cold';
    if (temp > 26) return 'temp-hot';
    return 'temp-normal';
  };

  return (
    <div className="px-4 py-6 animate-fade-in">
      {/* Large Title */}
      <h1 className="text-[34px] font-bold mb-6 px-1" style={{ color: 'var(--text-primary)' }}>
        Тёплый пол
      </h1>

      {/* Hero Temperature Card */}
      <div className={`${getTempGradient(store.floorTemp)} rounded-[20px] p-6 mb-4 shadow-lg animate-scale-in`}
        style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' }}>
        <div className="flex items-start justify-between mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          {store.relayOn && (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" className="animate-pulse">
              <path d="M8.5 14.5V17a3.5 3.5 0 0 0 7 0v-2.5c1.5-1 2.5-2.5 2.5-4.5 0-3-2-5-4-7-2 2-4 4-4 7 0 2 1 3.5 2.5 4.5z"/>
            </svg>
          )}
        </div>
        
        <div className="text-center">
          <div className="text-[80px] font-thin text-white leading-none tracking-tight">
            {store.floorTemp.toFixed(1)}°
          </div>
          <div className="text-[17px] text-white/90 mt-2 font-medium">
            Температура пола
          </div>
        </div>
      </div>

      {/* 2x2 Grid Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Air Temperature */}
        <div className="ios-card p-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--info)', opacity: 0.2 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--info)">
                <path d="M12 2a3 3 0 0 0-3 3v7.07A5 5 0 0 0 12 22a5 5 0 0 0 3-9.93V5a3 3 0 0 0-3-3z"/>
              </svg>
            </div>
            <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>Воздух</span>
          </div>
          <div className="text-[28px] font-bold" style={{ color: 'var(--text-primary)' }}>
            {store.airTemp.toFixed(1)}°
          </div>
        </div>

        {/* Light */}
        <div className="ios-card p-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--warning)', opacity: 0.2 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--warning)">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="21" x2="12" y2="23" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="1" y1="12" x2="3" y2="12" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="21" y1="12" x2="23" y2="12" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>Свет</span>
          </div>
          <div className="text-[28px] font-bold" style={{ color: 'var(--text-primary)' }}>
            {store.ldr}
          </div>
        </div>

        {/* Energy Today */}
        <div className="ios-card p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--success)', opacity: 0.2 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--success)">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>Сегодня</span>
          </div>
          <div className="text-[28px] font-bold" style={{ color: 'var(--text-primary)' }}>
            {store.todayKwh.toFixed(2)}
          </div>
          <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>кВт·ч</div>
        </div>

        {/* Energy Month */}
        <div className="ios-card p-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent)', opacity: 0.2 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>Месяц</span>
          </div>
          <div className="text-[28px] font-bold" style={{ color: 'var(--text-primary)' }}>
            {store.monthKwh.toFixed(1)}
          </div>
          <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>кВт·ч</div>
        </div>
      </div>

      {/* Relay Switch Card */}
      <div className="ios-card p-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" 
              style={{ backgroundColor: store.relayOn ? 'var(--danger)' : 'var(--separator)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M8.5 14.5V17a3.5 3.5 0 0 0 7 0v-2.5c1.5-1 2.5-2.5 2.5-4.5 0-3-2-5-4-7-2 2-4 4-4 7 0 2 1 3.5 2.5 4.5z"/>
              </svg>
            </div>
            <div>
              <div className="text-[17px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                Нагрев
              </div>
              <div className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                {store.relayOn ? 'Включено' : 'Выключено'}
              </div>
            </div>
          </div>
          <button
            onClick={store.toggleRelay}
            className={`ios-switch ${store.relayOn ? 'active' : ''}`}
          >
            <div className="ios-switch-thumb" />
          </button>
        </div>
      </div>
    </div>
  );
}
