document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const authView = document.getElementById('auth-view');
  const dashView = document.getElementById('dashboard-view');
  
  // Auth Elements
  const authForm = document.getElementById('auth-form');
  const authBtn = document.getElementById('auth-btn');
  const authSubtitle = document.getElementById('auth-subtitle');
  const nameGroup = document.getElementById('name-group');
  const switchLink = document.getElementById('auth-switch-link');
  const switchPrompt = document.getElementById('auth-switch-prompt');
  const errorText = document.getElementById('auth-error');
  
  // Dashboard Elements
  const greeting = document.getElementById('greeting');
  const logoutBtn = document.getElementById('logout-btn');
  const aiMessage = document.getElementById('ai-message');
  
  // Sensor Elements
  const valTemp = document.getElementById('val-temp');
  const valHum = document.getElementById('val-hum');
  const valSoil = document.getElementById('val-soil');
  const valWater = document.getElementById('val-water');

  // --- State Variables ---
  let isRegistering = false;
  let sensorInterval;

  // --- Auth Logic ---
  switchLink.addEventListener('click', (e) => {
    e.preventDefault();
    isRegistering = !isRegistering;
    errorText.classList.add('hidden');
    
    if (isRegistering) {
      nameGroup.classList.remove('hidden');
      authBtn.textContent = 'Register';
      authSubtitle.textContent = 'Create a new farm account';
      switchPrompt.textContent = 'Already have an account?';
      switchLink.textContent = 'Login here';
    } else {
      nameGroup.classList.add('hidden');
      authBtn.textContent = 'Login';
      authSubtitle.textContent = 'Login to your dashboard';
      switchPrompt.textContent = "Don't have an account?";
      switchLink.textContent = 'Register here';
    }
  });

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username-input').value;
    
    // Simple mock validation
    if (username.length < 3) {
      errorText.textContent = "Username must be at least 3 characters.";
      errorText.classList.remove('hidden');
      return;
    }

    // Success! Hide Auth, Show Dashboard
    authView.classList.add('hidden');
    dashView.classList.remove('hidden');
    greeting.textContent = `Welcome, ${username} 👋`;
    
    // Start simulating sensor data
    startSensorSimulation();
  });

  logoutBtn.addEventListener('click', () => {
    // Stop sensors, hide dash, show auth
    clearInterval(sensorInterval);
    dashView.classList.add('hidden');
    authView.classList.remove('hidden');
    authForm.reset();
  });

  // --- Sensor Simulation Logic ---
  // We use this to test the UI before the real Arduino is connected.
  function startSensorSimulation() {
    // Initial update immediately
    updateSensors();
    
    // Update every 3 seconds
    sensorInterval = setInterval(updateSensors, 3000);
  }

  function updateSensors() {
    // Generate random values close to reality
    const temp = (22 + Math.random() * 5).toFixed(1); // 22.0 to 27.0
    const hum = Math.floor(40 + Math.random() * 20); // 40 to 60
    const soil = Math.floor(30 + Math.random() * 50); // 30 to 80
    const isWaterFlowing = Math.random() > 0.5; // True or False

    // Update DOM
    valTemp.textContent = `${temp}°C`;
    valHum.textContent = `${hum}%`;
    valSoil.textContent = `${soil}%`;
    
    if (isWaterFlowing) {
      valWater.textContent = "ON";
      valWater.className = "value text-green"; // Apply green CSS class
    } else {
      valWater.textContent = "OFF";
      valWater.className = "value text-red"; // Apply red CSS class
    }

    // --- Basic AI Simulation Logic ---
    if (soil < 40 && !isWaterFlowing) {
      aiMessage.textContent = "⚠️ WARNING: Soil moisture is critically low. Activating water pumps is highly recommended.";
      aiMessage.style.color = "#e74c3c"; // Red warning
    } else if (temp > 26) {
      aiMessage.textContent = "☀️ NOTICE: High temperatures detected. Consider deploying shade nets.";
      aiMessage.style.color = "#e67e22"; // Orange warning
    } else {
      aiMessage.textContent = "✅ All systems stable. Plant growth conditions are optimal.";
      aiMessage.style.color = "#27ae60"; // Green success
    }
  }
});