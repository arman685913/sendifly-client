import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Initially set according to device/browser preference
    const systemTheme = mediaQuery.matches ? "dark" : "light";
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      applyTheme(savedTheme, false); // manual override, don’t save again
    } else {
      applyTheme(systemTheme, false);
    }

    // Listen for device/browser theme changes
    const handleSystemChange = (e) => {
      const newSystemTheme = e.matches ? "dark" : "light";

      // Always update app theme on system change
      applyTheme(newSystemTheme, false);
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  // If saveToStorage=true, manual toggle will be saved
  const applyTheme = (newTheme, saveToStorage = true) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");

    if (saveToStorage) localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    applyTheme(newTheme); // manual toggle => save to localStorage
  };

  return (
    <label className="swap swap-rotate cursor-pointer">
      <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />
      <FaSun className="text-yellow-400 h-5 w-5 md:h-6 md:w-6 swap-off" />
      <FaMoon className="text-sky-600 h-5 w-5 md:h-6 md:w-6 swap-on" />
    </label>
  );
};

export default ThemeToggle;
