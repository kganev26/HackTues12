import React from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate(); 
  return (
    <div className="App">

      {/* Hero / Banner */}
      <section className="hero">
        <div className="hero-content">
          <h1>Smart Plant Farm</h1>
          <p>
            A smart tool powered by AI that tells you what to do depending on humidity, temperature, water, and lighting.
          </p>
           <button className="btn-primary" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature">
          <h3>Sensors</h3>
          <p>Track soil moisture, temperature, water, and lighting in real-time.</p>
        </div>
        <div className="feature">
          <h3>Artificial Intelligence</h3>
          <p>AI analyzes your farm and provides actionable recommendations.</p>
        </div>
        <div className="feature">
          <h3>Recommendations</h3>
          <p>Personalized advice to maximize plant growth and health.</p>
        </div>
      </section>

      {/* About */}
      <section className="about">
        <div className="about-content">
          <h2>About Our Project</h2>
          <p>
            A smart tool powered by AI that helps farmers optimize plant growth based on humidity, temperature, water, and lighting conditions.
          </p>
        </div>
      </section>

      {/* Call To Action */}
      <section className="cta">
        <h2>Get Started Now</h2>
        <p>Sign up to monitor and manage your farm in real-time!</p>
        <button className="btn-secondary" onClick={() => navigate("/login")}>
          Sign Up / Login
        </button>
      </section>

      {/* Footer */}
      <footer>
        <p>GitHub: <a href="https://github.com/kganev26/HackTues12.git" target="_blank" rel="noreferrer">kganev26</a></p>
        <p>Email: <a href="mailto:kganev26@gmail.com">kganev26@gmail.com</a></p>
        <p>Phone: +359 087 919 3399</p>
      </footer>

    </div>
  );
}

export default App;