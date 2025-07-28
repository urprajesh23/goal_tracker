"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>🎯</div>
          <span>Goal Tracker</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className={styles.navLinks}>
          <li>
            <Link 
              href="/" 
              className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/add-goal" 
              className={`${styles.navLink} ${isActive('/add-goal') ? styles.active : ''}`}
            >
              Add Goals
            </Link>
          </li>
          <li>
            <Link 
              href="/uncompleted-goals" 
              className={`${styles.navLink} ${isActive('/uncompleted-goals') ? styles.active : ''}`}
            >
              Active Goals
            </Link>
          </li>
          <li>
            <Link 
              href="/delete-goals" 
              className={`${styles.navLink} ${isActive('/delete-goals') ? styles.active : ''}`}
            >
              Manage Goals
            </Link>
          </li>
          <li>
            <Link 
              href="/account" 
              className={`${styles.navLink} ${isActive('/account') ? styles.active : ''}`}
            >
              Account
            </Link>
          </li>
        </ul>

        {/* User Section */}
        <div className={styles.userSection}>
          <div className={styles.userAvatar} title="User Profile">
            👤
          </div>
          <button 
            className={styles.logoutBtn}
            onClick={handleLogout}
            title="Logout"
          >
            Logout
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            className={styles.mobileMenuBtn}
            onClick={toggleMobileMenu}
            title="Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
        <Link 
          href="/" 
          className={`${styles.mobileNavLink} ${isActive('/') ? styles.active : ''}`}
          onClick={closeMobileMenu}
        >
          Dashboard
        </Link>
        <Link 
          href="/add-goal" 
          className={`${styles.mobileNavLink} ${isActive('/add-goal') ? styles.active : ''}`}
          onClick={closeMobileMenu}
        >
          Add Goals
        </Link>
        <Link 
          href="/uncompleted-goals" 
          className={`${styles.mobileNavLink} ${isActive('/uncompleted-goals') ? styles.active : ''}`}
          onClick={closeMobileMenu}
        >
          Active Goals
        </Link>
        <Link 
          href="/delete-goals" 
          className={`${styles.mobileNavLink} ${isActive('/delete-goals') ? styles.active : ''}`}
          onClick={closeMobileMenu}
        >
          Manage Goals
        </Link>
        <Link 
          href="/account" 
          className={`${styles.mobileNavLink} ${isActive('/account') ? styles.active : ''}`}
          onClick={closeMobileMenu}
        >
          Account
        </Link>
        <button 
          className={`${styles.mobileNavLink} ${styles.logoutBtn}`}
          onClick={() => {
            closeMobileMenu();
            handleLogout();
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
} 