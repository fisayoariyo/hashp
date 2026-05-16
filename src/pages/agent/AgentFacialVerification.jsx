import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { CropexHttpError } from "../../services/cropexHttp";
import { submitEnrollmentBiometric, submitEnrollmentFace } from "../../services/cropexApi";

// Facial states:
// idle      → waiting, show Capture button
// scanning  → uploading captured frame to backend
// success   → backend confirmed face capture
// error     → capture or upload failed

function readString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function isGenericFaceFailureMessage(message) {
  const text = readString(message).toLowerCase();
  return (
    text === "failed to capture face" ||
    text === "failed to capture biometric data" ||
    text === "request failed with status 500." ||
    text === "internal server error"
  );
}

const MAX_CAPTURE_EDGE = 960;
const MIN_CAPTURE_EDGE = 320;

function waitUntilVideoReady(video, timeoutMs = 4500) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (!video) {
        reject(new Error("Camera is not ready yet."));
        return;
      }
      const w = video.videoWidth || 0;
      const h = video.videoHeight || 0;
      if (w > 2 && h > 2 && video.readyState >= 2) {
        resolve();
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error("Camera preview is still starting. Wait two seconds and tap Capture again."));
        return;
      }
      requestAnimationFrame(check);
    };
    check();
  });
}

function pickPreferredCamera(cameras) {
  if (!Array.isArray(cameras) || cameras.length === 0) return null;
  return (
    cameras.find((camera) => /c920/i.test(camera.label || "")) ||
    cameras.find((camera) => /(webcam|camera|usb)/i.test(camera.label || "")) ||
    cameras[0]
  );
}

function buildFaceCapture(video, { mimeType = "image/jpeg", quality = 0.82 } = {}) {
  const sourceWidth = video.videoWidth || 640;
  const sourceHeight = video.videoHeight || 480;
  const cropSize = Math.max(Math.floor(Math.min(sourceWidth, sourceHeight) * 0.84), 1);
  const sx = Math.max(Math.floor((sourceWidth - cropSize) / 2), 0);
  const sy = Math.max(Math.floor((sourceHeight - cropSize) / 2), 0);
  const outputSize = Math.min(Math.max(cropSize, MIN_CAPTURE_EDGE), MAX_CAPTURE_EDGE);

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not prepare image capture canvas.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  // Normalize to a smaller centered square so uploads stay predictable for the backend.
  context.drawImage(video, sx, sy, cropSize, cropSize, 0, 0, outputSize, outputSize);

  const dataUrl =
    mimeType === "image/jpeg" ? canvas.toDataURL(mimeType, quality) : canvas.toDataURL(mimeType);
  const base64 = readString(dataUrl.split(",")[1]);
  if (!base64) {
    throw new Error("Could not read captured face image.");
  }

  return {
    mimeType,
    dataUrl,
    base64,
    width: outputSize,
    height: outputSize,
  };
}

