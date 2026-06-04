import React, { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Download, 
  MessageSquare, 
  Map, 
  Compass, 
  Search, 
  Bell, 
  Globe, 
  Sun, 
  Moon, 
  ChevronRight, 
  Users, 
  Trash2,
  FileText,
  TrendingUp,
  BarChart3,
  Check,
  Shield,
  Upload,
  Layers,
  Star,
  Settings,
  HelpCircle,
  Activity,
  LogIn,
  LogOut,
  Mail,
  User
} from "lucide-react";

import { 
  LanguageCode, 
  Complaint, 
  Project, 
  TourismSpot, 
  ChatMessage, 
  OpenDataset, 
  MapMarker 
} from "./types";

import {
  onAuthStateChanged,
  signOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithGoogle,
  signInWithMockBypass,
  dbSaveComplaint,
  dbGetComplaints,
  dbUpdateComplaintStatus,
  isMockMode
} from "./firebase";

import {
  FALLBACK_STATS,
  FALLBACK_DATASETS,
  FALLBACK_PROJECTS,
  FALLBACK_MARKERS,
  FALLBACK_TOURISM,
  FALLBACK_COMPLAINTS
} from "./fallbackData";


// ================== DICTIONARY FOR MULTI-LANGUAGE SYSTEM ==================
const translations = {
  th: {
    title: "ยะลามหานคร",
    subtitle: "แพลตฟอร์มบริการดิจิทัลเพื่อประชาชนและการพัฒนาเมืองอัจฉริยะ",
    cityLabel: "เทศบาลนครยะลา",
    statusLive: "ระบบเปิดใช้งานปกติ",
    searchPlaceholder: "ค้นหาข้อมูลข่าวสาร บริการ และสถานะคำร้อง...",
    
    // Nav menu
    menuHome: "หน้าแรก & โครงการ",
    menuDashboard: "แดชบอร์ด & ข้อมูลเปิด",
    menuService: "บริการแจ้งปัญหานคร",
    menuMap: "แผนที่เมืองอัจฉริยะ GIS",
    menuTourism: "ท่องเที่ยวยะลาอัจฉริยะ",
    menuAdmin: "จำลองระบบแอดมิน",

    // Banner & Buttons
    quickReport: "แจ้งปัญหาสุขภาวะด่วน",
    trackStatus: "ติดตามสถานะคำร้อง",
    downloadOpenData: "ดาวน์โหลดคลังข้อมูลเปิด",
    submitBtn: "ส่งข้อมูลเข้าระบบ",
    placeholderInput: "พิมพ์คำถามเกี่ยวกับระบบเทศบาลที่นี่...",

    // Statistics
    statPop: "จำนวนประชากรรวม",
    statCommunities: "ชุมชนในเทศบาล",
    statWaste: "ปริมาณขยะมูลฝอยสะสม",
    statComplaints: "อัตราความสำเร็จคำร้อง",
    statAir: "คุณภาพอากาศในพื้นที่",
    statRain: "ปริมาณน้ำฝนสะสม",
    unitPop: "ราย",
    unitComm: "ชุมชน",
    unitWaste: "ตัน/วัน",
    unitPercent: "%",
    unitAqi: "AQI",
    unitMm: "มม.",

    // Form inputs
    formTitle: "หัวข้อคำร้องเรียน/ปัญหาที่พบ *",
    formTitlePlaceholder: "เช่น ไฟถนนบริเวณสี่แยกดับชำรุด, ขยะตกค้างริมตลาดสด",
    formDesc: "รายละเอียดปัญหาเพิ่มเติม *",
    formDescPlaceholder: "โปรดระบุรายละเอียดปัญหาที่พบ เพื่อความสะดวกในการคัดกรองด่วน",
    formLocation: "สถานที่เกิดเหตุหรือจุดสังเกตพิกัด *",
    formLocationPlaceholder: "เช่น ซอยสิโรรส 8 ข้างๆ ร้านขายยา",
    formCoordinates: "ระบุพิกัดบนแผนจําลอง GIS (คลิกเพื่อจัดพิกัด)",
    formUpload: "อัปโหลดภาพหลักฐานการชำรุด (จำลอง)",
    formStatusText: "สถานะการวิเคราะห์อัจฉริยะ",

    // AI Classification Suggestion Cards
    aiAnalysisActive: "สรุปผลการวิเคราะห์หมวดยานยนต์ด้วย AI",
    aiCat: "หมวดหมู่ปัญหา:",
    aiDept: "ฝ่ายรับผิดชอบ:",
    aiConfidence: "คะแนนเสถียรข้อมูล:",
    aiPriority: "ระดับความเร่งด่วน:",
    aiReason: "เหตุผลพิจารณา:",

    // Open Data
    openDataTitle: "คลังข้อมูลเปิดเพื่อความโปร่งใส (Yala Open Data Platform)",
    openDataSub: "ดาวน์โหลดสถิติการดำเนินงานเทศบาลนครยะลาในรูปแบบสาธารณะ",
    datasetName: "ชื่อชุดข้อมูล",
    datasetSize: "ขนาดไฟล์",
    datasetDownloads: "ยอดดาวน์โหลด",
    datasetUpdate: "ปรับปรุงล่าสุด",

    // AI Chat Bot
    assistantTitle: "หมุดอัจฉริยะ (Municipal AI Assistant)",
    assistantSub: "ระบบถามตอบข้อมูลบริการ ประชาสัมพันธ์ และภาษีเทศบาลนครยะลาด้วย AI",
    recommendationTitle: "คำถามที่พบบ่อย:",
    rec1: "ติดต่อแผนกทะเบียนราษฎร์กี่โมง?",
    rec2: "ภาษีที่ดินชำระช่องทางไหนได้บ้าง?",
    rec3: "สวนสาธารณะขวัญเมืองเปิดกี่โมง?",

    // Projects
    projectsTitle: "โครงการพัฒนาการเปลี่ยนแปลงเมืองยะลา",
    projectsSub: "อัปเดตสถิติกิจกรรม ปริมาณงบประมาณ และแผนผังโครงการหลัก",
    budget: "งบประมาณโครงการ:",
    duration: "ช่วงระยะดำเนินงาน:",
    statusDone: "สำเร็จลุล่วงเสร็จสิ้น",

    // Tourism
    tourismTitle: "พิกัดส่งเสริมการท่องเที่ยวอารยธรรมยะลา",
    tourismSub: "เช็กอินสถานที่สำคัญ สัมผัสธรรมชาติ ประเมินและวิวิจารณ์เชิงบวก",
    submitReview: "ส่งบทวิจารณ์พึงพอใจ",
    reviewAuthor: "ชื่อผู้เขียนรีวิว",
    reviewText: "แสดงความคิดเห็นของคุณ...",
    ratingScore: "คะแนนประเมิน (1-5 ดาว)",

    // Toasts & Notifications
    toastSuccess: "บันทึกเรียบร้อยแล้ว!",
    toastError: "โปรดกรอกข้อมูลที่จำเป็นให้ครบถ้วน",
    toastDownload: "เริ่มการดาวน์โหลดชุดข้อมูลรูปแบบ"
  },
  en: {
    title: "Yala Smart City",
    subtitle: "Digital Core Platform for citizens and smart municipal development",
    cityLabel: "Yala City Municipality",
    statusLive: "SYSTEM LIVE",
    searchPlaceholder: "Search news, public services and complaint cases...",
    
    // Nav menu
    menuHome: "Home & Projects",
    menuDashboard: "Dashboard & Data",
    menuService: "Smart Complaint Center",
    menuMap: "GIS Intelligent Map",
    menuTourism: "Unseen Yala Tourism",
    menuAdmin: "Mock Admin Station",

    // Banner & Buttons
    quickReport: "File urgent Incident Report",
    trackStatus: "Track Complaint Status",
    downloadOpenData: "Browse Datasets Store",
    submitBtn: "Submit Record",
    placeholderInput: "Ask about local tax, tourism, city laws...",

    // Statistics
    statPop: "Active Population",
    statCommunities: "Total Registered Communities",
    statWaste: "Daily Handled Municipal Waste",
    statComplaints: "Resolution Success Rate",
    statAir: "Area Air Quality Index",
    statRain: "Accumulated Rainfall Index",
    unitPop: "people",
    unitComm: "districts",
    unitWaste: "tons/day",
    unitPercent: "%",
    unitAqi: "AQI",
    unitMm: "mm",

    // Form inputs
    formTitle: "Problem Header / Title *",
    formTitlePlaceholder: "e.g. Broken streetlamp, uncollected garbage pile",
    formDesc: "Detailed Description *",
    formDescPlaceholder: "Provide thorough evidence details of the problem...",
    formLocation: "Accurate Landmark / Street Location *",
    formLocationPlaceholder: "e.g. Near Siroros Soi 8, adjacent to public garden",
    formCoordinates: "Assign Coordinates on GIS grid (Click map to point)",
    formUpload: "Upload Damage Image Proof (Mock)",
    formStatusText: "Intelligent Auto Classification Status",

    // AI Classification Suggestion Cards
    aiAnalysisActive: "Google Gemini Classifier Assessment",
    aiCat: "Identified Category:",
    aiDept: "Assigned Department:",
    aiConfidence: "AI Confidence Index:",
    aiPriority: "Risk Level Severity:",
    aiReason: "Logical Grounds:",

    // Open Data
    openDataTitle: "Yala Open Data & Eco Transparency Hub",
    openDataSub: "Directly export structural public data formatted for analytics",
    datasetName: "Dataset Information & Description",
    datasetSize: "File Size",
    datasetDownloads: "Downloads",
    datasetUpdate: "Latest Patch",

    // AI Chat Bot
    assistantTitle: "Smart Municipal Assistant Bot",
    assistantSub: "Instant bilingual guidance powered by server-side intelligence",
    recommendationTitle: "Frequently Asked Questions:",
    rec1: "What are office operational hours?",
    rec2: "How can I pay my land asset tax online?",
    rec3: "When is Suan Khwan Park open for exercises?",

    // Projects
    projectsTitle: "Local Structural Transformations Projects",
    projectsSub: "Tracking ongoing investments, timeline landmarks, and growth metrics",
    budget: "Strategic Budget Allocated:",
    duration: "Launch Window Timeline:",
    statusDone: "Fully Executed / Complete",

    // Tourism
    tourismTitle: "Cultural Heritage & Exotic Eco Venues",
    tourismSub: "Explore tourist nodes and write persistent user feedback",
    submitReview: "Publish Review",
    reviewAuthor: "Your Name",
    reviewText: "Write a short personal story...",
    ratingScore: "Rating Score (1-5 Stars)",

    // Toasts & Notifications
    toastSuccess: "Information recorded successfully!",
    toastError: "Please fulfill all mandatory constraints.",
    toastDownload: "Starting secure download for"
  },
  ms: {
    title: "Bandar Pintar Yala",
    subtitle: "Platform Perkhidmatan Digital Rakyat & Pembangunan Bandar Pintar",
    cityLabel: "Majlis Perbandaran Yala",
    statusLive: "SISTEM AKTIF",
    searchPlaceholder: "Cari berita, bantuan awam dan kes aduan...",
    
    // Nav menu
    menuHome: "Utama & Projek Pembangunan",
    menuDashboard: "Dashboard data & Data Terbuka",
    menuService: "Sistem Aduan Smart",
    menuMap: "Peta Pintar GIS Bandar Yala",
    menuTourism: "Pelancongan Bestari",
    menuAdmin: "Log Pentadbir Demo",

    // Banner & Buttons
    quickReport: "Lapor Masalah Segera",
    trackStatus: "Jejaki Status Aduan",
    downloadOpenData: "Muat Turun Data Terbuka",
    submitBtn: "Hantar Rekod Aduan",
    placeholderInput: "Tanya soalan tentang cukai, bantuan, pejabat awam...",

    // Statistics
    statPop: "Jumlah Penduduk Aktif",
    statCommunities: "Komuniti Berdaftar",
    statWaste: "Sisa Pepejal Dikumpul",
    statComplaints: "Kadar Selesai Aduan",
    statAir: "Indeks Kualiti Udara",
    statRain: "Taburan Hujan Semasa",
    unitPop: "orang",
    unitComm: "kawasan",
    unitWaste: "tan/hari",
    unitPercent: "%",
    unitAqi: "AQI",
    unitMm: "mm",

    // Form inputs
    formTitle: "Tajuk Aduan / Kerosakan *",
    formTitlePlaceholder: "Cth. Lampu jalan rosak padam, longgokan sampah",
    formDesc: "Keterangan Terperinci *",
    formDescPlaceholder: "Berikan butiran lengkap kerosakan yang dihadapi...",
    formLocation: "Lokasi & Tempat Kejadian *",
    formLocationPlaceholder: "Cth. Dekat Siroros Soi 8, sebelah taman awam",
    formCoordinates: "Tetapkan Koordinat GIS (Klik peta untuk letak koordinat)",
    formUpload: "Muat Naik Gambar Bukti Kerosakan",
    formStatusText: "Status Klasifikasi Automatik AI",

    // AI Classification Suggestion Cards
    aiAnalysisActive: "Analisis Klasifikasi Pintar Siri AI",
    aiCat: "Kategori Digaris:",
    aiDept: "Jabatan Bertanggungjawab:",
    aiConfidence: "Pekali Keyakinan AI:",
    aiPriority: "Aras Kepentingan:",
    aiReason: "Justifikasi Logik:",

    // Open Data
    openDataTitle: "Hub Integriti Data Terbuka Yala",
    openDataSub: "Penerbitan statistik prestasi untuk ketelusan dan pembangunan bersama",
    datasetName: "Penerangan Set Data",
    datasetSize: "Saiz Fail",
    datasetDownloads: "Dimuat Turun",
    datasetUpdate: "Tarikh Dikemas Kini",

    // AI Chat Bot
    assistantTitle: "Pembantu Awam Digital Yala",
    assistantSub: "Bimbingan perbandaran pantas disokong kecerdasan buatan",
    recommendationTitle: "Soalan Lazim Disaran:",
    rec1: "Waktu operasi pejabat pendaftaran?",
    rec2: "Cara bayaran cukai tanah atas talian?",
    rec3: "Pukul berapakah taman rekreasi dibuka?",

    // Projects
    projectsTitle: "Pelan Transformasi Infrastruktur Tempatan",
    projectsSub: "Kemajuan dana awam, tetingkap masa kerja, dan penanda sejarah",
    budget: "Belanjawan Diperuntukkan:",
    duration: "Garis Masa Tempoh:",
    statusDone: "Selesai Sepenuhnya",

    // Tourism
    tourismTitle: "Warisan Budaya & Destinasi Eko Ekzotik",
    tourismSub: "Terokai lokasi pelancongan dan hantar ulasan terus dalam sistem",
    submitReview: "Kirim Ulasan",
    reviewAuthor: "Nama Anda",
    reviewText: "Tulis kisah peribadi ringkas...",
    ratingScore: "Skor Penilaian (1-5 Bintang)",

    // Toasts & Notifications
    toastSuccess: "Rekod aduan berjaya disimpan!",
    toastError: "Sila isi semua ruangan penting diwajibkan.",
    toastDownload: "Memulakan muat turun selamat bagi"
  }
};

