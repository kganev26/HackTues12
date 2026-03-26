import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    // ако няма логнат потребител, пренасочваме към login
    return <Navigate to="/" />;
  }
  return children;
}
