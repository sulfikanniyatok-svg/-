import { OpenDataset, Project, TourismSpot, MapMarker, Complaint } from "./types";

export const FALLBACK_STATS = {
  population: { count: 64120, trend: "up", change: "+1.2%" },
  communities: { count: 42, trend: "neutral", change: "คงที่" },
  dailyWaste: { tons: 72.4, trend: "down", change: "-4.8% (แยกขยะอัจฉริยะ)" },
  complaintsSolved: { solved: 3410, total: 3584, rate: "95.1%" },
  airQuality: { aqi: 28, text: "ดีมาก (Good)", status: "safe" },
  rainfall: { currentMm: 12.5, text: "ปกติประจำฤดูฝนใต้" }
};

export const FALLBACK_DATASETS: OpenDataset[] = [
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
    format: "CSV"
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
    format: "CSV"
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
    format: "PDF"
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
    format: "CSV"
  }
];

export const FALLBACK_MARKERS: MapMarker[] = [
  { id: "m-1", title: { th: "สำนักงานเทศบาลนครยะลา", en: "Yala City Municipality Office", ms: "Pejabat Majlis Perbandaran Yala" }, type: "office", coordinates: { lat: 6.5401, lng: 101.2818 }, address: { th: "ถนนสุขยางค์ ต.สะเตง อ.เมืองยะลา", en: "Sukyang Rd, Sateng, Mueang Yala", ms: "Sukyang Rd, Sateng, Mueang Yala" } },
  { id: "m-2", title: { th: "โรงพยาบาลยะลา", en: "Yala Regional Hospital", ms: "Hospital Wilayah Yala" }, type: "hospital", coordinates: { lat: 6.5369, lng: 101.2755 }, address: { th: "ถนนเทศบาล 1 ต.สะเตง อ.เมืองยะลา", en: "Thetsaban 1 Rd, Sateng, Mueang Yala", ms: "Thetsaban 1 Rd, Sateng, Mueang Yala" } },
  { id: "m-3", title: { th: "สถานีตำรวจภูธรเมืองยะลา", en: "Mueang Yala Police Station", ms: "Balai Polis Mueang Yala" }, type: "police", coordinates: { lat: 6.5414, lng: 101.2858 }, address: { th: "ถนนพิพิธภักดี ต.สะเตง อ.เมืองยะลา", en: "Pipitpakdi Rd, Sateng, Mueang Yala", ms: "Pipitpakdi Rd, Sateng, Mueang Yala" } },
  { id: "m-4", title: { th: "โรงเรียนเทศบาล 1 (บ้านสะเตง)", en: "Municipal School 1 (Ban Sateng)", ms: "Sekolah Perbandaran 1 (Ban Sateng)" }, type: "school", coordinates: { lat: 6.5452, lng: 101.2721 }, address: { th: "ถนนเวฬุวัน ต.สะเตง อ.เมืองยะลา", en: "Weluwan Rd, Sateng, Mueang Yala", ms: "Weluwan Rd, Sateng, Mueang Yala" } },
  { id: "m-5", title: { th: "วิทยาลัยเทคนิคยะลา", en: "Yala Technical College", ms: "Kolej Teknikal Yala" }, type: "school", coordinates: { lat: 6.5332, lng: 101.2872 }, address: { th: "ถนนเทศบาล 3 ต.สะเตง อ.เมืองยะลา", en: "Thetsaban 3 Rd, Sateng, Mueang Yala", ms: "Thetsaban 3 Rd, Sateng, Mueang Yala" } },
  { id: "m-6", title: { th: "จุดชำรุดฝาท่อระบายน้ำ (เคสกำลังซ่อม)", en: "Damaged Manhole Cover (In Progress Case)", ms: "Penutup Lubang Rosak (Kes Sedang Dibaiki)" }, type: "complaint", coordinates: { lat: 6.5412, lng: 101.2825 }, status: "progress", address: { th: "ถนนพิพิธภักดี ตรงข้ามศาลหลักเมือง", en: "Pipitpakdi Rd, Opposite City Pillar Shrine", ms: "Pipitpakdi Rd, Setentang Kuil Bandar" } },
  { id: "m-7", title: { th: "จุดแจ้งไฟกิ่งส่องสว่างชำรุด (เคสได้รับเรื่อง)", en: "Broken Park Streetlamp (Case Received)", ms: "Lampu Taman Rosak (Kes Diterima)" }, type: "complaint", coordinates: { lat: 6.5495, lng: 101.2720 }, status: "received", address: { th: "รอบๆ เลียบสวนขวัญเมือง ฝั่งทิศตะวันตก", en: "West Suan Khwan Mueang Loop", ms: "Sisi Barat Suan Khwan Mueang" } }
];

export const FALLBACK_PROJECTS: Project[] = [
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
    descriptionMs: "Menukar lampu lama kepada nod LED IoT yang cekap tenaga, mengurangkan kecerahan automatik,และรักษาความปลอดภัยรอบข้าง",
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

export const FALLBACK_TOURISM: TourismSpot[] = [
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

export const FALLBACK_COMPLAINTS: Complaint[] = [
  {
    id: "comp-1",
    title: "พบฝาท่อระบายน้ำชำรุดบริเวณถนนพิพิธภักดี",
    description: "ฝาท่อเหล็กชำรุดทรุดตัวลงไปเกือบครึ่งหนึ่ง เกรงว่าจะเกิดอันตรายกับมอเตอร์ไซค์และรถยนต์ที่สัญจรผ่านในช่วงค่ำ",
    category: "ความชำรุดถนนและผิวจราจร",
    dept: "กองช่าง",
    location: "ถนนพิพิธภักดี ใกล้ศาลหลักเมืองยะลา",
    coordinates: { lat: 6.5412, lng: 101.2825 },
    status: "progress",
    date: "2026-06-01",
    trackingNum: "YLA-2026-8801",
    priority: "high",
    progressLog: [
      { status: "received", date: "2026-06-01 09:15", note: "ระบบได้รับเรื่องแจ้งปัญหาเรียบร้อยแล้ว" },
      { status: "progress", date: "2026-06-01 14:30", note: "ส่งข้อมูลให้ กองช่าง เทศบาลนครยะลา ลงพื้นที่วิเคราะห์และกั้นกรวยนิรภัย" }
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
    status: "completed",
    date: "2026-05-30",
    trackingNum: "YLA-2026-7244",
    priority: "medium",
    progressLog: [
      { status: "received", date: "2026-05-30 08:00", note: "ระบบได้รับเรื่องแจ้งปัญหาและตรวจสอบพิกัด" },
      { status: "progress", date: "2026-05-30 11:00", note: "กวาดเก็บขยะและฉีดล้างฆ่าเชื้อบริเวณดังกล่าว" },
      { status: "completed", date: "2026-05-30 15:30", note: "ทำความสะอาดเรียบร้อย เปลี่ยนถังขยะใบใหม่เสร็จสิ้น" }
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
    status: "received",
    date: "2026-06-02",
    trackingNum: "YLA-2026-9502",
    priority: "high",
    progressLog: [
      { status: "received", date: "2026-06-02 10:20", note: "ระบบ AI คัดกรองและส่งต่อไปยัง งานไฟฟ้าและแสงสว่าง สำนักการช่าง" }
    ]
  }
];
