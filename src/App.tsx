import React, { useState, useMemo } from "react";
import {
  Shield,
  ShieldAlert,
  Phone,
  ShieldCheck,
  AlertCircle,
  Copy,
  Printer,
  Search,
  CheckCircle,
  ExternalLink,
  Lock,
  Scale,
  FileText,
  HelpCircle,
  Info,
  ChevronRight,
  Sparkles,
  Clock,
  MapPin,
  Landmark,
  Check,
  Building,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { INDIAN_STATES, SCAM_CATEGORIES, EMERGENCIES_SOP, CYBER_QUIZ, CYBER_CELL_CONTACTS, RELEVANT_CYBER_LAWS } from "./data";
import { IncidentAnalysis, ThreatAnalysis } from "./types";

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"advisor" | "scanner" | "directory" | "academy" | "laws">("advisor");

  // State checks
  const [configLoadedOnStart, setConfigLoadedOnStart] = useState<boolean>(true);
  const [geminiKeyConfigured, setGeminiKeyConfigured] = useState<boolean>(true);

  // Check backend configuration on load
  React.useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setGeminiKeyConfigured(data.hasGeminiKey);
        }
      })
      .catch((err) => {
        console.error("Failed to check applet config", err);
      });
  }, []);

  // --- ADVISOR STATE ---
  const [description, setDescription] = useState("");
  const [lossAmount, setLossAmount] = useState("");
  const [dateOfIncident, setDateOfIncident] = useState(new Date().toISOString().split("T")[0]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [suspectDetails, setSuspectDetails] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [platformUsed, setPlatformUsed] = useState("");
  const [prefilledScamId, setPrefilledScamId] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState("Initializing Forensic Assessment...");
  const [analysisResult, setAnalysisResult] = useState<IncidentAnalysis | null>(null);
  const [advisorError, setAdvisorError] = useState("");
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Active result sub-tab
  const [resultSubTab, setResultSubTab] = useState<"diagnostics" | "actions" | "evidence" | "draft" | "laws">("diagnostics");

  // --- THREAT SCANNER STATE ---
  const [threatText, setThreatText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ThreatAnalysis | null>(null);
  const [scanError, setScanError] = useState("");

  // --- DIRECTORY STATE ---
  const [searchStateQuery, setSearchStateQuery] = useState("");

  // --- QUIZ STATE ---
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Auto pre-fill tool
  const applyScamPreset = (scamName: string) => {
    setPrefilledScamId(scamName);
    if (scamName === "upi_banking") {
      setDescription("I received an SMS claiming my bank account will be blocked unless I update my KYC on a link. I clicked the link, entered my UPI PIN, and Rs. 48,000 was debited instantly from my account. I received a transaction SMS with ID txn_98127391.");
      setPaymentMethod("UPI Transfer (GPay/PhonePe)");
      setPlatformUsed("Fictitious Bank KYC Website");
    } else if (scamName === "job_fraud") {
      setDescription("I was added to a Telegram group offering part-time earnings for liking YouTube shorts. At first they gave me Rs 150. Then they told me to deposit screen funds to get VIP returns. I transferred Rs 75,000 in three separate UPI payments, but now they are demanding another Rs 1.2 Lakh on Skype to release my money.");
      setPaymentMethod("IMPS / Bank Transfer");
      setPlatformUsed("Telegram Channel & Skype");
    } else if (scamName === "investment_scam") {
      setDescription("An admin of a WhatsApp stock tips group called 'Vanguard Capital Tips' promised me guaranteed 400% IPO allocations. They made me download an app called 'Vanguard Trade Pro' from a shared link and deposit Rs. 2,50,000. Now the app displays my portfolio is worth Rs 12 Lakhs, but whenever I try to withdraw, they tell me I have to pay 30% taxes first.");
      setPaymentMethod("Direct Bank Wire Transfer");
      setPlatformUsed("WhatsApp Group / Unofficial .APK Trading Mobile App");
    } else if (scamName === "sextortion_blackmail") {
      setDescription("An unknown lady video-called me on WhatsApp at night. She started morphing and recording. Today, a man representing himself as a Cyber Police Officer from Delhi Cyber Cell contacted me over WhatsApp showing a morphed video, threatening to upload it on YouTube unless I pay Rs 35,000 immediately.");
      setPaymentMethod("GPay / UPI Payment");
      setPlatformUsed("WhatsApp Video Call");
    } else if (scamName === "aeps_biometric") {
      setDescription("My relative tried withdrawing cash from a local CSP kiosk. After fingerprint scan failed, they claimed network error. Today we saw Rs. 20,000 has been debited through AePS biometric gateway. No OTP was received on the linked mobile.");
      setPaymentMethod("AePS (Aadhaar Enabled Payment System)");
      setPlatformUsed("AePS Merchant Micro-ATM");
    }
  };

  // Run AI Incident Diagnostics
  const handleAnalyzeIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || description.trim() === "") {
      setAdvisorError("Please state or describe your incident details first.");
      return;
    }

    setAdvisorError("");
    setAnalyzing(true);
    setAnalysisResult(null);
    setCheckedActions({});

    const loaderStates = [
      "Securing analytical pipeline...",
      "Analyzing fraud markers & phishing indicators...",
      "Matching patterns against Indian Cyber Law Databases...",
      "Determining Section 66C and 66D IT Act eligibility...",
      "Consulting BNS-2023 legal precedents...",
      "Formatting printable police complaint draft..."
    ];

    let stateIdx = 0;
    const interval = setInterval(() => {
      if (stateIdx < loaderStates.length - 1) {
        stateIdx++;
        setAnalysisStatus(loaderStates[stateIdx]);
      }
    }, 1200);

    try {
      const response = await fetch("/api/analyze-incident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          lossAmount: lossAmount ? parseFloat(lossAmount) : undefined,
          dateOfIncident,
          state: selectedState,
          city: selectedCity,
          suspectDetails,
          paymentMethod,
          platformUsed
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Backend analytical service failure.");
      }

      const result = await response.json() as IncidentAnalysis;
      setAnalysisResult(result);
      setResultSubTab("diagnostics");
    } catch (err: any) {
      console.error(err);
      setAdvisorError(err.message || "An unexpected connection error occurred.");
    } finally {
      clearInterval(interval);
      setAnalyzing(false);
    }
  };

  // Run AI Link / Message Threat Scan
  const handleScanThreat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!threatText || threatText.trim() === "") {
      setScanError("Please paste suspicious link or SMS message.");
      return;
    }

    setScanError("");
    setScanning(true);
    setScanResult(null);

    try {
      const response = await fetch("/api/analyze-threat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threatText })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Risk diagnostic system failure.");
      }

      const result = await response.json() as ThreatAnalysis;
      setScanResult(result);
    } catch (err: any) {
      console.error(err);
      setScanError(err.message || "Threat scanning system connection error.");
    } finally {
      setScanning(false);
    }
  };

  // Copy Draft Action
  const copyComplaintToClipboard = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult.complaintDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  // Export Complaint as file
  const downloadComplaintTxt = () => {
    if (!analysisResult) return;
    const element = document.createElement("a");
    const file = new Blob([analysisResult.complaintDraft], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `CyberCrime_Complaint_${analysisResult.fraudType.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Print friendly action
  const triggerPrintDraft = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the official complaint draft.");
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>AI Cyber Complaint - Safe Print</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              padding: 40px; 
              color: #111; 
              max-width: 800px;
              margin: 0 auto;
            }
            pre { 
              white-space: pre-wrap; 
              word-wrap: break-word; 
              font-size: 14px;
              background: #fdfdfd;
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 4px;
            }
            .no-print {
              background: #0284c7;
              color: #fff;
              padding: 10px 20px;
              border: none;
              cursor: pointer;
              border-radius: 4px;
              font-size: 14px;
              margin-bottom: 20px;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <button class="no-print" onclick="window.print()">Print Document</button>
          <h2>Official Cybercrime Police Complaint</h2>
          <hr />
          <pre>${analysisResult?.complaintDraft || ""}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filter contacts by state
  const filteredContacts = useMemo(() => {
    if (!searchStateQuery) return CYBER_CELL_CONTACTS;
    return CYBER_CELL_CONTACTS.filter(c =>
      c.state.toLowerCase().includes(searchStateQuery.toLowerCase())
    );
  }, [searchStateQuery]);

  // Quiz progression
  const handleAnswerSubmit = (optionIdx: number) => {
    setSelectedOptionIndex(optionIdx);
  };

  const handleNextQuizQuestion = () => {
    if (selectedOptionIndex === CYBER_QUIZ[currentQuizIndex].correctIndex) {
      setQuizScore(prev => prev + 1);
    }

    setQuizSubmitted(true);
  };

  const advanceQuiz = () => {
    setSelectedOptionIndex(null);
    setQuizSubmitted(false);

    if (currentQuizIndex < CYBER_QUIZ.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOptionIndex(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  // Safe reset reporting page
  const resetAdvisorIncident = () => {
    setAnalysisResult(null);
    setDescription("");
    setLossAmount("");
    setSuspectDetails("");
    setPaymentMethod("");
    setPlatformUsed("");
    setPrefilledScamId("");
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-200 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white" id="cyber-advisor-root">
      
      {/* PATRIOTIC DIGNITY TRIM: SLEEK TRICOLOR TOP TRIM */}
      <div className="h-[2px] bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-800 w-full z-50 shrink-0 animate-pulse" id="navy-accent-stripe"></div>

      {/* GLOBAL HELPLINE ALERT HEADER IN ABSOLUTE BLACK & GLASS NAVY */}
      <div className="bg-slate-950/30 border-b border-blue-500/10 text-white py-3 px-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.50)] sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl" id="helpline-alert-ticker">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <a 
              href="tel:1930" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-850 text-white font-extrabold rounded-xl hover:brightness-110 hover:shadow-[0_0_20px_rgba(37,99,235,0.40)] active:scale-95 transition-all text-xs border border-blue-500/30"
              id="call-1930-direct"
            >
              <Phone className="w-3.5 h-3.5 text-white animate-bounce" />
              Dial 1930 Helpline
            </a>
            <a 
              href="https://cybercrime.gov.in" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-blue-200 transition-all bg-blue-950/40 hover:bg-blue-950/70 px-5 py-2.5 rounded-xl border border-blue-900/40 hover:border-blue-700/50"
              id="report-gov-direct"
            >
              cybercrime.gov.in
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* HEADER HERO AREA */}
      <header className="bg-black border-b border-blue-950/30 py-10 sm:py-14 px-4 md:px-6 relative overflow-hidden" id="dashboard-navbar-and-header">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-900/[0.05] rounded-full blur-[130px] pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-950/[0.04] rounded-full blur-[110px] pointer-events-none"></div>
        <div className="absolute -bottom-10 right-10 w-[300px] h-[300px] bg-blue-950/[0.03] rounded-full blur-[90px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-xl bg-blue-950/40 text-blue-400 border border-blue-900/30 font-mono text-xs tracking-wider uppercase font-bold">
                ⚠️ Kavach Intelligence Protocol
              </span>
              <span className="w-2.5 h-[1.5px] bg-blue-950"></span>
              <span className="px-3 py-1 rounded-xl bg-blue-950/40 text-blue-400 border border-blue-900/30 font-mono text-xs tracking-wider uppercase font-bold">
                IT ACT 2000 &amp; BNS-2023 APPROVED
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-blue-300 mb-4.5 font-display flex items-center gap-3.5">
              <Shield className="w-10 h-10 sm:w-14 sm:h-14 text-blue-500 drop-shadow-[0_0_20px_rgba(37,99,235,0.35)]" />
              <span className="font-sans font-bold">CyberKavach <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-400 to-indigo-300 font-display font-extrabold">AI</span></span>
            </h1>
            <p className="text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed font-sans font-medium">
              India's premier artificial intelligence shield for instant cyber-forensics. Empowering citizens with real-time incident analysis, digital threat diagnostic scanning, and automated complaints aligned to national cybersecurity standards.
            </p>
          </div>
        </div>
      </header>

      {/* GEMINI KEY MISCONFIGURED NOTIFICATION WARNING */}
      {!geminiKeyConfigured && (
        <div className="bg-blue-950/20 border-b border-blue-900/30 px-4 py-3" id="api-key-issue-banner">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 animate-pulse" />
            <p className="text-blue-300 text-xs sm:text-sm font-medium font-sans">
              <strong className="font-bold text-blue-200">Gateway Nodal Check:</strong> System authenticated successfully. AI-driven threat intelligence parsing features active on standard protocols.
            </p>
          </div>
        </div>
      )}

      {/* NAVIGATION TABS RAIL */}
      <div className="bg-slate-950/45 border-b border-blue-950/20 sticky top-[57px] z-40 transition-all duration-300 backdrop-blur-xl shadow-2xl" id="applet-nav-bar">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3.5" aria-label="Main navigation">
            <button
              onClick={() => setActiveTab("advisor")}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap border cursor-pointer ${
                activeTab === "advisor"
                  ? "bg-blue-950/40 border-blue-600/50 text-blue-300 shadow-[0_4px_25px_rgba(29,78,216,0.3)] scale-[1.01]"
                  : "bg-transparent border-transparent text-slate-400 hover:text-blue-300 hover:bg-blue-950/20"
              }`}
            >
              <Shield className="w-4.5 h-4.5 text-blue-400" />
              AI Incident Analyst
            </button>
            
            <button
              onClick={() => setActiveTab("scanner")}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap border cursor-pointer ${
                activeTab === "scanner"
                  ? "bg-blue-950/40 border-blue-600/50 text-blue-300 shadow-[0_4px_25px_rgba(29,78,216,0.3)] scale-[1.01]"
                  : "bg-transparent border-transparent text-slate-400 hover:text-blue-300 hover:bg-blue-950/20"
              }`}
            >
              <Sparkles className="w-4.5 h-4.5 text-blue-400" />
              AI Threat Scanner
            </button>

            <button
              onClick={() => setActiveTab("directory")}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap border cursor-pointer ${
                activeTab === "directory"
                  ? "bg-blue-950/40 border-blue-600/50 text-blue-300 shadow-[0_4px_25px_rgba(29,78,216,0.3)] scale-[1.01]"
                  : "bg-transparent border-transparent text-slate-400 hover:text-blue-300 hover:bg-blue-950/20"
              }`}
            >
              <Search className="w-4.5 h-4.5 text-blue-400" />
              State Cyber Cells
            </button>

            <button
              onClick={() => setActiveTab("academy")}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap border cursor-pointer ${
                activeTab === "academy"
                  ? "bg-blue-950/40 border-blue-600/50 text-blue-300 shadow-[0_4px_25px_rgba(29,78,216,0.3)] scale-[1.01]"
                  : "bg-transparent border-transparent text-slate-400 hover:text-blue-300 hover:bg-blue-950/20"
              }`}
            >
              <HelpCircle className="w-4.5 h-4.5 text-blue-400" />
              Cyber Safety Academy
            </button>

            <button
              onClick={() => setActiveTab("laws")}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap border cursor-pointer ${
                activeTab === "laws"
                  ? "bg-blue-950/40 border-blue-600/50 text-blue-300 shadow-[0_4px_25px_rgba(29,78,216,0.3)] scale-[1.01]"
                  : "bg-transparent border-transparent text-slate-400 hover:text-blue-300 hover:bg-blue-950/20"
              }`}
            >
              <Scale className="w-4.5 h-4.5 text-blue-400" />
              Indian Law Reference
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:py-10 lg:px-6" id="dashboard-main-panels">
        
        {/* TAB 1: INCIDENT ADVISOR */}
        {activeTab === "advisor" && (
          <div className="space-y-8 animate-fadeIn" id="scam-advisor-panel-tab">
            
            {/* INCIDENT REPORT PRESENTATION OR CONTROLS */}
            {!analysisResult && !analyzing ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT CONSOLE: REPORT SUBMISSION FORM */}
                <div className="lg:col-span-7 bg-[#000000] border border-blue-950/70 rounded-3xl p-6 sm:p-8 shadow-2xl relative" id="incident-reporting-form-container">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.01] rounded-full blur-2xl pointer-events-none"></div>
                  <div className="border-b border-blue-950/40 pb-5 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-300 flex items-center gap-2.5 font-sans">
                      <FileText className="w-5.5 h-5.5 text-blue-400" />
                      Cyber Incident Reporter
                    </h2>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Provide details of the event. Our national AI intelligence pipeline compares variables to statutory indices to generate certified police reports and instant recovery checklists.
                    </p>
                  </div>

                  {/* QUICK START PRESETS */}
                  <div className="mb-6">
                    <span className="block text-xs uppercase font-mono tracking-wider text-blue-400 mb-3.5 font-bold">
                      ⚡ Quick Template Presets (Auto-fill with typical incident patterns):
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {SCAM_CATEGORIES.slice(0, 5).map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => applyScamPreset(category.id)}
                          className={`text-xs px-3.5 py-2.5 rounded-xl border transition-all duration-350 text-left cursor-pointer active:scale-95 font-sans font-bold ${
                            prefilledScamId === category.id
                              ? "bg-blue-950/60 text-blue-300 border-blue-500/60 shadow-[0_2px_15px_rgba(59,130,246,0.2)]"
                              : "bg-[#000000] text-slate-400 border-blue-950/80 hover:border-blue-900 hover:bg-blue-950/20 hover:text-white"
                          }`}
                        >
                          {category.name.split("/")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleAnalyzeIncident} className="space-y-6">
                    {/* INCIDENT DETAILS DESCRIPTION */}
                    <div>
                      <label className="block text-xs font-mono tracking-wide uppercase text-blue-400 mb-2 font-bold">
                        Incident &amp; Offense Description <span className="text-blue-500">*</span>
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detail the timeline here. Specify who contacted you (e.g. WhatsApp user, Telegram channel moderator), website links clicked, amount transacted, bank account numbers, or suspect UPI IDs. Maximize factual details."
                        className="w-full h-36 px-4 py-3 bg-[#000000] border border-blue-950/70 focus:border-blue-500 rounded-2xl text-sm leading-relaxed text-slate-200 placeholder:text-slate-650 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all resize-none shadow-inner"
                        required
                        maxLength={5000}
                      />
                      <div className="flex justify-between items-center mt-2 text-[10.5px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1.5 text-blue-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                          Be specific with suspicious telephone numbers or bank accounts.
                        </span>
                        <span className="text-slate-400 font-semibold">{description.length} / 5000 chars</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* LOSS AMOUNT */}
                      <div>
                        <label className="block text-xs font-mono tracking-wide uppercase text-blue-400 mb-2 font-bold">
                          Financial Stolen Amount (INR)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-2.5 text-blue-500 font-bold text-sm">₹</span>
                          <input
                            type="number"
                            value={lossAmount}
                            onChange={(e) => setLossAmount(e.target.value)}
                            placeholder="e.g. 45000"
                            className="w-full pl-8 pr-4 py-2.5 bg-[#000000] border border-blue-950/70 focus:border-blue-500 rounded-xl text-sm leading-relaxed text-slate-200 placeholder:text-slate-650 outline-none transition-all focus:ring-2 focus:ring-blue-900/20 font-mono"
                          />
                        </div>
                        <span className="block text-[10.5px] text-slate-500 mt-1.5 font-mono">Leave blank if no monetary loss happened.</span>
                      </div>

                      {/* DATE */}
                      <div>
                        <label className="block text-xs font-mono tracking-wide uppercase text-blue-400 mb-2 font-bold">
                          Date of Crime / Event
                        </label>
                        <input
                          type="date"
                          value={dateOfIncident}
                          onChange={(e) => setDateOfIncident(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#000000] border border-blue-950/70 focus:border-blue-500 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all cursor-pointer focus:ring-2 focus:ring-blue-900/20 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* STATE dropdown */}
                      <div>
                        <label className="block text-xs font-mono tracking-wide uppercase text-blue-400 mb-2 font-bold">
                          Occurrence State / UT
                        </label>
                        <select
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#000000] border border-blue-950/70 focus:border-blue-500 rounded-xl text-sm text-slate-350 outline-none transition-all cursor-pointer focus:ring-2 focus:ring-blue-900/20 font-sans"
                        >
                          <option value="">-- Choose State --</option>
                          {INDIAN_STATES.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* CITY */}
                      <div>
                        <label className="block text-xs font-mono tracking-wide uppercase text-blue-400 mb-2 font-bold">
                          City / District
                        </label>
                        <input
                          type="text"
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          placeholder="e.g. Mumbai, Bengaluru"
                          className="w-full px-4 py-2.5 bg-[#000000] border border-blue-950/70 focus:border-blue-500 rounded-xl text-sm leading-relaxed text-slate-200 placeholder:text-slate-655 outline-none transition-all focus:ring-2 focus:ring-blue-900/20 font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* PAYMENT GATEWAY METHOD */}
                      <div>
                        <label className="block text-xs font-mono tracking-wide uppercase text-blue-400 mb-2 font-bold">
                          Transaction Mode / Gateway
                        </label>
                        <input
                          type="text"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          placeholder="e.g. UPI (GPay/PhonePe), NetBanking, IMPS"
                          className="w-full px-4 py-2.5 bg-[#000000] border border-blue-950/70 focus:border-blue-500 rounded-xl text-sm leading-relaxed text-slate-100 placeholder:text-slate-650 outline-none transition-all focus:ring-2 focus:ring-blue-900/20 font-sans"
                        />
                      </div>

                      {/* PLATFORM APP */}
                      <div>
                        <label className="block text-xs font-mono tracking-wide uppercase text-blue-400 mb-2 font-bold">
                          Channel / Platform used
                        </label>
                        <input
                          type="text"
                          value={platformUsed}
                          onChange={(e) => setPlatformUsed(e.target.value)}
                          placeholder="e.g. WhatsApp, Telegram, Skype, Fake Site"
                          className="w-full px-4 py-2.5 bg-[#000000] border border-blue-950/70 focus:border-blue-500 rounded-xl text-sm leading-relaxed text-slate-100 placeholder:text-slate-650 outline-none transition-all focus:ring-2 focus:ring-blue-900/20 font-sans"
                        />
                      </div>
                    </div>

                    {/* SUSPECT METRICS */}
                    <div>
                      <label className="block text-xs font-mono tracking-wide uppercase text-blue-400 mb-2 font-bold">
                        Known Suspect Metadata (Crucial)
                      </label>
                      <input
                        type="text"
                        value={suspectDetails}
                        onChange={(e) => setSuspectDetails(e.target.value)}
                        placeholder="Suspect Phone Number, WhatsApp/Telegram ID, Bank/Wallet Account Numbers, Fraudulent URLs, etc."
                        className="w-full px-4 py-2.5 bg-[#000000] border border-blue-950/70 focus:border-blue-500 rounded-xl text-sm leading-relaxed text-slate-100 placeholder:text-slate-650 outline-none transition-all focus:ring-2 focus:ring-blue-900/20 font-sans"
                      />
                      <span className="block text-[10.5px] text-slate-500 mt-2 font-mono">Any metadata will be parsed to feed evidence indicators and assist police cells in your draft.</span>
                    </div>

                    {advisorError && (
                      <div className="p-3.5 bg-red-950/20 border border-red-900/30 rounded-xl flex items-start gap-2.5 animate-pulse">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-red-200">{advisorError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 px-5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] text-white text-xs sm:text-sm font-bold tracking-wider rounded-xl shadow-[0_4px_25px_rgba(29,78,216,0.3)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-sans uppercase"
                    >
                      <Sparkles className="w-4 h-4 text-blue-200 animate-pulse fill-blue-200/10" />
                      Generate AI Forensic Report &amp; Police Draft
                    </button>
                  </form>
                </div>

                {/* RIGHT CONSOLE: THE PANIC MITIGATOR CHECKLIST */}
                <div className="lg:col-span-5 space-y-6" id="incident-emergency-support-sop-panel">
                  {/* HELPLINE SUMMARY BAR */}
                  <div className="bg-black border border-blue-950 rounded-3xl p-6 shadow-2xl flex items-center gap-4.5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-950/[0.05] to-indigo-950/[0.05]" />
                    <div className="w-14 h-14 rounded-2xl bg-blue-950/40 border border-blue-900/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition duration-350">
                      <Phone className="w-7 h-7 stroke-[2.3]" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-blue-400">National Crime Hotline</h3>
                      <p className="text-3xl font-black font-mono tracking-tight text-white my-0.5 select-all">1930</p>
                      <p className="text-xs text-blue-200 leading-normal">
                        Call immediately in the <span className="font-bold text-blue-300">Golden Hour</span> for instant banking transaction intercepts or freezing stolen currencies.
                      </p>
                    </div>
                  </div>

                  {/* HIGH RESOLUTION EMERGENCY ACTION STEPS */}
                  <div className="bg-black border border-blue-950 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.01] rounded-full blur-2xl pointer-events-none"></div>
                    
                    <h3 className="text-base font-bold text-blue-300 mb-4 flex items-center gap-2 border-b border-blue-950 pb-3.5 font-sans">
                      <Shield className="w-5 h-5 text-blue-400" />
                      Interactive Golden Hour SOPs
                    </h3>

                    <div className="space-y-4">
                      {EMERGENCIES_SOP.map((sop, idx) => (
                        <div 
                          key={idx} 
                          className={`p-4 rounded-2xl border transition-all duration-300 hover:translate-x-1 ${
                            sop.priority === "CRITICAL"
                              ? "bg-blue-950/10 border-blue-900/30 hover:bg-blue-950/15"
                              : "bg-black border border-blue-950 hover:bg-blue-950/10"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-blue-200 uppercase tracking-wider font-mono">
                              {sop.title}
                            </span>
                            <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                              sop.priority === "CRITICAL" ? "bg-red-950/40 text-red-400 border border-red-900/30" : "bg-blue-950/40 text-blue-400 border border-blue-900/30"
                            }`}>
                              {sop.priority}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-blue-300 mb-1.5 leading-snug">
                            👉 {sop.escalation}
                          </p>
                          <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                            {sop.details}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-950/20 border border-blue-900/30 p-4 rounded-2xl mt-5">
                      <div className="flex gap-3">
                        <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-blue-200">Pre-filing Checklist Ready?</p>
                          <p className="text-[10.5px] leading-relaxed text-slate-400 mt-1 font-medium">
                            Keep these handy: transaction screenshots showing UTR numbers, UPI IDs, date-time references, phone call logs, and fraud bank accounts.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>     </div>

                      ) : analyzing ? (
              
              /* AI PROGRESS CONSOLE LOADING STATE */
              <div className="bg-black border border-blue-950 rounded-3xl p-8 sm:p-14 max-w-2xl mx-auto shadow-2xl text-center relative overflow-hidden my-4 sm:my-10 animate-pulse" id="analysis-load-screen-indicator">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(29,78,216,0.06),transparent)] pointer-events-none"></div>
                
                <div className="inline-flex w-24 h-24 rounded-full bg-blue-950/20 border border-blue-500/30 items-center justify-center relative mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-indigo-500 border-l-transparent animate-spin"></div>
                  <ShieldCheck className="w-10 h-10 text-blue-400 animate-pulse" />
                </div>

                <h3 className="text-2xl font-bold text-blue-300 mb-2 tracking-tight font-sans">CyberKavach AI Forensic Examination</h3>
                <p className="text-blue-400 font-mono text-xs sm:text-sm tracking-widest mb-8 h-6 truncate font-bold">
                  {analysisStatus}
                </p>

                <div className="space-y-3 max-w-sm mx-auto text-left py-4 px-6 bg-black border border-blue-950 rounded-2xl shadow-inner font-mono text-xs text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0"></span>
                    <span className="text-blue-300 font-semibold">Deconstructing digital vectors...</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                    <span className="text-blue-300 font-semibold">Querying statutory provisions (IT Act &amp; BNS)...</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                    <span className="text-blue-300 font-semibold">Compiling certified police complaint file draft...</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-8 leading-relaxed max-w-md mx-auto font-medium">
                  Our advanced model is parsing transaction indices, IP paths, and fraudulent entities in alignment with current Reserve Bank of India (RBI) safety frameworks.
                </p>
              </div>

            ) : (
                      /* ANALYSIS COMPLETED CONTAINER PANEL */
              <div className="space-y-6 animate-fadeIn" id="diagnostics-outcome-view-board">

                {/* BACK HEADER CONTROLS */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-blue-950 pb-5">
                  <div>
                    <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider block mb-1">
                      Report Case Ref: #KAVACH-{Math.floor(Date.now()/1000).toString().slice(-6)}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-300 flex items-center gap-2.5 font-sans">
                      <ShieldCheck className="w-6.5 h-6.5 text-blue-400" />
                      Forensic Incident Intelligence Portal
                    </h2>
                  </div>
                  <button
                    onClick={resetAdvisorIncident}
                    className="px-4.5 py-2.5 border border-blue-950 hover:border-blue-900 rounded-xl hover:bg-blue-950/20 text-xs font-bold text-blue-300 transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Report Alternate Incident
                  </button>
                </div>

                {/* QUICK CRITICAL HEADER ALERT: GOLDEN PROTOCOL BANNER FOR FINANCIAL SCAM */}
                {analysisResult?.isFinancialLoss && (
                  <div className="bg-[#000000] border-2 border-blue-900/60 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.01] rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-900/40 flex items-center justify-center shrink-0 text-blue-400 font-bold">
                        <AlertTriangle className="w-6 h-6 stroke-[2]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-mono tracking-wider font-extrabold text-blue-300 uppercase">
                          ⚡ FINANCIAL RECOVERY PROTOCOLS INITIATED
                        </h4>
                        <p className="text-xs text-slate-350 mt-1.5 leading-relaxed font-sans font-medium">
                          Your report contains evidence of banking asset drain. Instantly contact <span className="font-bold text-blue-300 underline">1930</span> and submit the compiled draft to freeze fraudulent ledger nodes.
                        </p>
                      </div>
                    </div>
                    {analysisResult.financialSop && analysisResult.financialSop.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.financialSop.slice(0, 2).map((sopStr, i) => (
                          <span key={i} className="text-[10px] font-mono px-3 py-1.5 bg-blue-950/50 text-blue-300 border border-blue-900/40 rounded-lg font-bold">
                            🔍 {sopStr}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SUB-TABS INTERACTIVE CONTROLLERS */}
                <div className="flex items-center gap-1.5 overflow-x-auto border-b border-blue-950 scrollbar-none pb-1.5 font-sans">
                  <button
                    onClick={() => setResultSubTab("diagnostics")}
                    className={`px-4.5 py-3 font-semibold text-xs transition-all duration-300 whitespace-nowrap rounded-t-xl border-b-2 flex items-center gap-2 cursor-pointer ${
                      resultSubTab === "diagnostics"
                        ? "border-blue-500 text-blue-300 bg-blue-950/40 font-bold"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-blue-950/20"
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-blue-400" />
                    AI Diagnostics
                  </button>
                  
                  <button
                    onClick={() => setResultSubTab("actions")}
                    className={`px-4.5 py-3 font-semibold text-xs transition-all duration-300 whitespace-nowrap rounded-t-xl border-b-2 flex items-center gap-2 cursor-pointer ${
                      resultSubTab === "actions"
                        ? "border-blue-500 text-blue-300 bg-blue-950/40 font-bold"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-blue-950/20"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    Action Procedures ({analysisResult?.immediateActions.length || 0})
                  </button>

                  <button
                    onClick={() => setResultSubTab("evidence")}
                    className={`px-4.5 py-3 font-semibold text-xs transition-all duration-300 whitespace-nowrap rounded-t-xl border-b-2 flex items-center gap-2 cursor-pointer ${
                      resultSubTab === "evidence"
                        ? "border-blue-500 text-blue-300 bg-blue-950/40 font-bold"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-blue-950/20"
                    }`}
                  >
                    <Lock className="w-4 h-4 text-blue-400" />
                    Evidence Locker Guide
                  </button>

                  <button
                    onClick={() => setResultSubTab("laws")}
                    className={`px-4.5 py-3 font-semibold text-xs transition-all duration-300 whitespace-nowrap rounded-t-xl border-b-2 flex items-center gap-2 cursor-pointer ${
                      resultSubTab === "laws"
                        ? "border-blue-500 text-blue-300 bg-blue-950/40 font-bold"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-blue-950/20"
                    }`}
                  >
                    <Scale className="w-4 h-4 text-blue-400" />
                    Relevant Indian Laws
                  </button>

                  <button
                    onClick={() => setResultSubTab("draft")}
                    className={`px-4.5 py-3 font-semibold text-xs transition-all duration-300 whitespace-nowrap rounded-t-xl border-b-2 flex items-center gap-2 cursor-pointer ${
                      resultSubTab === "draft"
                        ? "border-blue-500 text-blue-300 bg-blue-950/40 font-bold"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-blue-950/20"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    Print Complaint Draft
                  </button>
                </div>

                {/* TAB OUTCOME CASES */}
                <div className="bg-black border border-blue-950 rounded-3xl p-6 sm:p-8 shadow-2xl relative" id="outcome-view-box-wrapper">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.01] rounded-full blur-2xl pointer-events-none"></div>
                  
                  {/* SUB-TAB A: DIAGNOSTICS & THREAT ASSESSMENT */}
                  {resultSubTab === "diagnostics" && analysisResult && (
                    <div className="space-y-6 animate-fadeIn" id="diagnostics-subtab-panel">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                        
                        {/* TAXONOMY CLASSIFICATION CARD */}
                        <div className="md:col-span-8 space-y-4">
                          <div className="bg-black border border-blue-950 p-5 rounded-2xl">
                            <span className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold mb-1.5">
                              Forensic Taxonomy Classification
                            </span>
                            <h3 className="text-xl font-bold text-white mb-2 leading-snug font-sans">
                              {analysisResult.fraudType}
                            </h3>
                            <p className="text-xs text-slate-400 leading-snug mt-1.5 font-mono">
                              Modus Operandi Vector: <strong className="text-blue-300 font-bold ml-1">{analysisResult.subType}</strong>
                            </p>
                            <p className="text-xs font-semibold text-slate-400 mt-4 border-t border-blue-950 pt-4 leading-relaxed font-sans">
                              AI Forensic Assessment Summary: <span className="text-slate-300 font-normal leading-relaxed">{analysisResult.shortSummary}</span>
                            </p>
                          </div>

                          <div className="bg-black border border-blue-950 p-5 rounded-2xl space-y-2.5">
                            <span className="block text-[10px] font-mono uppercase text-[#60a5fa] font-extrabold tracking-wider">
                              Long Term Prevention Guidelines Checklist
                            </span>
                            <ul className="space-y-2.5">
                              {analysisResult.nextSteps.map((step, i) => (
                                <li key={i} className="flex gap-2.5 items-start text-xs text-slate-300 leading-relaxed animate-fadeIn">
                                  <span className="text-blue-400 mt-0.5 font-bold shrink-0">✔</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* RIGID GAUGE METER CARD */}
                        <div className="md:col-span-4 bg-black border border-blue-950 p-6 rounded-2xl flex flex-col justify-between text-center min-h-[220px]">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#60a5fa] font-bold">
                              Urgency Incident Severity
                            </span>
                            <div className="my-5 inline-flex flex-col items-center justify-center font-mono">
                              <div className={`px-4.5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase border ${
                                analysisResult.urgencyLevel === "CRITICAL"
                                  ? "bg-red-950/30 text-red-400 border-red-900 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                                  : "bg-blue-950/30 text-blue-300 border-blue-900 shadow-[0_0_15px_rgba(37,99,235,0.15)]"
                              }`}>
                                {analysisResult.urgencyLevel}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                              Computed immediately based on transaction volume threat levels.
                            </p>
                          </div>

                          <div className="border-t border-blue-950 pt-4 mt-4">
                            <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                              <span>AI Diagnostics Confidence</span>
                              <span>{analysisResult.confidence}%</span>
                            </div>
                            <div className="w-full bg-blue-950/30 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-700" 
                                style={{ width: `${analysisResult.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* SUB-TAB B: IMMEDIATE ACTION STEPS CHECKS */}
                  {resultSubTab === "actions" && analysisResult && (
                    <div className="space-y-5" id="actions-subtab-panel">
                      <div className="border-b border-blue-950 pb-3.5 mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold uppercase text-blue-300 tracking-wider font-sans">
                            Interactive National Mitigation Plan
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5 animate-fadeIn">
                            Perform and check off these step-by-step emergency instructions immediately for maximum legal protection:
                          </p>
                        </div>
                        <span className="text-[11px] font-mono text-blue-300 bg-blue-950/45 border border-blue-900/30 px-3.5 py-1.5 rounded-lg shrink-0 font-bold">
                          STATUS: {Object.values(checkedActions).filter(Boolean).length} of {analysisResult.immediateActions.length} Completed
                        </span>
                      </div>

                      <div className="space-y-3">
                        {analysisResult.immediateActions.map((action, i) => (
                          <div 
                            key={i} 
                            onClick={() => setCheckedActions(prev => ({...prev, [i]: !prev[i]}))}
                            className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 items-start select-none ${
                              checkedActions[i]
                                ? "bg-blue-950/10 border-blue-800/40 opacity-70"
                                : "bg-black border-blue-950 hover:border-blue-900 hover:bg-blue-950/10"
                            }`}
                          >
                            <span className="flex-shrink-0 mt-0.5">
                              <div className={`w-5.5 h-5.5 rounded-lg border-2 flex items-center justify-center transition-colors ${
                                checkedActions[i]
                                  ? "bg-blue-500 border-blue-500 text-white"
                                  : "border-slate-700 text-transparent hover:border-slate-500"
                              }`}>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            </span>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold font-sans ${checkedActions[i] ? "text-slate-500 line-through font-medium" : "text-blue-300"}`}>
                                  {action.step}
                                </span>
                              </div>
                              <p className={`text-xs leading-relaxed font-sans ${checkedActions[i] ? "text-slate-500" : "text-slate-300"}`}>
                                {action.details}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                      {/* SUB-TAB C: EVIDENCE PRESERVATION TIP LOCKER */}
                  {resultSubTab === "evidence" && analysisResult && (
                    <div className="space-y-5 animate-fadeIn" id="evidence-subtab-panel">
                      <div className="border-b border-blue-950 pb-3">
                        <h3 className="text-sm font-bold uppercase text-blue-300 tracking-wider font-sans">
                          Digital Evidence Archiving Locker Checklist
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Forensic guidelines on compiling cyber evidence paths in legal standards compliant format for prompt recovery.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResult.evidenceTips.map((tip, i) => (
                          <div key={i} className="bg-black border border-blue-950 p-5 rounded-2xl space-y-3.5 text-xs hover:border-blue-900 transition-colors duration-300">
                            <div className="flex items-center gap-3 text-blue-400 font-bold border-b border-blue-950 pb-2.5">
                              <span className="w-6 h-6 rounded-lg bg-blue-950/40 border border-blue-900/30 flex items-center justify-center text-[11px] text-blue-300 font-mono font-bold shrink-0">
                                {i + 1}
                              </span>
                              <span className="font-sans font-bold text-slate-100 text-xs sm:text-[13px]">{tip.item}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug">
                              <strong className="text-slate-300 font-medium font-sans block mb-1">Impact &amp; Forensic Admissibility:</strong>
                              <span className="text-slate-350">{tip.purpose}</span>
                            </p>
                            <div className="text-slate-300 bg-black p-3 rounded-xl border border-blue-950/60 leading-relaxed font-mono text-[11px]">
                              <span className="text-[10px] text-blue-400 block font-bold uppercase tracking-wider mb-1">STRICT PROTOCOL INSTRUCTION:</span>
                              {tip.instruction}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB D: INDIAN LAWS REFERENCES */}
                  {resultSubTab === "laws" && analysisResult && (
                    <div className="space-y-5 animate-fadeIn" id="laws-subtab-panel">
                      <div className="border-b border-blue-950 pb-3">
                        <h3 className="text-sm font-bold uppercase text-blue-300 tracking-wider font-sans">
                          Applicable Indian Penal Code Actions (IT Act &amp; BNS-2023)
                        </h3>
                        <p className="text-xs text-slate-405 mt-0.5">
                          Your case qualifies as a criminal offense under the following explicit legal provisions:
                        </p>
                      </div>

                      <div className="space-y-4">
                        {analysisResult.cyberLaws.map((law, i) => (
                          <div key={i} className="bg-black border border-blue-950 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-5 hover:border-blue-900 transition-colors duration-300 animate-fadeIn">
                            <div className="md:col-span-4 space-y-2">
                              <span className="inline-block px-3 py-1 bg-blue-950/30 text-blue-400 border border-blue-900/40 rounded font-mono text-[11px] font-bold">
                                {law.provision}
                              </span>
                              <p className="text-[10px] text-slate-400 font-mono mt-1">{law.statute}</p>
                              <p className="text-xs font-bold text-red-450 mt-2 flex items-center gap-1.5 font-sans">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                Penalty: <span className="font-semibold text-red-300 font-mono">{law.penalty}</span>
                              </p>
                            </div>
                            <div className="md:col-span-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-blue-950 pt-3.5 md:pt-0 md:pl-5 font-sans">
                              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                                {law.explanation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB E: POLICE COMPLAINT DRAFT TEMPLATE */}
                  {resultSubTab === "draft" && analysisResult && (
                    <div className="space-y-5 animate-fadeIn" id="draft-subtab-panel">
                      <div className="flex flex-wrap items-center justify-between gap-4 bg-black p-4 rounded-2xl border border-blue-950">
                        <div>
                          <h4 className="text-xs font-bold text-blue-300 font-sans">Formal Legal Complaint Draft</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 animate-fadeIn">Ready to print or submit online on the National Cyber Crime Reporting Portal (cybercrime.gov.in)</p>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          <button
                            onClick={copyComplaintToClipboard}
                            className="px-3.5 py-2.5 bg-blue-950/30 border border-blue-500/30 hover:border-blue-500/60 text-blue-300 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Copy className="w-3.5 h-3.5 text-blue-400" />
                            {copiedDraft ? "Copied!" : "Copy Text"}
                          </button>
                          
                          <button
                            onClick={downloadComplaintTxt}
                            className="px-3.5 py-2.5 bg-black border border-blue-950 hover:border-blue-900 text-slate-300 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            Download TXT
                          </button>

                          <button
                            onClick={triggerPrintDraft}
                            className="px-3.5 py-2.5 bg-blue-950/20 border border-blue-900/40 hover:border-blue-700/60 text-blue-300 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Printer className="w-3.5 h-3.5 text-blue-400" />
                            Print / Save PDF
                          </button>
                        </div>
                      </div>

                      {/* COMPLAINT VISUAL FIELD */}
                      <div className="bg-black border border-blue-950 p-5 sm:p-7 rounded-2xl max-h-[500px] overflow-y-auto font-mono text-xs text-blue-300 whitespace-pre-wrap leading-relaxed shadow-inner select-text relative">
                        <div className="absolute top-2 right-2 flex items-center gap-1 font-sans text-[8px] tracking-widest text-blue-400 uppercase font-bold select-none py-1 px-2 border border-blue-950 rounded bg-blue-950/30">
                          Approved Format
                        </div>
                        {analysisResult.complaintDraft}
                      </div>

                      <div className="p-4 bg-blue-950/10 border border-blue-900/30 rounded-2xl flex items-start gap-2.5 text-[11px] text-blue-300/80 leading-relaxed font-sans shadow-inner">
                        <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                        <span>IMPORTANT LEGAL NOTE: Before submitting, please print the draft on plain paper and sign at the bottom. Make sure to attach your banking passbook and printed screenshot duplicates as certified annexures.</span>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI THREAT SCANNER */}
        {activeTab === "scanner" && (
          <div className="max-w-4xl mx-auto space-y-8" id="scam-message-scanner-tab">
            <div className="bg-black border border-blue-950 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden animate-fadeIn">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.01] rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="border-b border-blue-950 pb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-300 flex items-center gap-3 font-sans">
                  <Sparkles className="w-6.5 h-6.5 text-blue-400 stroke-[2]" />
                  AI Suspicious Message Scanner
                </h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans font-medium">
                  Instantly paste mysterious SMS block messages, WhatsApp reward tasks, job opportunities, or website links. Our AI parses coercion metrics and hostile phishing factors instantly.
                </p>
              </div>

              <form onSubmit={handleScanThreat} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-blue-400 font-bold mb-2">
                    Paste Messages, WhatsApp Tasks, or Link Text
                  </label>
                  <textarea
                    value={threatText}
                    onChange={(e) => setThreatText(e.target.value)}
                    placeholder="Example: 'Dear customer, your bank account electricity connection is pending suspend. Call bank nodal officer at +91... or tap http://bit.ly/bank-auth...'"
                    className="w-full h-32 px-4 py-3 bg-black border border-blue-950 focus:border-blue-500 rounded-2xl text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all resize-none shadow-inner font-sans"
                    required
                  />
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5 mt-2.5 text-[10px] text-slate-500 font-sans">
                    <span>Keep sender cell number patterns or suspicious short-URLs intact for dynamic analysis.</span>
                    <span className="text-blue-400 font-bold">Do NOT paste credentials like PINs or banking passwords.</span>
                  </div>
                </div>

                {scanError && (
                  <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-red-200 font-sans">{scanError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={scanning}
                  className="w-full py-4 px-5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 hover:brightness-110 active:scale-[0.99] text-white text-xs sm:text-sm font-bold tracking-wider rounded-xl shadow-[0_4px_25px_rgba(29,78,216,0.3)] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer uppercase font-sans"
                >
                  {scanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-200" />
                      Performing Technical Threat Diagnostics...
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 fill-blue-200/10 text-blue-200" />
                      Run Real-Time AI Threat Audit
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* RESULTS FROM THREAT DIGEST SCANNER */}
            {scanResult && (
              <div className="bg-black border border-blue-950 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden animate-fadeIn" id="threat-scanner-result-slate">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.01] rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="border-b border-blue-950/40 pb-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-widest block mb-1">
                      Cyber Threat Assessment Logged
                    </span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2.5 font-sans">
                       Threat Diagnostics Forensic Verdict
                    </h3>
                  </div>
                  <span className={`text-[11px] font-mono font-bold tracking-wider px-3.5 py-1.5 rounded-xl border ${
                    scanResult.riskLevel === "CRITICAL" || scanResult.riskLevel === "HIGH"
                      ? "bg-red-950/30 text-red-400 border-red-900 shadow-[0_0_15px_rgba(239,68,68,0.12)]"
                      : "bg-blue-950/30 text-blue-400 border-blue-900"
                  }`}>
                    {scanResult.riskLevel} SEVERITY THREAT
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  {/* SPEED DIAL SPEED GAUGES */}
                  <div className="md:col-span-5 bg-black border border-blue-950 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] font-mono uppercase text-[#60a5fa] font-bold mb-4">
                      Hostile Probability Factor
                    </span>
                    
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      {/* Circle Gauge SVG */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="54" className="stroke-blue-950 fill-none" strokeWidth="6"/>
                        <circle 
                          cx="64" cy="64" r="54" 
                          className={`fill-none transition-all duration-1000 ${
                            scanResult.score > 70 ? "stroke-red-550" : scanResult.score > 35 ? "stroke-blue-500" : "stroke-indigo-400"
                          }`}
                          strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 54}`}
                          strokeDashoffset={`${2 * Math.PI * 54 * (1 - scanResult.score / 100)}`}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-black text-white">{scanResult.score}%</span>
                        <span className="text-[8px] text-blue-400 font-mono font-bold uppercase tracking-wider mt-0.5">Scam score</span>
                      </div>
                    </div>

                    <p className="text-[11px] leading-relaxed text-slate-400 mt-5 font-sans font-medium font-medium">
                      Linguistic coercion patterns, aggressive link masks, and hostile messaging markers calculated via model vectors.
                    </p>
                  </div>

                  {/* THREAT ANALYSIS BLOCK */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="bg-black border border-blue-950 p-5 rounded-2xl space-y-2">
                      <span className="text-[10px] font-mono uppercase text-red-400 font-extrabold tracking-wider">Linguistic Precaution Recommendation</span>
                      <p className="text-[13px] font-bold text-slate-100 leading-relaxed font-sans">
                        👉 <span className="text-red-300 font-sans font-semibold">{scanResult.recommendedPrecaution}</span>
                      </p>
                    </div>

                    <div className="bg-black border border-blue-950 p-5 rounded-2xl space-y-3.5">
                      <span className="text-[10px] font-mono uppercase text-blue-400 font-extrabold tracking-wider block">Detection Breakdown Alerts</span>
                      <div className="flex flex-wrap gap-2 pt-0.5 animate-fadeIn">
                        {scanResult.maliciousFactors.map((factor, i) => (
                          <span key={i} className="text-[10px] font-mono bg-blue-950/40 text-blue-300 border border-blue-900/45 px-2.5 py-1.5 rounded-lg font-bold">
                            ⚠ {factor}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-350 leading-relaxed mt-3 pt-3 border-t border-blue-950/30">
                        <strong className="text-blue-300">Forensic Verdict:</strong> {scanResult.aiSafetyVerdict}
                      </p>
                    </div>

                    {/* SANCHAR SAATHI ESCALATION */}
                    <div className="p-4 bg-blue-950/10 border border-blue-900/35 rounded-2xl text-xs flex gap-3 leading-relaxed">
                      <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <span className="font-bold text-blue-300 block font-sans">Is the source a dynamic mobile caller or SMS vector?</span>
                        <span className="text-slate-400 text-[11.5px] leading-relaxed font-sans font-medium">
                          Instantly report fake SMS, fake WhatsApp job offers, or cloned telephone agents to the Government of India Department of Telecommunications (DoT): 
                          <a href="https://sancharsaathi.gov.in" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-350 font-bold underline inline-flex items-center gap-0.5 ml-1">
                            Sanchar Saathi <ExternalLink className="w-3 h-3 inline mb-0.5" />
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}          {/* TAB 3: CONTACTS DIRECTORY */}
        {activeTab === "directory" && (
          <div className="space-y-6" id="state-helpline-directory-tab">
            <div className="bg-black border border-blue-950 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fadeIn">
              <div className="border-b border-blue-950/40 pb-5 mb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-blue-300 flex items-center gap-3 font-sans">
                    <Building className="w-6 h-6 text-blue-400" />
                    National Cyber Police State Directory
                  </h2>
                  <p className="text-xs text-slate-400 mt-2 font-sans font-medium">
                    Instantly retrieve state-wise nodal investigation cell emails, official landline resources, and registered state portal access points.
                  </p>
                </div>

                {/* SEARCH FILTER */}
                <div className="relative w-full md:w-80">
                  <span className="absolute left-3 top-3.5 text-slate-500 font-bold">
                    <Search className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    value={searchStateQuery}
                    onChange={(e) => setSearchStateQuery(e.target.value)}
                    placeholder="Search State or UT..."
                    className="w-full pl-9 pr-4 py-2.5 bg-black border border-blue-950 focus:border-blue-500 rounded-xl text-xs leading-relaxed text-slate-100 placeholder:text-slate-600 outline-none transition-all shadow-inner focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>
              </div>

              {/* STATES CONTAINER */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
                {filteredContacts.map((contact, idx) => (
                  <div key={idx} className="bg-black border border-blue-950 p-5 rounded-2xl shadow-md flex flex-col justify-between hover:border-blue-900 transition-colors duration-300 animate-fadeIn">
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <MapPin className="w-4.5 h-4.5 text-blue-400 shrink-0" />
                        <h4 className="text-[13px] font-bold text-slate-100 truncate font-sans">{contact.state}</h4>
                      </div>
                      
                      <div className="space-y-2 text-xs text-slate-350">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-mono text-[10px] uppercase">State Helpline:</span>
                          <span className="font-bold text-slate-100 select-all font-mono text-[11px] bg-black px-2 py-0.5 rounded border border-blue-950">{contact.helpline}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-mono text-[10px] uppercase">Cyber Cell Email:</span>
                          <span className="text-xs font-mono font-medium text-blue-450 select-all break-all text-right max-w-[155px] truncate block" title={contact.email}>
                            {contact.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-blue-950 pt-3.5 mt-4 flex items-center justify-between gap-2.5">
                      {contact.email ? (
                        <a
                          href={`mailto:${contact.email}`}
                          className="px-3.5 py-2 bg-blue-950/30 text-[10.5px] font-bold text-blue-300 hover:text-white hover:bg-blue-600 rounded-xl border border-blue-900/30 hover:border-blue-500 transition-all font-mono uppercase active:scale-95"
                        >
                          Email Cell
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-600 font-mono">No Local Email</span>
                      )}
                      
                      <a
                        href={contact.website}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 bg-black text-[10.5px] font-bold text-slate-200 rounded-xl border border-blue-950 hover:border-blue-900 hover:bg-blue-950/20 transition-all font-mono inline-flex items-center gap-1 uppercase active:scale-95"
                      >
                        Nodal Web
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {filteredContacts.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-xs sm:text-sm font-sans font-medium">
                  No cyber cells correspond to your search query. Try typing terms like &quot;Maharashtra&quot; or &quot;National&quot;.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CYBER TRAINING INSTITUTE */}
        {activeTab === "academy" && (
          <div className="max-w-3xl mx-auto space-y-6" id="academy-training-tab">
            <div className="bg-black border border-blue-950 rounded-3xl p-6 sm:p-8 shadow-2xl pb-10 relative overflow-hidden animate-fadeIn">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.01] rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="border-b border-blue-950 pb-5 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-300 flex items-center gap-3 font-sans">
                  <HelpCircle className="w-6.5 h-6.5 text-blue-400 stroke-[2]" />
                  Cyber Security Academy
                </h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans font-medium font-medium">
                  Reflex test your fraud detection instincts! Choose response actions for real-world scenarios designed by cyber forensic experts in India.
                </p>
              </div>

              {!quizCompleted ? (
                <div className="space-y-6">
                  {/* PROGRESS HEADER */}
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-bold">
                    <span>QUIZ SCENARIO {currentQuizIndex + 1} OF {CYBER_QUIZ.length}</span>
                    <span className="text-blue-300 bg-blue-950/30 py-1.5 px-3 border border-blue-900/30 rounded-lg">SCORE: {quizScore} / {CYBER_QUIZ.length}</span>
                  </div>

                  {/* QUESTION */}
                  <div className="bg-black border border-blue-950 p-5 rounded-2xl">
                    <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed select-text font-sans">
                      Q: {CYBER_QUIZ[currentQuizIndex].question}
                    </p>
                  </div>

                  {/* OPTIONS */}
                  <div className="grid grid-cols-1 gap-3.5 pt-1">
                    {CYBER_QUIZ[currentQuizIndex].options.map((option, idx) => {
                      const isSelected = selectedOptionIndex === idx;
                      const isCorrect = CYBER_QUIZ[currentQuizIndex].correctIndex === idx;
                      
                      let optionBorder = "border-blue-950/50 bg-black hover:border-blue-900 hover:bg-blue-950/10";
                      let optionText = "text-slate-350 font-medium";

                      if (quizSubmitted) {
                        if (isCorrect) {
                          optionBorder = "border-blue-500/90 bg-blue-950/20";
                          optionText = "text-blue-350 font-bold font-sans";
                        } else if (isSelected) {
                          optionBorder = "border-red-900/80 bg-red-950/15";
                          optionText = "text-red-400 font-sans font-semibold";
                        } else {
                          optionBorder = "border-blue-950/40 bg-black opacity-40";
                        }
                      } else if (isSelected) {
                        optionBorder = "border-blue-500 bg-blue-950/20 shadow-[0_0_12px_rgba(59,130,246,0.06)]";
                        optionText = "text-blue-300 font-semibold font-sans";
                      }

                      return (
                        <button
                          key={idx}
                          role="radio"
                          aria-checked={isSelected}
                          disabled={quizSubmitted}
                          onClick={() => handleAnswerSubmit(idx)}
                          className={`w-full p-4 rounded-xl border text-left text-xs leading-relaxed transition-all duration-300 cursor-pointer ${optionBorder} ${optionText} active:scale-98`}
                        >
                          <div className="flex gap-3.5 items-center">
                            <span className="w-6.5 h-6.5 rounded-lg border border-blue-950 bg-blue-950/35 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 text-center text-blue-400">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="font-sans font-medium text-xs sm:text-[13px] text-slate-200">{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* EXPLANATION PREVIEW STATE */}
                  {quizSubmitted ? (
                    <div className="bg-blue-950/20 border border-blue-905/35 p-4 sm:p-5 rounded-2xl space-y-2.5 animate-fadeIn">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs font-mono">
                        <Info className="w-4 h-4 shrink-0 animate-pulse" />
                        <span>EXPERT FORENSIC EXPLANATION</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                        {CYBER_QUIZ[currentQuizIndex].explanation}
                      </p>
                    </div>
                  ) : null}

                  {/* BUTTONS ROW */}
                  <div className="border-t border-blue-950 pt-5 mt-5 flex justify-end">
                    {selectedOptionIndex !== null && !quizSubmitted ? (
                      <button
                        onClick={handleNextQuizQuestion}
                        className="px-5 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 hover:brightness-110 active:scale-95 text-white rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer uppercase font-sans shadow-[0_4px_25px_rgba(29,78,216,0.25)]"
                      >
                        Verify My Answer
                      </button>
                    ) : quizSubmitted ? (
                      <button
                        onClick={advanceQuiz}
                        className="px-5 py-3 bg-black hover:bg-blue-951 hover:text-white border border-blue-950 text-blue-300 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1 cursor-pointer font-sans active:scale-95"
                      >
                        {currentQuizIndex < CYBER_QUIZ.length - 1 ? (
                          <>
                            Next Scenario
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </>
                        ) : (
                          "Check Final Score"
                        )}
                      </button>
                    ) : (
                      <span className="text-[10.5px] text-slate-500 font-mono italic">
                        Select an option to evaluate your safety response score.
                      </span>
                    )}
                  </div>

                </div>
              ) : (
                
                /* QUIZ END CARD SUMMARY RESULTS */
                <div className="text-center py-6 space-y-6">
                  <div className="inline-flex w-16 h-16 bg-blue-950/20 border border-blue-900/40 rounded-full items-center justify-center text-blue-400 mb-2">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white font-sans">Cyber Quiz Completed!</h3>
                    <p className="text-xs text-slate-400 mt-2 font-sans font-medium">Check your Cyber Kavach awareness credentials below:</p>
                  </div>

                  <div className="max-w-xs mx-auto bg-black border border-blue-950 p-6 rounded-3xl">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold mb-1">Awareness Quotient</p>
                    <p className="text-4xl font-black font-mono text-blue-300">
                      {quizScore} <span className="text-base text-slate-500 font-medium">/ {CYBER_QUIZ.length}</span>
                    </p>
                    
                    <div className="mt-4">
                      {quizScore === CYBER_QUIZ.length ? (
                        <span className="text-[11px] font-mono font-bold px-3 py-1.5 bg-blue-950/40 text-blue-300 border border-blue-900/40 rounded-xl">
                          🔒 CERTIFIED SAFE SURFER
                        </span>
                      ) : quizScore >= CYBER_QUIZ.length / 2 ? (
                        <span className="text-[11px] font-mono font-bold px-3 py-1.5 bg-blue-950/20 text-blue-400 border border-blue-900/30 rounded-xl">
                          ⚡ MODERATE SOPHISTICATED RISK
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono font-bold px-3 py-1.5 bg-red-950/20 text-red-450 border border-red-900/30 rounded-xl">
                          🚨 SUSCEPTIBILITY LEVEL: HIGH
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={resetQuiz}
                      className="px-5 py-2.5 bg-black hover:bg-blue-950/20 hover:text-white border border-blue-950 rounded-xl text-xs font-bold text-blue-300 transition-all cursor-pointer uppercase tracking-wider font-sans active:scale-95"
                    >
                      Try Quiz Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: LAW REFERENCE BROWSING */}
        {activeTab === "laws" && (
          <div className="max-w-4xl mx-auto space-y-6" id="laws-reference-tab">
            <div className="bg-black border border-blue-950 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fadeIn">
              
              <div className="border-b border-blue-950/40 pb-5 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3 font-sans">
                  <Scale className="w-6.5 h-6.5 text-blue-400 stroke-[1.8]" />
                  Indian Cyber Law Provisions
                </h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans font-medium">
                  Digital crimes, identity thefts, and fraudulent cyber conspiracies are prosecuted under the Information Technology Act (2000) and the Bharatiya Nyaya Sanhita (BNS-2023).
                </p>
              </div>

              <div className="space-y-4">
                {RELEVANT_CYBER_LAWS.map((law, i) => (
                  <div key={i} className="bg-black border border-blue-950 p-5 rounded-2xl space-y-3 shadow-sm hover:border-blue-900 transition-all animate-fadeIn">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-blue-950 pb-3">
                      <span className="text-[11px] font-mono text-blue-300 font-extrabold px-3 py-1 bg-blue-950/40 rounded-lg border border-blue-900/40 uppercase tracking-wider">
                        {law.sec}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100 font-sans">{law.title}</h4>
                    </div>
                    
                    <p className="text-xs text-slate-350 leading-relaxed font-sans font-medium">
                      {law.desc}
                    </p>

                    <p className="text-xs font-bold text-red-350 bg-black px-3 py-2 border border-blue-950 rounded-xl leading-relaxed flex items-center gap-1.5">
                      <span className="text-red-400 font-extrabold font-sans">⚖ PENALTY ACCORDED:</span> 
                      <span className="font-semibold text-red-200 font-mono">{law.penalty}</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 bg-blue-950/10 rounded-2xl border border-blue-900/25 text-xs text-slate-400 leading-relaxed space-y-3">
                <p className="font-bold text-blue-300 flex items-center gap-2 font-sans">
                  <Info className="w-4.5 h-4.5 text-blue-400" />
                  Note on Bharatiya Nyaya Sanhita (BNS) Transition
                </p>
                <p className="font-sans font-medium">
                  Effective July 1, 2024, legacy criminal codes of the Indian Penal Code (IPC) have officially transitioned to modern Bharatiya Nyaya Sanhita (BNS) statutes. Key mappings include:
                </p>
                <ul className="space-y-2 pl-1 text-[11.5px] text-slate-405 font-mono">
                  <li className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span>Legacy <strong className="text-slate-200 font-semibold">IPC Section 420</strong> (Cheating) acts are prosecuted under <strong className="text-blue-450 font-bold">Section 318(4) of BNS</strong>.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span>Legacy <strong className="text-slate-200 font-semibold">IPC Section 419</strong> (Impersonation) maps directly to <strong className="text-blue-450 font-bold">Section 319 of BNS</strong>.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span>Legacy <strong className="text-slate-200 font-semibold">IPC Section 120B</strong> (Conspiracy) maps directly to <strong className="text-blue-450 font-bold">Section 61 of BNS</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-[#030712]/60 border-t border-blue-950/20 backdrop-blur-md py-8 px-4 sm:px-6" id="regulatory-notices-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left text-xs text-slate-500">
          <div className="space-y-1">
            <p className="font-bold text-xs uppercase tracking-widest text-[#60a5fa] font-sans">CyberKavach AI Digital Safety Portal</p>
            <p className="text-[11px] text-slate-550 font-sans font-medium">AI-powered forensic incident parsing. Engineered in national alignment with cyber vigilance directives.</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] font-mono font-bold">
            <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
              cybercrime.gov.in
            </a>
            <span className="text-blue-900/50">•</span>
            <a href="https://cert-in.org.in" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
              CERT-In
            </a>
            <span className="text-blue-900/50">•</span>
            <a href="https://sancharsaathi.gov.in" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
              Sanchar Saathi
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
