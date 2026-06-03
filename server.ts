import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parsing
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Initialize Gemini SDK with telemetry User-Agent as instructed
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey && geminiApiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API client initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Gemini API client:", error);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined or is placeholder. AI queries will fallback to robust heuristics.");
}

// ========== IN-MEMORY PROTOTYPE DATABASE ==========
let complaints: any[] = [
  {
    id: "comp-1",
    title: "พบฝาท่อระบายน้ำชำรุดบริเวณถนนพิพิธภักดี",
    description: "ฝาท่อเหล็กชำรุดทรุดตัวลงไปเกือบครึ่งหนึ่ง เกรงว่าจะเกิดอันตรายกับมอเตอร์ไซค์และรถยนต์ที่สัญจรผ่านในช่วงค่ำ",
    category: "ความชำรุดถนนและผิวจราจร",
    dept: "กองช่าง",
    location: "ถนนพิพิธภักดี ใกล้ศาลหลักเมืองยะลา",
    coordinates: { lat: 6.5412, lng: 101.2825 },
    status: "progress" as const,
    date: "2026-06-01",
    trackingNum: "YLA-2026-8801",
    priority: "high" as const,
    progressLog: [
      { status: "received" as const, date: "2026-06-01 09:15", note: "ระบบได้รับเรื่องแจ้งปัญหาเรียบร้อยแล้ว" },
      { status: "progress" as const, date: "2026-06-01 14:30", note: "ส่งข้อมูลให้ กองช่าง เทศบาลนครยะลา ลงพื้นที่วิเคราะห์และกั้นกรวยนิรภัย" }
    ]
  },
  {
    id: "comp-2",
    title: "ขยะมูลฝอยตกค้างบริเวณจุดทิ้งขยะซอยสิโรรส 8",
    description: "มีถังขยะชำรุดและขยะล้นออกมานอกถัง ส่งกลิ่นเหม็นรบกวนบ้านเรือนข้างเคียง และมีแมลงวันตอมเป็นจำนวนมาก",
    category: "ขยะมูลฝอยและสิ่งแวดล้อม",
    dept: "กองสาธารณสุขและสิ่งแวดล้อม",
    location: "ซอยสิโรรส 8 อำเภอเมืองยะลา",
    coordinates: { lat: 6.5458, lng: 101.2882 },
    status: "completed" as const,
    date: "2026-05-30",
    trackingNum: "YLA-2026-7244",
    priority: "medium" as const,
    progressLog: [
      { status: "received" as const, date: "2026-05-30 08:00", note: "ระบบได้รับเรื่องแจ้งปัญหาและตรวจสอบพิกัด" },
      { status: "progress" as const, date: "2026-05-30 11:00", note: "กวาดเก็บขยะและฉีดล้างฆ่าเชื้อบริเวณดังกล่าว" },
      { status: "completed" as const, date: "2026-05-30 15:30", note: "ทำความสะอาดเรียบร้อย เปลี่ยนถังขยะใบใหม่เสร็จสิ้น" }
    ]
  },
  {
    id: "comp-3",
    title: "จุดทางข้ามสวนขวัญเมืองไฟส่องสว่างดับชำรุด",
    description: "โคมไฟถนนดับสลับกัน 3 ดวง ทำให้ทางเดินเท้าเลียบสวนขวัญเมืองมืดมาก ประชาชนที่วิ่งออกกำลังกายตอนค่ำแจ้งว่ารู้สึกไม่ปลอดภัย",
    category: "ระบบไฟฟ้าและแสงสว่าง",
    dept: "งานไฟฟ้าและแสงสว่าง",
    location: "ถนนเลียบสวนขวัญเมือง (ฝั่งทิศตะวันตก)",
    coordinates: { lat: 6.5495, lng: 101.2720 },
    status: "received" as const,
    date: "2026-06-02",
    trackingNum: "YLA-2026-9502",
    priority: "high" as const,
    progressLog: [
      { status: "received" as const, date: "2026-06-02 10:20", note: "ระบบ AI คัดกรองและส่งต่อไปยัง งานไฟฟ้าและแสงสว่าง สำนักการช่าง" }
    ]
  }
];

// Open Datasets
const openDatasets = [
  {
    id: "data-1",
    title: {
      th: "สถิติจำนวนประชากรและครัวเรือนในเขตเทศบาลนครยะลา ปี 2568-2569",
      en: "Demographics and Households Statistics of Yala Municipality (2025-2026)",
      ms: "Statistik Penduduk & Isi Rumah Majlis Perbandaran Yala (2025-2026)"
    },
    description: {
      th: "ข้อมูลสรุปจำแนกประชากรชาย-หญิง รายชุมชน และจำนวนครัวเรือนอย่างเป็นทางการ",
      en: "Official demographic breakdown by gender, community and total housing units.",
      ms: "Pecahan demografi rasmi mengikut jantina, komuniti dan unit perumahan."
    },
    category: "ประชากร & สังคม",
    fileSize: "142 KB",
    downloads: 385,
    lastUpdated: "2026-04-15",
    format: "CSV" as const
  },
  {
    id: "data-2",
    title: {
      th: "สถิติปริมาณขยะมูลฝอยและอัตราการรีไซเคิลรายเดือน ยะลาอัจฉริยะ",
      en: "Monthly Waste Volume and Recycling Rates - Yala Smart City",
      ms: "Statistik Sisa Bulanan & Kadar Kitar Semula - Bandaray Smart Yala"
    },
    description: {
      th: "ปริมาณขยะรายวันเฉลี่ย อัตราการแยกขยะ และปริมาณขยะที่ส่งกำจัดปลูกฝังสิ่งแวดล้อม",
      en: "Daily waste data, separation efficiency, and total landfill mass.",
      ms: "Data sisa harian, kecekapan pengasingan, dan jumlah jisim tapak pelupusan sisa."
    },
    category: "สิ่งแวดล้อม",
    fileSize: "89 KB",
    downloads: 241,
    lastUpdated: "2026-05-18",
    format: "CSV" as const
  },
  {
    id: "data-3",
    title: {
      th: "งบประมาณรายจ่ายประจำปีและสรุปแผนพัฒนาท้องถิ่น เทศบาลนครยะลา",
      en: "Local Development Budget and Strategic Investment Allocations",
      ms: "Belanjawan Pembangunan Tempatan & Pelaburan Strategik Majlis Yala"
    },
    description: {
      th: "ข้อมูลแจกแจงงบประมาณสาธารณะ โครงการลงทุนโครงสร้างพื้นฐาน และงบพัฒนาสิ่งแวดล้อม",
      en: "Detailed distribution of public funds, structure projects, and municipal upgrade plans.",
      ms: "Pengagihan terperinci dana awam, projek infrastruktur, dan pelan naik taraf bandar."
    },
    category: "งบประมาณ & แผนงาน",
    fileSize: "2.4 MB",
    downloads: 512,
    lastUpdated: "2026-01-10",
    format: "PDF" as const
  },
  {
    id: "data-4",
    title: {
      th: "แผนผังพื้นที่สีเขียวสวนสาธารณะและจุดผ่อนปรนเชิงนิเวศนครยะลา",
      en: "Green Spaces, Eco Zones, and Public Parks GIS Survey",
      ms: "Kawasan Hijau, Zon Eko, dan Tinjauan GIS Taman Awam Yala"
    },
    description: {
      th: "สรุปตารางเมตรพื้นที่สีเขียวต่อประชากรในเขตเทศบาลนครยะลา พร้อมพิกัด GPS",
      en: "Green area square meters per citizen index with coordinates.",
      ms: "Indeks meter persegi kawasan hijau bagi setiap warganegara berserta koordinat."
    },
    category: "ภูมิสารสนเทศ & GIS",
    fileSize: "910 KB",
    downloads: 178,
    lastUpdated: "2026-05-22",
    format: "CSV" as const
  }
];

