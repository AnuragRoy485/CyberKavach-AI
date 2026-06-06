import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Shared lazy-loaded Gemini client initialization to avoid startup crashes if key is omitted
let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add your key in the Secrets/Settings panel.");
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

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Health / Config checking
app.get("/api/config", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  res.json({
    status: "ok",
    hasGeminiKey: hasKey
  });
});

// API: Cyber incident analyzer endpoint
app.post("/api/analyze-incident", async (req, res) => {
  try {
    const { 
      description, 
      lossAmount, 
      dateOfIncident, 
      state, 
      city, 
      suspectDetails,
      paymentMethod,
      platformUsed
    } = req.body;

    if (!description || description.trim() === "") {
      return res.status(400).json({ error: "Please provide a description of the cybercrime incident." });
    }

    const ai = getGeminiAI();

    const prompt = `
      Analyse the following cybercrime incident occurring in India:
      
      Incident Description: "${description}"
      Date of Occurrence: ${dateOfIncident || "Recent (Unknown)"}
      Financial Loss amount: ${lossAmount ? `INR ${lossAmount}` : "None / Unspecified"}
      State: ${state || "Not specified"}
      City: ${city || "Not specified"}
      Suspect Details (phone, email, links, etc.): ${suspectDetails || "None provided"}
      Payment Method/Gateway (if applicable): ${paymentMethod || "Not applicable"}
      Platform/App used (WhatsApp, Telegram, etc.): ${platformUsed || "Not specified"}

      Perform a comprehensive cyber forensic/legal assessment. Provide output strictly matching the provided JSON schema. Ensure the legal drafts and laws align strictly with Indian cyber laws (Information Technology Act, 2000 and Bharatiya Nyaya Sanhita (BNS) / replacing IPC).
    `;

    const systemInstruction = `
      You are the ultimate AI Cyber Crime Forensic Expert & Cyber Law Advisor specializing in Indian laws (IT Act 2000, Bharatiya Nyaya Sanhita (BNS)).
      Your objective is to help victims of cyber fraud by analyzing their case, identifying exact fraud taxonomy, giving urgent recovery actions, detailing evidence preservation guidelines, list applicable legal provisions, and drafting a watertight formal cyber complaint.

      When drafting the complaint:
      - Addressing: Address to "The Superintendent of Police, Cyber Crime Cell" or "The Inspector of Police, Cyber Crime Police Station" of the user's state/city (e.g. Police Cyber Cell, ${state || "State"}). 
      - Format: Formal Indian police complaint formatting. Include Subject line, sequential timeline of events based on input, list suspects, specify the exact transaction IDs, telephone numbers, URLs, or accounts.
      - Tone: Official, formal, legal, and urgent. Mention standard placeholders or user inputs for dates, names, account details, and evidence files.

      Immediate Actions:
      - Provide practical, sequence-ordered action steps. 
      - If financial fraud involves a recent loss (golden hour), emphasize dialing the National Cyber Fraud Helpline '1930' immediately, reporting to www.cybercrime.gov.in, and requesting account freeze/chargebacks from respective banks with specific steps.
      - Map appropriate icons (like "shield", "phone", "bank", "alert-triangle", "eye-off", "lock") to each step.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fraudType: { 
              type: Type.STRING, 
              description: "Taxonomy of the fraud: e.g. Phishing / Vishing, Telegram Job Scam, AePS Biometric Clone, Sextortion, UPI Payment Fraud, Investment Fraud, Identity Impersonation." 
            },
            subType: { 
              type: Type.STRING, 
              description: "More specific style of scam, e.g. 'Telegram Task Earning scam', 'Fake PAN Card SMS', 'Instagram account hacking extortion'." 
            },
            confidence: { 
              type: Type.INTEGER, 
              description: "AI confidence percentage (integer between 1 and 100)" 
            },
            shortSummary: { 
              type: Type.STRING, 
              description: "A professional one-sentence summary of the incident and critical risk." 
            },
            urgencyLevel: { 
              type: Type.STRING, 
              description: "CRITICAL, HIGH, MEDIUM, or LOW." 
            },
            immediateActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.STRING, description: "Short title of step, e.g. 'Block Bank Account'" },
                  details: { type: Type.STRING, description: "Urgent instructions detailing exactly how to execute this." },
                  icon: { type: Type.STRING, description: "Lucide icon name (e.g. key, lock, phone, shield, Ban, Landmark)." }
                },
                required: ["step", "details", "icon"]
              }
            },
            evidenceTips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING, description: "Evidence item, e.g. 'Screenshot of payment', 'Email Headers'" },
                  purpose: { type: Type.STRING, description: "Why this is critical for police investigation." },
                  instruction: { type: Type.STRING, description: "Explicit instruction on how to preserve/format/save it safely without altering timestamps." }
                },
                required: ["item", "purpose", "instruction"]
              }
            },
            cyberLaws: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  provision: { type: Type.STRING, description: "Specific Section number: e.g., 'Section 66D'" },
                  statute: { type: Type.STRING, description: "Act name: e.g., 'Information Technology Act, 2000' or 'Bharatiya Nyaya Sanhita (BNS)'" },
                  penalty: { type: Type.STRING, description: "Stated punishment: e.g., 'Imprisonment up to 3 years and fine up to INR 1 Lakh'" },
                  explanation: { type: Type.STRING, description: "Translation of this legal law in simple terms for the user." }
                },
                required: ["provision", "statute", "penalty", "explanation"]
              }
            },
            complaintDraft: { 
              type: Type.STRING, 
              description: "The ready-to-print police complaint formatted in professional legal Markdown addressed to the police. Include details provided by the user." 
            },
            isFinancialLoss: { 
              type: Type.BOOLEAN, 
              description: "True if user experienced monetary loss, False otherwise." 
            },
            financialSop: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Special action items for financial fraud, e.g. 'Golden hour banking circular guidelines', 'Submit Chargeback form', 'Lodge NOC'."
            },
            nextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Next long term preventative legal recommendations."
            }
          },
          required: [
            "fraudType",
            "subType",
            "confidence",
            "shortSummary",
            "urgencyLevel",
            "immediateActions",
            "evidenceTips",
            "cyberLaws",
            "complaintDraft",
            "isFinancialLoss",
            "nextSteps"
          ]
        },
      }
    });

    const output = JSON.parse(response.text || "{}");
    res.json(output);

  } catch (error: any) {
    console.error("Incident analysis failed:", error);
    res.status(500).json({ 
      error: error.message || "Failed to analyze cybercrime incident. Please verify your GEMINI_API_KEY setup."
    });
  }
});

// API: Threat message / link analyzer
app.post("/api/analyze-threat", async (req, res) => {
  try {
    const { threatText } = req.body;

    if (!threatText || threatText.trim() === "") {
      return res.status(400).json({ error: "Please enter a message, link, SMS, or notification text." });
    }

    const ai = getGeminiAI();

    const prompt = `
      Analyze the following suspicious message, link, Telegram text, or offer received by an Indian user and assess the potential fraud risk:
      
      Suspicious Content: "${threatText}"
      
      Return a detailed classification in JSON. Assess if it aims to steal credentials, execute ransomware, perpetrate a task fraud, investment scam, or phishing. Keep in mind typical Indian scenarios like Flipkart lottery, Electricity Bill cut-off warnings, PAN card verification requests, Jio free recharge, Telegram click-for-like job offers.
    `;

    const systemInstruction = `
      You are an proactive Cyber Security Risk Evaluator. Analyze messages/URLs for phishing, smishing, scam patterns, social engineering, or technical threats.
      Keep your tone alert, precise, objective, and protective. Highlight critical red flags and give clear actionable rules to remain safe.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSuspicious: { 
              type: Type.BOOLEAN, 
              description: "True if the message content looks shady, fraudulent, or suspicious." 
            },
            riskLevel: { 
              type: Type.STRING, 
              description: "LOW, MEDIUM, HIGH, or CRITICAL." 
            },
            score: { 
              type: Type.INTEGER, 
              description: "Integer score between 0 (fully safe) and 100 (explicitly malicious scam)." 
            },
            fraudType: { 
              type: Type.STRING, 
              description: "Likely category if it's fraudulent (such as Phishing / Fake Job / Fake Bill Alert etc.)." 
            },
            maliciousFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific technical or behavioral red flags detected (e.g. URL shortener, artificial urgency, high-return scheme)."
            },
            aiSafetyVerdict: { 
              type: Type.STRING, 
              description: "A crisp 2-3 sentence human-friendly evaluation explaining why and how this scam works." 
            },
            recommendedPrecaution: { 
              type: Type.STRING, 
              description: "A single bold recommendation on how to handle (e.g. DO NOT CLICK. Block the number. Report on Sanchar Saathi)." 
            }
          },
          required: [
            "isSuspicious",
            "riskLevel",
            "score",
            "fraudType",
            "maliciousFactors",
            "aiSafetyVerdict",
            "recommendedPrecaution"
          ]
        }
      }
    });

    const output = JSON.parse(response.text || "{}");
    res.json(output);

  } catch (error: any) {
    console.error("Threat analysis failed:", error);
    res.status(500).json({ 
      error: error.message || "Failed to diagnose the suspicious message. Check GEMINI_API_KEY setup."
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res, next) => {
      // Exclude API routes from HTML serving
      if (req.originalUrl.startsWith("/api/")) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const templatePath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(templatePath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Cyber Fraud Advisor backend executing on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
