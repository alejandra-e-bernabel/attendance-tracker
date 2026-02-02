import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Attendance Tracker
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/classes">Classes</Link></li>
          <li><Link to="/students">Students</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/checkin">Check In</Link></li>
        </ul>
      </div>
    </nav>
  );
}
