import { Link, useParams } from 'react-router-dom';

const events = [
  {
    id: 'soccer-practice',
    title: 'Soccer Practice',
    dateTime: 'September 14, 2026 at 18:30',
    location: 'City Park Field A',
    group: 'Parent Soccer Club',
    rideStatus: 'Carpool planning needed',
    passengerCount: '4 confirmed passengers',
    driverStatus: 'Driver not assigned',
    pickupNotes: 'Confirm two pickup locations before the event day.',
  },
  {
    id: 'hockey-game',
    title: 'Hockey Game',
    dateTime: 'September 15, 2026 at 19:00',
    location: 'Convention Centre Arena 3',
    group: 'Parent Hockey Association',
    rideStatus: 'Driver assignment required',
    passengerCount: '8 expected passengers',
    driverStatus: 'Main driver confirmed, backup driver needed',
    pickupNotes: 'Coordinate equipment space and pickup order.',
  },
  {
    id: 'school-field-trip',
    title: 'School Field Trip',
    dateTime: 'September 22, 2026 at 14:30',
    location: 'City Square Museum',
    group: 'Parent School Board',
    rideStatus: 'Pickup coordination needed',
    passengerCount: '6 families confirmed',
    driverStatus: 'Drivers to be confirmed',
    pickupNotes: 'Arrange staggered pickup times and confirm final passenger count.',
  },
];

const pageStyle = { maxWidth: '850px', margin: '0 auto', padding: '32px 20px', fontFamily: 'Arial, sans-serif' } as const;
const cardStyle = { border: '1px solid #d7dce3', borderRadius: '12px', padding: '22px', background: '#ffffff', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)' } as const;
const rowStyle = { margin: '10px 0', color: '#1f2937' } as const;
const labelStyle = { fontWeight: 700 } as const;
const backLinkStyle = { display: 'inline-block', marginBottom: '18px', color: '#2563eb', fontWeight: 700 } as const;
const rideBoxStyle = { marginTop: '18px', padding: '14px', borderRadius: '10px', background: '#eef6ff', border: '1px solid #cfe3ff' } as const;

const EventsDetailPage = () => {
  const { eventId } = useParams();
  const event = events.find((item) => item.id === eventId) ?? events[0];

  return (
    <main style={pageStyle}>
      <Link to="/events" style={backLinkStyle}>Back to Events</Link>
      <section style={cardStyle}>
        <h1>{event.title}</h1>
        <p style={rowStyle}><span style={labelStyle}>Date/Time:</span> {event.dateTime}</p>
        <p style={rowStyle}><span style={labelStyle}>Location:</span> {event.location}</p>
        <p style={rowStyle}><span style={labelStyle}>Organization/Team/Group:</span> {event.group}</p>
        <div style={rideBoxStyle}>
          <h2>Ride Planning</h2>
          <p style={rowStyle}><span style={labelStyle}>Ride Status:</span> {event.rideStatus}</p>
          <p style={rowStyle}><span style={labelStyle}>Passenger Count:</span> {event.passengerCount}</p>
          <p style={rowStyle}><span style={labelStyle}>Driver Status:</span> {event.driverStatus}</p>
          <p style={rowStyle}><span style={labelStyle}>Pickup Notes:</span> {event.pickupNotes}</p>
        </div>
      </section>
    </main>
  );
};

export default EventsDetailPage;
