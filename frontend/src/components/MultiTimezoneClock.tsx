import { useEffect, useMemo, useState } from "react";

interface ClockTime {
  label: string;
  time: string;
  date: string;
  offset: string;
}

const DEFAULT_TIMEZONES = [
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const TIMEZONE_LABELS: Record<string, string> = {
  "America/New_York": "New York",
  "America/Los_Angeles": "Los Angeles",
  "America/Chicago": "Chicago",
  "Europe/London": "London",
  "Europe/Paris": "Paris",
  "Asia/Dubai": "Dubai",
  "Asia/Tokyo": "Tokyo",
  "Australia/Sydney": "Sydney",
  "Asia/Hong_Kong": "Hong Kong",
  "Asia/Singapore": "Singapore",
  "Asia/Bangkok": "Bangkok",
  "Asia/Kolkata": "Mumbai",
  "America/Sao_Paulo": "Sao Paulo",
  "America/Mexico_City": "Mexico City",
  "America/Toronto": "Toronto",
};

const AVAILABLE_TIMEZONES = Object.keys(TIMEZONE_LABELS);

function buildOffset(now: Date, timezone: string): string {
  const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  const offsetHours = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  const sign = offsetHours >= 0 ? "+" : "";
  return `UTC ${sign}${offsetHours.toFixed(1)}`;
}

export function MultiTimezoneClock() {
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(DEFAULT_TIMEZONES);
  const [times, setTimes] = useState<ClockTime[]>([]);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const nextTimes = selectedTimezones.map((timezone) => {
        const time = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);

        const date = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          year: "numeric",
          month: "short",
          day: "2-digit",
        }).format(now);

        return {
          label: TIMEZONE_LABELS[timezone] ?? timezone,
          time,
          date,
          offset: buildOffset(now, timezone),
        };
      });
      setTimes(nextTimes);
    };

    updateTimes();
    const interval = window.setInterval(updateTimes, 1000);
    return () => window.clearInterval(interval);
  }, [selectedTimezones]);

  const sortedTimezones = useMemo(() => [...AVAILABLE_TIMEZONES].sort(), []);

  return (
    <section className="panel">
      <div className="panel-title-row">
        <h3>Global Time Zones</h3>
        <p>Tracking {selectedTimezones.length} zones with one-second updates.</p>
      </div>
      <div className="timezone-grid">
        {times.map((item) => (
          <article key={item.label} className="timezone-card">
            <p className="timezone-name">{item.label}</p>
            <p className="timezone-time">{item.time}</p>
            <p className="timezone-date">{item.date}</p>
            <p className="timezone-offset">{item.offset}</p>
          </article>
        ))}
      </div>
      <div className="timezone-selector">
        {sortedTimezones.map((timezone) => (
          <label key={timezone} className="timezone-option">
            <input
              type="checkbox"
              checked={selectedTimezones.includes(timezone)}
              onChange={() =>
                setSelectedTimezones((prev) =>
                  prev.includes(timezone)
                    ? prev.filter((item) => item !== timezone)
                    : [...prev, timezone],
                )
              }
            />
            <span>{TIMEZONE_LABELS[timezone]}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
