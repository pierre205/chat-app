// src/pages/ThemeTestPage.jsx
import { THEMES } from "../constants/index";
import { useState, useEffect } from "react";

const ThemeTestPage = () => {
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  return (
    <div className="min-h-screen p-8 bg-base-100">
      <h1 className="text-3xl font-bold mb-6 text-primary">Test des thèmes DaisyUI</h1>
      <div className="flex flex-wrap gap-2 mb-8">
        {THEMES.map((theme) => (
          <button
            key={theme}
            className={`btn ${currentTheme === theme ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setCurrentTheme(theme)}
          >
            {theme}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Thème actuel: {currentTheme}</h2>
            <p>Voici un exemple de texte avec des couleurs de base</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="badge badge-primary">primary</span>
              <span className="badge badge-secondary">secondary</span>
              <span className="badge badge-accent">accent</span>
              <span className="badge badge-neutral">neutral</span>
            </div>
          </div>
        </div>
        
        <div>
          <button className="btn btn-primary mb-2 w-full">Primary Button</button>
          <button className="btn btn-secondary mb-2 w-full">Secondary Button</button>
          <button className="btn btn-accent mb-2 w-full">Accent Button</button>
          <button className="btn btn-neutral mb-2 w-full">Neutral Button</button>
          <button className="btn btn-ghost mb-2 w-full">Ghost Button</button>
        </div>
      </div>
    </div>
  );
};

export default ThemeTestPage;
