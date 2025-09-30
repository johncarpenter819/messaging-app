import { useState } from "react";
import { loginUser } from "../api/api";
import "../styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = form;
    const res = await loginUser({ email, password });
    if (res.error) setError(res.error);
    else {
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.user.id);
      localStorage.setItem("username", res.user.username);
      navigate("/chats");
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
