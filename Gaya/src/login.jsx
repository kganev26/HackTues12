import { useState, useEffect } from "react";
import "./login.css";

const farmImage = "https://scx2.b-cdn.net/gfx/news/hires/2024/farming.jpg";
const API_URL = "https://192.168.88.8:5500"; 

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const body = {
      username: form.get("username"),
      password: form.get("password"),
      ...(isLogin ? {} : {
        firstname: form.get("firstname"),
        lastname: form.get("lastname"),
      }),
    };

    try {
      const endpoint = isLogin ? "/login" : "/register";

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Грешка при заявката");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      setIsLoggedIn(true);
      setError("");

    } catch (err) {
      setError("Няма връзка със сървъра");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
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
      <div className="left">
        <img src={farmImage} alt="Smart Farm System" />
      </div>

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

            <button type="submit">{isLogin ? "Login" : "Register"}</button>
          </form>

          <p className="switch-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => { setIsLogin(!isLogin); setError(""); }}>
              {isLogin ? " Register" : " Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}