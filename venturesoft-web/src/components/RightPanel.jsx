import React, { useEffect, useState } from "react";

const RightPanel = () => {
  const policies = [
    { title: "Privacy Policy", content: `1. Introduction\nVentureSoft.ai is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information.\n\n2. Information We Collect\nWe collect:\nPersonal Information: Name, email, phone number, and other details provided during service interactions.\nUsage Data: IP address, browser type, and pages visited.\n\n3. How We Use Information\nWe use your information to:\nProvide and improve our services.\nCommunicate updates, promotions, or changes to our services.\nEnsure compliance with legal obligations.\n\n4. Information Sharing\nWe do not sell or rent your data. We may share it with trusted partners for operational purposes or as required by law.\n\n5. Data Security\nWe implement appropriate technical and organizational measures to protect your data. However, no online platform can guarantee absolute security.\n\n6. Cookies and Tracking\nWe use cookies to enhance user experience and analyze website traffic. You can manage your cookie preferences via browser settings.\n\n7. Third-Party Links\nOur website may contain links to external websites. We are not responsible for their privacy practices or content.\n\n8. Changes to Privacy Policy\nWe may update this Privacy Policy periodically. Continued use of our website constitutes acceptance of changes.\n\n9. Contact Us\nFor questions about this Privacy Policy, contact us at: legal@venturesoft.ai.` },
    { title: "Terms of Service", content: `1. Agreement to Terms\nWelcome to VentureSoft.ai ("Company," "we," "our," "us"). By accessing our website and services, you agree to these Terms of Service. If you do not agree, do not use our services.\n\n2. Services Offered\nVentureSoft.ai provides IT solutions and services, including but not limited to Software Development, Cloud, Data, Analytics and AI, IT Security services and solutions, ERP and CRM implementation, and Managed Services.\n\n3. User Responsibilities\nUsers agree to:\n- Provide accurate and up-to-date information when required.\n- Comply with all applicable laws and regulations.\n- Not misuse our services, including attempts to reverse-engineer, damage, or disrupt our systems.\n\n4. Intellectual Property\nAll content, including trademarks, logos, and proprietary information, is owned by VentureSoft.ai or its licensors. Unauthorized use is strictly prohibited.\n\n5. Limitation of Liability\nTo the extent permitted by law, VentureSoft.ai shall not be liable for indirect, incidental, or consequential damages arising from the use of our services.\n\n6. Changes to Terms\nWe reserve the right to update these Terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.\n\n7. Governing Law\nThese Terms shall be governed by the laws of State of California, without regard to its conflict of law principles.` },
    { title: "Code of Conduct", content: "This is the full explanation of the code of conduct..." }
  ];

  const [selectedPolicy, setSelectedPolicy] = useState(null);
  
  // Close modal with ESC key
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setSelectedPolicy(null);
    }
    if (selectedPolicy) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedPolicy]);

  return (
    <div className="right-panel">
      <h3>Company Policies</h3>
      <ul className="policy-list">
        {policies.map((policy, index) => (
          <li
            key={index}
            className="policy-item"
            onClick={() => setSelectedPolicy(policy)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setSelectedPolicy(policy);
            }}
          >
            {policy.title}
          </li>
        ))}
      </ul>

      {/* Modal pop-up for selected policy */}
      {selectedPolicy && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPolicy(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedPolicy(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 style={{ marginTop: 0 }}>{selectedPolicy.title}</h3>
            <pre className="policy-pre">{selectedPolicy.content}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
