import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface SensorData {
  airTemp: number;
  floorTemp: number;
  ldr: number;
  relayOn: boolean;
  tDay: number;
  tNight: number;
  tLight: number;
  hDay: number;
  hNight: number;
  airDay: number;
  airNight: number;
  mode: 'normal' | 'eco' | 'boost';
  todayKwh: number;
  monthKwh: number;
  predictEnabled: boolean;
  warmupMinutes: number;
  nextStart: string;
  history: number[];
  time: string;
  day: number;
}

interface AppContextType extends SensorData {
  connected: boolean;
  deviceName: string;
  deviceMac: string;
  connecting: boolean;
  setConnected: (v: boolean) => void;
  setDeviceName: (v: string) => void;
  setDeviceMac: (v: string) => void;
  setConnecting: (v: boolean) => void;
  setTDay: (v: number) => void;
  setTNight: (v: number) => void;
  setTLight: (v: number) => void;
  setHDay: (v: number) => void;
  setHNight: (v: number) => void;
  setAirDay: (v: number) => void;
  setAirNight: (v: number) => void;
  setMode: (v: 'normal' | 'eco' | 'boost') => void;
  setWarmupMinutes: (v: number) => void;
  setPredictEnabled: (v: boolean) => void;
  toggleRelay: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

function calculateNextStart(history: number[], tDay: number, hDay: number, warmup: number, enabled: boolean): string {
  if (!enabled || history.length < 3) {
    return `${String(hDay).padStart(2, '0')}:00`;
  }
  const last3 = history.slice(-3);
  const avg = last3.reduce((a, b) => a + b, 0) / last3.length;
  let startMinutes = hDay * 60;
  if (avg < tDay - 2) {
    startMinutes -= warmup;
  }
  if (startMinutes < 0) startMinutes = 0;
  const h = Math.floor(startMinutes / 60);
  const m = startMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceMac, setDeviceMac] = useState('');

  const [airTemp, setAirTemp] = useState(22.5);
  const [floorTemp, setFloorTemp] = useState(24.1);
  const [ldr, setLdr] = useState(850);
  const [relayOn, setRelayOn] = useState(true);
  const [tDay, setTDay] = useState(24);
  const [tNight, setTNight] = useState(18);
  const [tLight, setTLight] = useState(20);
  const [hDay, setHDay] = useState(7);
  const [hNight, setHNight] = useState(23);
  const [airDay, setAirDay] = useState(22);
  const [airNight, setAirNight] = useState(18);
  const [mode, setMode] = useState<'normal' | 'eco' | 'boost'>('normal');
  const [todayKwh, setTodayKwh] = useState(1.25);
  const [monthKwh, setMonthKwh] = useState(45.10);
  const [predictEnabled, setPredictEnabled] = useState(true);
  const [warmupMinutes, setWarmupMinutes] = useState(40);
  const [history, setHistory] = useState<number[]>([14, 15, 13, 16, 15, 12, 14]);
  const [time, setTime] = useState('09:41');
  const [day, setDay] = useState(2);

  const nextStart = calculateNextStart(history, tDay, hDay, warmupMinutes, predictEnabled);

  // Simulate sensor data updates
  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(() => {
      setAirTemp(prev => +(prev + (Math.random() - 0.5) * 0.4).toFixed(1));
      setFloorTemp(prev => {
        const newTemp = +(prev + (Math.random() - 0.5) * 0.3).toFixed(1);
        return Math.max(10, Math.min(40, newTemp));
      });
      setLdr(prev => Math.max(50, Math.min(1023, prev + Math.floor((Math.random() - 0.5) * 80))));
      setTodayKwh(prev => +(prev + Math.random() * 0.01).toFixed(2));
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    }, 2000);
    return () => clearInterval(interval);
  }, [connected]);

  // Relay logic
  useEffect(() => {
    if (floorTemp < tDay - 1) setRelayOn(true);
    else if (floorTemp > tDay + 0.5) setRelayOn(false);
  }, [floorTemp, tDay]);

  const toggleRelay = useCallback(() => setRelayOn(prev => !prev), []);

  const value: AppContextType = {
    connected, deviceName, deviceMac, connecting,
    airTemp, floorTemp, ldr, relayOn,
    tDay, tNight, tLight, hDay, hNight,
    airDay, airNight, mode,
    todayKwh, monthKwh,
    predictEnabled, warmupMinutes, nextStart, history,
    time, day,
    setConnected, setDeviceName, setDeviceMac, setConnecting,
    setTDay, setTNight, setTLight,
    setHDay, setHNight,
    setAirDay, setAirNight,
    setMode, setWarmupMinutes, setPredictEnabled,
    toggleRelay,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}
