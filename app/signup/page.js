"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password })
    });
    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.message || "Signup failed");
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 400, margin: '40px auto', padding: 32 }}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Email:</label><br />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Username:</label><br />
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Password:</label><br />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%' }} />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          <button type="submit" style={{ width: '100%' }}>Sign Up</button>
        </form>
      </main>
    </>
  );
} 