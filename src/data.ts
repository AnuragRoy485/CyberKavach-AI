import { InteractiveQuizQuestion, CyberCellContact } from "./types";

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (National Capital Territory)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
].sort();

export const SCAM_CATEGORIES = [
  {
    id: "upi_banking",
    name: "UPI / Banking / Credit Card Fraud",
    description: "Fraudulent UPI transfers, OTP compromises, fake credit card reward points, or unexpected account debits."
  },
  {
    id: "job_fraud",
    name: "Part-Time Job / Telegram Task scam",
    description: "Paid task requests on Telegram, YouTube like/subscribe payouts, or deposit-to-unlock career schemes."
  },
  {
    id: "investment_scam",
    name: "Fake Investment / Crypto Schemes",
    description: "Stock tips on WhatsApp groups, high-yield investment portal scams, or fake cryptocurrency trading claims."
  },
  {
    id: "sextortion_blackmail",
    name: "Sextortion / Morphing Morality threats",
    description: "Video call blackmail, morphing photos to demand currency, or social extortion schemes."
  },
  {
    id: "identity_theft_social",
    name: "Social Media Hijacking & Impersonation",
    description: "Instagram/Facebook account locking, duplicate profiles asking friends for emergency money, or fake police-call warnings."
  },
  {
    id: "aeps_biometric",
    name: "AePS / Biometric Clone Fraud",
    description: "Unauthorized withdrawals from Land Revenue registries clone fingers printed, or thumb scan thefts."
  },
  {
    id: "e_commerce_fake",
    name: "Fake Shopping / Instagram Stores",
    description: "Low-priced products advertised on social media, prepayment made, and the buyer got blocked immediately."
  },
  {
    id: "other",
    name: "Other Cyber Crime / Harassment",
    description: "Cyberbullying, malware, fake courier custom tax threats (like FedEx/Skynet calls), electricity bill reminders."
  }
];

export const EMERGENCIES_SOP = [
  {
    title: "The Golden Hour (Under 2 Hours)",
    escalation: "Call 1930 Helpline Immediately",
    details: "Helpline 1930 maps directly to the National Cyber Crime Reporting Portal. If logged within 2 hours, banks can place a temporary debit freeze on the visual ledger, protecting the stolen currency from getting withdrawn.",
    priority: "CRITICAL"
  },
  {
    title: "Call Your Bank Desk",
    escalation: "Block Account / Card via Mobile App",
    details: "Instantly lock your credit/debit card, freeze UPI registrations, and disable net-banking channels using your official banking applications.",
    priority: "HIGH"
  },
  {
    title: "Preserve Uncut Logs",
    escalation: "Collect Screenshots, Emails & SMS",
    details: "Take screenshots containing complete sender info (WhatsApp numbers, Telegram handles, email headers, UPI merchant IDs). Do not delete chat logs in anger—these are primary prosecution evidence.",
    priority: "MEDIUM"
  }
];

export const CYBER_QUIZ: InteractiveQuizQuestion[] = [
  {
    id: 1,
    question: "You receive an SMS alert: 'Your electricity service was suspended at 9:30 PM due to unpaid balance. Contact our bill coordinator on 94XXXXXX67 immediately.' What should you do?",
    options: [
      "Instantly dial the number to prevent electricity cutoff.",
      "Ignore it or look up your power utility's official app/customer portal to verify active dues.",
      "Click the pay-link and pay a tentative small balance to stay safe."
    ],
    correctIndex: 1,
    explanation: "Power distribution companies in India never send alerts from personal 10-digit mobile numbers demanding instant payment over WhatsApp or unofficial links. This is a common vishing/phishing scam."
  },
  {
    id: 2,
    question: "A stranger contacts you on Telegram offering Rs.150 per YouTube video liked and subscribed to. They pay you Rs.300 initially but request Rs.5,000 as 'VIP upgrade' deposit for massive earnings. What's happening here?",
    options: [
      "It is a legitimate digital marketing venture; the initial payment is proof of trust.",
      "The task-earnings is a Ponzi lock-trap. They pay a tiny reward to build trust and then freeze your larger subsequent deposits.",
      "It is safe as long as I get paid under Rs.1,000, then I should stop."
    ],
    correctIndex: 1,
    explanation: "This is the classic TikTok/YouTube Task scam. Scammers pay 'bait rewards' to build psychological compliance, then ask for larger security deposits ('welfare tasks') and block your account entirely when you try to withdraw."
  },
  {
    id: 3,
    question: "An unknown person claiming to be a Custom Official calling from Delhi/Mumbai Airport says a FedEx parcel under your name contains contraband. They demand you connect via Skype for a 'judicial interrogation' to verify details. What should you do?",
    options: [
      "Cooperate immediately and show him your ID card to avoid getting arrested.",
      "Understand that Indian police, CBI or custom authorities NEVER conduct Skype interrogations or 'digital arrests'. Block the number and tell your relatives.",
      "Transfer an investigation clearance security deposit to clear your Aadhaar record."
    ],
    correctIndex: 1,
    explanation: "These are 'digital arrest' scams. Law enforcement agencies in India never call users over WhatsApp/Skype and demand financial deposits or conduct camera interrogations for parcels."
  },
  {
    id: 4,
    question: "How is 'Golden Hour' relevant in financial cyber fraud cases in India?",
    options: [
      "It is the first 24 hours of filing reports to get free legal consulting.",
      "It refers to the initial 2 hours after a fraudulent transaction where dialing 1930 gets maximum legal probability to freeze money in transit.",
      "It is the weekend hours when crime rates drop."
    ],
    correctIndex: 1,
    explanation: "The Golden Hour refers to the immediate 2 hours after a digital banking fraud. If registered on 1930 or www.cybercrime.gov.in, banks can track the funds transfer logs (Layers 1-3) and block further withdrawals."
  }
];

