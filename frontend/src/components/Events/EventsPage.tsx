const EventsPage = () => {
  const events = [
    {
      title: "Soccer Practice",
      date: new Date("2024-12-15T18:30:00Z"),
      time: "18:30",
      location: "City Park Field A",
      organization: "Parent Soccer Club",
      status: "Upcoming",
      hint: "Carpool planning needed - 4 passengers confirmed, need 2 more drivers for pickup coordination.",
      urgency: "Today"
    },
    {
      title: "Hockey Game",
      date: new Date("2025-01-08T19:00:00Z"),
      time: "19:00",
      location: "Convention Center Arena 3",
      organization: "Parent Hockey Association",
      status: "Upcoming",
      hint: "Driver assignment required - main driver confirmed, need backup for passenger count of 8.",
      urgency: "Tomorrow"
    },
    {
      title: "School Field Trip",
      date: new Date("2025-01-20T14:30:00Z"),
      time: "14:30",
      location: "City Square Museum",
      organization: "Parent School Board",
      status: "Upcoming",
      hint: "Pickup coordination needed - 6 families confirmed, arrange staggered pickup times.",
      urgency: "Today"
    }
  ];

  return (
    <div className="events-page">
      <h1>Upcoming Events</h1>
      {events.map((event) => (
        <div key={event.title} style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '16px',
          backgroundColor: '#fff'
        }}>
          <h2 style={{ margin: '0 0 12px 0', color: '#333' }}>{event.title}</h2>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span 
              className={`status-badge ${event.status.toLowerCase()}`} 
              style={{ 
                backgroundColor: event.urgency === 'Today' ? '#ffcccc' : (event.urgency === 'Tomorrow' ? '#fff3cd' : '#d4edda'),
                color: event.urgency === 'Today' ? '#dc3545' : (event.urgency === 'Tomorrow' ? '#856404' : '#155724'),
                padding: '4px 12px', 
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {event.urgency}
            </span>
          </div>

          <p style={{ margin: '8px 0', color: '#666' }}>ðŸ“… Date/Time: {event.date.toLocaleDateString()} at {event.time}</p>
          
          <p style={{ margin: '8px 0', color: '#555' }}>ðŸ“ Location: {event.location}</p>
          
          <p style={{ margin: '8px 0', color: '#444' }}>ðŸ¢ Organization/Team/Group: {event.organization}</p>
          
          <div 
            style={{ 
              backgroundColor: event.status === "Upcoming" ? "#e7f3ff" : "#fff",
              padding: '12px', 
              borderRadius: '6px',
              marginTop: '8px'
            }}
          >
            <p style={{ margin: 0, color: '#0056b3', fontWeight: 'bold' }}>ðŸš— Ride Status:</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#333' }}>{event.hint}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsPage;
