import { useState } from "react";
import { loginUser } from "../api/api";
import "../styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = await loginUser(form);

    if (userData.token) {
      login(userData);
      navigate("/chats");
    } else {
      setError(
        userData.message || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p className="auth-footer">
          Not a member? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