// Map GIS Markers
const mapMarkers = [
  { id: "m-1", title: { th: "สำนักงานเทศบาลนครยะลา", en: "Yala City Municipality Office", ms: "Pejabat Majlis Perbandaran Yala" }, type: "office", coordinates: { lat: 6.5401, lng: 101.2818 }, address: { th: "ถนนสุขยางค์ ต.สะเตง อ.เมืองยะลา", en: "Sukyang Rd, Sateng, Mueang Yala", ms: "Sukyang Rd, Sateng, Mueang Yala" } },
  { id: "m-2", title: { th: "โรงพยาบาลยะลา", en: "Yala Regional Hospital", ms: "Hospital Wilayah Yala" }, type: "hospital", coordinates: { lat: 6.5369, lng: 101.2755 }, address: { th: "ถนนเทศบาล 1 ต.สะเตง อ.เมืองยะลา", en: "Thetsaban 1 Rd, Sateng, Mueang Yala", ms: "Thetsaban 1 Rd, Sateng, Mueang Yala" } },
  { id: "m-3", title: { th: "สถานีตำรวจภูธรเมืองยะลา", en: "Mueang Yala Police Station", ms: "Balai Polis Mueang Yala" }, type: "police", coordinates: { lat: 6.5414, lng: 101.2858 }, address: { th: "ถนนพิพิธภักดี ต.สะเตง อ.เมืองยะลา", en: "Pipitpakdi Rd, Sateng, Mueang Yala", ms: "Pipitpakdi Rd, Sateng, Mueang Yala" } },
  { id: "m-4", title: { th: "โรงเรียนเทศบาล 1 (บ้านสะเตง)", en: "Municipal School 1 (Ban Sateng)", ms: "Sekolah Perbandaran 1 (Ban Sateng)" }, type: "school", coordinates: { lat: 6.5452, lng: 101.2721 }, address: { th: "ถนนเวฬุวัน ต.สะเตง อ.เมืองยะลา", en: "Weluwan Rd, Sateng, Mueang Yala", ms: "Weluwan Rd, Sateng, Mueang Yala" } },
  { id: "m-5", title: { th: "วิทยาลัยเทคนิคยะลา", en: "Yala Technical College", ms: "Kolej Teknikal Yala" }, type: "school", coordinates: { lat: 6.5332, lng: 101.2872 }, address: { th: "ถนนเทศบาล 3 ต.สะเตง อ.เมืองยะลา", en: "Thetsaban 3 Rd, Sateng, Mueang Yala", ms: "Thetsaban 3 Rd, Sateng, Mueang Yala" } },
  { id: "m-6", title: { th: "จุดชำรุดฝาท่อระบายน้ำ (เคสกำลังซ่อม)", en: "Damaged Manhole Cover (In Progress Case)", ms: "Penutup Lubang Rosak (Kes Sedang Dibaiki)" }, type: "complaint", coordinates: { lat: 6.5412, lng: 101.2825 }, status: "progress", address: { th: "ถนนพิพิธภักดี ตรงข้ามศาลหลักเมือง", en: "Pipitpakdi Rd, Opposite City Pillar Shrine", ms: "Pipitpakdi Rd, Setentang Kuil Bandar" } },
  { id: "m-7", title: { th: "จุดแจ้งไฟกิ่งส่องสว่างชำรุด (เคสได้รับเรื่อง)", en: "Broken Park Streetlamp (Case Received)", ms: "Lampu Taman Rosak (Kes Diterima)" }, type: "complaint", coordinates: { lat: 6.5495, lng: 101.2720 }, status: "received", address: { th: "รอบๆ เลียบสวนขวัญเมือง ฝั่งทิศตะวันตก", en: "West Suan Khwan Mueang Loop", ms: "Sisi Barat Suan Khwan Mueang" } }
];

