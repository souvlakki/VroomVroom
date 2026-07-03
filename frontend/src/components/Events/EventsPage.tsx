
const EventsPage = () => {
  const events = [
    {
      title: "Soccer Practice",
      date: new Date("2023-10-05T14:00:00Z"),
      time: "14:00",
      location: "City Park",
      organization: "Parent Soccer Club",
      status: "Upcoming",
      hint: "Join us for an exciting soccer practice!",
      urgency: "Upcoming"
    },
    {
      title: "Hockey Game",
      date: new Date("2023-10-10T15:00:00Z"),
      time: "15:00",
      location: "Convention Center",
      organization: "Parent Hockey Association",
      status: "Upcoming",
      hint: "Watch your child play in a thrilling hockey game!",
      urgency: "Tomorrow"
    },
    {
      title: "School Field Trip",
      date: new Date("2023-10-15T16:00:00Z"),
      time: "16:00",
      location: "City Square",
      organization: "Parent School Board",
      status: "Upcoming",
      hint: "Enjoy a day of fun and learning with your child!",
      urgency: "Today"
    }
  ];

  return (
    <div className="events-page">
      <h1>Upcoming Events</h1>
      <ul>
        {events.map((event, index) => (
          <li key={index} className="event-item">
            <h2>{event.title}</h2>
            <p>Date: {event.date.toLocaleDateString()} at {event.time}</p>
            <p>Location: {event.location}</p>
            <p>Organization/Team/Group: {event.organization}</p>
            <span className={`status-badge ${event.status.toLowerCase()}`}>{event.status}</span>
            <p>Hint: {event.hint}</p>
            <p style={{ color: event.urgency === 'Today' ? 'red' : (event.urgency === 'Tomorrow' ? 'orange' : 'green') }}>
              Urgency: {event.urgency}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsPage;
