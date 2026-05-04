export const DEFAULT_RECIPES = [
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    category: "MATCHA",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Bột matcha", amount: "3.5g" },
          { name: "Sữa tươi", amount: "140ml" },
          { name: "Nước đường", amount: "10ml" },
          { name: "Sữa đặc", amount: "10ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Bột matcha", amount: "4.5g" },
          { name: "Sữa tươi", amount: "180ml" },
          { name: "Nước đường", amount: "10g" },
          { name: "Sữa đặc", amount: "15g" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Cho nước đường + sữa đặc, sữa tươi => Khuấy đều vào ly, thêm đá.",
      "Pha bột matcha với 40ml sữa tươi, khuấy tan đều.",
      "Rót sữa tươi vào ly.",
    ],
  },
  {
    id: "matcha-cold-whisk",
    name: "Matcha Cold Whisk",
    category: "MATCHA",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Bột matcha", amount: "3.5g" },
          { name: "Sữa tươi", amount: "140ml" },
          { name: "Nước đường", amount: "10g" },
          { name: "Sữa đặc", amount: "10g" },
          { name: "Rich (kem béo)", amount: "20g" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Bột matcha", amount: "4.5g" },
          { name: "Sữa tươi", amount: "180ml" },
          { name: "Nước đường", amount: "10g" },
          { name: "Sữa đặc", amount: "20g" },
          { name: "Rich (kem béo)", amount: "20g" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Cho nước đường, sữa đặc, rich, bột matcha, đá vào bình shaker.",
      "Lắc đều cho đến khi tan bột matcha, không còn thấy cặn bột dưới đáy bình.",
      "Đổ matcha ra rây, lược bớt bọt, thêm đá vào ly.",
    ],
  },
  {
    id: "matcha-latte-dau",
    name: "Matcha Latte Dâu",
    category: "MATCHA",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Bột matcha", amount: "3.5g" },
          { name: "Sữa tươi", amount: "140ml" },
          { name: "Nước đường", amount: "10ml" },
          { name: "Sữa đặc", amount: "5g" },
          { name: "Dâu", amount: "20ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Bột matcha", amount: "4.5g" },
          { name: "Sữa tươi", amount: "180ml" },
          { name: "Nước đường", amount: "10ml" },
          { name: "Sữa đặc", amount: "15ml" },
          { name: "Dâu", amount: "25ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Cho dâu khuếch đều xung quanh ly.",
      "Nước đường, sữa đặc, sữa tươi khuấy đều.",
      "Đánh bột matcha với 40ml sữa tươi.",
      "Đổ cốt matcha lên trên ly.",
    ],
  },
  {
    id: "matcha-latte-dua",
    name: "Matcha Latte Dừa",
    category: "MATCHA",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Kem matcha", amount: "20ml" },
          { name: "Nước dừa", amount: "150ml" },
          { name: "Nước đường", amount: "10ml" },
          { name: "Cuộn hạt điều", amount: "1–2g" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Bột matcha", amount: "30ml" },
          { name: "Nước dừa", amount: "200ml" },
          { name: "Nước đường", amount: "10ml" },
          { name: "Cuộn hạt điều", amount: "1–2g" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Rót nước dừa vào ly, nước đường, khuấy đều, cho đá vào.",
      "Đổ kem matcha lên trên.",
      "Rắc cuộn hạt điều.",
    ],
  },
  {
    id: "matcha-kem-muoi",
    name: "Matcha Latte Kem Muối",
    category: "MATCHA",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Bột matcha", amount: "3.5g" },
          { name: "Sữa tươi", amount: "140ml" },
          { name: "Nước đường", amount: "10ml" },
          { name: "Sữa đặc", amount: "10ml" },
          { name: "Sữa rich (kem muối)", amount: "30ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Bột matcha", amount: "4.5g" },
          { name: "Sữa tươi", amount: "180ml" },
          { name: "Nước đường", amount: "10ml" },
          { name: "Sữa đặc", amount: "15ml" },
          { name: "Sữa rich (kem muối)", amount: "30ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Cho nước đường, sữa đặc, bột matcha, đá vào bình shaker.",
      "Lắc đều cho đến khi tan bột matcha, không còn thấy cặn bột dưới đáy bình.",
      "Rót ra ly vớt bớt bọt, thêm đá.",
      "Đổ lớp kem muối lên trên, rắc thêm bột matcha.",
    ],
  },
  {
    id: "nau-cafe-sua-dac",
    name: "Nâu (Cafe Sữa Đặc)",
    category: "COFFEE",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Cafe", amount: "21g" },
          { name: "Sữa đặc", amount: "30ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Cafe", amount: "21g" },
          { name: "Sữa đặc", amount: "30ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Cho sữa đặc vào đáy ly, cà phê.",
      "Dùng máy đánh tạo bọt, thêm đá.",
    ],
  },
  {
    id: "asian-latte",
    name: "Asian Latte",
    category: "COFFEE",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Cafe", amount: "21g" },
          { name: "Sữa tươi", amount: "140ml" },
          { name: "Sữa đặc", amount: "20g" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Cafe", amount: "21g" },
          { name: "Sữa tươi", amount: "180ml" },
          { name: "Sữa đặc", amount: "30g" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Pha espresso.",
      "Cho sữa đặc, sữa tươi vào ly khuấy đều.",
      "Thêm đá, rót cafe lên trên để được phân tầng.",
    ],
  },
  {
    id: "caramel-macchiato",
    name: "Caramel Macchiato",
    category: "COFFEE",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Cafe", amount: "18g" },
          { name: "Sữa tươi", amount: "140ml" },
          { name: "Caramel syrup", amount: "20ml" },
          { name: "Sốt caramel", amount: "10ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Cafe", amount: "21g" },
          { name: "Sữa tươi", amount: "180ml" },
          { name: "Caramel syrup", amount: "30ml" },
          { name: "Sốt caramel", amount: "10ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Pha espresso.",
      "Cho caramel syrup, sữa tươi vào ly khuấy đều, thêm đá.",
      "Đổ cafe lên trên, vẽ sốt caramel.",
    ],
  },
  {
    id: "cappucino",
    name: "Cappucino",
    category: "COFFEE",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Cafe", amount: "21g" },
          { name: "Sữa tươi", amount: "200ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Cafe", amount: "21g" },
          { name: "Sữa tươi", amount: "300ml" },
          { name: "Sữa đặc", amount: "20g" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Pha espresso/cafe phin.",
      "Đánh bọt sữa tươi.",
      "Rót cafe vào ly, thêm đá.",
      "Đổ sữa bọt lên trên.",
    ],
  },
  {
    id: "cafe-muoi",
    name: "Cafe Muối",
    category: "COFFEE",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Cafe", amount: "17g" },
          { name: "Sữa đặc", amount: "5ml" },
          { name: "Kem muối", amount: "30ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Cafe", amount: "17g" },
          { name: "Sữa đặc", amount: "5ml" },
          { name: "Kem muối", amount: "30ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Pha espresso.",
      "Cho sữa đặc, rót cafe khuấy đều.",
      "Đổ lớp kem muối lên trên.",
    ],
  },
  {
    id: "tra-dao",
    name: "Trà Đào",
    category: "TRA_TRAI_CAY",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Cốt trà đen", amount: "180ml" },
          { name: "Tắc", amount: "5ml" },
          { name: "Nước đường", amount: "10ml" },
          { name: "Syrup đào", amount: "10ml" },
          { name: "Mứt đào", amount: "30ml" },
          { name: "Đào tươi", amount: "3 miếng" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Cốt trà đen", amount: "250ml" },
          { name: "Tắc", amount: "5ml" },
          { name: "Nước đường", amount: "15ml" },
          { name: "Syrup đào", amount: "10ml" },
          { name: "Mứt đào", amount: "40ml" },
          { name: "Đào tươi", amount: "3 miếng" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Cho mứt đào + syrup đào + nước đường + cốt trà vào ly.",
      "Thêm đá, rót cốt trà vào.",
      "Vắt tắc, trang trí miếng đào lên trên.",
    ],
  },
  {
    id: "tra-tac",
    name: "Trà Tắc",
    category: "TRA_TRAI_CAY",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Cốt trà đen", amount: "150ml" },
          { name: "Tắc", amount: "8ml" },
          { name: "Nước đường", amount: "40ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Cốt trà đen", amount: "200ml" },
          { name: "Tắc", amount: "12ml" },
          { name: "Nước đường", amount: "40ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Vắt tắc vào ly.",
      "Cho nước đường, thêm đá.",
      "Rót cốt trà đen vào.",
      "Khuấy đều, thưởng thức.",
    ],
  },
  {
    id: "tra-chanh",
    name: "Trà Chanh",
    category: "TRA_TRAI_CAY",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Cốt trà olong", amount: "140ml" },
          { name: "Nước đường", amount: "40ml" },
          { name: "Nước cốt chanh", amount: "15ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Cốt trà olong", amount: "180ml" },
          { name: "Nước đường", amount: "50ml" },
          { name: "Nước cốt chanh", amount: "20ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Pha cốt trà olong, để nguội.",
      "Cho nước đường vào ly, thêm đá.",
      "Rót cốt trà + nước cốt chanh vào.",
      "Khuấy đều.",
    ],
  },
  {
    id: "tra-buoi",
    name: "Trà Bưởi",
    category: "TRA_TRAI_CAY",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Cốt trà olong", amount: "140ml" },
          { name: "Mứt đào bưởi", amount: "10ml" },
          { name: "Mứt bưởi chunky", amount: "30ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Cốt trà olong", amount: "180ml" },
          { name: "Mứt bưởi", amount: "45ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Pha cốt trà olong, để nguội.",
      "Cho mứt bưởi vào đáy ly, thêm đá.",
      "Rót cốt trà vào.",
      "Khuấy nhẹ, trang trí.",
    ],
  },
  {
    id: "tra-dau-chanh",
    name: "Trà Dâu Chanh",
    category: "TRA_TRAI_CAY",
    sizes: [
      {
        label: "SIZE M", ml: "500ml",
        ingredients: [
          { name: "Cốt trà olong/lài", amount: "140–150ml" },
          { name: "Nước cốt chanh", amount: "10–15ml" },
          { name: "Nước đường", amount: "20ml" },
          { name: "Syrup chunky dâu", amount: "20ml" },
          { name: "Mứt dâu", amount: "10ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
      {
        label: "SIZE L", ml: "700ml",
        ingredients: [
          { name: "Cốt trà olong/lài", amount: "180ml" },
          { name: "Nước cốt chanh", amount: "20ml" },
          { name: "Nước đường", amount: "25ml" },
          { name: "Syrup chunky dâu", amount: "30ml" },
          { name: "Mứt dâu", amount: "10ml" },
          { name: "Ly + nắp + ống hút", amount: "1 bộ" },
        ],
      },
    ],
    steps: [
      "Pha cốt trà, để nguội.",
      "Cho mứt dâu + syrup dâu + nước đường vào ly.",
      "Vắt chanh, thêm đá.",
      "Rót cốt trà vào, khuấy nhẹ.",
    ],
  },
]

export const CATEGORIES = {
  MATCHA: { label: "MATCHA", color: "#2D6A4F", accent: "#52B788", light: "#D8F3DC", dot: "#95D5B2" },
  COFFEE: { label: "COFFEE", color: "#5C3D2E", accent: "#A0522D", light: "#F5E6D3", dot: "#DEB887" },
  TRA_TRAI_CAY: { label: "TRÀ TRÁI CÂY", color: "#7B3F00", accent: "#C0392B", light: "#FFF3E0", dot: "#E07B39" },
}

// ⚠️ Đặt mật khẩu edit ở đây
export const EDIT_PASSWORD = "128712"
