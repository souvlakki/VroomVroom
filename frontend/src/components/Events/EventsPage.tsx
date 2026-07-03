// src/components/Events/EventsPage.tsx


const EventsPage = () => {
  const events = [
    {
      title: "VroomVroom Race",
      date: new Date("2023-10-05T14:00:00Z"),
      time: "14:00",
      location: "City Park",
      team: "Red Team",
      status: "Upcoming",
      hint: "Join us for an exciting race!"
    },
    {
      title: "VroomVroom Workshop",
      date: new Date("2023-10-10T15:00:00Z"),
      time: "15:00",
      location: "Convention Center",
      team: "Blue Team",
      status: "Upcoming",
      hint: "Learn about the latest VroomVroom technology!"
    },
    {
      title: "VroomVroom Festival",
      date: new Date("2023-10-15T16:00:00Z"),
      time: "16:00",
      location: "City Square",
      team: "Green Team",
      status: "Upcoming",
      hint: "Enjoy a day of fun and games!"
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
            <p>Team/Group: {event.team}</p>
            <p>Status: {event.status}</p>
            <p>Hint: {event.hint}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsPage;
