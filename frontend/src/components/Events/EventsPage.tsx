import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const events = [
  {
    id: 'soccer-practice',
    title: 'Soccer Practice',
    urgency: 'Today',
    dateTime: 'September 14, 2026 at 18:30',
    location: 'City Park Field A',
    group: 'Parent Soccer Club',
    rideStatus: 'Carpool planning needed',
    rideHint: '4 passengers confirmed. Assign one driver and confirm two pickup locations.',
  },
  {
    id: 'hockey-game',
    title: 'Hockey Game',
    urgency: 'Tomorrow',
    dateTime: 'September 15, 2026 at 19:00',
    location: 'Convention Centre Arena 3',
    group: 'Parent Hockey Association',
    rideStatus: 'Driver assignment required',
    rideHint: 'Main driver confirmed. Backup driver needed for a passenger count of 8.',
  },
  {
    id: 'school-field-trip',
    title: 'School Field Trip',
    urgency: 'Upcoming',
    dateTime: 'September 22, 2026 at 14:30',
    location: 'City Square Museum',
    group: 'Parent School Board',
    rideStatus: 'Pickup coordination needed',
    rideHint: '6 families confirmed. Arrange staggered pickup times and confirm final passenger count.',
  },
];

const pageStyle = { maxWidth: '900px', margin: '0 auto', padding: '32px 20px', fontFamily: 'Arial, sans-serif' } as const;
const introStyle = { color: '#4b5563', marginBottom: '24px', lineHeight: 1.5 } as const;
const listStyle = { display: 'grid', gap: '18px' } as const;
const cardStyle = { border: '1px solid #d7dce3', borderRadius: '12px', padding: '20px', background: '#ffffff', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)', textDecoration: 'none', color: 'inherit', display: 'block' } as const;
const badgeStyle = (urgency: string) => ({ display: 'inline-block', padding: '4px 10px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, background: urgency === 'Today' ? '#ffe4e6' : urgency === 'Tomorrow' ? '#fef3c7' : '#e0f2fe', color: urgency === 'Today' ? '#be123c' : urgency === 'Tomorrow' ? '#92400e' : '#075985', marginBottom: '12px' }) as const;
const rowStyle = { margin: '7px 0', color: '#1f2937' } as const;
const labelStyle = { fontWeight: 700 } as const;
const rideBoxStyle = { marginTop: '14px', padding: '12px', borderRadius: '10px', background: '#eef6ff', border: '1px solid #cfe3ff' } as const;
const rideTitleStyle = { color: '#1d4ed8', fontWeight: 800, marginBottom: '4px' } as const;
const responseStyle = { marginTop: '12px', padding: '10px 12px', borderRadius: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontWeight: 700 } as const;
const linkHintStyle = { marginTop: '12px', color: '#2563eb', fontWeight: 700 } as const;

const EventsPage = () => {
  const [responses, setResponses] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedResponses = events.reduce<Record<string, string>>((acc, event) => {
      const saved = localStorage.getItem(`vroomvroom-event-response-${event.id}`);
      if (saved) acc[event.id] = saved;
      return acc;
    }, {});
    setResponses(savedResponses);
  }, []);

  return (
    <main style={pageStyle}>
      <h1>Upcoming Events</h1>
      <p style={introStyle}>Plan around the event first, then confirm drivers, passengers, pickup timing, and ride capacity.</p>
      <section style={listStyle}>
        {events.map((event) => (
          <Link key={event.id} to={`/events/${event.id}`} style={cardStyle}>
            <article>
              <h2>{event.title}</h2>
              <span style={badgeStyle(event.urgency)}>{event.urgency}</span>
              <p style={rowStyle}><span style={labelStyle}>Date/Time:</span> {event.dateTime}</p>
              <p style={rowStyle}><span style={labelStyle}>Location:</span> {event.location}</p>
              <p style={rowStyle}><span style={labelStyle}>Organization/Team/Group:</span> {event.group}</p>
              <div style={rideBoxStyle}>
                <div style={rideTitleStyle}>Ride Status: {event.rideStatus}</div>
                <div>{event.rideHint}</div>
              </div>
              {responses[event.id] && <div style={responseStyle}>Your Response: {responses[event.id]}</div>}
              <div style={linkHintStyle}>View event details</div>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default EventsPage;
