"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [tab, setTab] = useState("signin");
  // Sign In state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  // Sign Up state
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password })
    });
    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      setLoginError(data.message || "Invalid credentials");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password: signupPassword })
    });
    if (res.ok) {
      setSignupSuccess("Signup successful! You can now sign in.");
      setTab("signin");
      setEmail(""); setUsername(""); setSignupPassword("");
    } else {
      const data = await res.json();
      setSignupError(data.message || "Signup failed");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ffe5e5 0%, #ffb3b3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(255,0,0,0.08)', width: 380, padding: 36, maxWidth: '90vw' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <button onClick={() => setTab("signin")}
            style={{
              flex: 1,
              padding: '12px 0',
              border: 'none',
              borderBottom: tab === 'signin' ? '3px solid #e53935' : '1px solid #eee',
              background: 'none',
              fontWeight: tab === 'signin' ? 700 : 400,
              color: tab === 'signin' ? '#e53935' : '#333',
              fontSize: 18,
              cursor: 'pointer',
              transition: 'border 0.2s'
            }}>
            Sign In
          </button>
          <button onClick={() => setTab("signup")}
            style={{
              flex: 1,
              padding: '12px 0',
              border: 'none',
              borderBottom: tab === 'signup' ? '3px solid #e53935' : '1px solid #eee',
              background: 'none',
              fontWeight: tab === 'signup' ? 700 : 400,
              color: tab === 'signup' ? '#e53935' : '#333',
              fontSize: 18,
              cursor: 'pointer',
              transition: 'border 0.2s'
            }}>
            Sign Up
          </button>
        </div>
        {tab === 'signin' && (
          <form onSubmit={handleSignIn}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500 }}>Email or Username</label><br />
              <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e57373', marginTop: 4, background: '#fff6f6' }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500 }}>Password</label><br />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e57373', marginTop: 4, background: '#fff6f6' }} />
            </div>
            {loginError && <div style={{ color: '#d32f2f', marginBottom: 12 }}>{loginError}</div>}
            <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 8, background: '#e53935', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16, marginTop: 8, boxShadow: '0 2px 8px #ffb3b3' }}>Sign In</button>
          </form>
        )}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500 }}>Email</label><br />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e57373', marginTop: 4, background: '#fff6f6' }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500 }}>Username</label><br />
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e57373', marginTop: 4, background: '#fff6f6' }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500 }}>Password</label><br />
              <input type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e57373', marginTop: 4, background: '#fff6f6' }} />
            </div>
            {signupError && <div style={{ color: '#d32f2f', marginBottom: 12 }}>{signupError}</div>}
            {signupSuccess && <div style={{ color: 'green', marginBottom: 12 }}>{signupSuccess}</div>}
            <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 8, background: '#e53935', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16, marginTop: 8, boxShadow: '0 2px 8px #ffb3b3' }}>Sign Up</button>
          </form>
        )}
      </div>
    </div>
  );
} 