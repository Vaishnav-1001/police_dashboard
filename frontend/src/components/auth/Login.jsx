import { useState } from "react";
import { login } from "../../api/auth";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(username, password);
      onLogin(data.user);
    } catch (error) {
      setError(
        error.message || "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <form
        className="login-card"
        onSubmit={handleSubmit}
      >
        <div className="login-brand">
          <h1>Login</h1>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <div className="login-field">
          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            autoComplete="username"
            required
          />
        </div>

        <div className="login-field">
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="current-password"
            required
          />
        </div>

        <button
          className="login-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "SIGNING IN..." : "LOGIN"}
        </button>
      </form>
    </main>
  );
}