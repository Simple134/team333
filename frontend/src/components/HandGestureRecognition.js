import React, { useRef, useEffect, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./HandGestureRecognition.css";

const OFFICIAL_ALPHABET_IMAGE =
  "https://diccionariolsrd.cc/wp-content/uploads/2024/07/Alfabeto.jpg";

const alphabetGuides = [
  {
    letter: "A",
    pose: "fist-thumb",
    shape: "Puño cerrado con el pulgar visible al costado.",
    orientation: "Palma hacia el receptor.",
    movement: "Mantén la mano firme.",
  },
  {
    letter: "B",
    pose: "flat",
    shape: "Dedos extendidos y juntos, pulgar cruzado al frente.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "C",
    pose: "curve",
    shape: "Mano curvada como la letra C.",
    orientation: "Palma ligeramente de lado.",
    movement: "Sin movimiento.",
  },
  {
    letter: "D",
    pose: "index-up",
    shape: "Indice extendido; los otros dedos se unen con el pulgar.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "E",
    pose: "closed",
    shape: "Dedos doblados hacia la palma.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "F",
    pose: "pinch",
    shape: "Indice y pulgar forman un circulo; otros dedos arriba.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "G",
    pose: "index-side",
    shape: "Indice extendido hacia un lado con pulgar abierto.",
    orientation: "Palma de lado.",
    movement: "Sin movimiento.",
  },
  {
    letter: "H",
    pose: "two-side",
    shape: "Indice y medio extendidos hacia un lado.",
    orientation: "Palma de lado.",
    movement: "Sin movimiento.",
  },
  {
    letter: "I",
    pose: "pinky",
    shape: "Menique extendido; los otros dedos cerrados.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "J",
    pose: "pinky-motion",
    shape: "Menique extendido.",
    orientation: "Palma hacia el receptor.",
    movement: "Dibuja una J breve en el aire.",
  },
  {
    letter: "K",
    pose: "k",
    shape: "Indice y medio abiertos; pulgar apoyado entre ambos.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "L",
    pose: "l",
    shape: "Indice arriba y pulgar horizontal formando una L.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "M",
    pose: "m",
    shape: "Dedos cerrados sobre el pulgar.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "N",
    pose: "n",
    shape: "Dos dedos cerrados sobre el pulgar.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "Ñ",
    pose: "n-motion",
    shape: "Forma de N.",
    orientation: "Palma hacia el receptor.",
    movement: "Agrega un movimiento corto de lado a lado.",
  },
  {
    letter: "O",
    pose: "o",
    shape: "Dedos y pulgar forman un circulo.",
    orientation: "Palma de lado.",
    movement: "Sin movimiento.",
  },
  {
    letter: "P",
    pose: "p",
    shape: "Forma parecida a K, orientada hacia abajo.",
    orientation: "Palma de lado o hacia abajo.",
    movement: "Sin movimiento.",
  },
  {
    letter: "Q",
    pose: "q",
    shape: "Indice y pulgar apuntan hacia abajo.",
    orientation: "Palma de lado.",
    movement: "Sin movimiento.",
  },
  {
    letter: "R",
    pose: "r",
    shape: "Indice y medio cruzados.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "S",
    pose: "closed",
    shape: "Puño cerrado con el pulgar al frente.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "T",
    pose: "t",
    shape: "Pulgar entre indice y medio.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "U",
    pose: "two-up",
    shape: "Indice y medio extendidos juntos.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "V",
    pose: "v",
    shape: "Indice y medio extendidos y separados.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "W",
    pose: "w",
    shape: "Indice, medio y anular extendidos.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "X",
    pose: "x",
    shape: "Puño cerrado con el indice en forma de gancho.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "Y",
    pose: "y",
    shape: "Pulgar y menique extendidos.",
    orientation: "Palma hacia el receptor.",
    movement: "Sin movimiento.",
  },
  {
    letter: "Z",
    pose: "index-motion",
    shape: "Indice extendido.",
    orientation: "Palma de lado.",
    movement: "Dibuja una Z breve en el aire.",
  },
].map((item) => ({
  ...item,
  sourceUrl: `https://diccionariolsrd.cc/diccionario/${encodeURIComponent(
    item.letter.toLowerCase()
  )}/`,
}));

const phraseGuides = [
  {
    phrase: "Yo me llamo",
    use: "Para presentarte al iniciar una conversación.",
    sequence: [
      {
        label: "Yo",
        pose: "point-self",
        detail: "Señala tu pecho con el indice.",
      },
      {
        label: "Me llamo",
        pose: "two-tap",
        detail: "Haz la seña de nombre y luego deletrea tu nombre.",
      },
      {
        label: "Nombre",
        pose: "fingerspell",
        detail: "Usa el abecedario manual letra por letra.",
      },
    ],
    sourceUrl: "https://diccionariolsrd.cc/diccionario/",
  },
  {
    phrase: "Buenos días",
    use: "Saludo inicial en la mañana.",
    sequence: [
      {
        label: "Bueno",
        pose: "flat-mouth",
        detail: "Mano dominante desde el labio hacia la mano no dominante.",
      },
      {
        label: "Día",
        pose: "day-arc",
        detail: "Brazo dominante baja en arco sobre la mano no dominante.",
      },
    ],
    sourceUrl: "https://diccionariolsrd.cc/diccionario/buenos-dias/",
  },
  {
    phrase: "Necesito ayuda",
    use: "Para pedir apoyo en una situación escolar.",
    sequence: [
      {
        label: "Necesito",
        pose: "pull-self",
        detail: "Lleva la mano hacia tu cuerpo para marcar necesidad.",
      },
      {
        label: "Ayuda",
        pose: "two-palms",
        detail: "Muestra ambas manos al frente y realiza el movimiento de apoyo.",
      },
    ],
    sourceUrl: "https://diccionariolsrd.cc/diccionario/ayuda/",
  },
  {
    phrase: "Gracias",
    use: "Para cerrar una interacción con cortesía.",
    sequence: [
      {
        label: "Gracias",
        pose: "thanks",
        detail: "Mano plana desde la boca hacia adelante en arco suave.",
      },
    ],
    sourceUrl: "https://diccionariolsrd.cc/diccionario/gracias/",
  },
];

const detectedSigns = [
  "Hola",
  "Sí",
  "No",
  "Gracias",
  "Buenas tardes",
];

const signNames = {
  "Hola": "open-wave",
  "Sí": "closed",
  "No": "no",
  "Gracias": "thanks",
  "Buenas tardes": "thumb-up",
};

function SignHandDiagram({ pose, label }) {
  return (
    <svg
      className={`sign-diagram sign-diagram--${pose}`}
      viewBox="0 0 180 150"
      role="img"
      aria-label={`Representación visual de ${label}`}
    >
      <rect className="sign-wrist" x="72" y="98" width="38" height="36" rx="13" />
      <ellipse className="sign-palm" cx="91" cy="86" rx="38" ry="34" />
      <g className="sign-fingers">
        <rect className="finger finger-index" x="58" y="28" width="17" height="58" rx="8" />
        <rect className="finger finger-middle" x="78" y="18" width="17" height="66" rx="8" />
        <rect className="finger finger-ring" x="98" y="26" width="17" height="59" rx="8" />
        <rect className="finger finger-pinky" x="118" y="41" width="16" height="47" rx="8" />
        <rect className="finger finger-thumb" x="35" y="76" width="48" height="16" rx="8" transform="rotate(-24 59 84)" />
      </g>
      <g className="sign-curls">
        <path className="curl curl-one" d="M59 70 C68 61, 78 63, 79 76" />
        <path className="curl curl-two" d="M79 66 C89 56, 101 60, 101 76" />
        <path className="curl curl-three" d="M99 69 C109 60, 121 63, 121 78" />
      </g>
      <g className="motion-marks" aria-hidden="true">
        <path className="motion-arc" d="M124 34 C151 52, 151 88, 127 105" />
        <path className="motion-line" d="M132 70 L154 70" />
        <path className="motion-line motion-line-two" d="M132 86 L154 78" />
      </g>
      <text className="sign-letter-mark" x="90" y="94" textAnchor="middle">
        {label}
      </text>
    </svg>
  );
}

function HandGestureRecognition() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [gesture, setGesture] = useState("Esperando una seña...");
  const gestureTimeoutRef = useRef(null);
  const [isTTSActive, setIsTTSActive] = useState(false);
  const [activeGuide, setActiveGuide] = useState("phrases");
  const [selectedLetter, setSelectedLetter] = useState(alphabetGuides[0].letter);
  const [selectedPhraseIndex, setSelectedPhraseIndex] = useState(0);
  const ttsTimeoutRef = useRef(null);
  const lastSpokenGestureRef = useRef(null);
  const lastSpokenTimeRef = useRef(0);
  const selectedLetterGuide =
    alphabetGuides.find((item) => item.letter === selectedLetter) ||
    alphabetGuides[0];

  useEffect(() => {
    const videoElement = videoRef.current;

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (videoElement && videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (gestureTimeoutRef.current) {
        clearTimeout(gestureTimeoutRef.current);
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, []);

  const detectGesture = (landmarks) => {
    // Get all important landmarks
    const wrist = landmarks[0];

    // Thumb landmarks
    const thumbCMC = landmarks[1]; // Thumb base
    const thumbMCP = landmarks[2]; // Thumb first joint
    const thumbIP = landmarks[3]; // Thumb second joint
    const thumbTip = landmarks[4]; // Thumb tip

    // Index finger landmarks
    const indexMCP = landmarks[5]; // Index base
    const indexPIP = landmarks[6]; // Index first joint
    const indexDIP = landmarks[7]; // Index second joint
    const indexTip = landmarks[8]; // Index tip

    // Middle finger landmarks
    const middleMCP = landmarks[9]; // Middle base
    const middlePIP = landmarks[10]; // Middle first joint
    const middleDIP = landmarks[11]; // Middle second joint
    const middleTip = landmarks[12]; // Middle tip

    // Ring finger landmarks
    const ringMCP = landmarks[13]; // Ring base
    const ringTip = landmarks[16]; // Ring tip

    // Pinky landmarks
    const pinkyMCP = landmarks[17]; // Pinky base
    const pinkyTip = landmarks[20]; // Pinky tip

    // Helper functions
    const distance = (point1, point2) => {
      return Math.sqrt(
        Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
      );
    };

    const isFingerRaised = (tip, mcp, threshold = 0.02) => {
      return tip.y < mcp.y - threshold;
    };

    const isFingerStraight = (tip, dip, pip, mcp, tolerance = 0.2) => {
      const totalLength =
        distance(mcp, pip) + distance(pip, dip) + distance(dip, tip);
      const directLength = distance(mcp, tip);
      return directLength / totalLength > 1 - tolerance;
    };

    // Check finger states
    const indexRaised = isFingerRaised(indexTip, indexMCP);
    const middleRaised = isFingerRaised(middleTip, middleMCP);
    const ringRaised = isFingerRaised(ringTip, ringMCP);
    const pinkyRaised = isFingerRaised(pinkyTip, pinkyMCP);

    const indexStraight = isFingerStraight(
      indexTip,
      indexDIP,
      indexPIP,
      indexMCP
    );
    const middleStraight = isFingerStraight(
      middleTip,
      middleDIP,
      middlePIP,
      middleMCP
    );
    // Thumb specific checks
    const thumbRaised = thumbTip.y < wrist.y - 0.1;
    const thumbOut = thumbTip.x > indexMCP.x;
    const thumbStraight = isFingerStraight(
      thumbTip,
      thumbIP,
      thumbMCP,
      thumbCMC,
      0.3
    );

    // Calculate finger spread once at the beginning
    const fingerSpread = distance(indexTip, pinkyTip);

    // HELLO - Open palm with spread fingers
    const allFingersRaised = [indexTip, middleTip, ringTip, pinkyTip].every(
      (tip) => tip.y < wrist.y - 0.1
    );

    if (allFingersRaised && thumbOut && fingerSpread > 0.2) {
      return "Hola";
    }

    // YES - Closed fist
    if (
      !indexRaised &&
      !middleRaised &&
      !ringRaised &&
      !pinkyRaised &&
      !thumbRaised
    ) {
      return "Sí";
    }

    // NO - Three fingers (thumb, index, middle)
    if (
      indexRaised &&
      middleRaised &&
      !ringRaised &&
      !pinkyRaised &&
      thumbOut &&
      indexStraight &&
      middleStraight
    ) {
      return "No";
    }

    // THANKS - Four fingers together
    if (
      indexRaised &&
      middleRaised &&
      ringRaised &&
      pinkyRaised &&
      fingerSpread < 0.15
    ) {
      return "Gracias";
    }

    // GOOD AFTERNOON - Thumbs up
    if (
      thumbRaised &&
      thumbStraight &&
      !indexRaised &&
      !middleRaised &&
      !ringRaised &&
      !pinkyRaised
    ) {
      return "Buenas tardes";
    }

    return null;
  };

  const updateGesture = (newGesture) => {
    if (!newGesture) {
      if (gesture === "Ajustando..." || gesture === "Muestra una seña...") {
        return;
      }
      setGesture("Muestra una seña...");
      return;
    }

    // Always update immediately for better responsiveness
    setGesture(newGesture);

    // Reset the timeout
    if (gestureTimeoutRef.current) {
      clearTimeout(gestureTimeoutRef.current);
    }

    // Keep the gesture displayed
    gestureTimeoutRef.current = setTimeout(() => {
      setGesture("Muestra una seña...");
    }, 3000);
  };

  const handleBack = () => {
    navigate("/options");
  };

  const startCamera = async () => {
    try {
      // Stop any existing streams
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (handsRef.current) {
        handsRef.current.close();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video metadata to load
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            resolve();
          };
        });

        await videoRef.current.play();

        handsRef.current = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        handsRef.current.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        handsRef.current.onResults((results) => {
          if (!canvasRef.current) return;

          const canvasCtx = canvasRef.current.getContext("2d");
          canvasCtx.save();
          canvasCtx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          canvasCtx.drawImage(
            results.image,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

          if (
            results.multiHandLandmarks &&
            results.multiHandLandmarks.length > 0
          ) {
            // Draw hand landmarks
            drawConnectors(
              canvasCtx,
              results.multiHandLandmarks[0],
              HAND_CONNECTIONS,
              {
                color: "#00FF00",
                lineWidth: 5,
              }
            );
            drawLandmarks(canvasCtx, results.multiHandLandmarks[0], {
              color: "#FF0000",
              lineWidth: 2,
              radius: 3,
            });

            const detectedGesture = detectGesture(
              results.multiHandLandmarks[0]
            );
            updateGesture(detectedGesture);
          } else {
            updateGesture(null);
          }
          canvasCtx.restore();
        });

        cameraRef.current = new Camera(videoRef.current, {
          onFrame: async () => {
            if (handsRef.current) {
              await handsRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        await cameraRef.current.start();
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setGesture("Error de cámara: " + err.message);
    }
  };

  const stopCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    if (handsRef.current) {
      handsRef.current.close();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setGesture("Cámara detenida");
  };

  const speakGesture = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("La lectura de texto no está disponible en este navegador.");
    }
  };

  useEffect(() => {
    const currentTime = Date.now();

    if (
      isTTSActive &&
      gesture &&
      gesture !== "Muestra una seña..." &&
      gesture !== "Esperando una seña..." &&
      (gesture !== lastSpokenGestureRef.current ||
        currentTime - lastSpokenTimeRef.current >= 10000)
    ) {
      if (ttsTimeoutRef.current) {
        clearTimeout(ttsTimeoutRef.current);
      }

      speakGesture(gesture);
      lastSpokenGestureRef.current = gesture;
      lastSpokenTimeRef.current = currentTime;

      ttsTimeoutRef.current = setTimeout(() => {
        // Allow the next gesture to be spoken after 5 seconds
      }, 5000);
    }

    return () => {
      if (ttsTimeoutRef.current) {
        clearTimeout(ttsTimeoutRef.current);
      }
    };
  }, [gesture, isTTSActive]);

  const toggleTTS = () => {
    if (isTTSActive) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      if (ttsTimeoutRef.current) {
        clearTimeout(ttsTimeoutRef.current);
      }
    }
    setIsTTSActive(!isTTSActive);
  };

  return (
    <div className="gesture-container">
      <button className="back-button" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
        Volver
      </button>
      <main className="live-layout">
        <section className="translator-panel" aria-label="Traductor en vivo">
          <div className="video-wrapper">
            <video
              ref={videoRef}
              className="input-video"
              style={{ transform: "scaleX(-1)" }}
              playsInline
            />
            <canvas
              ref={canvasRef}
              className="output-canvas"
              width={640}
              height={480}
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
          <div className="controls">
            <div className="gesture-text">{gesture}</div>
            <button
              onClick={isStreaming ? stopCamera : startCamera}
              className="camera-button"
            >
              {isStreaming ? "Detener cámara" : "Iniciar cámara"}
            </button>
            <button onClick={toggleTTS} className="tts-button">
              {isTTSActive ? "Detener voz" : "Texto a voz"}
            </button>
          </div>
          <div className="instructions">
            <p>Consejos para mejorar la detección:</p>
            <ul>
              <li>Mantén la mano estable</li>
              <li>Haz gestos claros y amplios</li>
              <li>Usa buena iluminación</li>
              <li>Mantén la mano a una distancia cómoda de la cámara</li>
              <li>Coloca la palma mirando hacia la cámara</li>
            </ul>
          </div>
        </section>

        <aside className="learning-panel" aria-label="Aprender lengua de señas">
          <div className="learning-header">
            <h1>Aprender señas</h1>
            <p>
              Usa estas guías como apoyo visual antes de practicar frente a la
              cámara. Valida las señas con docentes o intérpretes de ENAPSOR.
            </p>
          </div>

          <div className="guide-tabs" role="tablist" aria-label="Tipo de guía">
            <button
              type="button"
              role="tab"
              aria-selected={activeGuide === "phrases"}
              className={activeGuide === "phrases" ? "active" : ""}
              onClick={() => setActiveGuide("phrases")}
            >
              Frases
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeGuide === "alphabet"}
              className={activeGuide === "alphabet" ? "active" : ""}
              onClick={() => setActiveGuide("alphabet")}
            >
              Abecedario
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeGuide === "recognized"}
              className={activeGuide === "recognized" ? "active" : ""}
              onClick={() => setActiveGuide("recognized")}
            >
              Detectadas
            </button>
          </div>

          {activeGuide === "phrases" && (
            <section className="guide-section" aria-label="Frases comunes">
              <div className="phrase-list">
                {phraseGuides.map((item, index) => (
                  <button
                    type="button"
                    key={item.phrase}
                    className={selectedPhraseIndex === index ? "selected" : ""}
                    onClick={() => setSelectedPhraseIndex(index)}
                  >
                    {item.phrase}
                  </button>
                ))}
              </div>
              <article className="practice-card">
                <span className="practice-label">Frase común</span>
                <h2>{phraseGuides[selectedPhraseIndex].phrase}</h2>
                <p>{phraseGuides[selectedPhraseIndex].use}</p>
                <div className="sign-sequence">
                  {phraseGuides[selectedPhraseIndex].sequence.map((step) => (
                    <div className="sign-step" key={step.label}>
                      <SignHandDiagram pose={step.pose} label={step.label} />
                      <div>
                        <strong>{step.label}</strong>
                        <span>{step.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  className="source-link"
                  href={phraseGuides[selectedPhraseIndex].sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver referencia oficial
                </a>
              </article>
            </section>
          )}

          {activeGuide === "alphabet" && (
            <section className="guide-section" aria-label="Abecedario manual">
              <figure className="official-sign-reference">
                <img
                  src={OFFICIAL_ALPHABET_IMAGE}
                  alt="Abecedario manual oficial de la Lengua de Señas Dominicana"
                  loading="lazy"
                />
                <figcaption>
                  Imagen de referencia del Diccionario Oficial de la Lengua de
                  Señas Dominicana, CONADIS.
                </figcaption>
              </figure>
              <div className="alphabet-grid">
                {alphabetGuides.map((item) => (
                  <button
                    type="button"
                    key={item.letter}
                    className={selectedLetter === item.letter ? "selected" : ""}
                    onClick={() => setSelectedLetter(item.letter)}
                  >
                    {item.letter}
                  </button>
                ))}
              </div>
              <article className="practice-card letter-card">
                <div className="letter-visual">
                  <SignHandDiagram
                    pose={selectedLetterGuide.pose}
                    label={selectedLetterGuide.letter}
                  />
                  <strong>{selectedLetterGuide.letter}</strong>
                </div>
                <div className="sign-facts">
                  <span className="practice-label">Letra seleccionada</span>
                  <p>{selectedLetterGuide.shape}</p>
                  <p>{selectedLetterGuide.orientation}</p>
                  <p>{selectedLetterGuide.movement}</p>
                </div>
                <a
                  className="source-link"
                  href={selectedLetterGuide.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver en diccionario LESDOM
                </a>
              </article>
            </section>
          )}

          {activeGuide === "recognized" && (
            <section className="guide-section" aria-label="Señas detectadas">
              <article className="practice-card">
                <span className="practice-label">Este prototipo reconoce</span>
                <div className="detected-list detected-list--visual">
                  {detectedSigns.map((sign) => (
                    <span key={sign}>
                      <SignHandDiagram pose={signNames[sign]} label={sign} />
                      {sign}
                    </span>
                  ))}
                </div>
                <p>
                  Estas señas están conectadas al detector actual. El panel de
                  frases funciona como guía de aprendizaje, aunque no todas las
                  frases completas se detectan automáticamente todavía.
                </p>
              </article>
            </section>
          )}
        </aside>
      </main>
    </div>
  );
}

export default HandGestureRecognition;
