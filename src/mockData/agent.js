// ============================================================
// HASHMAR CROPEX — AGENT MOCK DATA
// TODO: Replace with API calls from src/services/agentApi.js
// ============================================================

export const agentData = {
  id: "AGT-001",
  name: "Tomide",
  fullName: "Tomide Adelopo",
  phone: "08012345678",
  email: "tomide@hashmar.com",
  state: "Oyo",
  lga: "Ibadan North",
  status: "Online",
  photo: "https://via.placeholder.com/150",
  totalFarmersRegistered: 543,
  syncedFarmers: 1100,
  pendingSync: 8,
  completedSync: 42,
  syncProgress: 8,
};

export const agentRegisteredFarmers = [
  {
    id: "HSH-IB-2026-000123",
    name: "Adebayo Oluwaseun",
    photo: "https://via.placeholder.com/150",
    regDate: "20/09/2025",
    status: "synced",
    primaryCrop: "Maize",
    state: "Oyo",
    lga: "Ibadan North",
    phone: "08034291930",
    cooperative: "Oyo Farmers Cooperative Union",
    farmSize: "2 hectares",
    landOwnership: "Owned",
    gender: "Male",
    dob: "20/09/1985",
    nin: "12345678901",
    address: "Elere Area, Ibadan, Oyo State",
    biometric: { face: true, fingerprint: true },
  },
  {
    id: "HSH-IB-2026-000124",
    name: "Folake Adesanya",
    photo: "https://via.placeholder.com/150",
    regDate: "22/09/2025",
    status: "pending",
    primaryCrop: "Rice",
    state: "Oyo",
    lga: "Ibadan South",
    phone: "08023456789",
    cooperative: "Oyo Farmers Cooperative Union",
    farmSize: "1.5 hectares",
    landOwnership: "Leased",
    gender: "Female",
    dob: "15/05/1990",
    nin: "98765432109",
    address: "Apata Road, Ibadan, Oyo State",
    biometric: { face: true, fingerprint: true },
  },
  {
    id: "HSH-IB-2026-000125",
    name: "Biodun Okafor",
    photo: "https://via.placeholder.com/150",
    regDate: "25/09/2025",
    status: "pending",
    primaryCrop: "Cassava",
    state: "Oyo",
    lga: "Egbeda",
    phone: "08034567890",
    cooperative: "Egbeda Farmers Union",
    farmSize: "3 hectares",
    landOwnership: "Communal",
    gender: "Male",
    dob: "10/11/1978",
    nin: "11223344556",
    address: "Odo-Ona, Ibadan, Oyo State",
    biometric: { face: true, fingerprint: false },
  },
  {
    id: "HSH-IB-2026-000126",
    name: "Yetunde Balogun",
    photo: "https://via.placeholder.com/150",
    regDate: "28/09/2025",
    status: "synced",
    primaryCrop: "Yam",
    state: "Oyo",
    lga: "Ona-Ara",
    phone: "08045678901",
    cooperative: "Ona-Ara Cooperative",
    farmSize: "1 hectare",
    landOwnership: "Family",
    gender: "Female",
    dob: "30/01/1995",
    nin: "66778899001",
    address: "Iwo Road, Ibadan, Oyo State",
    biometric: { face: true, fingerprint: true },
  },
];

export const agentFAQs = [
  {
    id: "1",
    question: "How do I register a new farmer?",
    answer:
      "Tap 'Register New Farmer' on the dashboard. Follow the 4-step process: Biometric → Personal Info → Farm Info → Cooperative. Review and submit.",
  },
  {
    id: "2",
    question: "What if there is no internet connection?",
    answer:
      "The app works fully offline. All data is saved locally and syncs automatically when you have internet.",
  },
  {
    id: "3",
    question: "How do I sync farmer data?",
    answer:
      "Tap 'Sync Now' on the dashboard or farmers list to upload all pending records.",
  },
  {
    id: "4",
    question: "Can I edit a farmer's profile after registration?",
    answer:
      "Yes. Open the farmer's detail screen, tap Edit, and update permitted fields.",
  },
  {
    id: "5",
    question: "What biometrics are required?",
    answer:
      "Face photo and fingerprint scan. Both must be captured before proceeding to personal info.",
  },
];

export const nigerianStates = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];
