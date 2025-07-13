import { useState, useEffect } from "react";
import { useAuth } from "../lib/stores/useAuth";
import { useMenu } from "../lib/stores/useMenu";
import NeonButton from "./NeonButton";

type AuthMode = "login" | "register";

export default function Auth() {
  const { login, register, isLoading, error, clearError, checkUsernameAvailable } = useAuth();
  const { setCurrentScreen } = useMenu();
  
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCurrentScreen("main");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentScreen]);

  // Clear error when switching modes
  useEffect(() => {
    clearError();
    setUsernameAvailable(null);
  }, [mode, clearError]);

  // Check username availability for registration
  useEffect(() => {
    if (mode === "register" && username.length >= 3) {
      const checkUsername = async () => {
        setIsCheckingUsername(true);
        const available = await checkUsernameAvailable(username);
        setUsernameAvailable(available);
        setIsCheckingUsername(false);
      };

      const timeoutId = setTimeout(checkUsername, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setUsernameAvailable(null);
    }
  }, [username, mode, checkUsernameAvailable]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validation
    if (username.length < 3) {
      return;
    }

    if (password.length < 6) {
      return;
    }

    if (mode === "register") {
      if (!email.includes("@")) {
        return;
      }
      
      if (password !== confirmPassword) {
        return;
      }

      if (!usernameAvailable) {
        return;
      }

      const success = await register(username, email, password);
      if (success) {
        setCurrentScreen("main");
      }
    } else {
      const success = await login(username, password);
      if (success) {
        setCurrentScreen("main");
      }
    }
  };

  const isFormValid = () => {
    if (username.length < 3 || password.length < 6) return false;
    
    if (mode === "register") {
      return email.includes("@") && 
             password === confirmPassword && 
             usernameAvailable === true;
    }
    
    return true;
  };

  return (
    <div className="auth">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="section-title">
            {mode === "login" ? "LOGIN" : "CREATE ACCOUNT"}
          </h1>
        </div>

        <div className="auth-mode-toggle">
          <button
            className={`mode-button ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            LOGIN
          </button>
          <button
            className={`mode-button ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
          >
            REGISTER
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-container">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-input"
                placeholder="Enter username (min 3 characters)"
                minLength={3}
                required
                disabled={isLoading}
              />
              {mode === "register" && username.length >= 3 && (
                <div className="username-status">
                  {isCheckingUsername ? (
                    <span className="checking">Checking...</span>
                  ) : usernameAvailable === true ? (
                    <span className="available">✓ Available</span>
                  ) : usernameAvailable === false ? (
                    <span className="unavailable">✗ Username taken</span>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {mode === "register" && (
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="Enter email address"
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder="Enter password (min 6 characters)"
              minLength={6}
              required
              disabled={isLoading}
            />
          </div>

          {mode === "register" && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
              {confirmPassword && password !== confirmPassword && (
                <span className="password-mismatch">Passwords don't match</span>
              )}
            </div>
          )}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <div className="form-actions">
            <NeonButton
              onClick={() => {}} // Form submission is handled by onSubmit
              type="submit"
              color="green"
              size="large"
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? "LOADING..." : mode === "login" ? "LOGIN" : "CREATE ACCOUNT"}
            </NeonButton>
          </div>
        </form>

        <div className="auth-info">
          {mode === "register" && (
            <div className="registration-info">
              <p>By creating an account, you can:</p>
              <ul>
                <li>Save your progress</li>
                <li>Play multiplayer games</li>
                <li>Add friends and compete</li>
                <li>Access leaderboards</li>
              </ul>
            </div>
          )}
        </div>

        <div className="auth-controls">
          <NeonButton
            onClick={() => setCurrentScreen("main")}
            color="red"
            size="medium"
          >
            BACK TO MENU
          </NeonButton>
        </div>
      </div>
    </div>
  );
}