import { useRef, useState, useEffect } from "react";
import { Stack, Button, IconButton, Icon } from "@mui/material";
import { Drawer, DrawerApis } from "../Drawer";

interface CameraOCRProps {
  lang: string;
  onContent: (content: string) => void;
}

interface TesseractLogger {
  status: string;
  progress: number;
}

interface TesseractRecognizeResult {
  data: {
    text: string;
    // Add more fields if needed from the `data` object
    words?: {
      text: string;
      bbox: {
        x0: number;
        x1: number;
        y0: number;
        y1: number;
      };
      confidence: number;
    }[];
    lines?: {
      text: string;
      words: {
        text: string;
        bbox: {
          x0: number;
          x1: number;
          y0: number;
          y1: number;
        };
        confidence: number;
      }[];
    }[];
    blocks?: {
      text: string;
      bbox: {
        x0: number;
        x1: number;
        y0: number;
        y1: number;
      };
      confidence: number;
      paragraphs: {
        text: string;
        bbox: {
          x0: number;
          x1: number;
          y0: number;
          y1: number;
        };
        confidence: number;
        lines: {
          text: string;
          words: {
            text: string;
            bbox: {
              x0: number;
              x1: number;
              y0: number;
              y1: number;
            };
            confidence: number;
          }[];
        }[];
      }[];
    }[];
    confidence: number;
  };
}

const getLang3 = (lang: string): string => {
  const langMap: { [key: string]: string } = {
    // Northern European languages
    da: "dan", // Danish
    no: "nor", // Norwegian
    fi: "fin", // Finnish
    is: "isl", // Icelandic
    fo: "fao", // Faroese

    // Western European languages
    en: "eng", // English
    fr: "fra", // French
    de: "deu", // German
    nl: "nld", // Dutch
    lb: "ltz", // Luxembourgish
    af: "afr", // Afrikaans
    yi: "yid", // Yiddish

    // Southern European languages
    it: "ita", // Italian
    es: "spa", // Spanish
    pt: "por", // Portuguese
    gl: "glg", // Galician
    ca: "cat", // Catalan
    oc: "oci", // Occitan
    rm: "roh", // Romansh

    // Eastern European languages
    pl: "pol", // Polish
    cz: "ces", // Czech
    sk: "slk", // Slovak
    sl: "slv", // Slovenian
    hr: "hrv", // Croatian
    sr: "srp", // Serbian
    bs: "bos", // Bosnian
    mk: "mkd", // Macedonian
    bg: "bul", // Bulgarian
    ru: "rus", // Russian
    uk: "ukr", // Ukrainian
    be: "bel", // Belarusian
    cs: "ces", // Czech

    // Baltic languages
    lv: "lav", // Latvian
    lt: "lit", // Lithuanian
    et: "est", // Estonian

    // Celtic languages
    gd: "gla", // Scottish Gaelic
    ga: "gle", // Irish
    cy: "cym", // Welsh
    br: "bre", // Breton
    gv: "glv", // Manx
    kw: "cor", // Cornish

    // Other European languages
    hu: "hun", // Hungarian
    el: "ell", // Greek
    mt: "mlt", // Maltese
    sq: "sqi", // Albanian
    ro: "ron", // Romanian
    eu: "eus", // Basque

    // Turkish languages (often used in Europe)
    tr: "tur", // Turkish
    az: "aze", // Azerbaijani
  };

  return langMap[lang] || "eng"; // Default to 'eng' (English) if not found
};

export const CameraOCR: React.FC<CameraOCRProps> = ({ lang, onContent }) => {
  const drawerRef = useRef<DrawerApis>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const handleInit = async () => {
    if (!videoRef.current) return;

    drawerRef.current?.open();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use the rear camera if available
        },
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error("Error accessing the camera", err);
    }
  };

  const handleShoot = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setImageData(imageData);
  };

  const handleClose = () => {
    drawerRef.current?.close();

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (!imageData) return;

    setWorking(true);
    window.Tesseract.recognize(imageData, getLang3(lang), {
      logger: (m: TesseractLogger) => console.log(m),
    })
      .then((result: TesseractRecognizeResult) => {
        onContent(result.data.text);
        drawerRef.current?.close();
      })
      .catch((err: Error) => {
        alert(err.message);
      })
      .finally(() => {
        setWorking(false);
      });
  }, [imageData]);

  return (
    <>
      <IconButton onClick={handleInit}>
        <Icon>add_a_photo</Icon>
      </IconButton>

      <Drawer
        fullScreen
        keepMounted
        ref={drawerRef}
        actions={
          <Stack flex={1}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleShoot}
              disabled={working}
            >
              shoot
            </Button>
            <Button fullWidth onClick={handleClose} disabled={working}>
              cancel
            </Button>
          </Stack>
        }
        dialogContentSX={{ padding: 0 }}
      >
        <video
          ref={videoRef}
          style={{
            width: "100%",
            maxHeight: "100%",
            display: working ? "none" : "block",
          }}
          playsInline
          muted
          autoPlay
        />
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "100%",
            display: working ? "block" : "none",
          }}
        />
        {working && (
          <Stack flex={1} sx={{ textAlign: "center" }}>
            Running OCR...
          </Stack>
        )}
      </Drawer>
    </>
  );
};
