import { useState, useEffect } from "react";
import "./login.css";

// Примерна снимка на интелигентна ферма за растения (можеш да замениш с локален файл)
const farmImage = "https://scx2.b-cdn.net/gfx/news/hires/2024/farming.jpg";
export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) setIsLoggedIn(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const firstName = form.get("firstName");
    const lastName = form.get("lastName");
    const username = form.get("username");
    const password = form.get("password");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isLogin) {
      // 👉 LOGIN
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (!user) {
        setError("Invalid username or password");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      setIsLoggedIn(true);
      setError("");
    } else {
      // 👉 REGISTER
      const exists = users.find((u) => u.username === username);

      if (exists) {
        setError("Username already exists");
        return;
      }

      const newUser = { firstName, lastName, username, password };
      users.push(newUser);

      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      setIsLoggedIn(true);
      setError("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    return (
      <div className="logged-in">
        <h1>Welcome, {user.username} 👋</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="page">
      {/* LEFT IMAGE */}
      <div className="left">
        <img
          src={farmImage}
          alt="Smart Farm System"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="right">
        <div className="form-box">
          <h2>{isLogin ? "Login" : "Create Account"}</h2>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="input-group">
                  <input name="firstName" placeholder=" " required />
                  <label>First Name</label>
                </div>

                <div className="input-group">
                  <input name="lastName" placeholder=" " required />
                  <label>Last Name</label>
                </div>
              </>
            )}

            <div className="input-group">
              <input name="username" placeholder=" " required />
              <label>Username</label>
            </div>

            <div className="input-group">
              <input type="password" name="password" placeholder=" " required />
              <label>Password</label>
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p className="switch-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError(""); // изчиства предишната грешка при смяна на формата
              }}
            >
              {isLogin ? " Register" : " Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}