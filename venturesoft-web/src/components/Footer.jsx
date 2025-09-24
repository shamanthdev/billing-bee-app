import React from "react";
import Logo from "../assets/VST-Logo.png";

const Footer = () => (
  <footer className="footer-content">
    <img src={Logo} alt="Venturesoft logo" className="footer-logo" />
    <p className="footer-desc">
      VentureSoft specializes in data intelligence, cloud transformation, security, ERP, and application development, delivering innovative IT solutions to clients worldwide. We proudly serve over 300 clients, from startups to Fortune 500 companies, with a steadfast commitment to their growth and success. Our success is defined by the satisfaction of our clients, employees, and partners, fostering meaningful, enduring relationships that drive lasting impact.
    </p>
    <p>Connect with us:</p>
    <div className="footer-contacts">
      <a href="https://www.linkedin.com/company/venturesoft-global/" target="_blank" rel="noreferrer" aria-label="Venturesoft Global on LinkedIn">
        LinkedIn
      </a>
      <span className="contact-sep" aria-hidden>•</span>
      <a href="tel:+19259355220" aria-label="Call Venturesoft">+1-925-935-5220</a>
      <span className="contact-sep" aria-hidden>•</span>
      <a href="mailto:hello@venturesoft.ai" aria-label="Email Venturesoft">hello@venturesoft.ai</a>
    </div>

    <details className="footer-locations">
      <summary>Locations</summary>
      <div className="footer-offices">
        <div className="office-item">
          <strong>US Office</strong>
          <span>5000 Hopyard Rd Suite 120, Pleasanton, CA 94588</span>
        </div>
        <div className="office-item">
          <strong>UAE Office</strong>
          <span>Dubai South Office Headquarters, PB 282228 – Dubai South – Dubai – United Arab Emirates</span>
        </div>
        <div className="office-item">
          <strong>Bengaluru Office</strong>
          <span>VentureSoft India PVT LTD, Novel Tech Park, 1st floor 46/4, Garvebavi Palya, Electronic City, Bengaluru – 560068</span>
          <a href="tel:+918041705135">+91 80 4170 5135</a>
        </div>
      </div>
    </details>
  </footer>
);

export default Footer;