// Projects Database
const projects = [
  {
    id: "proj-1",
    name: "ระบบศูนย์บัญชาการกล้องวงจรปิดอัจฉริยะ (Smart CCTV Integration)",
    nameEn: "Yala Smart Commmand Center & Intelligent CCTV Deployment",
    nameMs: "Pusat Perintah Bestari & CCTV Pintar Majlis Yala",
    description: "ติดตั้งกล้อง AI บันทึกตรวจจับทะเบียนรถ ตรวจสอบความหนาแน่นจราจรและวัตถุต้องสงสัย เพิ่มการป้องกันภัยและรักษาเสถียรภาพความปลอดภัยระดับสูง",
    descriptionEn: "Deploy AI cameras with license plate recognition and traffic density flow analytics to ensure high municipal safety, security and peace.",
    descriptionMs: "Memasang kamera AI bersepadu dengan pengecaman papan nombor dan aliran trafik untuk keselamatan perbandaran.",
    budget: "18,400,000 บาท",
    progress: 85,
    startDate: "2025-08-10",
    endDate: "2026-08-30",
    location: "รอบเขตเทศบาลนครยะลา",
    coordinates: { lat: 6.5401, lng: 101.2818 },
    timeline: [
      { title: "จัดสรรงบประมาณและเซ็นสัญญา", titleEn: "Budget allocation & contract signing", titleMs: "Kelulusan Belanjawan & Kontrak", date: "2025-08", completed: true },
      { title: "ติดตั้งเสาเหล็กและระบบโครงข่ายไฟเบอร์ออพติก", titleEn: "Tower & Fiber Optic Backhaul deployment", titleMs: "Pemasangan Gentian Optik", date: "2025-12", completed: true },
      { title: "ติดตั้งชุดกล้อง AI IoT 254 จุดครอบคลุมรอบเมือง", titleEn: "AI IoT cameras mounting at 254 nodes", titleMs: "Pemasangan 254 Kamera AI", date: "2026-03", completed: true },
      { title: "เชื่อมต่อประมวลผลเซิร์ฟเวอร์นวัตกรรม", titleEn: "Integration to municipal GPU datashield", titleMs: "Integrasi Pusat Data GPU", date: "2026-05", completed: true },
      { title: "เปิดทดสอบระบบเต็มรูปแบบและฝึกอบรมเจ้าหน้าที่", titleEn: "Full operations beta release & staff drill", titleMs: "Pelancaran Beta & Latihan Teknikal", date: "2026-08", completed: false }
    ]
  },
  {
    id: "proj-2",
    name: "โครงการปรับปรุงภูมิทัศน์และเพิ่มพื้นที่สีเขียวสวนขวัญเมือง (Green Spaces & Eco Park)",
    nameEn: "Suan Khwan Mueang Eco-Park Renewal & Reforestation",
    nameMs: "Projek Pembaharuan & Penghijauan Taman Awam Suan Khwan Mueang",
    description: "ขุดลอกแอ่งน้ำธรรมชาติ จัดระเบียบทางสัญจรวิ่งจักรยาน และติดตั้งระบบชลประทานอัจฉริยะประหยัดพลังงานเพื่อส่งเสริมการพักผ่อนของเยาวชนและผู้สูงอายุ",
    descriptionEn: "Dredging natural waterways, rebuilding walking/biking tracks and embedding automated smart solar watering systems to support wellness.",
    descriptionMs: "Pembersihan tasik, pembinaan trek joging/basikal baru, dan penyepaduan penyiraman pintar solar untuk mesra warga emas.",
    budget: "12,500,000 บาท",
    progress: 40,
    startDate: "2026-01-15",
    endDate: "2026-11-20",
    location: "สวนขวัญเมือง อำเภอเมืองยะลา",
    coordinates: { lat: 6.5480, lng: 101.2725 },
    timeline: [
      { title: "วิจัยวิเคราะห์เชิงนิเวศสิ่งแวดล้อม", titleEn: "Environmental ecology impact study", titleMs: "Kajian Impak Ekologi", date: "2026-01", completed: true },
      { title: "ขุดลอกและสร้างแนวอ่างกักเก็บตะกอน", titleEn: "Waterway cleanup & retaining wall setup", titleMs: "Pembersihan Tasik & Tebat Banjir", date: "2026-04", completed: true },
      { title: "จัดตั้งแนวต้นไม้พื้นถิ่นและปูพื้นสนามมัลติสปอร์ต", titleEn: "Planting regional tree species & multisport turf", titleMs: "Penanaman Pokok Tempatan & Padang Sukan", date: "2026-07", completed: false },
      { title: "ติดตั้งระบบประปารีดักชันอัจฉริยะอัตโนมัติ", titleEn: "Smart solar irrigation framework setup", titleMs: "Peralatan Penyiraman Pintar Solar", date: "2026-09", completed: false },
      { title: "ทำพิธีรับมอบจัดกิจกรรมสันทนาการชุมชน", titleEn: "Official grand opening and public fair", titleMs: "Peresmian Pembukaan & Karnival Rakyat", date: "2026-11", completed: false }
    ]
  },
  {
    id: "proj-3",
    name: "ระบบโครงข่ายไฟส่องสว่างอัจฉริยะ Smart Street Light (IoT-LED)",
    nameEn: "Autonomous Smart Street Lighting Network Restoration",
    nameMs: "Sistem Lampu Jalan Pintar IoT Melalui Lampu LED",
    description: "เปลี่ยนโคมท่อสังกะสีเป็นหลอด LED ประหยัดพลังงานที่ควบคุมระดับความสว่างผ่านแพลตฟอร์มคลาวด์ พร้อมแจ้งเตือนเจ้าหน้าที่อัตโนมัติทันทีเมื่อหลอดดับชำรุด",
    descriptionEn: "Replacing legacy lamps with smart energy-efficient IoT LED nodes, self-throttling by motion queues with auto-alert when broken.",
    descriptionMs: "Menukar lampu lama kepada nod LED IoT yang cekap tenaga, mengurangkan kecerahan automatik, dan isyarat kerosakan automatik.",
    budget: "8,900,000 บาท",
    progress: 100,
    startDate: "2025-03-01",
    endDate: "2026-02-15",
    location: "ครอบคลุมถนนเศรษฐกิจ ย่านการค้า",
    coordinates: { lat: 6.5420, lng: 101.2840 },
    timeline: [
      { title: "จัดจ้างผลิตภัณฑ์โคมไฟมาตรฐานสากลอเนกประสงค์", titleEn: "Sourcing world-certified smart LED components", titleMs: "Perolehan Komponen LED Pintar", date: "2025-03", completed: true },
      { title: "ทยอยติดตั้งทดแทนย่านถนนรถไฟและตลาดเมืองยะลา", titleEn: "Retrofitting across downtown railway & trade complex", titleMs: "Pemasangan di Pusat Bandar & Kawasan Stesen", date: "2025-06", completed: true },
      { title: "เชื่อมต่อประมวลผลเซ็นเซอร์วัดพลังงาน IoT", titleEn: "Configuring power surge metrics monitoring on cloud", titleMs: "Sistem Pemantauan Awan Tenaga IoT", date: "2025-10", completed: true },
      { title: "ตรวจสอบประสิทธิภาพการประหยัดกระแสไฟกว่า 42%", titleEn: "Validating up to 42% energy reduction results", titleMs: "Pengesahan Penjimatan Tenaga 42%", date: "2026-02", completed: true }
    ]
  }
];

