export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/"; // пренасочваме към login
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user.username} 👋</h1>
      <p>This is a protected page.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}