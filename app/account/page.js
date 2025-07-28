"use client";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [emailEdit, setEmailEdit] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");
  const [pwEdit, setPwEdit] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const router = useRouter();
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const u = await res.json();
        setUser(u);
        setEmail(u.email);
      } else {
        router.replace('/login');
      }
    }
    fetchUser();
  }, [router]);

  async function handleEmailUpdate(e) {
    e.preventDefault();
    setEmailMsg("");
    const res = await fetch('/api/auth/update-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (res.ok) {
      setEmailMsg('Email updated!');
      setEmailEdit(false);
      setUser({ ...user, email });
    } else {
      const data = await res.json();
      setEmailMsg(data.message || 'Failed to update email');
    }
  }

  async function handlePwUpdate(e) {
    e.preventDefault();
    setPwMsg("");
    const res = await fetch('/api/auth/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw })
    });
    if (res.ok) {
      setPwMsg('Password updated!');
      setPwEdit(false);
      setOldPw("");
      setNewPw("");
    } else {
      const data = await res.json();
      setPwMsg(data.message || 'Failed to update password');
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 900, margin: '40px auto', padding: 32 }}>
        <h2>My Account</h2>
        {user ? (
          <div>
            <p><b>Email:</b> {user.email} {emailEdit ? (
              <form onSubmit={handleEmailUpdate} style={{ display: 'inline' }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ marginLeft: 8 }} />
                <button type="submit">Save</button>
                <button type="button" onClick={() => { setEmailEdit(false); setEmail(user.email); }}>Cancel</button>
                {emailMsg && <span style={{ marginLeft: 8, color: 'green' }}>{emailMsg}</span>}
              </form>
            ) : (
              <button style={{ marginLeft: 8 }} onClick={() => setEmailEdit(true)}>Update Email</button>
            )}</p>
            <p><b>Username:</b> {user.username}</p>
            <div style={{ marginTop: 24 }}>
              <b>Password:</b> ******** <button onClick={() => setPwEdit(true)}>Update Password</button>
              {pwEdit && (
                <form onSubmit={handlePwUpdate} style={{ marginTop: 12 }}>
                  <div>
                    <label>Old Password:</label><br />
                    <input type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} required style={{ width: 300 }} />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <label>New Password:</label><br />
                    <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required style={{ width: 300 }} />
                  </div>
                  <button type="submit" style={{ marginTop: 8 }}>Save</button>
                  <button type="button" onClick={() => { setPwEdit(false); setOldPw(""); setNewPw(""); }} style={{ marginLeft: 8 }}>Cancel</button>
                  {pwMsg && <span style={{ marginLeft: 8, color: pwMsg.includes('updated') ? 'green' : 'red' }}>{pwMsg}</span>}
                </form>
              )}
            </div>
          </div>
        ) : (
          <p>You are not logged in.</p>
        )}
      </main>
    </>
  );
} 