// Tourism hotspots with photos and reviews
const tourismSpots = [
  {
    id: "tour-1",
    name: "สวนขวัญเมือง (Suan Khwan Mueang)",
    nameEn: "Suan Khwan Mueang Public Wellness Park",
    nameMs: "Taman Rekreasi Suan Khwan Mueang",
    description: "สวนสาธารณะขนาดใหญ่เนื้อที่กว่า 227 ไร่ โดดเด่นด้วยน่านน้ำสาธารณะกว้างขวาง เหมาะสําหรับการเล่นเรือ สวนหย่อมพักใจ สนามเด็กเล่นที่กว้างขวาง และเป็นสถานที่แข่งขันนกเขาชวาเสียงชิงแชมป์เอเชียที่มีชื่อเสียงระดับสากล",
    descriptionEn: "A massive 90-hectare recreation oasis. Highlighted by a colossal inland rowing lake, scenic walking tracks, children sports parks, and the prestigious Asian Dove Singing Championship center.",
    descriptionMs: "Taman rekreasi seluas 90 hektar dengan tasik dayung yang besar, laluan jogging, taman permainan kanak-kanak, dan pusat Kejohanan Nyanyian Burung Merbok Asia yang terkenal.",
    coordinates: { lat: 6.5480, lng: 101.2725 },
    rating: 4.6,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80",
    reviews: [
      { author: "อับดุลเลาะห์ มูซอ", rating: 5, text: "บรรยากาศดีมาก ลมพัดเย็นสบายตลอดช่วงบ่าย เหมาะพาครอบครัวมาปิคนิค วิ่งจ๊อกกิ้งรอบอ่างน้ำวิวสวยงาม", date: "2026-05-12" },
      { author: "Sunisa K.", rating: 4, text: "สถานที่สะอาด ดอกไม้เยอะมาก ช่วงเย็นคนจะเยอะนิดหน่อย แต่มีระเบียบเรียบร้อย ปลอดภัยดีค่ะ", date: "2026-05-20" }
    ]
  },
  {
    id: "tour-2",
    name: "ศาลหลักเมืองยะลา (Yala City Pillar Shrine)",
    nameEn: "Yala City Pillar Shrine Sacred Monument",
    nameMs: "Kuil Tiang Bandar Yala",
    description: "ศูนย์รวมจิตใจของชาวเมืองยะลา ตั้งใจกลางวงเวียนขนาดใหญ่ ออกแบบสถาปัตยกรรมแบบสุโขทัยผสมผสานความเป็นไทยอย่างงดงาม รายล้อมด้วยปูชนียาลัยอันศักดิ์สิทธิ์และต้นไม้ใหญ่ร่มรื่น",
    descriptionEn: "The spiritual heart of Yala city situated at the center of a giant circular roundabout park, displaying beautiful Sukhothai architectural elements surrounded by greenery.",
    descriptionMs: "Pusat rohani bandar Yala yang terletak di tengah-tengah taman bulatan gergasi, mempamerkan seni bina Sukhothai yang indah dikelilingi oleh pepohonan rimbun.",
    coordinates: { lat: 6.5401, lng: 101.2818 },
    rating: 4.8,
    reviewsCount: 95,
    image: "https://images.unsplash.com/photo-1598977123418-45f04b6141bb?auto=format&fit=crop&w=1200&q=80",
    reviews: [
      { author: "สมชาย เดชะคง", rating: 5, text: "ศาลหลักเมืองคู่บ้านคู่เมือง ยามค่ำคืนเปิดไฟสวยสง่างามมาก ข้ามถนนต้องระวังระมัดระวังนิดนึงเพราะอยู่ตรงวงเวียนพอดี", date: "2026-04-10" }
    ]
  },
  {
    id: "tour-3",
    name: "อุโมงค์เบตงมงคลฤทธิ์ (Betong Mongollorit Tunnel)",
    nameEn: "Betong Mongollorit Automotive Mountain Tunnel",
    nameMs: "Terowong Betong Mongollorit",
    description: "อุโมงค์รถยนต์ลอดใต้ภูเขาที่ใหญ่ที่สุดสร้างด้วยคอนกรีตเสริมเหล็กในประเทศไทย เชื่อมโยงใจกลางเขตเทศบาลเมืองเบตงได้อย่างสะดวกสบาย โด่งดังด้วยแสงสีตระการตาที่สว่างไสวในทุกๆ ค่ำคืน",
    descriptionEn: "The first and largest automotive tunnel carved under the mountains in Thailand, complete with aesthetic color-changing led installation inside for spectacular photoshoots.",
    descriptionMs: "Terowong automotif pertama dan terbesar yang diukir di bawah pergunungan di Thailand, dilengkapi dengan lampu limpah LED yang bertukar warna di dalamnya.",
    coordinates: { lat: 5.7725, lng: 101.1214 },
    rating: 4.7,
    reviewsCount: 228,
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
    reviews: [
      { author: "Nadia Ibrahim", rating: 5, text: "อุโมงค์สวยงามอลังการมากค่ะ เดินชมตอนเย็นเปิดไฟสลับสีถ่ายรูปสวยมาก ยะลาเมืองที่ซ่อนขุมทรัพย์ของธรรมชาติและศิลปะจริงๆ", date: "2026-05-15" }
    ]
  },
  {
    id: "tour-4",
    name: "ทะเลหมอกอัยเยอร์เวง (Ayerweng Skywalk)",
    nameEn: "Ayerweng Sea Of Mist World-class Skywalk",
    nameMs: "Ayerweng Lautan Kabus Skywalk",
    description: "สกายวอล์กกระจกสัมผัสวิวทะเลหมอก 360 องศาที่ยอดเยี่ยมที่สุดในเอเชียตะวันออกเฉียงใต้ ตั้งอยู่บนความสูงกว่า 2,038 ฟุตเหนือเกณฑ์วัดน้ำทะเล ให้คุณล่องลอยเหนือมหาสมุทรหมอกปุยขาวอันหรูหรา",
    descriptionEn: "A magnificent 360-degree glass skywalk overlooking the dense, rolling cloudscapes. Standing elevated at over 620 meters above sea level in Betong region.",
    descriptionMs: "Jambatan kaca 360 darjah yang indah dengan pemandangan lautan kabus yang tebal. Terletak pada ketinggian lebih daripada 620 meter dari aras laut.",
    coordinates: { lat: 5.9782, lng: 101.1812 },
    rating: 4.9,
    reviewsCount: 654,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    reviews: [
      { author: "Kitti S.", rating: 5, text: "ที่สุดของความงดงาม หมอกหนาลอยมาเกาะกระจกทางเดินเลย ไปตีห้ากำลังฟิน คุ้มค่าแก่การตื่นนอนเช้ามากครับ", date: "2026-05-29" }
    ]
  }
];


