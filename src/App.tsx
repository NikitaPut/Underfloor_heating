import { useState, useEffect } from 'react';
import { AppProvider, useAppStore } from './store/appStore';
import DashboardScreen from './screens/DashboardScreen';
import PredictionScreen from './screens/PredictionScreen';
import SettingsScreen from './screens/SettingsScreen';
import ConnectionScreen from './screens/ConnectionScreen';

type Screen = 'dashboard' | 'prediction' | 'settings' | 'connection';

function AppContent() {
  const [screen, setScreen] = useState<Screen>('connection');
  const store = useAppStore();

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    updateTheme(mediaQuery);
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, []);

  // Auto-connect if MAC saved
  useEffect(() => {
    const savedMac = localStorage.getItem('sf_mac');
    const savedName = localStorage.getItem('sf_name');
    if (savedMac) {
      store.setConnected(true);
      store.setDeviceName(savedName || 'HC-05');
      store.setDeviceMac(savedMac);
      setScreen('dashboard');
    }
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard': return <DashboardScreen />;
      case 'prediction': return <PredictionScreen />;
      case 'settings': return <SettingsScreen />;
      case 'connection': return <ConnectionScreen onConnected={() => setScreen('dashboard')} />;
      default: return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-grouped)' }}>
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-0 sm:h-[860px] sm:rounded-[3rem] sm:border-[6px] sm:border-gray-800 sm:shadow-2xl overflow-hidden flex flex-col relative" style={{ backgroundColor: 'var(--bg-grouped)' }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1 shrink-0" style={{ color: 'var(--text-primary)' }}>
          <span className="text-xs font-semibold">9:41</span>
          <div className="flex items-center gap-1.5">
            {store.connected && (
              <>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--success)' }} />
                <span className="text-[10px] font-medium" style={{ color: 'var(--success)' }}>BLE</span>
              </>
            )}
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" opacity="0.8">
              <path d="M12 3C7.46 3 3.34 4.78.29 7.67l1.41 1.41C4.02 6.78 7.74 5 12 5s7.98 1.78 10.3 4.08l1.41-1.41C20.66 4.78 16.54 3 12 3zm0 4c-3.3 0-6.28 1.36-8.45 3.55l1.41 1.41C6.84 10.09 9.27 9 12 9s5.16 1.09 7.04 2.96l1.41-1.41C18.28 8.36 15.3 7 12 7z"/>
            </svg>
            <svg className="w-6 h-3" fill="currentColor" viewBox="0 0 28 14" opacity="0.8">
              <rect x="0.5" y="0.5" width="22" height="13" rx="2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4"/>
              <rect x="2" y="2" width="16" height="9" rx="1" fill="currentColor" opacity="0.7"/>
              <rect x="24" y="4" width="2.5" height="5" rx="1" fill="currentColor" opacity="0.4"/>
            </svg>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {renderScreen()}
        </div>

        {/* iOS Tab Bar */}
        {store.connected && (
          <div className="shrink-0 border-t px-2 pb-6 pt-2" style={{ 
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--separator)',
            backdropFilter: 'blur(20px)',
          }}>
            <div className="flex items-center justify-around">
              {([
                { id: 'dashboard' as Screen, label: 'Главная', icon: 'house', activeIcon: 'house-fill' },
                { id: 'prediction' as Screen, label: 'Прогноз', icon: 'chart', activeIcon: 'chart-fill' },
                { id: 'settings' as Screen, label: 'Настройки', icon: 'gear', activeIcon: 'gear-fill' },
                { id: 'connection' as Screen, label: 'Связь', icon: 'bluetooth', activeIcon: 'bluetooth' },
              ]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setScreen(tab.id)}
                  className="flex flex-col items-center gap-1 px-3 py-1 transition-all active:scale-95"
                >
                  <TabIcon name={screen === tab.id ? tab.activeIcon : tab.icon} active={screen === tab.id} />
                  <span className="text-[10px] font-medium" style={{ 
                    color: screen === tab.id ? 'var(--accent)' : 'var(--text-secondary)' 
                  }}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// SF Symbols-style icons (SVG)
function TabIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? 'var(--accent)' : 'var(--text-secondary)';
  const size = 24;
  
  const icons: Record<string, JSX.Element> = {
    'house': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    'house-fill': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
    ),
    'chart': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    'chart-fill': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <rect x="4" y="12" width="4" height="8" rx="1"/>
        <rect x="10" y="4" width="4" height="16" rx="1"/>
        <rect x="16" y="8" width="4" height="12" rx="1"/>
      </svg>
    ),
    'gear': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    'gear-fill': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    'bluetooth': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>
      </svg>
    ),
  };

  return icons[name] || null;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