export default function AgentFacialVerification({ onSuccess, onBack, embedded, sessionId }) {
  const [status, setStatus] = useState("idle"); // idle | scanning | success | error
  const [errorText, setErrorText] = useState("");
  const [cameraLabel, setCameraLabel] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function initCamera() {
      if (!navigator?.mediaDevices?.getUserMedia) {
        if (mounted) {
          setStatus("error");
          setErrorText("Camera API is not available in this browser.");
        }
        return;
      }
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === "videoinput");
        const preferred = pickPreferredCamera(cameras);

        const baseVideoConstraints = {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        };
        const constraints = preferred?.deviceId
          ? { video: { ...baseVideoConstraints, deviceId: { exact: preferred.deviceId } }, audio: false }
          : { video: baseVideoConstraints, audio: false };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (!mounted || !videoRef.current) return;

        videoRef.current.srcObject = stream;
        setCameraLabel(preferred?.label || "Camera ready");
        setCameraReady(true);
      } catch (error) {
        if (!mounted) return;
        setStatus("error");
        setErrorText(error instanceof Error ? error.message : "Could not access camera.");
      }
    }
    void initCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!sessionId) {
      setStatus("error");
      setErrorText("Enrollment session is missing.");
      return;
    }
    if (!videoRef.current || !cameraReady) {
      setStatus("error");
      setErrorText("Camera is not ready yet.");
      return;
    }
    setErrorText("");
    setStatus("scanning");

    try {
      const video = videoRef.current;
      await waitUntilVideoReady(video);

      const jpegCapture = buildFaceCapture(video, { mimeType: "image/jpeg", quality: 0.82 });
      const pngCapture = buildFaceCapture(video, { mimeType: "image/png" });

      const attempts = [
        {
          label: "/enrollment/face jpeg-base64",
          run: () =>
            submitEnrollmentFace({
              session_id: sessionId,
              face_photo: jpegCapture.base64,
            }),
        },
        {
          label: "/enrollment/biometric jpeg-base64",
          run: () =>
            submitEnrollmentBiometric({
              session_id: sessionId,
              biometric_data: {
                face_captured: true,
                face_photo: jpegCapture.base64,
              },
            }),
        },
        {
          label: "/enrollment/biometric jpeg-data-url",
          run: () =>
            submitEnrollmentBiometric({
              session_id: sessionId,
              biometric_data: {
                face_captured: true,
                face_photo: jpegCapture.dataUrl,
              },
            }),
        },
        {
          label: "/enrollment/face png-base64",
          run: () =>
            submitEnrollmentFace({
              session_id: sessionId,
              face_photo: pngCapture.base64,
            }),
        },
      ];

      let lastError = null;
      for (const attempt of attempts) {
        try {
          await attempt.run();
          lastError = null;
          break;
        } catch (attemptError) {
          lastError = attemptError;
          if (!(attemptError instanceof CropexHttpError) || attemptError.status < 500) {
            throw attemptError;
          }
          console.warn("Face upload attempt failed", {
            attempt: attempt.label,
            status: attemptError.status,
            message: attemptError.message,
            jpegBytesApprox: Math.round((jpegCapture.base64.length * 3) / 4),
            pngBytesApprox: Math.round((pngCapture.base64.length * 3) / 4),
            width: jpegCapture.width,
            height: jpegCapture.height,
          });
        }
      }

      if (lastError) {
        if (lastError instanceof CropexHttpError) {
          console.error("Face upload failed after trying 4 payload variants.", {
            status: lastError.status,
            message: lastError.message,
            attemptedVariants: [
              "face jpeg-base64",
              "biometric jpeg-base64",
              "biometric jpeg-data-url",
              "face png-base64",
            ],
          });
        }
        throw lastError;
      }
      setStatus("success");
    } catch (error) {
      setStatus("error");
      let message = error instanceof Error ? error.message : "Face capture failed.";
      if (error instanceof CropexHttpError) {
        if (/could not reach/i.test(message)) {
          message = `${message} Check your internet connection and that the CropEx API is reachable.`;
        } else if (error.status === 404) {
          message = "Enrollment session was not found. Start the farmer registration again.";
        } else if (error.status === 422) {
          message = isGenericFaceFailureMessage(message)
            ? "Failed to capture face. Please try again."
            : message;
        } else if (/failed to capture face/i.test(message) || error.status >= 500) {
          message = isGenericFaceFailureMessage(message)
            ? "Failed to capture face. Please try again."
            : message;
        }
      }
      setErrorText(message);
    }
  };

  const handleContinue = () => {
    onSuccess();
  };

  const rootClass = embedded
    ? "flex flex-col min-h-0 flex-1 w-full max-h-[calc(100dvh-220px)] justify-center"
    : "page-container bg-brand-bg-page flex flex-col";
  const scrollPb = embedded ? "pb-2" : "pb-28";
  const bottomClass = embedded
    ? "flex flex-col items-center gap-3 w-full mt-auto pt-4 border-t border-brand-border/80 shrink-0 px-4"
    : "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-8 bg-transparent pt-3 z-10 flex flex-col items-center";

  const innerCard =
    "w-full max-w-md mx-auto rounded-2xl border border-brand-border bg-white p-5 flex flex-col min-h-0 flex-1 shadow-sm";

  const content = (
    <>
      <div className={`flex-1 overflow-y-auto scrollbar-hide min-h-0 ${scrollPb}`}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-brand-text-secondary mb-5"
        >
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>

        <h1 className="font-display font-bold text-2xl md:text-[48px] md:leading-[52px] text-brand-text-primary mb-1 md:text-center">
          Facial Verification
        </h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-6 md:text-center">
          Capture face for identity verification.
        </p>

        {/* Oval camera frame — proportional to ID card photo (~112px wide) */}
        <div className="flex justify-center mb-4">
          <div className="relative w-52 h-[13.5rem] max-w-[85vw]">
            {/* Dashed green oval border */}
            <svg
              viewBox="0 0 256 320"
              className="absolute inset-0 w-full h-full"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <ellipse
                cx="128"
                cy="160"
                rx="118"
                ry="148"
                stroke={status === "success" ? "#155235" : "#155235"}
                strokeWidth="2.5"
                strokeDasharray="10 7"
                className={status === "scanning" ? "animate-spin" : ""}
                style={{ transformOrigin: "128px 160px" }}
              />
            </svg>

            {/* Camera preview */}
            <div className="absolute inset-3 rounded-full overflow-hidden bg-gray-200">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />

              {/* Scanning overlay */}
              {status === "scanning" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                  {/* Vertical scan line animation */}
                  <div
                    className="w-full h-0.5 bg-brand-green/80"
                    style={{
                      animation: "scanLine 1.5s ease-in-out infinite alternate",
                    }}
                  />
                </div>
              )}

              {/* Success overlay */}
              {status === "success" && (
                <div className="absolute inset-0 flex items-center justify-center bg-brand-green/20">
                  <div className="w-16 h-16 rounded-full bg-brand-green flex items-center justify-center">
                    <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
                      <polyline
                        points="6,17 13,24 26,10"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Vertical centre-line — only when idle/scanning */}
            {status !== "success" && (
              <div
                className="absolute top-3 bottom-3 left-1/2 -translate-x-1/2 w-0.5 bg-white/70"
                style={{ backgroundImage: "repeating-linear-gradient(to bottom, white 0 8px, transparent 8px 14px)" }}
              />
            )}
          </div>
        </div>

        {/* Instruction text */}
        <p className="font-sans text-center text-sm text-brand-text-primary leading-relaxed px-4">
          {status === "idle" && "Position your face within the frame and look directly at the camera"}
          {status === "scanning" && "Hold still — uploading face capture..."}
          {status === "success" && (
            <span className="text-brand-green font-semibold">
              Face verification successful ✓
            </span>
          )}
          {status === "error" && (
            <span className="text-red-600 font-semibold">
              {errorText || "Face verification failed."}
            </span>
          )}
        </p>
        {cameraLabel ? (
          <p className="mt-2 text-center font-sans text-xs text-brand-text-muted">
            Camera: {cameraLabel}
          </p>
        ) : null}
      </div>

      <div className={bottomClass}>
        {status === "success" ? (
          <button type="button" onClick={handleContinue} className="btn-capture-pill w-[220px] justify-center">
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCapture}
            disabled={status === "scanning" || !cameraReady}
            className="btn-capture-pill w-[220px] justify-center disabled:opacity-60"
          >
            {status === "scanning" ? "Scanning..." : "Capture"}
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className={rootClass}>
      {embedded ? (
        <div className="flex flex-col min-h-0 flex-1 w-full">
          {content}
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0 w-full max-w-md mx-auto px-3 pt-4 pb-4">
          <div className="rounded-2xl border border-brand-border bg-white p-5 flex flex-col flex-1 min-h-0 shadow-sm">
            {content}
          </div>
        </div>
      )}

      <style>{`
        @keyframes scanLine {
          from { transform: translateY(-120px); }
          to   { transform: translateY(120px); }
        }
      `}</style>
    </div>
  );
}
