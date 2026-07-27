import React, { useState, useEffect } from 'react';
import { Globe, Clock } from 'lucide-react';

interface Timezone {
  name: string;
  identifier: string;
  offset: number;
}

interface ClockTime {
  timezone: string;
  time: string;
  date: string;
  offset: string;
}

const MultiTimezoneClock: React.FC = () => {
  const [times, setTimes] = useState<ClockTime[]>([]);
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>([
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney',
  ]);

  const availableTimezones: Timezone[] = [
    { name: 'New York (EST)', identifier: 'America/New_York', offset: -5 },
    { name: 'Los Angeles (PST)', identifier: 'America/Los_Angeles', offset: -8 },
    { name: 'Chicago (CST)', identifier: 'America/Chicago', offset: -6 },
    { name: 'London (GMT)', identifier: 'Europe/London', offset: 0 },
    { name: 'Paris (CET)', identifier: 'Europe/Paris', offset: 1 },
    { name: 'Dubai (GST)', identifier: 'Asia/Dubai', offset: 4 },
    { name: 'Tokyo (JST)', identifier: 'Asia/Tokyo', offset: 9 },
    { name: 'Sydney (AEDT)', identifier: 'Australia/Sydney', offset: 11 },
    { name: 'Hong Kong (HKT)', identifier: 'Asia/Hong_Kong', offset: 8 },
    { name: 'Singapore (SGT)', identifier: 'Asia/Singapore', offset: 8 },
    { name: 'Bangkok (ICT)', identifier: 'Asia/Bangkok', offset: 7 },
    { name: 'Mumbai (IST)', identifier: 'Asia/Kolkata', offset: 5.5 },
    { name: 'São Paulo (BRT)', identifier: 'America/Sao_Paulo', offset: -3 },
    { name: 'Mexico City (CST)', identifier: 'America/Mexico_City', offset: -6 },
    { name: 'Toronto (EST)', identifier: 'America/Toronto', offset: -5 },
  ];

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();

      const updatedTimes = selectedTimezones.map((tzIdentifier) => {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tzIdentifier,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });

        const dateFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tzIdentifier,
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        });

        const time = formatter.format(now);
        const date = dateFormatter.format(now);

        // Calculate UTC offset
        const utcTime = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzTime = new Date(now.toLocaleString('en-US', { timeZone: tzIdentifier }));
        const offsetMs = tzTime.getTime() - utcTime.getTime();
        const offsetHours = offsetMs / (1000 * 60 * 60);
        const sign = offsetHours >= 0 ? '+' : '';
        const offset = `UTC ${sign}${offsetHours.toFixed(1)}`;

        const tzLabel = availableTimezones.find((tz) => tz.identifier === tzIdentifier)?.name || tzIdentifier;

        return {
          timezone: tzLabel,
          time,
          date,
          offset,
        };
      });

      setTimes(updatedTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [selectedTimezones]);

  const toggleTimezone = (tzIdentifier: string) => {
    setSelectedTimezones((prev) =>
      prev.includes(tzIdentifier)
        ? prev.filter((tz) => tz !== tzIdentifier)
        : [...prev, tzIdentifier]
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Clock className="text-blue-600" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Global Time Zones</h2>
          <p className="text-gray-600">Real-time clock for different time zones</p>
        </div>
      </div>

      {/* Main Clock Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {times.map((item, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-lg p-6 shadow-xl border border-gray-700 hover:border-blue-500 transition"
          >
            {/* Timezone Name */}
            <p className="text-sm font-medium text-gray-400 mb-2">{item.timezone}</p>

            {/* Time Display */}
            <div className="text-center mb-4">
              <div className="text-4xl font-mono font-bold text-blue-400 tracking-wider">
                {item.time}
              </div>
              <div className="text-xs text-gray-400 mt-2">{item.date}</div>
            </div>

            {/* UTC Offset */}
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 border-t border-gray-700 pt-3">
              <Globe size={14} />
              <span>{item.offset}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Timezone Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time Zones</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableTimezones.map((tz) => (
            <label
              key={tz.identifier}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
            >
              <input
                type="checkbox"
                checked={selectedTimezones.includes(tz.identifier)}
                onChange={() => toggleTimezone(tz.identifier)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{tz.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          🕐 <strong>Currently tracking {selectedTimezones.length} time zones</strong> - Updates every second
        </p>
      </div>
    </div>
  );
};

export default MultiTimezoneClock;