// ========== API ENDPOINTS ==========

// 1. Get stats
app.get("/api/city-stats", (req, res) => {
  res.json({
    population: { count: 64120, trend: "up", change: "+1.2%" },
    communities: { count: 42, trend: "neutral", change: "คงที่" },
    dailyWaste: { tons: 72.4, trend: "down", change: "-4.8% (แยกขยะอัจฉริยะ)" },
    complaintsSolved: { solved: 3410, total: 3584, rate: "95.1%" },
    airQuality: { aqi: 28, text: "ดีมาก (Good)", status: "safe" },
    rainfall: { currentMm: 12.5, text: "ปกติประจำฤดูฝนใต้" }
  });
});

// 2. Get Open Data
app.get("/api/open-datasets", (req, res) => {
  res.json(openDatasets);
});

// 3. Get Project List
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// 4. Get GIS Map Markers
app.get("/api/map-markers", (req, res) => {
  res.json(mapMarkers);
});

// 5. Get Tourism List
app.get("/api/tourism", (req, res) => {
  res.json(tourismSpots);
});

// 6. Submit Tourism Spot Review
app.post("/api/tourism/:id/review", (req, res) => {
  const { id } = req.params;
  const { author, rating, text } = req.body;

  if (!author || !rating || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const spot = tourismSpots.find(t => t.id === id);
  if (!spot) {
    return res.status(404).json({ error: "Tourism spot not found" });
  }

  const newReview = {
    author,
    rating: Number(rating),
    text,
    date: new Date().toISOString().split("T")[0]
  };

  spot.reviews.unshift(newReview);
  // Recalculate rating
  const totalRating = spot.reviews.reduce((sum, r) => sum + r.rating, 0);
  spot.reviewsCount = spot.reviews.length;
  spot.rating = parseFloat((totalRating / spot.reviews.length).toFixed(1));

  res.json({ success: true, spot });
});

// 7. Get All Complaints
app.get("/api/complaints", (req, res) => {
  res.json(complaints);
});

// 8. Submit Complaint with AI Auto-Classification Client Engine
app.post("/api/complaints", async (req, res) => {
  const { title, description, location, coordinates, imageUrl } = req.body;

  if (!title || !description || !location) {
    return res.status(400).json({ error: "กรุณกรอกข้อมูล หัวข้อคำร้อง, รายละเอียดปัญหา และสถานที่พบปัญหา" });
  }

  // Create complaint model skeleton
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const trackingNum = `YLA-2026-${randomSuffix}`;
  const d = new Date();
  const dateStr = d.toISOString().split("T")[0];

  // Default fallback classification
  let aiSuggestion: any = {
    category: "ปัญหาทั่วไปทางการบริการ",
    department: "กองช่าง",
    confidence: 0.85,
    priority: "medium",
    explanation: "คัดกรองเบื้องต้นเพื่อประสานสำนักปลัดเทศบาลสแตนด์บายตรวจแก้ปัญหา"
  };

  // Run AI reasoning if Gemini API client is alive
  if (ai) {
    try {
      const prompt = `วิเคราะห์หัวข้อและคำอธิบายปัญหาเรื่องร้องเรียนของประชาชนเพื่อจัดหมวดหมู่ส่งต่อหน่วยงานเทศบาลนครยะลา
      หัวข้อ: "${title}"
      รายละเอียด: "${description}"

      จัดหมวดหมู่ให้สอดคล้องกับตัวเลือกในระบบข้อมูลต่อไปนี้:
      1. กองช่าง (งานซ่อมบำรุงทาง ถนนหลุมบ่อ ทางเท้าชำรุด อาคาร งานสาธารณูปโภคโยธา)
      2. กองสาธารณสุขและสิ่งแวดล้อม (ขยะสะสม ถังขยะล้น ท่อระบายน้ำขยะเหม็นจับแมลงวัน น้ำเสีย สัตว์มีพิษ หญ้ารก)
      3. งานไฟฟ้าและแสงสว่าง (ไฟถนนดับ ไฟกิ่งเสีย ไฟตก สายไฟรกรุงรังอันตราย)
      4. กองป้องกันและบรรเทาสาธารณภัย (อุทกภัย น้ำท่วมขังฉับพลัน ต้นไม้ล้มขวางทาง ดับเพลิง บรรเทาสาธารณภัย)
      5. สำนักงานปลัดเทศบาล (เรื่องราวร้องทุกข์ เสียงดังรบกวน ทะเลาะวิวาท สัญจรผ่านไม่ได้ ปัญหาทั่วไป)

      ส่งคำตอบในรูปแบบ JSON วัตถุชิ้นเดียวเท่านั้น ไม่มีตัวอักษรอื่นปะปน (Strict JSON)
      โครงสร้างคีย์ฟอร์แมตรูปแบบดังนี้:
      {
        "category": "หมวดหมู่ภาษาไทยสรุปสั้น 2-3 คำ (เช่น ถนนชำรุด, ขยะมูลฝอยตกค้าง, ไฟฟ้าทางเดินดับ, น้ำท่วมขัง)",
        "department": "ชื่อกองหน่วยงานที่ระบุข้างต้น (ตัวเลือก: 'กองช่าง' | 'กองสาธารณสุขและสิ่งแวดล้อม' | 'งานไฟฟ้าและแสงสว่าง' | 'กองป้องกันและบรรเทาสาธารณภัย' | 'สำนักงานปลัดเทศบาล')",
        "confidence": 0.88-0.99 (ค่าความมั่นใจแบบตัวเลขทศนิยม),
        "priority": "ระดับความด่วน (ตัวเลือก: 'low' | 'medium' | 'high' | 'critical')",
        "explanation": "อธิบายเหตุผลสั้นๆ 1 ประโยคไทยในการคัดกรองครั้งนี้"
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              department: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              priority: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ["category", "department", "confidence", "priority", "explanation"],
          },
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        aiSuggestion = {
          category: parsed.category || aiSuggestion.category,
          department: parsed.department || aiSuggestion.department,
          confidence: parseFloat(parsed.confidence) || aiSuggestion.confidence,
          priority: (["low", "medium", "high", "critical"].includes(parsed.priority) ? parsed.priority : "medium") as any,
          explanation: parsed.explanation || aiSuggestion.explanation
        };
      }
    } catch (aiErr) {
      console.warn("AI Classification generated an error. Falling back safely.", aiErr);
      // fallback matching rules based on content analysis
      const lowercaseContent = (title + " " + description).toLowerCase();
      if (lowercaseContent.includes("ไฟ") || lowercaseContent.includes("แสงสว่าง") || lowercaseContent.includes("ส่องสว่าง")) {
        aiSuggestion = {
          category: "ระบบไฟฟ้าและแสงสว่าง",
          department: "งานไฟฟ้าและแสงสว่าง",
          confidence: 0.90,
          priority: "high",
          explanation: "คัดเลือกกองจากหลักฐานคำพ้องความหมายด้านไฟฟ้าและแสงสว่าง"
        };
      } else if (lowercaseContent.includes("ขยะ") || lowercaseContent.includes("กลิ่น") || lowercaseContent.includes("เหม็น") || lowercaseContent.includes("น้ำเสีย")) {
        aiSuggestion = {
          category: "ขยะมูลฝอยและสิ่งแวดล้อม",
          department: "กองสาธารณสุขและสิ่งแวดล้อม",
          confidence: 0.92,
          priority: "medium",
          explanation: "คัดเลือกกองส่งต่อดูแลสิ่งปฏิกูลตามระบบฐานข้อมูลขยะไร้ฝุ่น"
        };
      } else if (lowercaseContent.includes("ท่วม") || lowercaseContent.includes("น้ำล้น") || lowercaseContent.includes("ฝน") || lowercaseContent.includes("เพลิง")) {
        aiSuggestion = {
          category: "ภัยพิบัติและบรรเทาสาธารณภัย",
          department: "กองป้องกันและบรรเทาสาธารณภัย",
          confidence: 0.95,
          priority: "critical",
          explanation: "จัดหมวดภัยฉุกเฉินน้ำล้นท่วมขังเพื่อตอบรับเร่งด่วนรวดเร็ว"
        };
      } else if (lowercaseContent.includes("ถนน") || lowercaseContent.includes("หลุม") || lowercaseContent.includes("ทางเท้า") || lowercaseContent.includes("ฝาท่อ")) {
        aiSuggestion = {
          category: "ความชำรุดโยธาและทางจราจร",
          department: "กองช่าง",
          confidence: 0.94,
          priority: "high",
          explanation: "จัดเป็นงานซ่อมผิวจราจรและโครงข่ายขนส่งให้อยู่ในสภาพสมบูรณ์"
        };
      }
    }
  } else {
    // Basic Keyword Heuristics for offline mode
    const lowercaseContent = (title + " " + description).toLowerCase();
    if (lowercaseContent.includes("ไฟ") || lowercaseContent.includes("แสงสว่าง") || lowercaseContent.includes("ส่องสว่าง")) {
      aiSuggestion = {
        category: "ระบบไฟฟ้าและแสงสว่าง",
        department: "งานไฟฟ้าและแสงสว่าง",
        confidence: 0.90,
        priority: "medium",
        explanation: "คัดเลือกตามกฎ heuristic คำพ้องความหมายไฟฟ้าส่องสว่างอัตโนมัติ"
      };
    } else if (lowercaseContent.includes("ขยะ") || lowercaseContent.includes("กลิ่น") || lowercaseContent.includes("เหม็น") || lowercaseContent.includes("สกปรก")) {
      aiSuggestion = {
        category: "ขยะมูลฝอยและสิ่งแวดล้อม",
        department: "กองสาธารณสุขและสิ่งแวดล้อม",
        confidence: 0.94,
        priority: "medium",
        explanation: "คัดกรองเบื้องต้นโดยคีย์เวิร์ดเกี่ยวกับสิ่งแวดล้อม ขยะมูลฝอย"
      };
    } else if (lowercaseContent.includes("ท่วม") || lowercaseContent.includes("อุทกภัย") || lowercaseContent.includes("น้ำนอง")) {
      aiSuggestion = {
        category: "ภัยพิบัติทางน้ำและอุทกภัย",
        department: "กองป้องกันและบรรเทาสาธารณภัย",
        confidence: 0.95,
        priority: "critical",
        explanation: "คัดกรองโดยคีย์เวิร์ดตรวจพบภัยน้ำท่วมขังขวางทางจราจรฉุกเฉิน"
      };
    } else if (lowercaseContent.includes("ถนน") || lowercaseContent.includes("ทางเดิน") || lowercaseContent.includes("หลุม") || lowercaseContent.includes("ฝาท่อ")) {
      aiSuggestion = {
        category: "โยธาและการก่อสร้างปรับระบบถนน",
        department: "กองช่าง",
        confidence: 0.92,
        priority: "high",
        explanation: "คัดกรองโดยคีย์เวิร์ดตรวจพบความเสียหายโครงสร้างพื้นฐาน/ถนนหนทาง"
      };
    }
  }

  // Create the final complaint entry with geographic coordinates
  const newComplaint = {
    id: `comp-${Date.now()}`,
    title,
    description,
    category: aiSuggestion.category,
    dept: aiSuggestion.department,
    location,
    coordinates: coordinates || { lat: 6.5415, lng: 101.2820 }, // Fallback center of Yala
    imageUrl: imageUrl || undefined,
    status: "received" as const,
    date: dateStr,
    trackingNum,
    priority: aiSuggestion.priority,
    progressLog: [
      {
        status: "received" as const,
        date: `${dateStr} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
        note: `ระบบรับเรื่องและจัดหมวดหมู่สำเร็จโดย AI [${aiSuggestion.category} -> ${aiSuggestion.department}] ด้วยความมั่นใจ ${(aiSuggestion.confidence * 100).toFixed(0)}%. ${aiSuggestion.explanation}`
      }
    ]
  };

  complaints.unshift(newComplaint);

  // Add a simulation background update to push it from "received" to "progress" in exactly 45 seconds if running.
  // We can simulate state changes dynamically inside the dashboard too.

  res.status(201).json({
    success: true,
    data: newComplaint,
    aiRecommendation: aiSuggestion
  });
});

