import React from "react";
import { useEffect } from "react";
import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import CenterPanel from "./components/CenterPanel"; // updated
import RightPanel from "./components/RightPanel";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import "./App.css";

function App() {
  useEffect(() => {
  fetch("http://localhost:5000/api/hello")
    .then(res => res.json())
    .then(data => console.log(data));
}, []);

  return (
    <>
      <header className="header">
        <Header />
      </header>

      <div className="app-container">
        <aside className="left-panel">
          <LeftPanel />
        </aside>
        <main className="center-panel">
          <CenterPanel /> {/* updated */}
        </main>
        <aside className="right-panel">
          <RightPanel />
        </aside>
        
        <footer className="footer">
          <Footer />
        </footer>
      </div>

      <BackToTop />
    </>
  );
}

export default App;
