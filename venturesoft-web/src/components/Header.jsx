import { useEffect, useState } from "react";
import logo from "../assets/VST-Logo.png"; // adjust path to your logo file

function Header() {
  const [dateTime, setDateTime] = useState(new Date());
  const [location, setLocation] = useState("Fetching...");

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const town = data?.address?.town || data?.address?.city || data?.address?.village || "";
          const state = data?.address?.state || "";
          if (town && state) {
            setLocation(`${town}, ${state}`);
          } else {
            setLocation(town || state || "Unknown");
          }
        } catch (err) {
          setLocation("Location unavailable");
        }
      });
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  return (
    <header className="header">
      {/* Left side - Logo */}
      <div className="logo">
        <img src={logo} alt="VentureSoft Logo" />
      </div>

      {/* Right side - Info */}
      <div className="header-info">
        <span>{location}</span>
        <span>{dateTime.toLocaleDateString()}</span>
        <span>{dateTime.toLocaleTimeString()}</span>
      </div>
    </header>
  );
}

export default Header;
