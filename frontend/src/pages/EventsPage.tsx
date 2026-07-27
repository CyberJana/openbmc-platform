import { useEffect, useState } from 'react';
import { eventService } from '../services/eventService';
import { EventRecord } from '../types';

const DEFAULT_SYSTEM_ID = 1;

function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);

  useEffect(() => {
    eventService.list(DEFAULT_SYSTEM_ID).then((response) => setEvents(response.events));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Events</h2>
      <div className="rounded border bg-white p-4 dark:bg-slate-900 dark:border-slate-700">
        <ul className="space-y-2">
          {events.map((event, index) => (
            <li key={event.id ?? index} className="text-sm border-b pb-2 last:border-0">
              <strong>{event.severity ?? 'INFO'}:</strong> {event.message ?? 'No message'}
            </li>
          ))}
          {events.length === 0 ? <li className="text-sm text-slate-500">No events returned.</li> : null}
        </ul>
      </div>
    </div>
  );
}

export default EventsPage;