// 9. AI Chat Assistant integration (Answers municipal questions about Yala city)
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array are required" });
  }

  const lastUserMessage = messages[messages.length - 1]?.text;
  if (!lastUserMessage) {
    return res.status(400).json({ error: "Last user message text is missing" });
  }

  const systemInstruction = `คุณคือ "หมุดอัจฉริยะ" AI ผู้ช่วยบริการประชาชนอเนกประสงค์ของเทศบาลนครยะลา (Yala Smart City Platform)
  คุณหน้าที่เป็นทางการในการให้ข้อมูลที่ครบครัน มีประโยชน์ สุภาพ และเปี่ยมด้วยความหวังดีต่อประชาชน ยินดีช่วยเหลือใน 3 ภาษา: ไทย (เป็นหลัก), อังกฤษ (English) และยาวี/มลายูถิ่น (Melayu Yala/Jawi)

  กรุณาศึกษาประเด็นข้อมูลสำคัญด้านล่างเพื่อตอบประชาชน:
  1. เวลาทำงานที่ทำการเทศบาลนครยะลา: จันทร์ - ศุกร์ เวลา 08:30 น. ถึง 16:30 น. (หยุดวันเสาร์-อาทิตย์ และวันหยุดนักขัตฤกษ์)
  2. การเสียภาษีท้องถิ่นในเขตเทศบาล: 
     - ภาษีที่ดินและสิ่งปลูกสร้าง (ชำระภายในเดือนเมษายน ของทุกปี)
     - ภาษีป้าย (ยื่นแบบภายในเดือนมีนาคม ของทุกปี)
     - สามารถชำระออนไลน์ผ่านโมบายแบงก์กิ้ง หรือมาสแกน QR Code ตรวจสอบที่กองคลัง ณ อาคารเทศบาลนครยะลา ชั้น 1
  3. การแจ้งอุบัติภัย/แจ้งไฟฟ้าสาธารณะเสีย:
     - แนะนำให้ข้ามไปพิมพ์ปัญหาที่หน้า "แจ้งปัญหาและบริการสุขภาวะ (Citizen Service)" เพื่อให้ AI วิเคราะห์กองพิกัดอย่างสมบูรณ์ทันที
     - หากเกิดภัยฉุกเฉิน โทรแจ้งกองป้องกันและบรรเทาสาธารณภัยได้ตลอด 24 ชั่วโมงที่เบอร์ 199 หรือ 073-212111
  4. แนะนำสถานที่ท่องเที่ยว Yala Tourism:
     - สวนขวัญเมือง (สวนกว้าง มีแอ่งพายเรือ ลานกิจกรรมกีฬา แข่งขันนกเขาชวาเสียงอาเซียน)
     - ศาลหลักเมืองยะลา (วงเวียนร่มรื่น วิหารสุโขทัยงดงามใจกลางเมือง)
     - สถานที่ Betong (อุโมงค์มงคลฤทธิ์ใต้ภูเขา, สกายวอล์กชมทะเลหมอกอัยเยอร์เวง)
  5. กองงานในเทศบาล: สำนักการช่าง (กองช่าง), สำนักสาธารณสุข (กองสาธารณสุข), งานสว่างไสวไฟฟ้า, กองการศึกษา

  หลักปฏิบัติทางวาจา:
  - ใช้ถ้อยคำเป็นกันเอง อบอุ่น มีเสน่ห์แบบคนใต้ ยินดีให้บริการด้วยความจริงใจ
  - หลีกเลี่ยงความยืดยาดของข้อความ ให้ตอบสั้นกระชับเป็นข้อๆ และให้กำลังใจประชาชน
  - หากประชาชนถามถึงการ "แจ้งปัญหา" ให้แจ้งลิงก์แจ้งปัญหาหรือให้เขากรอกข้อมูลได้ทันทีในแท็บ "บริการประชาชน" แสนสะดวกรวดเร็ว`;

  if (ai) {
    try {
      // Structure chat context
      const chatContext = messages.map(msg => ({
        role: msg.sender === "user" ? "user" as const : "model" as const,
        parts: [{ text: msg.text }]
      }));

      // Set up the chat with historical context
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          ...chatContext.slice(0, -1),
          { role: "user", parts: [{ text: lastUserMessage }] }
        ],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      if (response && response.text) {
        return res.json({ text: response.text });
      }
    } catch (err) {
      console.error("Gemini Chat assistant failed, falling back to heuristic chat engine", err);
    }
  }

  // Robust Multilingual Heuristic Chat fallback if API Key is missing or failed
  const txt = lastUserMessage.toLowerCase();
  let answer = "";

  if (txt.includes("เวลา") || txt.includes("เปิด") || txt.includes("ปิด") || txt.includes("วันทำการ")) {
    answer = "สวัสดีครับชาวเมืองยะลา! สำนักงานเทศบาลนครยะลา เปิดทำการวันจันทร์ - ศุกร์ ตั้งแต่เวลา 08:30 น. - 16:30 น.ครับ (หยุดวันเสาร์-อาทิตย์ และวันหยุดราชการ) สามารถติดต่อสอบถามโทร 073-212722 ได้ในเวลาดังกล่าวครับผม";
  } else if (txt.includes("ภาษี") || txt.includes("ที่ดิน") || txt.includes("ป้าย")) {
    answer = "เรื่องการยื่นชำระภาษีท้องถิ่นดังนี้ครับ:\n1. **ภาษีป้าย** ยื่นประเมินได้ภายในเดือน มีนาคม ของทุกปี\n2. **ภาษีที่ดินและสิ่งปลูกสร้าง** ชำระได้ภายในเดือน เมษายน ของทุกปีครับ\n\nท่านสามารถนำเอกสารเข้ามาติดต่อที่กองคลัง ชั้น 1 สำนักงานเทศบาลนครยะลา หรือชำระแบบออนไลน์ด้วย QR Code ผ่านแอปธนาคารได้เลยครับ!";
  } else if (txt.includes("ไฟถนน") || txt.includes("ไฟสว่าง") || txt.includes("ไฟเสีย") || txt.includes("ถนนเสีย")) {
    answer = "พบปัญหาไฟถนนดับหรือผิวทางชำรุดใช่ไหมครับ? แนะนำให้เข้าไปที่เมนู **'บริการประชาชน'** ในแถบด้านบนสิครับ! มีระบบฟอร์มให้อัปโหลดภาพถ่าย ระบุตำแหน่ง และส่งคำร้อง ซึ่งระบบของเรามี **AI อัจฉริยะวิเคราะห์คัดกรองส่งเรื่องต่อไปยังกองช่างหรือหน่วยงานไฟฟ้าโดยตรงทันที** และท่านสามารถติดตามความคืบหน้าได้แบบเรียลไทม์เลยครับ!";
  } else if (txt.includes("เที่ยว") || txt.includes("สถานที่สำคัญ") || txt.includes("สวนขวัญเมือง")) {
    answer = "ยะลาน่าเที่ยวมากครับ! ในเมืองเรามี **'สวนขวัญเมือง'** สวนสีเขียวบึงน้ำขนาดใหญ่จัดแข่งนกเขาชวาเสียงอาเซียน และ **'ศาลหลักเมืองยะลา'** เป็นสิริมงคล หากไปเที่ยวต่างอำเภอ พลาดไม่ได้กับเบตง: **'อุโมงค์มงคลฤทธิ์'** ชิคๆ และ **'สกายวอล์กทะเลหมอกอัยเยอร์เวง'** บรรยากาศหมอกจุใจสุดสายตาครับ สามารถเข้าดูแกลเลอรีท่องเที่ยวสวยๆ ได้ที่แผงนำเที่ยวเมนู **'ท่องเที่ยวเมืองยะลา'** ได้เลยครับ!";
  } else if (txt.includes("hello") || txt.includes("hi") || txt.includes("how are you")) {
    answer = "Selamat Datang! Welcome to Yala Smart Municipality Civic Assistant. I can help you with municipal hours, tourist attractions, civic complaints classification, and regional tax guidance. Feel free to ask in Thai, English, or Melayu!";
  } else {
    answer = "ยินดีต้อนรับสู่ผู้ช่วยเทศบาลอัจฉริยะยะลาครับ! ผมสามารถชี้แจงหัวข้อเวลาเปิดทำการชำระภาษี แนะนำนกเขาชวาสวนขวัญเมือง แหล่งสกายวอล์กเบตง หรือช่วยเหลือบริการรับเรื่องร้องเรียนร้องทุกข์ของชาวเมือง หากมีความประสงค์เรื่องใด สอบถามข้อมูลพิมพ์ส่งมาได้เลยครับ ยะลาเมืองแห่งความสุขน่าอยู่อย่างยั่งยืนครับ!";
  }

  res.json({ text: answer });
});

