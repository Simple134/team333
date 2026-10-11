import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="header nav-mast">
        <p className="mast-line">Proyecto institucional · La Vega · Agosto 2026</p>
        <div className="logo mast-name">
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="Logo del sistema de traducción de lengua de señas"
            className="logo-image"
          />
          <span>ENAPSOR</span>
        </div>
        <hr className="mast-rule" aria-hidden="true" />
      </header>
      <main className="main-content hero-split">
        <section className="text-content" aria-labelledby="project-title">
          <h1>
            Sistema Inteligente de Traducción de Lengua de Señas
          </h1>
          <p className="project-title" id="project-title">
            Desarrollo de un Sistema Inteligente de Traducción de Lengua de
            Señas para Optimizar la Comunicación entre Personas Sordas y
            Oyentes en la Escuela Nacional de Sordomudos (ENAPSOR), La Vega,
            Agosto 2026.
          </p>
          <p className="project-summary">
            Herramienta web para apoyar la comunicación entre estudiantes,
            docentes y visitantes mediante reconocimiento de gestos en tiempo
            real, cámara web y asistencia de voz.
          </p>
          <dl className="project-meta" aria-label="Datos del proyecto">
            <div>
              <dt>Institución</dt>
              <dd>ENAPSOR</dd>
            </div>
            <div>
              <dt>Modalidad</dt>
              <dd>Cámara en vivo</dd>
            </div>
            <div>
              <dt>Objetivo</dt>
              <dd>Comunicación accesible</dd>
            </div>
          </dl>
          <button
            onClick={() => navigate("/options")}
            className="get-started-button"
          >
            Empezar
          </button>
        </section>
        <figure className="image-content">
          <img
            src={`${process.env.PUBLIC_URL}/home_page_image.jpg`}
            alt="Persona comunicándose mediante lengua de señas"
            className="illustration"
            width="760"
            height="620"
          />
          <figcaption>
            Reconocimiento visual para apoyar conversaciones dentro del entorno escolar.
          </figcaption>
        </figure>
      </main>
      <footer className="foot-mast">
        <p className="wordmark">ENAPSOR · Lengua de Señas</p>
        <p>Prototipo académico para evaluación y uso guiado en aula.</p>
      </footer>
    </div>
  );
}

export default Home;
