import React, { useEffect, useState } from 'react'

const Logo = () => {
      const [theme, setTheme] = useState('light');

  useEffect(() => {
    // This reads the actual class applied on <body> (reliable on reload)
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    setTheme(currentTheme);

    // Listen for manual event trigger
    const updateTheme = () => {
      const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
      setTheme(newTheme);
    };

    window.addEventListener('theme-changed', updateTheme);

    return () => window.removeEventListener('theme-changed', updateTheme);
  }, []);
  return (
    <img src={`/logo ${theme}.png`} alt="logo"/>
  )
}

export default Logo