export const CYBER_CELL_CONTACTS: CyberCellContact[] = [
  {
    state: "National Cyber Crime Portal",
    helpline: "1930 / +91-11-24363223",
    email: "support-cybercrime@gov.in",
    website: "https://cybercrime.gov.in"
  },
  {
    state: "Andhra Pradesh",
    helpline: "1930 / 112",
    email: "ccps-cid@ap.gov.in",
    website: "https://cid.ap.gov.in"
  },
  {
    state: "Bihar",
    helpline: "1930 / +91-612-2213730",
    email: "cybercell-bih@nic.in",
    website: "https://biharpolice.in"
  },
  {
    state: "Delhi",
    helpline: "1930 / +91-11-20892631",
    email: "cp.delhi@nic.in / cybercell@delhipolice.gov.in",
    website: "https://cyber.delhipolice.gov.in"
  },
  {
    state: "Gujarat",
    helpline: "1930 / +91-79-23250798",
    email: "ccps-cid@gujarat.gov.in",
    website: "https://cid.gujarat.gov.in"
  },
  {
    state: "Karnataka",
    helpline: "1930 / +91-80-22094498",
    email: "ccps.cid@karnataka.gov.in",
    website: "https://karnatakastatepolice-cybercrime.gov.in"
  },
  {
    state: "Maharashtra",
    helpline: "1930 / +91-22-22160080",
    email: "ig.cyber@maharashtra.gov.in",
    website: "https://mahacyber.gov.in"
  },
  {
    state: "Punjab",
    helpline: "1930 / +91-172-2748100",
    email: "cybercrime@punjabpolice.gov.in",
    website: "https://punjabpolice.gov.in"
  },
  {
    state: "Rajasthan",
    helpline: "1930 / +91-141-2309711",
    email: "ccps.cidcb@rajasthan.gov.in",
    website: "https://police.rajasthan.gov.in"
  },
  {
    state: "Tamil Nadu",
    helpline: "1930 / +91-44-28447700",
    email: "cybercell@tnpolice.gov.in",
    website: "https://eservices.tnpolice.gov.in"
  },
  {
    state: "Telangana",
    helpline: "1930 / +91-40-27852400",
    email: "cybercrime-cid@telangana.gov.in",
    website: "https://tspolice.gov.in"
  },
  {
    state: "Uttar Pradesh",
    helpline: "1930 / +91-522-2231298",
    email: "cybercell.shq@up.gov.in",
    website: "https://uppolice.gov.in"
  },
  {
    state: "West Bengal",
    helpline: "1930 / +91-33-24791930",
    email: "cybercrime@wb.gov.in",
    website: "https://westbengalpolice.gov.in"
  }
];

export const RELEVANT_CYBER_LAWS = [
  {
    sec: "Section 66C (IT Act)",
    title: "Identity Theft & Biometric Steals",
    penalty: "Imprisonment up to 3 years and/or fine up to INR 1,00,000.",
    desc: "Governs phishing, credential compromise, AePS fingerprints cloner fraud, or electronic signature thefts."
  },
  {
    sec: "Section 66D (IT Act)",
    title: "Cheating by Personation on Net",
    penalty: "Imprisonment up to 3 years and/or fine up to INR 1,00,000.",
    desc: "Applicable to Telegram task, fake customer support calls, fake courier scams where callers masquerade as officers."
  },
  {
    sec: "Section 66E (IT Act)",
    title: "Violation of Privacy (Morphing)",
    penalty: "Imprisonment up to 3 years and/or fine up to INR 2,00,000.",
    desc: "Capturing, publishing or transmitting private body parts without consent—applicable to webcam/sextortion threats."
  },
  {
    sec: "Section 319 (BNS, 2023)",
    title: "Cheating by Personation",
    penalty: "Imprisonment up to 5 years and/or financial fine.",
    desc: "BNS law (replacing IPC Section 419) prosecuting cheats disguising online profiles as bank staffs or government custom experts."
  },
  {
    sec: "Section 318(4) (BNS, 2023)",
    title: "Cheating and Dishonestly Inducing Delivery",
    penalty: "Rigorous Imprisonment up to 7 years and fine.",
    desc: "BNS law (replacing IPC Section 420) for criminal financial deceptions—applicable to fake stock invest portals and crypto clubs."
  }
];
