import { useState } from "react";
import { signupUser } from "../api/api";
import "../styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match!");
      return;
    }
    const { username, email, password } = form;
    const res = await signupUser({ username, email, password });

    if (res.error) {
      setError(res.error);
    } else {
      localStorage.setItem("token", res.token);
      navigate("/login");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
          />
          <input
            name="confirm"
            placeholder="Confirm Password"
            type="password"
            onChange={handleChange}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Sign Up</button>
        </form>
        <p className="auth-footer">
          Already a member? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