export default function App() {
  const [lang, setLang] = useState<LanguageCode>("th");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("home");
  
  // Real-time API state variables
  const [stats, setStats] = useState<any>(null);
  const [datasets, setDatasets] = useState<OpenDataset[]>([]);
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [tourism, setTourism] = useState<TourismSpot[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // Authentication State Variables
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [emailInput, setEmailInput] = useState<string>("");
  const [isSendingLink, setIsSendingLink] = useState<boolean>(false);
  const [linkSent, setLinkSent] = useState<boolean>(false);
  const [redirectTarget, setRedirectTarget] = useState<string>("dashboard");
  const [authError, setAuthError] = useState<string | null>(null);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mapFilter, setMapFilter] = useState<string>("all");
  const [selectedSpot, setSelectedSpot] = useState<TourismSpot | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Form State
  const [complaintForm, setComplaintForm] = useState({
    title: "",
    description: "",
    location: "",
    imageUrl: "",
    lat: 6.5415,
    lng: 101.2820
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastSubmissionResult, setLastSubmissionResult] = useState<any>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "สวัสดีครับไอยะลา! ผมคือ 'หมุดอัจฉริยะ' AI พอร์ทัลประจำเทศบาลนครยะลา ยินดีบริการค้นหาแผนที่ แนะนำท่องเที่ยว แนะนำภาษี หรืออธิบายขั้นตอนการขนขยะให้แจ้งมาได้เลยครับ!",
      timestamp: "17:43"
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatTyping, setIsChatTyping] = useState<boolean>(false);

  // Review Form state
  const [reviewForm, setReviewForm] = useState({
    author: "",
    rating: 5,
    text: ""
  });

  // UI state utilities
  const [notifications, setNotifications] = useState<string[]>([
    "สภากาแฟยามเช้านครยะลา เชิญชวนร่วมกิจกรรมวันที่ 5 มิ.ย.",
    "ระบบ AI ตรวจคัดกรองจัดสัดส่วนกองงานขยับอัตราพึ่งพาตนเองสู่อันดับ 1",
    "เตือนภัยระดับน้ำแม่น้ำปัตตานีสูงขึ้นเล็กน้อย เกณฑ์สถานการณ์เฝ้าระวังสบายใจ"
  ]);
  const [showNotificationPopup, setShowNotificationPopup] = useState<boolean>(false);
  const [searchSuggestionActive, setSearchSuggestionActive] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "info" } | null>(null);

  // Custom coordinate Grid Click Selector Simulation
  const [gridX, setGridX] = useState<number>(140);
  const [gridY, setGridY] = useState<number>(180);

  // Handle Toast helper
  const triggerToast = (text: string, type: "success" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Intercept navigation for protected views
  const handleTabChange = (targetTab: string) => {
    const protectedTabs = ["dashboard", "service", "profile", "admin"];
    if (protectedTabs.includes(targetTab) && !currentUser) {
      setRedirectTarget(targetTab);
      localStorage.setItem("authRedirectTarget", targetTab);
      setActiveTab("login");
      triggerToast("กรุณาเข้าสู่ระบบด้วยอีเมลเพื่อเข้าถึงหน้าบริการส่วนนี้", "info");
    } else {
      setActiveTab(targetTab);
      setSelectedComplaint(null);
    }
  };

  // Listen to Firebase authentication status changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Check and process passwordless login emails
  useEffect(() => {
    const checkEmailLink = async () => {
      const { href } = window.location;
      if (isSignInWithEmailLink(href)) {
        let email = localStorage.getItem("emailForSignIn");
        if (!email) {
          email = window.prompt("โปรดป้อนอีเมลของคุณอีกครั้งเพื่อทำการยืนยันเข้าสู่ระบบ:");
        }
        if (email) {
          try {
            setLoadingAuth(true);
            setAuthError(null);
            const user = await signInWithEmailLink(email, href);
            setCurrentUser(user);
            triggerToast(`ยินดีต้อนรับ! คุณเข้าสู่ระบบด้วยอีเมล ${email} เรียบร้อยแล้ว`, "success");
            localStorage.removeItem("emailForSignIn");
            
            // Clean URL query parameters
            const cleanUrl = new URL(href);
            cleanUrl.searchParams.delete("apiKey");
            cleanUrl.searchParams.delete("mockSignIn");
            window.history.replaceState({}, document.title, cleanUrl.pathname + cleanUrl.search);
            
            // Redirect to stored tab
            const target = localStorage.getItem("authRedirectTarget") || "dashboard";
            setActiveTab(target);
          } catch (error: any) {
            console.error("Link authentication failed:", error);
            setAuthError(error.message || "ลิงก์เข้าสู่ระบบหมดอายุหรือเชื่อมต่อขัดข้อง");
            triggerToast("การเข้าสู่ระบบผ่านลิงก์ล้มเหลว", "info");
          } finally {
            setLoadingAuth(false);
          }
        }
      }
    };
    checkEmailLink();
  }, []);

  // Fetch API resources on Init & on User change
  useEffect(() => {
    fetchStats();
    fetchDatasets();
    fetchProjects();
    fetchMarkers();
    fetchComplaints();
    fetchTourism();
  }, [currentUser]);


  const fetchStats = async () => {
    try {
      const res = await fetch("/api/city-stats");
      if (!res.ok) throw new Error("Status " + res.status);
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.warn("Failed fetching municipal stats. Utilizing offline data metrics.", e);
      setStats(FALLBACK_STATS);
    }
  };

  const fetchDatasets = async () => {
    try {
      const res = await fetch("/api/open-datasets");
      if (!res.ok) throw new Error("Status " + res.status);
      const data = await res.json();
      setDatasets(data);
    } catch (e) {
      console.warn("Using offline fallback datasets:", e);
      setDatasets(FALLBACK_DATASETS);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Status " + res.status);
      const data = await res.json();
      setProjectList(data);
    } catch (e) {
      console.warn("Using offline fallback projects:", e);
      setProjectList(FALLBACK_PROJECTS);
    }
  };

  const fetchMarkers = async () => {
    try {
      const res = await fetch("/api/map-markers");
      if (!res.ok) throw new Error("Status " + res.status);
      const data = await res.json();
      setMarkers(data);
    } catch (e) {
      console.warn("Using offline fallback map markers:", e);
      setMarkers(FALLBACK_MARKERS);
    }
  };

  const fetchComplaints = async () => {
    try {
      let data = [];
      try {
        const res = await fetch("/api/complaints");
        if (res.ok) {
          data = await res.json();
        } else {
          data = FALLBACK_COMPLAINTS;
        }
      } catch (errApi) {
        console.warn("Could not load complaints from API, using fallback complaints:", errApi);
        data = FALLBACK_COMPLAINTS;
      }
      
      // Fetch user's persistent complaints from Firestore or localStorage
      const userComplaints = await dbGetComplaints(currentUser?.uid);
      
      // Merge: display user's complaints at top, then default backend mock claims ensuring zero duplicates
      const merged = [
        ...userComplaints,
        ...data.filter((c: any) => !userComplaints.some((uc: any) => uc.id === c.id))
      ];
      setComplaints(merged);
    } catch (e) {
      console.error("General complaints parsing error. Setting fallbacks:", e);
      setComplaints(FALLBACK_COMPLAINTS);
    }
  };


  const fetchTourism = async () => {
    try {
      const res = await fetch("/api/tourism");
      if (!res.ok) throw new Error("Status " + res.status);
      const data = await res.json();
      setTourism(data);
      if (data.length > 0) {
        // Only set selectedSpot if not yet configured, prioritizing index 0
        setSelectedSpot(prev => prev || data[0]);
      }
    } catch (e) {
      console.warn("Using offline fallback tourism spots:", e);
      setTourism(FALLBACK_TOURISM);
      setSelectedSpot(prev => prev || FALLBACK_TOURISM[0]);
    }
  };

  // Form Submission
  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.title || !complaintForm.description || !complaintForm.location) {
      triggerToast(translations[lang].toastError, "info");
      return;
    }

    setIsSubmitting(true);
    setLastSubmissionResult(null);

    const payload = {
      title: complaintForm.title,
      description: complaintForm.description,
      location: complaintForm.location,
      coordinates: { lat: complaintForm.lat, lng: complaintForm.lng },
      imageUrl: complaintForm.imageUrl || "https://images.unsplash.com/photo-1590086782957-93c060218022?auto=format&fit=crop&w=400&q=80"
    };

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("API not ok");
      const resData = await res.json();

      if (resData.success) {
        // Enforce actual logged-in User ID ownership for durable Firestore querying
        const finalComplaint = {
          ...resData.data,
          userId: currentUser?.uid || "guest"
        };
        
        // Save using our unified Firestore persistent database adapter!
        await dbSaveComplaint(finalComplaint);

        setLastSubmissionResult(resData);
        triggerToast(`${translations[lang].toastSuccess} เลขที่ติดตาม: ${resData.data.trackingNum}`, "success");
        // Add new complaint locally to front of array
        setComplaints(prev => [finalComplaint, ...prev]);
        // Re-inject a marker into custom map dynamic list
        const newMarker: MapMarker = {
          id: `marker-${Date.now()}`,
          title: {
            th: `เรื่องร้องเรียน: ${resData.data.category}`,
            en: `Complaint: ${resData.data.category}`,
            ms: `Aduan: ${resData.data.category}`
          },
          type: "complaint",
          coordinates: { lat: resData.data.coordinates.lat, lng: resData.data.coordinates.lng },
          address: {
            th: resData.data.location,
            en: resData.data.location,
            ms: resData.data.location
          },
          status: "received"
        };
        setMarkers(prev => [newMarker, ...prev]);
        
        // Push notification of submit success
        setNotifications(prev => [
          `เรื่องแจ้งปัญหาไคลซิสใหม่ [${resData.data.trackingNum}] ส่งตรวจกองงาน ${resData.data.dept} เรียบร้อย`,
          ...prev
        ]);

        // Reset text fields, keep default center coordinates
        setComplaintForm({
          title: "",
          description: "",
          location: "",
          imageUrl: "",
          lat: 6.5415,
          lng: 101.2820
        });
      }
    } catch (err) {
      console.warn("Backend complaints filing failed. Simulating local classification & persistence:", err);
      
      // Simulate classification
      const title = complaintForm.title;
      const description = complaintForm.description;
      const lowercaseContent = (title + " " + description).toLowerCase();
      
      let aiSuggestion = {
        category: "ปัญหาทั่วไปทางการบริการ",
        department: "กองช่าง",
        confidence: 0.85,
        priority: "medium" as any,
        explanation: "คัดกรองระบบจำลองเบื้องต้น เพื่อประสานหน่วยงานบำบัดทุกข์บำรุงสุขแก่ประชาชน"
      };
      
      if (lowercaseContent.includes("ไฟ") || lowercaseContent.includes("แสงสว่าง") || lowercaseContent.includes("ส่องสว่าง")) {
        aiSuggestion = {
          category: "ระบบไฟฟ้าและแสงสว่าง",
          department: "งานไฟฟ้าและแสงสว่าง",
          confidence: 0.92,
          priority: "high",
          explanation: "คัดเลือกกองจากหลักฐานคำพ้องความหมายด้านไฟฟ้าและแสงสว่าง"
        };
      } else if (lowercaseContent.includes("ขยะ") || lowercaseContent.includes("กลิ่น") || lowercaseContent.includes("เหม็น") || lowercaseContent.includes("น้ำเสีย")) {
        aiSuggestion = {
          category: "ขยะมูลฝอยและสิ่งแวดล้อม",
          department: "กองสาธารณสุขและสิ่งแวดล้อม",
          confidence: 0.94,
          priority: "medium",
          explanation: "คัดเลือกกองส่งต่อดูแลสิ่งปฏิกูลตามระบบฐานข้อมูลขยะไร้ฝุ่น"
        };
      } else if (lowercaseContent.includes("ท่วม") || lowercaseContent.includes("น้ำล้น") || lowercaseContent.includes("ฝน") || lowercaseContent.includes("อุทกภัย")) {
        aiSuggestion = {
          category: "ภัยพิบัติและบรรเทาสาธารณภัย",
          department: "กองป้องกันและบรรเทาสาธารณภัย",
          confidence: 0.96,
          priority: "critical",
          explanation: "จัดหมวดภัยฉุกเฉินน้ำล้นท่วมขังเพื่อตอบรับเร่งด่วนรวดเร็ว"
        };
      } else if (lowercaseContent.includes("ถนน") || lowercaseContent.includes("หลุม") || lowercaseContent.includes("ทางเท้า") || lowercaseContent.includes("ฝาท่อ")) {
        aiSuggestion = {
          category: "ความชำรุดโยธาและทางจราจร",
          department: "กองช่าง",
          confidence: 0.95,
          priority: "high",
          explanation: "จัดเป็นงานซ่อมผิวจราจรและโครงข่ายขนส่งให้อยู่ในสภาพสมบูรณ์"
        };
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const trackingNum = `YLA-2026-${randomSuffix}`;
      const d = new Date();
      const dateStr = d.toISOString().split("T")[0];

      const finalComplaint = {
        id: `comp-${Date.now()}`,
        title,
        description,
        category: aiSuggestion.category,
        dept: aiSuggestion.department,
        location: complaintForm.location,
        coordinates: { lat: complaintForm.lat, lng: complaintForm.lng },
        imageUrl: complaintForm.imageUrl || "https://images.unsplash.com/photo-1590086782957-93c060218022?auto=format&fit=crop&w=400&q=80",
        status: "received" as const,
        date: dateStr,
        trackingNum,
        priority: aiSuggestion.priority,
        userId: currentUser?.uid || "guest",
        progressLog: [
          {
            status: "received" as const,
            date: `${dateStr} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
            note: `ระบบรับเรื่องร่วมพิกัด [${aiSuggestion.category} -> ${aiSuggestion.department}] สำเร็จด้วยระบบคัดกรองแบบจำลองปัญญาประดิษฐ์ท้องถิ่น`
          }
        ]
      };

      // Save using our unified Firestore persistent database adapter (will fallback to localStorage if firebase fails/offline)
      await dbSaveComplaint(finalComplaint);

      const fakeResData = {
        success: true,
        data: finalComplaint,
        aiRecommendation: aiSuggestion
      };

      setLastSubmissionResult(fakeResData);
      triggerToast(`${translations[lang].toastSuccess} เลขที่ติดตาม: ${trackingNum}`, "success");
      setComplaints(prev => [finalComplaint, ...prev]);

      const newMarker: MapMarker = {
        id: `marker-${Date.now()}`,
        title: {
          th: `เรื่องร้องเรียน: ${aiSuggestion.category}`,
          en: `Complaint: ${aiSuggestion.category}`,
          ms: `Aduan: ${aiSuggestion.category}`
        },
        type: "complaint",
        coordinates: finalComplaint.coordinates,
        address: {
          th: finalComplaint.location,
          en: finalComplaint.location,
          ms: finalComplaint.location
        },
        status: "received"
      };
      setMarkers(prev => [newMarker, ...prev]);

      setNotifications(prev => [
        `เรื่องแจ้งปัญหาไคลซิสใหม่ [${trackingNum}] ส่งตรวจกองงาน ${aiSuggestion.department} เรียบร้อย`,
        ...prev
      ]);

      setComplaintForm({
        title: "",
        description: "",
        location: "",
        imageUrl: "",
        lat: 6.5415,
        lng: 101.2820
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chat message submit
  const handleChatSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    const memoInput = chatInput;
    setChatInput("");
    setIsChatTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg]
        })
      });
      if (!res.ok) throw new Error("API not ok");
      const data = await res.json();
      
      setChatMessages(prev => [...prev, {
        id: `chat-reply-${Date.now()}`,
        sender: "assistant",
        text: data.text || "ขออภัยครับ ขณะนี้ระบบขัดข้องเล็กน้อย ลองสลับหัวข้อคำถามดูนะคร้าบ",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.warn("Backend chat failed. Generating local helper response:", err);
      
      const text = memoInput.trim();
      let responseText = "ขออภัยครับ ขณะนี้ระบบประมวลผลระบบช่วยเหลือจำลองได้รับข้อความแล้ว แนะนำให้ตรวจสอบพิกัดท่องเที่ยวหรือตารางบริการเมืองโดยละเอียดอีกครั้งนะครับ";
      
      const textLower = text.toLowerCase();
      if (textLower.includes("ภาษี") || textLower.includes("tax")) {
        responseText = `สำหรับการเสียภาษีในเขตเทศบาลนครยะลา มีข้อมูลดังนี้ครับ:\n\n1. ภาษีที่ดินและสิ่งปลูกสร้าง (ชำระภายในเดือนเมษายน ของทุกปี)\n2. ภาษีป้าย (ยื่นแบบภายในเดือนมีนาคม ของทุกปี)\n\nช่องทางชำระหลัก: สามารถมารับการบริการโดยสแกน QR Code ตรวจสอบสิทธิ์ที่กองคลัง แผนกชำระภาษี ชั้น 1 ของสำนักงานเทศบาล หรือผ่านระบบโอนโมบายแบงก์กิ้งเพื่อความอัจฉริยะสะดวกสบายครับ`;
      } else if (textLower.includes("เวลา") || textLower.includes("ทำงาน") || textLower.includes("เปิด") || textLower.includes("ปิด") || textLower.includes("office") || textLower.includes("schedule")) {
        responseText = `สำนักงานเทศบาลนครยะลา เปิดทำการวันจันทร์ - ศุกร์ ตั้งแต่เวลา 08:30 น. ถึง 16:30 น. (หยุดทำการวันเสาร์ - อาทิตย์ และวันหยุดนักขัตฤกษ์ราชการ) แต่อุปกรณ์คลาวด์และจุดตรวจวัดสภาพสิ่งแวดล้อมทำงานคัดกรองปัญหายังออนไลน์รันทำงาน 24 ชั่วโมงครับ`;
      } else if (textLower.includes("เที่ยว") || textLower.includes("แนะนำ") || textLower.includes("tour") || textLower.includes("travel")) {
        responseText = `เทศบาลนครยะลาและอำเภอเคียงข้างมีจุดท่องเที่ยวสะกดสายตาน่าไปเยือนหลายแห่งครับ:\n\n- **สวนขวัญเมือง**: สวนพักใจระดับภูมิภาค มีสนามแข่งขันนกเขาชวาเสียงและลู่วิ่งเลียบน่านน้ำ\n- **ศาลหลักเมืองยะลา**: วงเวียนปูชนียสถาปัตยกรรมสุโขทัยร่มรื่นมีชื่อเสียง\n- **ทะเลหมอกอัยเยอร์เวง / เบตง**: ทะเลหมอกระดับอาเซียน 360 องศาพร้อมสะพานสกายวอล์กกระจกสัมผัสก้อนเมฆแสนประทับใจ\n\nสามารถคลิกเลือกชมเพิ่มเติมได้ที่แท็บ "ท่องเที่ยวอัจฉริยะ 🧭" เพื่อศึกษารายการประเมินได้เลยครับ!`;
      } else if (textLower.includes("เบอร์") || textLower.includes("โทร") || textLower.includes("ด่วน") || textLower.includes("ติดต่อ")) {
        responseText = `เบอร์ติดต่อด่วนสำคัญของเทศบาลนครยะลา สำหรับปวงชนช่วยเหลือฉุกเฉิน:\n\n- กองป้องกันและบรรเทาสาธารณภัย (ดับเพลิง/กู้ภัยทางใต้): 199 หรือ 073-212111 (บริการ 24 ชั่วโมง)\n- ศูนย์ประสานป้องกันยาเสพติด: 073-222621\n- สำนักปลัดเทศบาล: 073-216790`;
      } else if (textLower.includes("สวัสดี") || textLower.includes("hello") || textLower.includes("hi") || textLower.includes("ดีครับ") || textLower.includes("ดีค่ะ")) {
        responseText = `สวัสดีครับ! ยินดีต้อนรับสู่ผู้ช่วยหมุดอัจฉริยะเมืองยะลา แพลตฟอร์มดิจิทัลบริการประชาชนเชิงรุก ผมคอยแสตนด์บายช่วยเหลือแนะนำข้อมูลเกี่ยวกับ เวลาทำการ สำนักภาษี การท่องเที่ยว หรือเรื่องราวร้องทุกข์ปัญหาชุมชนครับ! มีอะไรให้ผมรับใช้แจ้งได้เลยครับ`;
      }
      
      setChatMessages(prev => [...prev, {
        id: `chat-reply-${Date.now()}`,
        sender: "assistant",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsChatTyping(false);
    }
  };

  const handleRecommendationClick = (prompt: string) => {
    setChatInput(prompt);
  };

  // Submit spot review
  const handleSubmitReview = async (e: React.FormEvent, spotId: string) => {
    e.preventDefault();
    if (!reviewForm.author || !reviewForm.text) {
      triggerToast(translations[lang].toastError, "info");
      return;
    }

    try {
      const res = await fetch(`/api/tourism/${spotId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: reviewForm.author,
          rating: Number(reviewForm.rating),
          text: reviewForm.text
        })
      });
      if (!res.ok) throw new Error("API not ok");
      const data = await res.json();
      if (data.success) {
        triggerToast("ขอบคุณที่ร่วมรีวิวพิกัดท้องถิ่นยะลาอัจฉริยะ!", "success");
        // Update local state spot dynamically
        setTourism(prev => prev.map(s => s.id === spotId ? data.spot : s));
        setSelectedSpot(data.spot);
        // Reset Form
        setReviewForm({ author: "", rating: 5, text: "" });
      }
    } catch (err) {
      console.warn("Backend review submission failed. Simulating review on client state:", err);
      // Fallback local update
      setTourism(prev => prev.map(s => {
        if (s.id === spotId) {
          const newReview = {
            author: reviewForm.author,
            rating: Number(reviewForm.rating),
            text: reviewForm.text,
            date: new Date().toISOString().split("T")[0]
          };
          const updatedReviews = [newReview, ...s.reviews];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const updatedSpot = {
            ...s,
            reviewsCount: updatedReviews.length,
            reviews: updatedReviews,
            rating: parseFloat((totalRating / updatedReviews.length).toFixed(1))
          };
          // Set as currently selected as well
          setSelectedSpot(updatedSpot);
          return updatedSpot;
        }
        return s;
      }));
      triggerToast("ร่วมรีวิวพิกัดท้องถิ่นยะลาระบบจำลองสำเร็จ!", "success");
      setReviewForm({ author: "", rating: 5, text: "" });
    }
  };

  // Download simulation
  const simulateDownload = (datasetTitle: string, format: string) => {
    triggerToast(`${translations[lang].toastDownload} ${format}: ${datasetTitle}`, "success");
  };

  // Coordinate click selector mock simulation
  const handleMapGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setGridX(x);
    setGridY(y);

    // Convert pixels to believable Yala coordinates (around Lat 6.54, Lng 101.28)
    const normalizedLat = 6.53 + ((300 - y) / 300) * 0.03;
    const normalizedLng = 101.26 + (x / 400) * 0.04;

    setComplaintForm(prev => ({
      ...prev,
      lat: parseFloat(normalizedLat.toFixed(4)),
      lng: parseFloat(normalizedLng.toFixed(4))
    }));

    triggerToast(`จัดหมุนพิกัด GIS สำเร็จ: [${normalizedLat.toFixed(4)}, ${normalizedLng.toFixed(4)}]`, "success");
  };

  // Admin simulation state changes
  const handleAdminStatusChange = async (complaintId: string, newStatus: "received" | "progress" | "completed") => {
    try {
      const updated = await dbUpdateComplaintStatus(complaintId, newStatus, "ปรับโอนย้ายสถานะเคสโดยส่วนควบคุมแอดมิน เพื่อส่งต่อเร่งบูรณาการแก้ไข");
      if (updated) {
        setComplaints(prev => prev.map(c => c.id === complaintId ? updated : c));
      } else {
        // Fallback local modification if mock
        setComplaints(prev => prev.map(c => {
          if (c.id === complaintId) {
            const d = new Date();
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
            const newLog = {
              status: newStatus,
              date: dateStr,
              note: `ปรับโอนย้ายสถานะเคสโดยส่วนควบคุมแอดมิน เพื่อส่งต่อเร่งบูรณาการแก้ไข`
            };
            return {
              ...c,
              status: newStatus,
              progressLog: [...c.progressLog, newLog]
            };
          }
          return c;
        }));
      }
      triggerToast(`ปรับอัปเดตสถานะปัญหาเลขดักเรียบร้อยเป็น: ${newStatus.toUpperCase()}`, "success");
    } catch (err: any) {
      console.error("Admin status override error:", err);
      triggerToast("ไม่สามารถอัปเดตสถานะเนื่องจากสิทธิ์ผู้ใช้ไม่พึงประสงค์", "info");
    }
  };

  // Delete complaint instance (mock admin delete)
  const handleAdminDelete = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
    triggerToast("ลบเรื่องร้องเรียนออกจากฐานข้อมูลจำลองสถิติสำเร็จ", "info");
  };

  const filteredMarkers = markers.filter(m => {
    if (mapFilter === "all") return true;
    return m.type === mapFilter;
  });

  const searchedComplaints = complaints.filter(c => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(query) ||
      c.trackingNum.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query) ||
      c.dept.toLowerCase().includes(query)
    );
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} font-sans`}>
      
      {/* ================== GLOBAL TOAST ================== */}
      {toastMessage && (
        <div id="toast" className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl transition-all border border-l-4 animate-fade-in ${
          toastMessage.type === "success" 
            ? "bg-emerald-900 border-emerald-500 text-emerald-100 animate-pulse" 
            : "bg-blue-900 border-blue-500 text-blue-100"
        }`}>
          {toastMessage.type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" /> : <AlertTriangle className="h-5 w-5 text-blue-400 shrink-0" />}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">MUNICIPAL DESK ALERT</p>
            <p className="text-sm font-semibold">{toastMessage.text}</p>
          </div>
        </div>
      )}

      {/* ================== MASTER VIEWPORT GRID ================== */}
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        
        {/* ================== SIDEBAR (Dark theme elements strictly adhering to Design instructions) ================== */}
        <aside className="w-full lg:w-80 bg-slate-900 text-slate-100 flex flex-col justify-between border-r border-slate-800 shrink-0 z-10 overflow-y-auto">
          <div>
            {/* Logo Badge */}
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 font-extrabold text-lg tracking-tighter text-white shadow-lg shadow-blue-500/10">
                  YALA
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">SMART CITY</p>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight leading-none text-white font-display">ยะลามหานคร</h1>
                </div>
              </div>
              <p className="mt-2 text-xs font-medium text-slate-400">{translations[lang].subtitle}</p>
            </div>

            {/* Sidebar Navigation */}
            <nav className="mt-6 px-4 space-y-1.5">
              <button 
                id="nav-home"
                onClick={() => { handleTabChange("home"); }}
                className={`w-full font-display border-l-4 rounded-r-lg px-4 py-3.5 text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "home" 
                    ? "bg-blue-600/10 text-white border-blue-500" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className={`h-4.5 w-4.5 ${activeTab === "home" ? "text-blue-400" : "text-slate-500"}`} />
                  {translations[lang].menuHome}
                </div>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </button>

              <button 
                id="nav-dashboard"
                onClick={() => { handleTabChange("dashboard"); }}
                className={`w-full font-display border-l-4 rounded-r-lg px-4 py-3.5 text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "dashboard" 
                    ? "bg-blue-600/10 text-white border-blue-500" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className={`h-4.5 w-4.5 ${activeTab === "dashboard" ? "text-blue-400" : "text-slate-500"}`} />
                  {translations[lang].menuDashboard}
                </div>
                <span className="bg-emerald-500 text-slate-905 font-bold text-[9px] px-1.5 py-0.5 rounded-full">REAL-TIME</span>
              </button>

              <button 
                id="nav-service"
                onClick={() => { handleTabChange("service"); }}
                className={`w-full font-display border-l-4 rounded-r-lg px-4 py-3.5 text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "service" 
                    ? "bg-blue-600/10 text-white border-blue-500" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-4.5 w-4.5 ${activeTab === "service" ? "text-blue-400" : "text-slate-500"}`} />
                  {translations[lang].menuService}
                </div>
                <span className="bg-blue-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full">AI v2</span>
              </button>

              <button 
                id="nav-map"
                onClick={() => { handleTabChange("map"); }}
                className={`w-full font-display border-l-4 rounded-r-lg px-4 py-3.5 text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "map" 
                    ? "bg-blue-600/10 text-white border-blue-500" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Map className={`h-4.5 w-4.5 ${activeTab === "map" ? "text-blue-400" : "text-slate-500"}`} />
                  {translations[lang].menuMap}
                </div>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </button>

              <button 
                id="nav-tourism"
                onClick={() => { handleTabChange("tourism"); }}
                className={`w-full font-display border-l-4 rounded-r-lg px-4 py-3.5 text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "tourism" 
                    ? "bg-blue-600/10 text-white border-blue-500" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Compass className={`h-4.5 w-4.5 ${activeTab === "tourism" ? "text-blue-400" : "text-slate-500"}`} />
                  {translations[lang].menuTourism}
                </div>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </button>

              <button 
                id="nav-profile"
                onClick={() => { handleTabChange("profile"); }}
                className={`w-full font-display border-l-4 rounded-r-lg px-4 py-3.5 text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "profile" 
                    ? "bg-blue-600/10 text-white border-blue-500" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`h-4.5 w-4.5 ${activeTab === "profile" ? "text-blue-400" : "text-slate-300"}`} />
                  โปรไฟล์ & ติดตามเครื่องมือ
                </div>
                {currentUser ? (
                  <span className="bg-emerald-500 text-slate-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider">ACTIVE</span>
                ) : (
                  <span className="bg-slate-700 text-slate-300 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider">GUEST</span>
                )}
              </button>

              <button 
                id="nav-admin"
                onClick={() => { handleTabChange("admin"); }}
                className={`w-full font-display border-l-4 rounded-r-lg px-4 py-3.5 text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "admin" 
                    ? "bg-emerald-600/10 text-emerald-400 border-emerald-500" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className={`h-4.5 w-4.5 ${activeTab === "admin" ? "text-emerald-400" : "text-slate-500"}`} />
                  {translations[lang].menuAdmin}
                </div>
                <span className="bg-amber-500 text-slate-900 font-extrabold text-[9px] px-1.5 py-0.5 rounded">CONTROLS</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Highlight Panel */}
          <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-slate-800 to-indigo-950 border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">Innovation Highlight</p>
            </div>
            <p className="font-bold text-xs text-white">AI Complaint Classifier</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              ระบบวิเคราะห์ข้อมูลคัดกรองปัญหาด้วย LLM Gemini-3.5 อัตโนมัติ เพื่อส่งตรงถึงเจ้าของฝ่ายปกครองทันที 95% ทันการณ์
            </p>
            <button 
              onClick={() => { setSelectedComplaint(null); handleTabChange("service"); }}
              className="mt-3 w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 transition-all cursor-pointer shadow-md shadow-blue-500/10"
            >
              ทดสอบส่งปัญหา AI
            </button>
          </div>
        </aside>

        {/* ================== MAIN VIEW WRAPPER ================== */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* ================== HEADER ================== */}
          <header className={`h-20 border-b flex items-center justify-between px-6 lg:px-8 shrink-0 z-20 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
            
            {/* Search Input Box */}
            <div className="relative w-full max-w-md hidden md:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4.5 w-4.5 text-slate-400" />
              </span>
              <input 
                type="text"
                placeholder={translations[lang].searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchSuggestionActive(e.target.value.length > 0);
                }}
                className={`w-full rounded-full pl-10 pr-4 py-2 text-xs font-semibold tracking-tight transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? "bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-705" : "bg-slate-100 text-slate-800 focus:bg-white"
                }`}
              />
              {searchSuggestionActive && searchedComplaints.length > 0 && (
                <div className={`absolute top-full left-0 right-0 mt-2 p-3 rounded-xl shadow-2xl z-50 border ${
                  darkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                }`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">ผลลัพธ์คัดกรองปัญหาด่วน ({searchedComplaints.length})</p>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {searchedComplaints.slice(0, 4).map(c => (
                      <div 
                        key={c.id}
                        onClick={() => {
                          setSelectedComplaint(c);
                          handleTabChange("service");
                          setSearchSuggestionActive(false);
                        }}
                        className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                          darkMode ? "hover:bg-slate-800 inline-block w-full" : "hover:bg-slate-100 inline-block w-full"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-500">{c.trackingNum}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold self-start uppercase ${
                            c.status === "completed" ? "bg-emerald-100 text-emerald-800" : c.status === "progress" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-800"
                          }`}>{c.status}</span>
                        </div>
                        <p className="truncate font-semibold mt-0.5 text-slate-600 dark:text-slate-300">{c.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language + DarkMode + Notification controls */}
            <div className="flex items-center gap-3 ml-auto">
              
              {/* Language Toolbar */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(["th", "en", "ms"] as LanguageCode[]).map(l => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      triggerToast(`เปลี่ยนภาษาของระบบสำเร็จเป็น: ${l.toUpperCase()}`, "info");
                    }}
                    className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                      lang === l 
                        ? "bg-blue-600 text-white" 
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  darkMode ? "bg-slate-800 text-amber-400 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Notification Center */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                  className={`p-2.5 rounded-xl transition-colors relative cursor-pointer ${
                    darkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {notifications.length}
                  </span>
                </button>

                {showNotificationPopup && (
                  <div className={`absolute top-full right-0 mt-3 w-80 p-4 rounded-2xl shadow-2xl z-50 border ${
                    darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-100 text-slate-900"
                  }`}>
                    <div className="flex items-center justify-between mb-3 border-b pb-2">
                      <p className="text-xs font-extrabold uppercase tracking-tight text-slate-400">Notification Center</p>
                      <button 
                        onClick={() => setNotifications([])}
                        className="text-[10px] text-blue-500 hover:underline font-bold"
                      >
                        เคลียร์ทั้งหมด
                      </button>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-center text-slate-400 py-4 font-semibold">ไม่มีการแจ้งเตือนใหม่</p>
                      ) : (
                        notifications.map((n, idx) => (
                          <div key={idx} className="flex gap-2.5 items-start text-xs border-b border-slate-50 last:border-none pb-2">
                            <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                            <p className="leading-relaxed text-slate-600 dark:text-slate-300 font-medium">{n}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Badge for hackathon presentation */}
              <div className="hidden lg:flex items-center gap-2 border-l pl-4 border-slate-200 dark:border-slate-800">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[11px] font-black uppercase text-emerald-500 font-mono tracking-wider">HACKATHON v2.0</span>
              </div>
            </div>
          </header>

          {/* ================== SUB VIEW BODY CONTENT AREA ================== */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 dark:bg-slate-950">
            
            {/* ================== TAB: HOME (Dashboard & Projects) ================== */}
            {activeTab === "home" && (
              <div className="space-y-8 max-w-7xl mx-auto">
                
                {/* Hero Banner with Bold Typography Design */}
                <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[300px] flex flex-col justify-end p-8 md:p-12 shadow-2xl shadow-blue-900/10 border border-slate-800">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="absolute top-6 right-6 flex items-center bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20">
                    <Activity className="h-4.5 w-4.5 text-emerald-400 animate-pulse mr-2" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">{translations[lang].statusLive}</span>
                  </div>
                  
                  <div className="relative max-w-3xl z-10 space-y-4">
                    <div className="inline-block bg-blue-600 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest">
                      YALA SMART CITY INITIATIVE
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                      Yala Smart <br className="hidden md:inline" /> Municipality Platform
                    </h2>
                    <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed max-w-2xl">
                      {translations[lang].subtitle} สำหรับการพัฒนาและช่วยเหลือประเด็นสาธารณะ คัดกรองกองทำงานด้วย AI ทันเวลา ตกแต่งข้อมูลเมืองอเนกประสงค์เพื่อการนำเสนอใน Hackathon
                    </p>
                    
                    {/* Hero Actions */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button 
                        onClick={() => handleTabChange("service")} 
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                      >
                        {translations[lang].quickReport}
                      </button>
                      <button 
                        onClick={() => handleTabChange("dashboard")} 
                        className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm px-6 py-3 rounded-2xl transition-all cursor-pointer border border-white/20"
                      >
                        {translations[lang].downloadOpenData}
                      </button>
                    </div>
                  </div>
                </div>

                {/* City Statistics Overview Rows (Adhering to requested metrics cards) */}
                <div>
                  <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    ดัชนีเมืองอัจฉริยะแบบ Real-Time (Yala City Index)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{translations[lang].statPop}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black text-blue-600">{stats?.population?.count.toLocaleString() || "64,120"}</span>
                        <span className="text-xs text-slate-400 font-bold">{translations[lang].unitPop}</span>
                      </div>
                      <span className="text-xs text-emerald-500 font-bold mt-2 inline-block">↗ {stats?.population?.change || "+1.2%"} สถิติรายปี</span>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{translations[lang].statCommunities}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black text-slate-800 dark:text-slate-200">{stats?.communities?.count || "42"}</span>
                        <span className="text-xs text-slate-400 font-bold">{translations[lang].unitComm}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-bold mt-2 inline-block">● ครอบคลุมรอบเทศบาลสมบูรณ์</span>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{translations[lang].statWaste}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black text-amber-600">{stats?.dailyWaste?.tons || "72.4"}</span>
                        <span className="text-xs text-slate-400 font-bold">{translations[lang].unitWaste}</span>
                      </div>
                      <span className="text-xs text-emerald-500 font-bold mt-2 inline-block">{stats?.dailyWaste?.change || "-4.8% แยกขยะสำเร็จ"}</span>
                    </div>
                  </div>
                </div>

                {/* News & Public Health Warnings Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Latest Community News Cards */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-black uppercase text-slate-500 tracking-wider">ประชาสัมพันธ์ & สถานการณ์เด่น</h3>
                    <div className="space-y-4">
                      
                      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center">
                        <img 
                          src="https://images.unsplash.com/photo-1577906096429-f73ae1831244?auto=format&fit=crop&w=350&q=80" 
                          alt="techno" 
                          className="h-28 w-full md:w-40 rounded-xl object-cover shrink-0"
                        />
                        <div className="space-y-1 w-full">
                          <span className="bg-blue-150 inline-block bg-blue-100 text-blue-800 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase">เทคโนโลยีระดับเมือง</span>
                          <h4 className="font-bold text-sm md:text-base hover:text-blue-600 transition-colors cursor-pointer">ยะลาเชื่อมต่อสถิติกางร่มกล้อง AI เพื่อลดอุบัติภัยยามค่ำคืน </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            สำนักเทศบาลนครยะลา ดำเนินการยกระดับโครงข่ายไฟเบอร์ออปติกรุ่นใหม่และติดตั้งกล้องวงจรปิดออปติคอลตรวจแก้ความปลอดภัยครอบคลุม 254 พิกัดเสี่ยง...
                          </p>
                          <p className="text-[10px] text-slate-400 pt-1 font-semibold">2 มิถุนายน 2526 • หมวดเทคโนโลยีและระบบจราจร</p>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center">
                        <img 
                          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=350&q=80" 
                          alt="ecology" 
                          className="h-28 w-full md:w-40 rounded-xl object-cover shrink-0"
                        />
                        <div className="space-y-1 w-full">
                          <span className="bg-emerald-100 text-emerald-800 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase">สุขภาพและสิ่งแวดล้อม</span>
                          <h4 className="font-bold text-sm hover:text-emerald-600 transition-colors cursor-pointer">เชิญชวนวิ่งรณรงค์คัดแยกขยะเปียกเปลี่ยนโลก ณ อ่างสวนขวัญเมือง</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            เสาร์สัปดาห์นี้ขอเรียนเชิญเยาวชนและผู้สูงอายุร่วมเดินขบวนฟิตร่างกายรับอากาศสะอาด โดยเปิดกล่องสาธิตนวัตกรรมถังอัจฉริยะ...
                          </p>
                          <p className="text-[10px] text-slate-400 pt-1 font-semibold">30 พฤษภาคม 2526 • กองสาธารณสุข ยะลา</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Development Projects Milestones Card */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-black uppercase text-slate-500 tracking-wider">โชว์รูมแผนพัฒนา (City Projects)</h3>
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white space-y-4 shadow-xl border border-slate-800">
                      <div>
                        <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-950 px-2 py-1 rounded">FEATURED PROGRESS</span>
                        <h4 className="font-bold text-base mt-2">ศูนย์บัญชาการอัจฉริยะนครยะลา</h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">เชื่อมต่อโครงข่ายจราจรและดัชนีเซ็นเซอร์ IoT ประหยัดกระแสไฟ</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold font-mono">
                          <span>คืบหน้าภาพรวม</span>
                          <span className="text-emerald-400">85%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>

                      <div className="border-t border-slate-800 pt-3 space-y-2.5">
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span>เชื่อมโยงข้อมูลขยะและ AQI สำเร็จ</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span>ติดตั้งกล้องคัดเลือกเลขทะเบียน</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                          <div className="h-2 w-2 rounded-full bg-amber-500 animate-ping ml-1 mr-1"></div>
                          <span>อยู่ระหว่างฝึกเจ้าหน้าที่ห้องแวร์เฮาส์</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleTabChange("tourism")}
                        className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-2 rounded-xl text-xs font-bold text-center block transition-all"
                      >
                        ดูแผนผังความคืบหน้าทั้งหมด (Interactive)
                      </button>
                    </div>
                  </div>

                </div>

                {/* City Development Project Details / Interactive Timeline Grid page section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black">{translations[lang].projectsTitle}</h3>
                    <p className="text-xs text-slate-400">{translations[lang].projectsSub}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectList.map(proj => (
                      <div key={proj.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase truncate">
                              {proj.location}
                            </span>
                            <span className="text-xs font-bold text-emerald-500">{proj.progress}%</span>
                          </div>
                          
                          <h4 className="font-extrabold text-sm md:text-base leading-tight">
                            {lang === "th" ? proj.name : lang === "en" ? proj.nameEn : proj.nameMs}
                          </h4>
                          
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                            {lang === "th" ? proj.description : lang === "en" ? proj.descriptionEn : proj.descriptionMs}
                          </p>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-slate-50 dark:border-slate-850">
                          <div className="text-[11px] text-slate-400 space-y-1 font-medium">
                            <p>💰 <span className="font-semibold text-slate-600 dark:text-slate-300">{proj.budget}</span></p>
                            <p>⏳ <span>{proj.startDate} ถึง {proj.endDate}</span></p>
                          </div>

                          <div className="h-1.5 bg-slate-100 dark:bg-slate-820 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${proj.progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ================== TAB: DASHBOARD (Data charts & Open Data Download Platform) ================== */}
            {activeTab === "dashboard" && (
              <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
                
                {/* Visual Section Head */}
                <div className="space-y-2">
                  <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-400 font-bold text-[9px] px-2.5 py-1.5 rounded-full uppercase tracking-widest inline-block">
                    MUNICIPAL TRANSPARENCY
                  </span>
                  <h2 className="text-3xl font-black font-display text-slate-800 dark:text-slate-100 tracking-tight leading-none uppercase">ยะลาเรียลไทม์แดชบอร์ด</h2>
                  <p className="text-xs text-slate-500">ข้อมูลสถิติมลพิษ จราจร ขยะและอัตราครองตนเองเพื่อสังคมใน Hackathon ต้นแบบการแข่งขัน</p>
                </div>

                {/* Numeric Metric row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{translations[lang].statAir}</p>
                    <p className="text-2xl font-black text-emerald-500 mt-1">28 {translations[lang].unitAqi}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">● ดีมาก (Very Good)</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{translations[lang].statComplaints}</p>
                    <p className="text-2xl font-black text-blue-600 mt-1">95.1%</p>
                    <p className="text-[10px] text-slate-400 font-semibold">3,410 / 3,584 เคสที่ยุติแล้ว</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{translations[lang].statRain}</p>
                    <p className="text-2xl font-black text-indigo-500 mt-1">12.5 {translations[lang].unitMm}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">เฉลี่ยตกประปรายระดับปกติ</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">เรื่องร้องเรียนค้างคา</p>
                    <p className="text-2xl font-black text-amber-500 mt-1">{complaints.filter(c => c.status !== "completed").length} เรื่อง</p>
                    <p className="text-[10px] text-amber-600 font-bold">● กำลังแก้ไขอย่างเร่งด่วน</p>
                  </div>
                </div>

                {/* Gorgeous interactive SVG charts strictly conforming to styling patterns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* SVG Bar Chart: Complaints by Department */}
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm">
                    <div>
                      <h4 className="font-extrabold text-sm md:text-base">จำนวนผู้ใช้บริการแจ้งปัญหาจำแนกตามกองรับผิดชอบ</h4>
                      <p className="text-[11px] text-slate-400">อัปเดตสถิติตามการคัดหมวดประเภทพยากรณ์จาก AI</p>
                    </div>

                    <div className="pt-4 space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>กองช่าง (โครงสร้างพื้นฐาน/ถนน)</span>
                          <span className="font-bold">42% (150 เคส)</span>
                        </div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: "42%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>กองสาธารณสุขและสิ่งแวดล้อม (ขยะ/สิ่งปฏิกูล)</span>
                          <span className="font-bold">28% (100 เคส)</span>
                        </div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "28%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>งานไฟฟ้าและแสงสว่าง (โคมทางไฟ)</span>
                          <span className="font-bold">18% (65 เคส)</span>
                        </div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: "18%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>กองป้องกันอุทกภัยและสาธารณภัย</span>
                          <span className="font-bold">12% (43 เคส)</span>
                        </div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: "12%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SVG Line Chart Simulator: Monthly Recycled index representation */}
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm md:text-base">แนวโน้มระดับคุณภาพอากาศและประสิทธิภาพการบำบัดขยะ (รายไตรมาส)</h4>
                      <p className="text-[11px] text-slate-400">เปรียบเทียบระหว่าง อากาศปลอดโปร่ง (เขียว) และ ตารางการกวาดล้างสิ่งสกปรก (เทา)</p>
                    </div>

                    {/* Interactive Graphics Line representation over years */}
                    <div className="relative h-44 w-full border-b border-l border-slate-200 dark:border-slate-700 flex items-end">
                      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                        {/* Green Line (Aq index) */}
                        <path 
                          d="M10,130 Q80,90 140,110 T260,30 T380,45" 
                          fill="none" 
                          stroke="#22c55e" 
                          strokeWidth="3.5" 
                          className="drop-shadow-lg"
                        />
                        {/* Blue Line (Recycling index) */}
                        <path 
                          d="M10,100 Q80,120 140,70 T260,80 T380,20" 
                          fill="none" 
                          stroke="#3b82f6" 
                          strokeWidth="3.5" 
                          className="drop-shadow-lg"
                        />
                      </svg>
                      {/* X Axis indicators */}
                      <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[10px] font-bold text-slate-400 font-mono">
                        <span>Q1/25</span>
                        <span>Q2/25</span>
                        <span>Q3/25</span>
                        <span>Q4/25</span>
                        <span>Q1/26</span>
                      </div>
                    </div>

                    <div className="flex gap-4 text-xs font-bold justify-center">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                        <span>ดัชนีคาร์บอน (อากาศปลอดภัย)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                        <span>อัตราสัดส่วนการรีไซเคิลของชุมชน</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Open Data Platform (คลังข้อมูลเปิดและชุดดาวน์โหลด) */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black">{translations[lang].openDataTitle}</h3>
                    <p className="text-xs text-slate-400">{translations[lang].openDataSub}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {datasets.map(data => (
                      <div key={data.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                              {data.category}
                            </span>
                            <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-400 font-bold text-[9px] px-2 py-0.5 rounded font-mono">
                              {data.format}
                            </span>
                          </div>
                          
                          <h4 className="font-extrabold text-sm leading-snug">
                            {lang === "th" ? data.title.th : lang === "en" ? data.title.en : data.title.ms}
                          </h4>
                          
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {lang === "th" ? data.description.th : lang === "en" ? data.description.en : data.description.ms}
                          </p>

                          <div className="flex gap-4 pt-2 text-[10px] text-slate-400 font-mono">
                            <span>📦 {data.fileSize}</span>
                            <span>📥 {data.downloads.toLocaleString()} downloads</span>
                            <span>⏳ ปรับปรุง: {data.lastUpdated}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => simulateDownload(lang === "th" ? data.title.th : data.title.en, data.format)}
                          className="p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-2xl transition-all cursor-pointer text-blue-600 dark:text-blue-400 shadow-sm shrink-0"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ================== TAB: CITIZEN SERVICE (Smart Complaint and Live tracking Log workflow) ================== */}
            {activeTab === "service" && (
              <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
                
                {/* Form header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 font-bold text-[9px] px-2.5 py-1.5 rounded-full uppercase tracking-widest inline-block">
                      AI CLASSIFIER SYSTEM v2
                    </span>
                    <h2 className="text-3xl font-black font-display tracking-tight text-slate-800 dark:text-slate-100">ศูนย์รับแจ้งปัญหาสุขภาวะอัจฉริยะ</h2>
                    <p className="text-xs text-slate-500">กรอกหัวข้อปัญหา แตะพิกัดบนแผนที่ GIS จำลอง ระบบ AI จะตรวจสอบจำแนกโอนส่งกองงานเจ้าของพื้นที่ที่ถูกต้อง</p>
                  </div>
                  <button 
                    onClick={() => {
                      setComplaintForm({
                        title: "ขยะล้นถังในซอยสุขยางค์ 10 ส่งกลิ่นเหม็น",
                        description: "ถังขยะใบสีน้ำเงินแตกหัก มีขยะเศษอาหารเทล้นออกมาด้านนอกเป็นเวลากว่า 3 วันแล้ว ส่งกลิ่นเหม็นเข้าไปในบ้านพักอาศัยประชาชนมาก",
                        location: "ซอยสุขยางค์ 10 หน้าสำนักงานซักรีดด่วน",
                        imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80",
                        lat: 6.5422,
                        lng: 101.2818
                      });
                      triggerToast("ใส่ข้อมูลตัวอย่างอเนกประสงค์เพื่อการนำเสนอ เรียบร้อย!", "success");
                    }}
                    className="bg-indigo-650 hover:bg-indigo-600 bg-indigo-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    โหลดตัวอย่างปัญหาด่วน (Demo Filler)
                  </button>
                </div>

                {/* Main Split Screen container: Left Form, Right AI recommendations & details */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Input Panel */}
                  <form onSubmit={handleSubmitComplaint} className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-850 space-y-5 shadow-sm">
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-350">{translations[lang].formTitle}</label>
                      <input 
                        type="text"
                        required
                        placeholder={translations[lang].formTitlePlaceholder}
                        value={complaintForm.title}
                        onChange={(e) => setComplaintForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-350">{translations[lang].formDesc}</label>
                      <textarea 
                        required
                        rows={3}
                        placeholder={translations[lang].formDescPlaceholder}
                        value={complaintForm.description}
                        onChange={(e) => setComplaintForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-350">{translations[lang].formLocation}</label>
                      <input 
                        type="text"
                        required
                        placeholder={translations[lang].formLocationPlaceholder}
                        value={complaintForm.location}
                        onChange={(e) => setComplaintForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                      />
                    </div>

                    {/* Interactive coordinate and mapping Selector */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-bold text-slate-600 dark:text-slate-350">{translations[lang].formCoordinates}</label>
                        <span className="font-mono text-blue-500 dark:text-blue-400 font-bold">Lat: {complaintForm.lat}, Lng: {complaintForm.lng}</span>
                      </div>
                      
                      {/* Custom grid representing central Yala */}
                      <div 
                        onClick={handleMapGridClick}
                        className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-150 border border-dashed border-slate-300 dark:border-slate-750 bg-slate-100 cursor-crosshair group"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-40"></div>
                        
                        {/* Map landmark tags floating on mock grid */}
                        <span className="absolute top-4 left-6 text-[9px] bg-white/80 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold">สวนขวัญเมือง Suan Khwan</span>
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded font-bold">จุดศูนย์กลางเมืองศาลหลักเมือง Yala City Pillar</span>
                        <span className="absolute bottom-4 right-8 text-[9px] bg-white/80 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold">ตลาดสิโรรส Siroros Bazaar</span>

                        {/* Interactive red pointer */}
                        <div 
                          className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300"
                          style={{ left: gridX, top: gridY }}
                        >
                          <span className="absolute h-6 w-6 rounded-full bg-red-500/30 animate-ping"></span>
                          <MapPin className="h-5 w-5 text-red-600" />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal font-medium">💡 คลิกส่วนใดก็ได้บนแผ่นตารางจำลองข้างต้นเพื่อจัดหาพิกัด GPS ส่งเข้าฐานข้อมูลแผนที่</p>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs py-4 rounded-2xl transition-all cursor-pointer shadow-lg shadow-blue-600/15 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                          <span>กำลังคัดแยกอัจฉริยะด้วย AI...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4.5 w-4.5" />
                          <span>{translations[lang].submitBtn}</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Right Column: AI Live Evaluation and Timeline */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Live Suggestion Analysis Results */}
                    {lastSubmissionResult ? (
                      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white space-y-4 shadow-xl border border-indigo-800 transform scale-100 animate-pulse duration-1000">
                        <div className="flex items-center gap-2 border-b border-indigo-800 pb-3">
                          <Sparkles className="h-5 w-5 text-amber-400" />
                          <h4 className="font-extrabold text-sm md:text-base text-amber-400">{translations[lang].aiAnalysisActive}</h4>
                        </div>

                        <div className="space-y-2 text-xs">
                          <p>
                            <span className="text-slate-400">{translations[lang].aiCat}</span>{" "}
                            <span className="font-extrabold text-white">{lastSubmissionResult.aiRecommendation.category}</span>
                          </p>
                          <p>
                            <span className="text-slate-400">{translations[lang].aiDept}</span>{" "}
                            <span className="bg-blue-600/30 text-blue-300 font-extrabold px-2 py-0.5 rounded">
                              {lastSubmissionResult.aiRecommendation.department}
                            </span>
                          </p>
                          <p>
                            <span className="text-slate-400">{translations[lang].aiConfidence}</span>{" "}
                            <span className="font-mono text-emerald-400 font-black">
                              {(lastSubmissionResult.aiRecommendation.confidence * 100).toFixed(0)}%
                            </span>
                          </p>
                          <p>
                            <span className="text-slate-400">{translations[lang].aiPriority}</span>{" "}
                            <span className={`font-mono font-bold uppercase ${
                              lastSubmissionResult.aiRecommendation.priority === "critical" ? "text-red-400" : "text-amber-400"
                            }`}>
                              {lastSubmissionResult.aiRecommendation.priority}
                            </span>
                          </p>
                          <p className="border-t border-indigo-900 pt-2 leading-relaxed">
                            <span className="text-slate-400">{translations[lang].aiReason}</span>{" "}
                            <span className="text-slate-200 italic">"{lastSubmissionResult.aiRecommendation.explanation}"</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 font-semibold text-xs text-center py-12">
                        <Sparkles className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p>รอข้อมูลการส่งเรื่องร้องเรียน...</p>
                        <p className="text-[10px] text-slate-400 mt-1">ระบบจะวิเคราะห์คีย์เวิร์ดภาษาไทยเพื่อแสดงกองงานปกครองอย่างแม่นยำ</p>
                      </div>
                    )}

                    {/* Timeline Tracker box below */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm">ประวัติการติดตามงานล่าสุด (Timeline Audit)</h4>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold">STATE FLOW</span>
                      </div>

                      <div className="space-y-4 max-h-72 overflow-y-auto">
                        {searchedComplaints.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-4 font-semibold">ไม่พบเคสตามข้อความค้นหาของคุณ</p>
                        ) : (
                          searchedComplaints.map(caseNode => (
                            <div 
                              key={caseNode.id} 
                              onClick={() => setSelectedComplaint(caseNode)}
                              className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                                selectedComplaint?.id === caseNode.id 
                                  ? "bg-slate-100 border-slate-350 dark:bg-slate-800 dark:border-slate-700" 
                                  : "bg-slate-50 border-slate-100 dark:bg-slate-900 dark:border-slate-850 hover:bg-slate-100/50"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono font-bold text-xs text-blue-600">{caseNode.trackingNum}</span>
                                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                                  caseNode.status === "completed" 
                                    ? "bg-emerald-100 text-emerald-800" 
                                    : caseNode.status === "progress" 
                                      ? "bg-amber-100 text-amber-800" 
                                      : "bg-slate-200 text-slate-800"
                                }`}>
                                  {caseNode.status}
                                </span>
                              </div>
                              <h5 className="font-extrabold text-xs truncate mt-2 leading-tight">{caseNode.title}</h5>
                              <p className="text-[10px] text-slate-400 mt-1">📍 {caseNode.location} • {caseNode.date}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                </div>

                {/* Selected Complaint Tracking Details Workflow visualization */}
                {selectedComplaint && (
                  <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-6 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-lg text-blue-600">{selectedComplaint.trackingNum}</span>
                          <span className="text-slate-400 font-bold">•</span>
                          <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-bold text-slate-600 dark:text-slate-300">
                            {selectedComplaint.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mt-1 text-slate-800 dark:text-white leading-tight">{selectedComplaint.title}</h3>
                      </div>
                      
                      {/* Active Status Display and Timeline Workflow */}
                      <div className="flex items-center gap-2 bg-slate-150 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase ${
                          selectedComplaint.status === "received" ? "bg-blue-600 text-white" : "text-slate-400"
                        }`}>Received</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase ${
                          selectedComplaint.status === "progress" ? "bg-amber-500 text-slate-900" : "text-slate-400"
                        }`}>In Progress</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase ${
                          selectedComplaint.status === "completed" ? "bg-emerald-500 text-white" : "text-slate-400"
                        }`}>Completed</span>
                      </div>
                    </div>

                    {/* Complaint detailed body */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="space-y-1.5 text-xs">
                          <p className="font-bold text-slate-400">รายละเอียดเพิ่มเติม:</p>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">{selectedComplaint.description}</p>
                        </div>
                        <div className="space-y-1 text-xs">
                          <p className="font-bold text-slate-400">สถานที่จำเลย:</p>
                          <p className="font-semibold text-slate-600 dark:text-slate-300">📍 {selectedComplaint.location}</p>
                        </div>
                        <div className="space-y-1 text-xs font-mono">
                          <p className="font-bold text-slate-400">กองสัญชาติรับเรื่อง:</p>
                          <p className="font-black text-blue-500 dark:text-blue-400">🏢 {selectedComplaint.dept}</p>
                        </div>
                      </div>

                      {/* Progress Logger steps representation */}
                      <div className="space-y-4 bg-slate-50 dark:bg-slate-820 p-5 rounded-2xl border">
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">ประวัติบันทึกการซ่อมบำรุง (Progress Log)</h4>
                        <div className="space-y-4 relative pl-4 border-l border-slate-200 dark:border-slate-700">
                          {selectedComplaint.progressLog.map((log, lIdx) => (
                            <div key={lIdx} className="relative space-y-1">
                              {/* circular timeline tick */}
                              <span className={`absolute -left-[20.5px] top-1 h-3 w-3 rounded-full border-2 ${
                                log.status === "completed" ? "bg-emerald-500 border-emerald-990" : log.status === "progress" ? "bg-amber-500 border-amber-990" : "bg-blue-500 border-blue-990"
                              }`}></span>
                              
                              <p className="text-[10px] font-mono text-slate-400 font-bold">{log.date}</p>
                              <p className="text-xs font-extrabold capitalize">{log.status.toUpperCase()}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{log.note}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ================== TAB: GIS MAP (แผนที่แสดง Landmark และจุดร้องเรียน) ================== */}
            {activeTab === "map" && (
              <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
                
                {/* Title area */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-400 font-bold text-[9px] px-2.5 py-1.5 rounded-full uppercase tracking-widest inline-block">
                      INTERACTIVE GEOGRAPHIC SYSTEM
                    </span>
                    <h2 className="text-3xl font-black font-display tracking-tight text-slate-800 dark:text-slate-100 uppercase">แผนที่ข้อมูลอัจฉริยะ (GIS City Map)</h2>
                    <p className="text-xs text-slate-500">ติดตามตำแหน่งสถานที่สำคัญของรัฐ โรงเรียน โรงพยาบาล และติดตามเคสความเดือดร้อน ณ ยะลา</p>
                  </div>

                  {/* Marker filters */}
                  <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border">
                    {[
                      { type: "all", label: "ดูทั้งหมด" },
                      { type: "office", label: "🏢 สถานที่ราชการ" },
                      { type: "hospital", label: "🏥 โรงพยาบาล" },
                      { type: "school", label: "🏫 โรงเรียน" },
                      { type: "complaint", label: "⚠️ จุดแจ้งปัญหา" }
                    ].map(f => (
                      <button
                        key={f.type}
                        onClick={() => setMapFilter(f.type)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                          mapFilter === f.type 
                            ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900" 
                            : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Map Display & marker coordinate selection panel split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
                  
                  {/* Left Column: Huge Vector Map Canvas */}
                  <div className="lg:col-span-8 bg-slate-900 text-white rounded-3xl relative overflow-hidden border border-slate-800 shadow-xl h-full flex flex-col items-center justify-center">
                    
                    {/* SVG map contours representation */}
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
                    
                    {/* Decorative River representation */}
                    <svg className="absolute inset-0 h-full w-full opacity-35" preserveAspectRatio="none">
                      <path 
                        d="M -10,300 C 200,280 400,450 850,320" 
                        fill="none" 
                        stroke="#1d4ed8" 
                        strokeWidth="35" 
                      />
                    </svg>

                    {/* Vector Map contour shapes representation */}
                    <div className="absolute border-4 border-slate-800 w-[550px] h-[550px] rounded-full opacity-20 pointer-events-none"></div>
                    <div className="absolute border border-slate-705 w-[420px] h-[420px] rounded-full opacity-25 pointer-events-none"></div>

                    {/* Live markers mapped accurately over pixels */}
                    {filteredMarkers.map((marker, idx) => {
                      // Map geographic lat-lng to roughly pixels (Lat: 6.53 to 6.55) -> (Lng: 101.26 to 101.29)
                      const pctX = ((marker.coordinates.lng - 101.26) / 0.04) * 100;
                      const pctY = (1 - (marker.coordinates.lat - 6.53) / 0.03) * 100;

                      return (
                        <div
                          key={marker.id}
                          className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                          style={{ left: `${pctX}%`, top: `${pctY}%` }}
                        >
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-125 border ${
                            marker.type === "office" ? "bg-blue-600 border-blue-400" 
                            : marker.type === "hospital" ? "bg-emerald-600 border-emerald-400"
                            : marker.type === "school" ? "bg-amber-600 border-amber-400"
                            : marker.type === "police" ? "bg-indigo-600 border-indigo-400"
                            : "bg-red-600 border-red-400"
                          }`}>
                            {marker.type === "office" ? <Building2 className="h-4 w-4 text-white" />
                              : marker.type === "hospital" ? <Users className="h-4 w-4 text-white" />
                              : marker.type === "school" ? <FileText className="h-4 w-4 text-white" />
                              : <AlertTriangle className="h-4 w-4 text-white" />
                            }
                          </div>

                          {/* Hover detail tooltip popup */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2.5 bg-slate-900 border border-slate-755 text-white rounded-xl shadow-2xl opacity-0 hover:opacity-100 group-hover:opacity-100 pointer-events-none transition-opacity w-48 z-40">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{marker.type}</p>
                            <h5 className="text-xs font-bold font-display leading-tight">{lang === "th" ? marker.title.th : marker.title.en}</h5>
                            <p className="text-[9px] text-slate-350 pr-1 mt-0.5 leading-normal truncate">{lang === "th" ? marker.address.th : marker.address.en}</p>
                            {marker.status && (
                              <span className="text-[8px] bg-blue-105 inline-block bg-blue-900/40 text-blue-300 px-1 py-0.5 rounded font-bold uppercase mt-1">
                                {marker.status}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Left overlay for coordinates description details */}
                    <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm p-4 rounded-2xl text-[10px] space-y-2 border border-slate-700 shadow-2xl">
                      <p className="font-extrabold uppercase tracking-widest text-[#22c55e]">GIS Legend (คำอธิบายสัญลักษณ์)</p>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-600"></span> <span>🏢 อาคารราชการเทศบาล</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span> <span>🏥 ศูนย์การแพทย์/โรงพยาบาล</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-600"></span> <span>🏫 สถาบันการศึกษารอบพิกัด</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-600"></span> <span>⚠️ เรื่องจากประชาชน (เรียลไทม์)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Active dynamic list panel info */}
                  <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-5 overflow-y-auto h-full space-y-4">
                    <div>
                      <h4 className="font-extrabold text-sm mb-1 uppercase tracking-tight">รายการดัชนีจุดสังเกต ({filteredMarkers.length})</h4>
                      <p className="text-[10px] text-slate-400">พารามิเตอร์ GPS อิงจากพิกัดเขตหนาแน่นเมืองยะลา</p>
                    </div>

                    <div className="space-y-3">
                      {filteredMarkers.map(marker => (
                        <div key={marker.id} className="p-3 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-50 dark:border-slate-850">
                          <div className="flex items-center gap-3">
                            <span className={`p-2 rounded-xl text-white ${
                              marker.type === "office" ? "bg-blue-600" 
                              : marker.type === "hospital" ? "bg-emerald-600"
                              : marker.type === "school" ? "bg-amber-600"
                              : "bg-red-500"
                            }`}>
                              {marker.type === "office" ? <Building2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                            </span>
                            <div className="text-xs">
                              <h5 className="font-black leading-tight">
                                {lang === "th" ? marker.title.th : lang === "en" ? marker.title.en : marker.title.ms}
                              </h5>
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                {lang === "th" ? marker.address.th : marker.address.en}
                              </p>
                              <p className="text-[10px] text-blue-500 dark:text-blue-400 font-mono mt-1 font-bold">
                                {marker.coordinates.lat}, {marker.coordinates.lng}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ================== TAB: TOURISM (ท่องเที่ยวยะลาอัจฉริยะ) ================== */}
            {activeTab === "tourism" && (
              <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
                
                {/* Title */}
                <div>
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-bold text-[9px] px-2.5 py-1.5 rounded-full uppercase tracking-widest inline-block">
                    PROMOTING CITIZEN CULTURE
                  </span>
                  <h2 className="text-3xl font-black font-display tracking-tight text-slate-800 dark:text-slate-100 uppercase">{translations[lang].tourismTitle}</h2>
                  <p className="text-xs text-slate-500">{translations[lang].tourismSub}</p>
                </div>

                {/* Tourism locations grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Cards list of destinations */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-display">
                      {tourism.map(spot => (
                        <div 
                          key={spot.id}
                          onClick={() => {
                            setSelectedSpot(spot);
                            // Highlight transition effect
                            triggerToast(`แสดงรายละเอียด: ${spot.name}`, "info");
                          }}
                          className={`rounded-2xl overflow-hidden border transition-all cursor-pointer bg-white dark:bg-slate-900 group ${
                            selectedSpot?.id === spot.id 
                              ? "border-blue-500 ring-2 ring-blue-500/20 scale-[1.02]" 
                              : "border-slate-100 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-700"
                          }`}
                        >
                          <div className="relative h-44 overflow-hidden">
                            <img 
                              src={spot.image} 
                              alt={spot.name} 
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-3 right-3 bg-slate-900/70 text-white font-black text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span>{spot.rating}</span>
                            </div>
                          </div>

                          <div className="p-4 space-y-2">
                            <h4 className="font-extrabold text-sm md:text-base text-slate-800 dark:text-white leading-tight">
                              {lang === "th" ? spot.name : lang === "en" ? spot.nameEn : spot.nameMs}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-3">
                              {lang === "th" ? spot.description : lang === "en" ? spot.descriptionEn : spot.descriptionMs}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Detailed review and persistent interactive comment box list */}
                  <div className="lg:col-span-5">
                    {selectedSpot && (
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 space-y-6 shadow-sm">
                        
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white leading-tight">
                            {lang === "th" ? selectedSpot.name : selectedSpot.nameEn}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                            {lang === "th" ? selectedSpot.description : selectedSpot.descriptionEn}
                          </p>
                        </div>

                        {/* Leave a review interactive form */}
                        <form onSubmit={(e) => handleSubmitReview(e, selectedSpot.id)} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 space-y-3 border">
                          <h4 className="font-extrabold text-xs text-slate-650 tracking-wider">แสดงความเห็นและให้คะแนน</h4>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">ชื่อคนริวิว</label>
                              <input 
                                type="text"
                                required
                                value={reviewForm.author}
                                onChange={(e) => setReviewForm(prev => ({ ...prev, author: e.target.value }))}
                                placeholder="เช่น มูฮัมหมัด ยะลา"
                                className="w-full text-xs font-semibold p-2 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">คะแนนพึงพอใจ</label>
                              <select
                                value={reviewForm.rating}
                                onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                                className="w-full text-xs font-semibold p-2 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none"
                              >
                                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ดาว (Stars)</option>)}
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">บทวิจารณ์คำพึงพอใจ</label>
                            <textarea 
                              required
                              rows={2}
                              value={reviewForm.text}
                              onChange={(e) => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                              placeholder="เมืองสวย อากาศตอนเช้าสดชื่นมากครับ..."
                              className="w-full text-xs font-semibold p-2 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none"
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs py-2 rounded-xl transition-all cursor-pointer"
                          >
                            {translations[lang].submitReview}
                          </button>
                        </form>

                        {/* Display list of reviews */}
                        <div className="space-y-4">
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">บทวิจารณ์จากชาวเน็ต ({selectedSpot.reviewsCount} reviews)</h4>
                          <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
                            {selectedSpot.reviews.map((rev, rIdx) => (
                              <div key={rIdx} className="p-3 bg-slate-50 dark:bg-slate-820 rounded-xl space-y-1 border">
                                <div className="flex items-center justify-between text-xs font-bold">
                                  <span>👤 {rev.author}</span>
                                  <span className="text-amber-500 font-mono">{"★".repeat(rev.rating)}</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-350 pr-1 leading-normal italic font-medium">"{rev.text}"</p>
                                <p className="text-[9px] text-slate-400 font-semibold">{rev.date}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* ================== TAB: ADMIN DEMO (สำหรับการทดสอบแก้ข่าวด่วนและสถานะ complaints) ================== */}
            {activeTab === "admin" && (
              <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
                
                {/* Title */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 font-bold text-[9px] px-2.5 py-1.5 rounded-full uppercase tracking-widest inline-block">
                      ADMIN CONTROL CENTER (MOCKUP)
                    </span>
                    <h2 className="text-3xl font-black font-display tracking-tight text-white leading-none bg-slate-900 border border-slate-755 p-3 rounded-2xl flex items-center gap-3">
                      <Settings className="h-5 w-5 text-amber-400 animate-spin-slow" />
                      Yala Dispatch Command Room
                    </h2>
                    <p className="text-xs text-slate-400 mt-2">ส่วนควบคุมจำลองการจัดการ ไม่เชื่อมล็อกด้วยรหัสผ่าน สะดวกแก่กรรมการตรวจประเมินผล Hackathon</p>
                  </div>
                </div>

                {/* Live Management complaints row list table */}
                <div className="space-y-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                  <div>
                    <h3 className="text-lg font-black font-display">จัดการสถานะเรื่องแจ้งเดือดร้อนของประชาชน</h3>
                    <p className="text-xs text-slate-450 text-slate-400 mb-4">จำลองการทำงานเป็นผู้อำนวยการเขต กดเปลี่ยนสถานะเคสเพื่อสะท้อนหน้า Citizen Timeline</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                          <th className="py-3 px-2">Tracking Num</th>
                          <th className="py-3 px-2">เรื่องเดือดร้อน</th>
                          <th className="py-3 px-2">ฝ่ายที่วิเคราะห์</th>
                          <th className="py-3 px-2">พิกัดและที่เกิด</th>
                          <th className="py-3 px-2">สถานะปัจจุบัน</th>
                          <th className="py-3 px-2 text-center">แก้ไขสถานะจัดหมวดหมู่</th>
                          <th className="py-3 px-2 text-right">ลบข้อมูล</th>
                        </tr>
                      </thead>
                      <tbody>
                        {complaints.map(caseNode => (
                          <tr key={caseNode.id} className="border-b border-slate-50 last:border-none dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                            <td className="py-3 px-2 font-mono font-bold text-blue-500">{caseNode.trackingNum}</td>
                            <td className="py-3 px-2 max-w-xs">
                              <p className="font-extrabold truncate">{caseNode.title}</p>
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">{caseNode.description}</p>
                            </td>
                            <td className="py-3 px-2">
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2 py-0.5 rounded font-black">
                                {caseNode.dept}
                              </span>
                            </td>
                            <td className="py-3 px-2 font-medium">
                              <p className="truncate">{caseNode.location}</p>
                              <p className="text-[9px] text-slate-400 mt-0.5">{caseNode.coordinates.lat}, {caseNode.coordinates.lng}</p>
                            </td>
                            <td className="py-3 px-2">
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                                caseNode.status === "completed" 
                                  ? "bg-emerald-100 text-emerald-800" 
                                  : caseNode.status === "progress" 
                                    ? "bg-amber-100 text-amber-800" 
                                    : "bg-blue-105 bg-blue-100 text-blue-800"
                              }`}>
                                {caseNode.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <div className="flex justify-center gap-1">
                                <button
                                  onClick={() => handleAdminStatusChange(caseNode.id, "received")}
                                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 border px-2 py-1 rounded text-[10px] font-bold"
                                >
                                  RECV
                                </button>
                                <button
                                  onClick={() => handleAdminStatusChange(caseNode.id, "progress")}
                                  className="bg-amber-50 hover:bg-amber-100 text-amber-600 border px-2 py-1 rounded text-[10px] font-bold"
                                >
                                  PROG
                                </button>
                                <button
                                  onClick={() => handleAdminStatusChange(caseNode.id, "completed")}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border px-2 py-1 rounded text-[10px] font-bold"
                                >
                                  COMP
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <button 
                                onClick={() => handleAdminDelete(caseNode.id)}
                                className="p-1.5 hover:bg-red-50 hover:text-red-650 text-red-500 rounded transition-all shrink-0 cursor-pointer"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ================== TAB: PASSWORDLESS MAGIC LINK AUTHENTICATION ================== */}
            {activeTab === "login" && (
              <div className="max-w-md mx-auto my-8 md:my-16 space-y-6">
                <div className="text-center space-y-3">
                  <div className="inline-flex p-3.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-500">
                    <LogIn className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    เข้าสู่ระบบด้วยอีเมล
                  </h2>
                  <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">
                    กรอกอีเมลของคุณเพื่อรับลิงก์ยืนยันตัวตนระดับล็อกอินผ่าน Magic Link ด่วน ไม่ต้องจำรหัสผ่าน ปลอดภัยสูงสไตล์ Smart City
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-xl space-y-6">
                  {authError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold leading-relaxed flex items-start gap-2">
                      <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {linkSent ? (
                    <div className="space-y-4 text-center py-4">
                      <div className="inline-flex p-3 bg-emerald-500/10 rounded-full text-emerald-500">
                        <Check className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        เราส่งลิงก์ถอดรหัสล็อกอินไปยัง <span className="text-blue-500">{emailInput}</span> แล้ว!
                      </p>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        โปรดเข้ากล่องข้อความจดหมายเพื่อคลิกดำเนินการ หรือคุณสามารถทดสอบเข้าสู่ระบบผ่านปุ่มจำลองอย่างรวดเร็วได้ทันทีด้านล่าง
                      </p>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <button
                          onClick={async () => {
                            try {
                              setLoadingAuth(true);
                              const user = await signInWithMockBypass(emailInput);
                              setCurrentUser(user);
                              triggerToast(`ยินดีต้อนรับ! คุณเข้าสู่ระบบจำลองสำเร็จด้วยอีเมล ${emailInput}`, "success");
                              
                              // Redirect to stored tab
                              const target = localStorage.getItem("authRedirectTarget") || "dashboard";
                              setActiveTab(target);
                            } catch (e: any) {
                              console.error(e);
                              setAuthError(e.message || "การจำลองลิงก์เข้าสู่ระบบล้มเหลว");
                            } finally {
                              setLoadingAuth(false);
                            }
                          }}
                          className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/10 cursor-pointer animate-pulse"
                        >
                          📬 คลิกลิงก์ยืนยันในอีเมลจำลอง (Simulate Magic Link Click)
                        </button>
                        <button
                          onClick={() => setLinkSent(false)}
                          className="text-xs text-slate-405 hover:text-slate-600 dark:hover:text-slate-300 underline font-semibold cursor-pointer"
                        >
                          ป้อนอีเมลใหม่อีกครั้ง
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Google Sign-In Button */}
                      <button
                        type="button"
                        onClick={async () => {
                          setLoadingAuth(true);
                          setAuthError(null);
                          try {
                            const user = await signInWithGoogle();
                            setCurrentUser(user);
                            setActiveTab("home");
                            triggerToast("เข้าสู่ระบบด้วย Google สำเร็จเรียบร้อยแล้ว!", "success");
                          } catch (err: any) {
                            console.error(err);
                            setAuthError(err.message || "การเข้าสู่ระบบผ่าน Google ล้มเหลว");
                          } finally {
                            setLoadingAuth(false);
                          }
                        }}
                        disabled={loadingAuth}
                        className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 font-extrabold text-xs transition-all flex items-center justify-center gap-2.5 border border-slate-200 dark:border-slate-850 cursor-pointer shadow-sm"
                      >
                        <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.755 1.054 15.01 0 12 0c-4.872 0-9.018 2.71-11.132 6.673l4.398 3.092z"
                          />
                          <path
                            fill="#4285F4"
                            d="M23.49 12.275c0-.825-.075-1.62-.21-2.385H12v4.56h6.435a5.535 5.535 0 0 1-2.4 3.63l3.72 2.88c2.175-2 3.435-4.95 3.435-8.4l-.265-.285z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.266 14.235L.868 17.327A11.94 11.94 0 0 1 0 12c0-1.895.44-3.69 1.256-5.327l4.398 3.092a7.086 7.086 0 0 0-.388 2.235c0 .324.032.64.088.948v1.287z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.955-1.08 7.935-2.91l-3.72-2.88c-1.035.7-2.355 1.11-4.215 1.11-3.24 0-5.985-2.19-6.965-5.13L.632 17.28A11.957 11.957 0 0 0 12 24z"
                          />
                        </svg>
                        <span>เข้าสู่ระบบความปลอดภัยสูงด้วย Google (Instant Login)</span>
                      </button>

                      <div className="flex items-center py-2">
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800/80"></div>
                        <span className="px-3.5 text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">หรือใช้บริการลิงก์วิเศษ</span>
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800/80"></div>
                      </div>

                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!emailInput.trim()) {
                          triggerToast("กรุณากรอกอีเมลที่ถูกต้อง", "info");
                          return;
                        }
                        setIsSendingLink(true);
                        setAuthError(null);
                        try {
                          await sendSignInLinkToEmail(emailInput);
                          setLinkSent(true);
                          triggerToast("ส่งจดหมายตรวจสอบล็อกอินสำเร็จ! กรุณาเช็กอีเมล", "success");
                        } catch (err: any) {
                          console.error(err);
                          const msg = err.message || "";
                          if (msg.includes("auth/operation-not-allowed")) {
                            setAuthError(
                              "ฟังก์ชันล็อกอินด้วยระบบ Magic Link ล่วงหน้าเข้าสู่ระบบยังไม่ได้ถูกเปิดใช้งานใน Console ของ Firebase ของคุณตามมาตรฐานสิทธิ์ผู้ดูแลระบบ เพื่อแก้ปัญหานี้คุณมีทางเลือกสกัดชั่วคราวง่ายๆ:\n\n1. เข้าสู่ระบบด้วยปุ่ม 'Google (Instant Login)' ทันทีด้านบนเนื่องจากคลาวด์เปิดทำงานให้ปลอดภัยและทันที\n2. หรือเปิดการตั้งค่าของท่านทางคอนโซลหลักที่ Authentication -> Sign-in Method แล้วตั้งค่าเปิดสิทธิ์ใช้งานระบบ 'Email/Password' และตั้งค่าหัวข้อสยบข้อ 'Email Link' เพื่อใช้งานเต็มรูปแบบ\n3. หรือเลือกใช้ทางลัดบัญชีประเมินฉุกเฉิน (Evaluator Bypass) ด้านล่างสุดได้เช่นกันครับ"
                            );
                          } else {
                            setAuthError(msg || "การส่งลิงก์ขัดข้อง โปรดตรวจสอบอินเทอร์เน็ต");
                          }
                        } finally {
                          setIsSendingLink(false);
                        }
                      }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider mb-2">อีเมลผู้ใช้งาน (Use Active Email)</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450">
                              <Mail className="h-4.5 w-4.5" />
                            </span>
                            <input
                              type="email"
                              required
                              placeholder="name@example.com"
                              value={emailInput}
                              onChange={(e) => setEmailInput(e.target.value)}
                              className="w-full rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSendingLink}
                          className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all tracking-wide disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isSendingLink && (
                            <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          )}
                          <span>{isSendingLink ? "กำลังส่งลิงก์..." : "ส่งลิงก์เข้าสู่ระบบ (Magic Link)"}</span>
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">🛠️ ผู้ประเมิน & กรรมการแข่งขันเข้าระบบทางลัด</p>
                    <button
                      onClick={async () => {
                        setLoadingAuth(true);
                        setAuthError(null);
                        try {
                          const user = await signInWithMockBypass("evaluator.yala@hackathon.org");
                          setCurrentUser(user);
                          triggerToast("เข้าสู่ระบบสิทธิ์แอดมินจำลอง (Evaluator Bypass) สำเร็จ!", "success");
                          
                          // Redirect to stored tab
                          const target = localStorage.getItem("authRedirectTarget") || "dashboard";
                          setActiveTab(target);
                        } catch (err: any) {
                          console.error(err);
                          setAuthError(err.message || "การเข้าระบบจำลองล้มเหลว");
                        } finally {
                          setLoadingAuth(false);
                        }
                      }}
                      className="w-full py-2.5 px-4 outline-dashed outline-1 outline-blue-500/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-500 dark:text-blue-400 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                    >
                      🚀 ล็อกอินสิทธิ์ผู้ประเมินแฮกกาธอนอย่างรวดเร็ว (Evaluator Bypass)
                    </button>
                  </div>
                </div>

                <div className="text-center text-[11px] text-slate-400 font-medium leading-relaxed">
                  ระบบจัดทำสอดคล้องตามกรอบความปลอดภัยข้อมูลส่วนบุคคลภาครัฐ (PDPA/GDPR Compliant)
                </div>
              </div>
            )}

            {/* ================== TAB: VERIFIED CITIZEN PROFILE & COMPLAINTS TRACKER ================== */}
            {activeTab === "profile" && currentUser && (
              <div className="space-y-8 max-w-7xl mx-auto font-display">
                
                {/* Profile Header Block */}
                <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800/80 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px]"></div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-2xl md:text-3xl font-black shadow-lg shadow-blue-500/10">
                      ID
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-lg md:text-xl font-black">{currentUser.email}</p>
                        <span className="bg-emerald-500 text-slate-905 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest">VERIFIED CITIZEN</span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-1">UID: {currentUser.uid}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Metadata Client: {navigator.userAgent.slice(0, 50)}...</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full md:w-auto self-stretch md:self-auto items-center">
                    <div className="flex items-center gap-2 border border-slate-800 bg-slate-950/60 p-3 rounded-2xl shrink-0 text-left w-full sm:w-auto">
                      <Clock className="h-4.5 w-4.5 text-blue-400" />
                      <div>
                        <p className="text-[9px] font-bold text-slate-405 uppercase tracking-widest leading-none">ล็อกอินเมื่อ</p>
                        <p className="text-xs font-black text-white mt-1">
                          {currentUser.metadata?.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleString("th-TH") : new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={async () => {
                        setLoadingAuth(true);
                        await signOut();
                        setCurrentUser(null);
                        setActiveTab("home");
                        triggerToast("ออกจากระบบเพื่อความปลอดภัยของคุณเรียบร้อย", "info");
                      }}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-red-600/10 text-red-500 hover:bg-red-650 hover:text-white border border-red-500/20 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>ออกจากระบบ (Logout)</span>
                    </button>
                  </div>
                </div>

                {/* Submissions Section */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 gap-2">
                    <div>
                      <h3 className="text-xl font-extrabold flex items-center gap-2 text-slate-800 dark:text-white">
                        <FileText className="h-5 w-5 text-blue-500" />
                        ประวัติและติดตามเรื่องร้องเรียนของคุณ ({complaints.filter(c => c.userId === currentUser.uid).length} เรื่อง)
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">เฉพาะปัญหาที่คุณแจ้งเรื่องจากอุปกรณ์นี้หรือผ่านบัญชีของคุณในระบบคลาวด์มูนิซิพ้าลิตี้</p>
                    </div>
                    
                    <button
                      onClick={() => handleTabChange("service")}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span>แจ้งเรื่องร้องเรียนเพิ่ม</span>
                    </button>
                  </div>

                  {complaints.filter(c => c.userId === currentUser.uid).length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-805 rounded-3xl space-y-3 bg-white dark:bg-slate-900/40">
                      <div className="inline-flex p-3 bg-slate-105 dark:bg-slate-800 text-slate-400 rounded-full">
                        <FileText className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-705 dark:text-slate-350">ยังไม่มีประวัติการแจ้งข่าวสารหรือความชำรุดของคุณ</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">ปัญหาสุดอุ่นใจสามารถส่งได้ 24 ชั่วโมง โดยจะมี AI คัดกรองกองทำงานทันใจเพื่อนำส่งส่วนบริหารเทศบาลยะลาโดยเสร็จพริบตาเดียว</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {complaints.filter(c => c.userId === currentUser.uid).map(caseNode => (
                        <div 
                          key={caseNode.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            selectedComplaint?.id === caseNode.id
                              ? "bg-slate-100/10 border-blue-500/30"
                              : "bg-white dark:bg-slate-900/60 border-slate-100 dark:border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className={`p-2.5 rounded-xl ${
                                caseNode.status === "completed" 
                                  ? "bg-emerald-500/10 text-emerald-500" 
                                  : caseNode.status === "progress" 
                                    ? "bg-amber-500/10 text-amber-500" 
                                    : "bg-slate-500/10 text-slate-400"
                              } shrink-0`}>
                                <AlertTriangle className="h-5 w-5" />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 font-extrabold px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 font-mono tracking-wider">{caseNode.trackingNum}</span>
                                <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 leading-snug">{caseNode.title}</h4>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400">
                                  <span className="font-bold text-blue-500">{caseNode.dept}</span>
                                  <span>•</span>
                                  <span>รายงานเมื่อ: {caseNode.date}</span>
                                  <span>•</span>
                                  <span>{caseNode.location}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                                caseNode.status === "completed"
                                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                  : caseNode.status === "progress"
                                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/10"
                                    : "bg-slate-500/10 text-slate-505 border border-slate-500/10"
                              }`}>{caseNode.status}</span>
                              
                              <button
                                onClick={() => setSelectedComplaint(selectedComplaint?.id === caseNode.id ? null : caseNode)}
                                className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 cursor-pointer"
                              >
                                {selectedComplaint?.id === caseNode.id ? "ซ่อนขั้นตอน" : "ติดตามตัวเคส"}
                              </button>
                            </div>
                          </div>

                          {/* Tracking Details Accordion */}
                          {selectedComplaint?.id === caseNode.id && (
                            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
                              <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-400 bg-slate-950/20 p-3.5 rounded-xl">
                                <span className="font-bold text-blue-500 block mb-1">📝 สรุปรายละเอียด:</span>
                                {caseNode.description}
                              </p>

                              {caseNode.imageUrl && (
                                <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950 max-w-md">
                                  <img 
                                    src={caseNode.imageUrl} 
                                    alt="complaint photo" 
                                    className="h-full w-full object-cover opacity-80"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              )}

                              {/* Complaint Steps Tracker Timeline */}
                              <div className="space-y-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">สถานะกระบวนการบูรณาการแก้ปัญหา (Process Timeline)</p>
                                <div className="space-y-4 pl-3.5 border-l-2 border-slate-200 dark:border-slate-850">
                                  {caseNode.progressLog.map((log, lIdx) => (
                                    <div key={lIdx} className="relative">
                                      {/* Indicator bullet */}
                                      <span className={`absolute -left-[19.5px] top-1 h-3.5 w-3.5 rounded-full border-2 bg-slate-950 ${
                                        log.status === "completed" 
                                          ? "border-emerald-500" 
                                          : log.status === "progress" 
                                            ? "border-amber-500" 
                                            : "border-slate-400"
                                      }`}></span>
                                      
                                      <div className="-mt-1 space-y-0.5">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-black uppercase text-slate-850 dark:text-slate-200 tracking-wide">{log.status}</span>
                                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold">{log.date}</span>
                                        </div>
                                        <p className="text-xs text-slate-450 font-medium leading-relaxed">{log.note}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* ================== CHAT DIALOG OVERLAY CONTROL RAILS ================== */}
          {/* Municipal Bot floating popover trigger strictly matching government smart assistants demands */}
          <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 font-display">
            
            {/* Show Chatbot window block conditionally */}
            <div className={`w-80 md:w-[350px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
              activeTab === "chat" ? "scale-100 opacity-100 h-[500px]" : "scale-0 opacity-0 h-0 pointer-events-none"
            }`}>
              
              {/* Header */}
              <div className="bg-slate-900 border-b border-indigo-950 p-4 shrink-0 flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></div>
                  <div>
                    <h4 className="font-extrabold text-xs tracking-wider uppercase text-emerald-400">YALA AI SERVICES</h4>
                    <p className="text-xs font-bold">{translations[lang].assistantTitle}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab("home")} 
                  className="font-bold text-[10px] bg-white/10 px-2 py-1 rounded text-slate-300 border border-white/10"
                >
                  ย่อระบบ
                </button>
              </div>

              {/* Message scroll log area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950">
                {chatMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[85%] text-xs leading-relaxed p-3.5 rounded-2xl ${
                      msg.sender === "user" 
                        ? "self-end ml-auto bg-blue-600 text-white rounded-br-none shadow-md" 
                        : "bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    <p className="font-semibold">{msg.text}</p>
                    <span className="text-[8px] text-slate-400 mt-1 uppercase self-end font-mono tracking-widest">{msg.timestamp}</span>
                  </div>
                ))}
                {isChatTyping && (
                  <div className="self-start bg-white dark:bg-slate-905 p-3 rounded-2xl text-xs text-slate-500 font-semibold italic border max-w-[80%] inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-pulse"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-pulse delay-75"></span>
                    <span>AI กำลังประมวลผลข้อมูลเมือง...</span>
                  </div>
                )}
              </div>

              {/* Recommended interactive items */}
              <div className="p-2 border-t shrink-0 flex gap-1.5 overflow-x-auto bg-slate-100 dark:bg-slate-900 pr-1 select-none">
                <button 
                  onClick={() => handleRecommendationClick(translations[lang].rec1)}
                  className="bg-white dark:bg-slate-800 px-2 py-1.5 rounded text-[10px] shrink-0 font-bold hover:bg-slate-50"
                >
                  🕒 เวลาทำทะเบียน?
                </button>
                <button 
                  onClick={() => handleRecommendationClick(translations[lang].rec2)}
                  className="bg-white dark:bg-slate-800 px-2 py-1.5 rounded text-[10px] shrink-0 font-bold hover:bg-slate-50"
                >
                  💰 การชำระภาษีป้าย?
                </button>
                <button 
                  onClick={() => handleRecommendationClick(translations[lang].rec3)}
                  className="bg-white dark:bg-slate-800 px-2 py-1.5 rounded text-[10px] shrink-0 font-bold hover:bg-slate-50"
                >
                  🌳 สวนขวัญเมืองเปิด?
                </button>
              </div>

              {/* Input console */}
              <form onSubmit={handleChatSendMessage} className="p-3 border-t shrink-0 flex gap-2 bg-white dark:bg-slate-900 bg-slate-100">
                <input 
                  type="text"
                  placeholder={translations[lang].placeholderInput}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 p-2.5 rounded-xl text-white hover:bg-blue-500 cursor-pointer transition-colors"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </form>

            </div>

            {/* Main triggers button widget display */}
            <button
              onClick={() => {
                if (activeTab === "chat") {
                  setActiveTab("home");
                } else {
                  setActiveTab("chat");
                }
              }}
              className="bg-gradient-to-tr from-blue-600 to-indigo-750 hover:from-blue-500 hover:to-indigo-650 text-white p-4.5 rounded-full shadow-2xl transition-all cursor-pointer relative group flex items-center gap-2 "
            >
              <MessageSquare className="h-6 w-6 shrink-0 group-hover:rotate-12 transition-transform" />
              <span className="font-extrabold text-xs hidden sm:inline-block pr-1">สอบถามศูนย์บริการ AI บอท</span>
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">AI</span>
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}
