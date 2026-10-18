'use client';

import { useState, type FormEvent } from 'react';

export function DemoLogin({ onExplore }: { onExplore: () => void }) {
  const [message, setMessage] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('Este acceso es solo visual. Usa “Explorar demo” para ver el panel.');
  }

  return (
    <main className="demo-login-page">
      <section className="login-story" aria-label="Presentación de Tributo Educa">
        <div className="demo-brand demo-brand-light"><span className="demo-brand-mark">TE</span><span>Tributo Educa<small>PERÚ · PANEL ADMINISTRATIVO</small></span></div>
        <div className="login-story-copy">
          <p className="demo-eyebrow">CENTRO DE CONTENIDOS</p>
          <h1>Conocimiento claro para negocios que quieren crecer.</h1>
          <p>Organiza módulos, lecciones y recursos educativos desde un solo lugar.</p>
        </div>
        <div className="story-preview" aria-hidden="true">
          <div className="story-preview-top"><span>Ruta de aprendizaje</span><span className="story-dot" /></div>
          <strong>Tributario</strong>
          <div className="story-progress"><span /></div>
          <small>Contenido ordenado · Fácil de actualizar</small>
        </div>
        <small className="story-footer">Una experiencia educativa pensada para el Perú.</small>
      </section>

      <section className="login-panel">
        <div className="demo-only-tag"><span /> DEMOSTRACIÓN VISUAL</div>
        <div className="login-form-wrap">
          <p className="demo-eyebrow">BIENVENIDO/A</p>
          <h2>Iniciar sesión</h2>
          <p className="demo-muted">Ingresa tus credenciales para acceder al panel.</p>
          <form className="demo-login-form" onSubmit={submit}>
            <label htmlFor="demo-email">Correo electrónico</label>
            <input id="demo-email" type="email" placeholder="nombre@empresa.pe" autoComplete="username" />
            <div className="password-label"><label htmlFor="demo-password">Contraseña</label><button type="button" onClick={() => setMessage('La recuperación de contraseña no está conectada en esta demo.')}>¿Olvidaste tu contraseña?</button></div>
            <input id="demo-password" type="password" placeholder="Ingresa tu contraseña" autoComplete="current-password" />
            {message && <p className="demo-login-message" role="status">{message}</p>}
            <button className="demo-button demo-button-primary" type="submit">Iniciar sesión <span aria-hidden="true">→</span></button>
          </form>
          <div className="demo-divider"><span /> <span>O SOLO QUIERES VERLO</span> <span /></div>
          <button className="demo-button demo-button-secondary" type="button" onClick={onExplore}>Explorar panel de demostración</button>
          <p className="login-disclaimer"><span aria-hidden="true">ⓘ</span> Esta pantalla no autentica usuarios ni envía información. Los datos del panel son ficticios.</p>
        </div>
        <footer className="login-footer">© 2026 Tributo Educa Perú · Versión de demostración</footer>
      </section>
    </main>
  );
}
