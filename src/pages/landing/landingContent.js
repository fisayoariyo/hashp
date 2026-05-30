export const LANDING_NAV_ITEMS = [
  { label: "About HFEI", href: "#about-hfei" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQs", href: "#faqs" },
];

export const LANDING_ABOUT_IMAGES = [
  {
    src: "/landing/images/about-left-agent.png",
    alt: "Farmer carrying produce in the field",
  },
  {
    src: "/landing/images/about-right-farmer.png",
    alt: "Farmers standing together outdoors",
  },
];

export const LANDING_TABS = {
  agents: {
    key: "agents",
    label: "Agents",
    title: "Built for Field Agents Working in Rural Communities",
    description:
      "The Hashmar Agent WebApp gives field officers the tools they need to register and support farmers directly from the field, even in areas with poor internet connectivity.",
    cards: [
      {
        title: "Biometric Capture",
        description: "Capture fingerprint and face for identity verification",
        icon: "/landing/icons/finger-access.svg",
      },
      {
        title: "Personal Information Collection",
        description: "Enter the farmer's basic details and identification number.",
        icon: "/landing/icons/profile.svg",
      },
      {
        title: "Farm Information Collection",
        description: "Provide details about the farm and crop type.",
        icon: "/landing/icons/tractor.svg",
      },
      {
        title: "Cooperative & Association Record",
        description: "Add cooperative details if the farmer belongs to one",
        icon: "/landing/icons/user-group.svg",
      },
      {
        title: "Review & Submit Information",
        description: "Confirm all details and complete registration.",
        icon: "/landing/icons/tick-double.svg",
      },
    ],
    cta: {
      title: "Register as an Agent",
      href: "/agent/create-account",
      image: "/landing/images/agent-card-cta.png",
      alt: "Agent registration call to action",
      position: "center",
    },
  },
  farmers: {
    key: "farmers",
    label: "Farmers",
    title: "Helping Farmers Access More Than Just Farming Tools",
    description:
      "The Hashmar Farmer WebApp gives farmers visibility, access, and support through a digital platform designed to improve productivity and unlock financial opportunities.",
    cards: [
      {
        title: "Digital Farmer Identity",
        description:
          "Every farmer gets a verified digital ID linked to their farm records before loging in to the webapp",
        icon: "/landing/icons/id-card-lanyard.svg",
      },
      {
        title: "Farm & Yield Tracking",
        description: "Access your profile, farming support, and opportunities in one place.",
        icon: "/landing/icons/check-list.svg",
      },
      {
        title: "Training & Advisory Support",
        description:
          "Get farming guidance and support for better decisions and productivity.",
        icon: "/landing/icons/brain-02.svg",
      },
      {
        title: "Financing Opportunities",
        description: "Verified farmer data helps unlock financing and loan opportunities.",
        icon: "/landing/icons/money-04.svg",
      },
      {
        title: "Market Access",
        description:
          "Connect to markets and storage solutions that improve earnings and reduce losses.",
        icon: "/landing/icons/store-01.svg",
      },
    ],
    cta: {
      title: "Get started as a farmer",
      buttonLabel: "Get started",
      href: "/farmer/get-started",
      returnState: { returnTo: "/" },
      image: "/landing/images/farmer-card-cta.png",
      alt: "Farmer get started call to action",
      position: "62% 48%",
    },
  },
};

export const LANDING_CONTACT = {
  title: "Get in touch with us",
  description:
    "Have questions, inquiries, or need Hashmar services in your community? Reach out to us and let us know how we can support farmers and agricultural activities in your area. Our team is ready to help bring digital farming solutions closer to you.",
  image: {
    src: "/landing/images/contact-field.png",
    alt: "Farmer working in a green field",
  },
};

export const LANDING_FAQS = [
  {
    question: "What is Hashmar Farmer Empowerment Initiative (HFEI)?",
    answer:
      "HFEI is Hashmar's digital agriculture initiative focused on helping farmers and field agents work with verified identities, farm data, and better access to support services.",
  },
  {
    question: "Who can use the Hashmar platform?",
    answer:
      "The platform is designed for field agents registering and supporting farmers, and for farmers who need a digital identity, visibility into their records, and access to services.",
  },
  {
    question: "What does the Agent App do?",
    answer:
      "The Agent App helps field officers capture biometrics, collect personal and farm details, record cooperative information, and submit verified farmer registrations from the field.",
  },
  {
    question: "What does the Farmer App provide?",
    answer:
      "The Farmer App gives farmers access to their verified digital identity, farm and yield information, advisory support, market opportunities, and financing pathways.",
  },
  {
    question: "Can the Agent App work without internet access?",
    answer:
      "It is designed for rural work environments and supports field workflows in low-connectivity settings, with registration data captured first and synced when connectivity is available.",
  },
  {
    question: "Why is farm mapping important?",
    answer:
      "Farm mapping improves visibility into farm activity, supports better planning, and makes it easier to connect verified production data to training, financing, and market access.",
  },
  {
    question: "How does Hashmar help farmers access financing?",
    answer:
      "By combining verified digital identity and farm data, Hashmar creates trusted records that can help unlock more relevant financing and loan opportunities.",
  },
  {
    question: "Is farmer data secure on the platform?",
    answer:
      "The platform is built around verified digital identities and structured records so farmer information can be managed more consistently and shared with clearer accountability.",
  },
];

export const LANDING_FOOTER_GROUPS = [
  {
    title: "Quick Links",
    links: [
      { label: "About", href: "#about-hfei" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "FAQs", href: "#faqs" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Become an Agent", href: "/agent/create-account" },
      { label: "Login as a farmer", href: "/farmer/verify" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Use", href: "#" },
      { label: "Data Protection", href: "#" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "support@hashmar.com", href: "mailto:support@hashmar.com" },
      { label: "08133905285", href: "tel:08133905285" },
    ],
  },
];

export const LANDING_SOCIAL_LINKS = [
  {
    label: "WhatsApp",
    href: "https://wa.me/2348133905285",
    icon: "/landing/icons/whatsapp.svg",
  },
  {
    label: "Facebook",
    href: "#",
    icon: "/landing/icons/facebook.svg",
  },
  {
    label: "X",
    href: "#",
    icon: "/landing/icons/x.svg",
  },
];
