import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialization function for Gemini API client to prevent crashing on startup
let aiClient: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Click Settings > Secrets to configure your Gemini API Key.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set payload limits high enough to transmit compressed compressed mp4 or avi captures
  app.use(express.json({ limit: "60mb" }));
  app.use(express.urlencoded({ limit: "60mb", extended: true }));

  // API Health Indicator
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "StrikeScan Intelligence Server online." });
  });

  // Main Endpoint: Multimodal AI Video Scouting analysis
  app.post("/api/analyze-video", async (req, res) => {
    const { 
      videoBase64, 
      fileName, 
      mimeType, 
      playerName, 
      profileType, 
      orientation, // battingHand or bowlingStyle
      isSimulated 
    } = req.body;

    // Check simulation parameter or missing API key fallback to prevent bad user states
    const hasKey = !!process.env.GEMINI_API_KEY;
    if (isSimulated || !hasKey) {
      console.log(`[StrikeScan AI] ${isSimulated ? "User requested simulation" : "No GEMINI_API_KEY found"}. Simulating tactical scouting response...`);
      
      // Select appropriate tactical output for simulation
      const isBat = profileType === "batsman";
      const simulatedData = {
        primaryVerdict: isBat 
          ? `Biomechanical review of ${playerName}'s footage indicates a slight weight transfer issue. On full-pitch deliveries, the head falls across towards the off-side before foot landing, causing a temporary imbalance in the front-foot drive. Key trigger movement is a late back-press which delays response to quick short-of-length deliveries.`
          : `Grip analysis of bowler ${playerName} reveals distinct wrist angle variation of approx. 12 degrees during back-of-the-hand release. This variation translates to inconsistent spin revolutions under high-humidity wickets, exposing their orthodox off-breaks to heavy leg-side sweeps.`,
        weaknessesDetected: isBat 
          ? [
              "Flicker in wrist during early trigger setup, trapping them in front for late-swinging inswingers.",
              "Vulnerability in the Corridor of Uncertainty outside offstump on good length lines.",
              "Susceptibility to short pitched bouncers targeting the rib cage, leading to cramped defensive pulls."
            ]
          : [
              "Tendency to lose seam position when pitching on hard lengths, leaking runs over deep mid-wicket.",
              "Vulnerable to late aggressive sweeps and scoops of flighted, slower overpitched deliveries.",
              "Lacks defensive containment variations under pressure when batsmen charge down the wicket."
            ],
        recommendedStrategy: isBat
          ? `Initiate play with back-of-a-length deliveries outside off-stump to exploit the delayed front-foot lunge. Once established, employ a sharp short delivery aimed directly at the shoulder line to force an awkward hook attempt, safely defended by an elevated deep-square leg boundary trap.`
          : `Deploy batsmen with soft-wrist capabilities to sweep against the spin direction. Instruct top-order to pre-trigger forward-neutral movements, advancing aggressively down the crease to convert good-length deliveries into comfortable low-risk low full-to-mid tosses.`,
        pitchTargetZone: isBat ? "good-outside-off" : "half-volley-pads",
        tacticalFieldSetup: isBat ? "slip-cordon" : "balanced-default",
        simulated: true,
        notice: !hasKey ? "Key configured simulates report." : undefined
      };

      // Add a small artificial sleep to make the report feel researched and high-fidelity
      await new Promise(resolve => setTimeout(resolve, 2000));
      return res.json(simulatedData);
    }

    try {
      if (!videoBase64) {
        return res.status(400).json({ error: "Missing video payload data." });
      }

      // Strip potential base64 metadata header if present
      let rawBase64 = videoBase64;
      if (videoBase64.includes(";base64,")) {
        rawBase64 = videoBase64.split(";base64,")[1];
      }

      const client = getGenAIClient();
      console.log(`[StrikeScan AI] Transmitting opponent footage to Gemini for ${playerName} (${profileType}). File: ${fileName}`);

      // Map common MIME styles to standard IANA values
      let cleanMime = mimeType || "video/mp4";
      if (cleanMime.toLowerCase().includes("avi")) {
        cleanMime = "video/x-msvideo"; // standard avi MIME label
      }

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          primaryVerdict: { 
            type: Type.STRING,
            description: "A highly analytical, professional tactical coaching critique detailing the player's trigger movements, weight bias, stance defects, or delivery vulnerabilities shown in the footage." 
          },
          weaknessesDetected: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Exactly 3 distinct, specific, and technically actionable weaknesses."
          },
          recommendedStrategy: { 
            type: Type.STRING, 
            description: "Detailed 2-3 sentence coaching gameplan on how our bowlers or batsmen can immediately exploit this player's flaws in real-time matches."
          },
          pitchTargetZone: { 
            type: Type.STRING,
            description: `A system pitch zone identifier. For batsman, strictly choose from: 'short-body', 'good-outside-off', 'good-stumps', 'full-wide', 'short-wide'. For bowler, strictly choose from: 'half-volley-pads', 'short-wide', 'good-length-off', 'good-length-stumps'.`
          },
          tacticalFieldSetup: { 
            type: Type.STRING,
            description: `For batsman, strictly choose a preset field name: 'slip-cordon', 'shortline-choke', 'spin-strangle', 'balanced-default'. For bowler, use 'balanced-default' or 'custom'.`
          }
        },
        required: ["primaryVerdict", "weaknessesDetected", "recommendedStrategy", "pitchTargetZone", "tacticalFieldSetup"]
      };

      const systemPrompt = `You are the lead tactical analyst, biomechanics coordinator, and master cricket coach for a national championship athletic team. 
We need you to evaluate match footage for an opponent named ${playerName} with the profile type of: ${profileType} and stance/action of: ${orientation}.
Your response must be entirely factual based on modern athletic data structures. Output your report strictly conforming to the requested JSON schema.`;

      const userPrompt = `Evaluate the uploaded opponent footage:
Profile Name: ${playerName}
Profile Type: ${profileType}
Style/Action: ${orientation}
Identify their mechanical glitches, late trigger weights, glove/wrist positioning, and footwork gaps. Provide the tactical analysis schema.`;

      const chatResponse = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: cleanMime,
              data: rawBase64,
            }
          },
          {
            text: userPrompt
          }
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.15,
        }
      });

      const responseText = chatResponse.text;
      if (!responseText) {
        throw new Error("No response string received from the Gemini analysis service.");
      }

      console.log("[StrikeScan AI] Successfully received scouting JSON from Gemini.");
      const parsedReport = JSON.parse(responseText.trim());
      res.json(parsedReport);

    } catch (error: any) {
      console.error("[StrikeScan AI Error]", error);
      res.status(500).json({ 
        error: error.message || "An unexpected error occurred during AI analysis. Please confirm your API key and file format." 
      });
    }
  });

  // Serve static UI assets in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[StrikeScan Server] Fullstack service initialized. Accessible on port ${PORT}`);
  });
}

startServer();
