import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const SENSORS = [
  { id: 'dht11', label: 'DHT11', color: '#E04040' },
  { id: 'load-cell', label: 'Load Cell', color: '#4080E0' },
  { id: 'ultrasonic', label: 'Ultrasonic', color: '#40E060' },
];

const MICROCONTROLLERS = [
  { id: 'esp8266', label: 'ESP8266', color: '#E0E040' },
  { id: 'wemos-d1', label: 'Wemos D1', color: '#E040E0' },
  { id: 'arduino-uno', label: 'Arduino UNO', color: '#40E0E0' },
];

const CORRECT_PAIRS: Record<string, string> = {
  dht11: 'esp8266',
  'load-cell': 'wemos-d1',
  ultrasonic: 'arduino-uno',
};

interface ComponentConnectProps {
  onComplete: () => void;
  onClose: () => void;
}

export function ComponentConnect({ onComplete, onClose }: ComponentConnectProps) {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const handleSensorClick = useCallback((sensorId: string) => {
    if (connections[sensorId]) return;
    setSelectedSensor(sensorId);
  }, [connections]);

  const handleMCUClick = useCallback(
    (mcuId: string) => {
      if (!selectedSensor) return;
      if (Object.values(connections).includes(mcuId)) return;

      const isCorrect = CORRECT_PAIRS[selectedSensor] === mcuId;
      if (isCorrect) {
        setConnections((prev) => ({ ...prev, [selectedSensor]: mcuId }));
        setSelectedSensor(null);

        const newConnections = { ...connections, [selectedSensor]: mcuId };
        if (Object.keys(newConnections).length === SENSORS.length) {
          setResult('correct');
          setTimeout(() => onComplete(), 800);
        }
      } else {
        setResult('wrong');
        setTimeout(() => setResult('idle'), 500);
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 2) {
          setTimeout(() => setShowHint(true), 1000);
        }
      }
    },
    [selectedSensor, connections, attempts, onComplete],
  );

  function handleSkip() {
    onComplete();
  }

  function handleReset() {
    setConnections({});
    setSelectedSensor(null);
    setResult('idle');
    setShowHint(false);
  }

  const allConnected = Object.keys(connections).length === SENSORS.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h2
        style={{
          color: '#F0E040',
          fontFamily: "'Impact', sans-serif",
          fontSize: 24,
          marginBottom: 8,
        }}
      >
        Component Connect
      </h2>
      <p
        style={{
          color: '#888',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          marginBottom: 32,
        }}
      >
        Match each sensor to its correct microcontroller
      </p>

      <div
        style={{
          display: 'flex',
          gap: 60,
          alignItems: 'flex-start',
          marginBottom: 32,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3
            style={{
              color: '#F0E040',
              fontFamily: "'Impact', sans-serif",
              fontSize: 14,
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            Sensors
          </h3>
          {SENSORS.map((sensor) => {
            const connected = !!connections[sensor.id];
            return (
              <motion.div
                key={sensor.id}
                whileHover={{ scale: connected ? 1 : 1.05 }}
                onClick={() => handleSensorClick(sensor.id)}
                style={{
                  padding: '12px 24px',
                  background: selectedSensor === sensor.id ? '#2a2a4a' : '#1a1a2a',
                  border: `2px solid ${
                    connected
                      ? '#40E060'
                      : selectedSensor === sensor.id
                        ? '#F0E040'
                        : '#555'
                  }`,
                  borderRadius: 4,
                  color: '#f5f5f5',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  cursor: connected ? 'default' : 'pointer',
                  opacity: connected ? 0.6 : 1,
                  minWidth: 120,
                  textAlign: 'center',
                }}
              >
                {sensor.label}
                {connected && ' ✓'}
              </motion.div>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignSelf: 'center',
          }}
        >
          {selectedSensor && !allConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                color: '#F0E040',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              → Select a microcontroller
            </motion.div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3
            style={{
              color: '#F0E040',
              fontFamily: "'Impact', sans-serif",
              fontSize: 14,
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            Microcontrollers
          </h3>
          {MICROCONTROLLERS.map((mcu) => {
            const used = Object.values(connections).includes(mcu.id);
            return (
              <motion.div
                key={mcu.id}
                whileHover={{ scale: used ? 1 : 1.05 }}
                onClick={() => selectedSensor && !used && handleMCUClick(mcu.id)}
                style={{
                  padding: '12px 24px',
                  background: '#1a1a2a',
                  border: `2px solid ${used ? '#40E060' : '#555'}`,
                  borderRadius: 4,
                  color: '#f5f5f5',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  cursor: selectedSensor && !used ? 'pointer' : 'default',
                  opacity: used ? 0.6 : 1,
                  minWidth: 120,
                  textAlign: 'center',
                }}
              >
                {mcu.label}
                {used && ' ✓'}
              </motion.div>
            );
          })}
        </div>
      </div>

      {result === 'wrong' && (
        <p
          style={{
            color: '#E04040',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            marginBottom: 8,
          }}
        >
          Wrong connection, try again
        </p>
      )}

      {showHint && (
        <p
          style={{
            color: '#E0E040',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            marginBottom: 16,
          }}
        >
          Hint: DHT11 is temperature/humidity, Load Cell measures weight, Ultrasonic detects distance
        </p>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleReset}
          style={{
            background: 'transparent',
            border: '1px solid #555',
            color: '#888',
            padding: '8px 24px',
            borderRadius: 4,
            fontFamily: "'JetBrains Mono', monospace",
            cursor: 'pointer',
          }}
        >
          Reset
        </button>

        {showHint && (
          <button
            onClick={handleSkip}
            style={{
              background: 'transparent',
              border: '1px solid #F0E040',
              color: '#F0E040',
              padding: '8px 24px',
              borderRadius: 4,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: 'pointer',
            }}
          >
            Skip Puzzle
          </button>
        )}

        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '1px solid #555',
            color: '#888',
            padding: '8px 24px',
            borderRadius: 4,
            fontFamily: "'JetBrains Mono', monospace",
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
