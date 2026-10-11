import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faCloudArrowUp,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./InputSelection.css";

function InputSelection() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleBack = () => {
    navigate("/");
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (selectedOption === "live") {
      navigate("/livewebcam");
    }
    // Add more conditions if needed for other options
  };

  return (
    <div className="input-selection-container">
      <button className="back-button" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
        Volver
      </button>
      <main className="selection-panel" aria-labelledby="selection-title">
        <section className="selection-copy">
          <p className="selection-kicker">Modo de traducción</p>
          <h1 id="selection-title">Elige cómo iniciar la interpretación</h1>
          <p>
            Para esta versión del prototipo, la traducción se realiza con la
            cámara en vivo. La carga de videos queda marcada como una extensión
            futura para pruebas grabadas.
          </p>
        </section>

        <div className="option-cards">
          <button
            type="button"
            aria-pressed={selectedOption === "live"}
          className={`option-card ${
            selectedOption === "live" ? "selected" : ""
          }`}
          onClick={() => handleSelect("live")}
        >
          <div className="circle">
            <FontAwesomeIcon icon={faVideo} className="icon" />
          </div>
            <span className="option-content">
              <strong>Cámara en vivo</strong>
              <small>Reconoce gestos directamente desde la webcam.</small>
            </span>
            <span className="availability">Disponible</span>
          </button>

          <button
            type="button"
            className="option-card option-card-disabled"
            disabled
        >
          <div className="circle">
            <FontAwesomeIcon icon={faCloudArrowUp} className="icon" />
          </div>
            <span className="option-content">
              <strong>Subir video</strong>
              <small>Procesamiento de archivos para una fase posterior.</small>
            </span>
            <span className="availability muted">Próximamente</span>
          </button>
        </div>

        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={selectedOption !== "live"}
        >
          {selectedOption === "live" ? "Entrar a cámara" : "Selecciona una modalidad"}
        </button>
      </main>
    </div>
  );
}

export default InputSelection;
