import { useState } from 'react';
import { useAppStore } from '../store/appStore';

interface Props {
  onConnected: () => void;
}

const MOCK_DEVICES = [
  { name: 'HC-05', mac: '00:14:03:06:1A:2B', rssi: -45 },
  { name: 'TeplyPol', mac: '00:14:03:06:2C:3D', rssi: -62 },
  { name: 'HC-06', mac: '00:14:03:06:4E:5F', rssi: -78 },
];

export default function ConnectionScreen({ onConnected }: Props) {
  const store = useAppStore();
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<typeof MOCK_DEVICES>([]);
  const [connectingTo, setConnectingTo] = useState<string | null>(null);

  const startScan = () => {
    setScanning(true);
    setDevices([]);
    
    setTimeout(() => setDevices([MOCK_DEVICES[0]]), 800);
    setTimeout(() => setDevices([MOCK_DEVICES[0], MOCK_DEVICES[1]]), 1500);
    setTimeout(() => {
      setDevices(MOCK_DEVICES);
      setScanning(false);
    }, 2500);
  };

  const connectToDevice = (device: typeof MOCK_DEVICES[0]) => {
    setConnectingTo(device.mac);
    
    setTimeout(() => {
      store.setConnected(true);
      store.setDeviceName(device.name);
      store.setDeviceMac(device.mac);
      localStorage.setItem('sf_mac', device.mac);
      localStorage.setItem('sf_name', device.name);
      setConnectingTo(null);
      onConnected();
    }, 2000);
  };

  const disconnect = () => {
    store.setConnected(false);
    store.setDeviceName('');
    store.setDeviceMac('');
    localStorage.removeItem('sf_mac');
    localStorage.removeItem('sf_name');
    setDevices([]);
  };

  const getRssiBars = (rssi: number) => {
    if (rssi > -50) return 4;
    if (rssi > -65) return 3;
    if (rssi > -75) return 2;
    return 1;
  };

  return (
    <div className="px-4 py-6 animate-fade-in">
      {/* Large Title */}
      <h1 className="text-[34px] font-bold mb-6 px-1" style={{ color: 'var(--text-primary)' }}>
        Устройство
      </h1>

      {/* Connection Status Card */}
      {store.connected && (
        <div className="ios-card p-5 mb-4 animate-scale-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" 
              style={{ backgroundColor: 'var(--success)', opacity: 0.15 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-[20px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {store.deviceName}
              </div>
              <div className="text-[13px]" style={{ color: 'var(--success)' }}>
                Подключено
              </div>
            </div>
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--success)' }} />
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-grouped)' }}>
              <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Сигнал</div>
              <div className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>Отличный</div>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-grouped)' }}>
              <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Скорость</div>
              <div className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>9600</div>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-grouped)' }}>
              <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Пинг</div>
              <div className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>12 мс</div>
            </div>
          </div>

          <button
            onClick={disconnect}
            className="w-full py-3 rounded-xl text-[17px] font-semibold transition-all active:scale-[0.98]"
            style={{ backgroundColor: 'var(--danger)', color: 'white' }}
          >
            Отключить
          </button>
        </div>
      )}

      {/* Scan Button */}
      {!store.connected && (
        <button
          onClick={startScan}
          disabled={scanning}
          className="ios-button mb-6 animate-scale-in"
          style={{ opacity: scanning ? 0.7 : 1 }}
        >
          {scanning ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Поиск устройств...
            </span>
          ) : (
            'Найти устройство'
          )}
        </button>
      )}

      {/* Device List */}
      {devices.length > 0 && !store.connected && (
        <div className="animate-slide-up">
          <div className="ios-section-header">НАЙДЕНО УСТРОЙСТВ: {devices.length}</div>
          <div className="ios-grouped-list">
            {devices.map((device) => (
              <button
                key={device.mac}
                onClick={() => connectToDevice(device)}
                disabled={connectingTo !== null}
                className="ios-list-item w-full text-left active:opacity-70 transition-opacity"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                      style={{ backgroundColor: 'var(--accent)', opacity: 0.15 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[17px] font-medium" style={{ color: 'var(--text-primary)' }}>
                        {device.name}
                      </div>
                      <div className="text-[13px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                        {device.mac}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Signal strength */}
                    <div className="flex items-end gap-0.5 h-4">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className="w-1 rounded-full"
                          style={{ 
                            height: `${bar * 25}%`,
                            backgroundColor: bar <= getRssiBars(device.rssi) ? 'var(--success)' : 'var(--separator)'
                          }}
                        />
                      ))}
                    </div>
                    {connectingTo === device.mac ? (
                      <svg className="w-5 h-5 animate-spin" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    )}
                  </div>
                </div>
                {connectingTo === device.mac && (
                  <div className="mt-2 text-[13px]" style={{ color: 'var(--accent)' }}>
                    Подключение...
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!store.connected && devices.length === 0 && !scanning && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" 
            style={{ backgroundColor: 'var(--separator)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>
            </svg>
          </div>
          <div className="text-[17px] font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Нет подключения
          </div>
          <div className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Нажмите «Найти устройство» для поиска<br/>Bluetooth-модулей HC-05/HC-06
          </div>
        </div>
      )}

      {/* Auto-reconnect hint */}
      {store.connected && (
        <div className="text-center mt-4 animate-fade-in">
          <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            ✅ Автосохранение активно. При следующем запуске<br/>подключение произойдёт автоматически.
          </div>
        </div>
      )}
    </div>
  );
}