// 10. Simulate administrative stats change or status movement for hackathon dashboard demo
app.post("/api/admin/simulate-step", (req, res) => {
  let changed = false;
  complaints = complaints.map(comp => {
    if (comp.status === "received") {
      changed = true;
      return {
        ...comp,
        status: "progress" as const,
        progressLog: [
          ...comp.progressLog,
          { status: "progress" as const, date: new Date().toISOString().replace("T", " ").substring(0, 16), note: "ผู้ดูแลระบบเทศบาลอนุมัติคำร้องและมอบหมายทีมปฏิบัติการพื้นที่เพื่อเตรียมอุปกรณ์ลงเข้าตรวจซ่อม" }
        ]
      };
    } else if (comp.status === "progress") {
      changed = true;
      return {
        ...comp,
        status: "completed" as const,
        progressLog: [
          ...comp.progressLog,
          { status: "completed" as const, date: new Date().toISOString().replace("T", " ").substring(0, 16), note: "ทีมวิศวกรและช่างบริการทำการซ่อมแซมเสร็จสมบูรณ์เรียบร้อยแล้ว ได้ทำการถ่ายภาพยืนยันปิดเคสงานอัจฉริยะ" }
        ]
      };
    }
    return comp;
  });

  res.json({ success: true, message: changed ? "อัปเดตสเตตัสเรื่องร้องเรียนในแบบจำลองเรียบร้อยแผงควบคุม" : "เคสทั้งหมดถูกซ่อมแซมสมบูรณ์ครบถ้วนในระลอกวงจรแล้ว!" });
});


// ========== SET UP SERVER AND VITE ENGINE ==========

async function startServer() {
  // Integrate Vite for single-page client loading in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`===============================================`);
    console.log(`  YALA SMART CITY NODE RUNNING: http://localhost:${PORT}`);
    console.log(`  PORT IS ROUTED BY NGINX IN CONTAINER ACCESS`);
    console.log(`===============================================`);
  });
}

startServer();
