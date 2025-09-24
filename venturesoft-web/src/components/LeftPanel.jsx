import React from "react";

const LeftPanel = () => {
  const links = [
    { title: "HRMS", url: "https://venturesofttechhr.stratemis.com/" },
    { title: "IRONCLOUD", url: "https://venturesoft.ai/solutions/comprehensive-it-security-and-compliance-platform/" },
    { title: "Venturesoft Corporate", url: "https://venturesoft.ai/" },
    { title: "Services", url: "https://venturesoft.ai/services" },
  ];

  return (
    <div className="left-panel">
      <h3>Navigation</h3>
      {links.map((link, index) => (
        <div key={index} className="nav-item">
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {link.title}
          </a>
        </div>
      ))}
    </div>
  );
};

export default LeftPanel;
