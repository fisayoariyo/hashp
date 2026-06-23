const CONTACT_EMAIL = "hashmarfarms@gmail.com";
const CONTACT_PHONE = "08153953002";

function section(id, title, paragraphs, list) {
  return { id, title, paragraphs, list };
}

export const LEGAL_PAGES = {
  "privacy-policy": {
    path: "/privacy-policy",
    title: "HFEI Privacy Policy",
    welcomeTitle: "Welcome to our privacy policy",
    effectiveDate: "June 2, 2026",
    welcomeParagraphs: [
      "At Hashmar (\"we,\" \"our,\" or \"us\"), we are committed to protecting the privacy of farmers, field agents, partners, and users who access the HFEI platform.",
      "Hashmar provides a digital farmer identity and empowerment platform used by field agents and farmers for farmer registration, farm mapping, productivity monitoring, financial inclusion, and other agricultural services.",
    ],
    sections: [
      section("introduction", "Introduction", [
        "This privacy policy explains how we collect, use, store, and protect personal information when you use the HFEI website, agent web application, farmer web application, and related services (collectively, the \"Platform\").",
        "By using the Platform, you acknowledge that you have read and understood this privacy policy. If you do not agree with this policy, please do not use the Platform.",
      ]),
      section("data-collection", "Data collection", [
        "We collect information directly from users, through field agents during farmer registration, and automatically when the Platform is used.",
        "Information may be captured online or offline and synchronized when connectivity becomes available.",
      ], [
        "Personal details provided during account creation, verification, or support requests.",
        "Biometric data captured during approved identity verification workflows.",
        "Farm records, cooperative information, and location data submitted during registration.",
        "Technical logs such as IP address, browser type, device identifiers, and usage activity.",
      ]),
      section("types-of-data", "Types of data", [
        "Depending on your role on the Platform, we may process the following categories of data:",
      ], [
        "Identity and contact data, including name, phone number, email address, and residential or farm location.",
        "Biometric data, including fingerprint and facial images used for verification.",
        "Agricultural data, including farm size, crop type, yield records, and mapping information.",
        "Account and authentication data, including login credentials and verification codes.",
        "Communications and support records related to your use of the Platform.",
      ]),
      section("use-of-data", "Use of data", [
        "We use personal information to operate, secure, and improve the Platform, including:",
      ], [
        "Creating and managing agent and farmer accounts.",
        "Verifying identities and maintaining trusted farmer records.",
        "Enabling offline registration and later synchronization.",
        "Providing support, service notifications, and platform updates.",
        "Complying with legal obligations and enforcing our terms.",
      ]),
      section("third-party-services", "Third party services", [
        "We may share information with trusted service providers that help us host, secure, verify, communicate, or operate the Platform. These providers are permitted to process information only as needed to deliver services to us.",
        "The Platform may also link to third-party websites or services that are not operated by Hashmar. We are not responsible for the privacy practices of those third parties and encourage you to review their policies before sharing personal information.",
        `For privacy questions or requests, contact us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`,
      ]),
    ],
  },
  "terms-of-use": {
    path: "/terms-of-use",
    title: "HFEI Terms of Use",
    welcomeTitle: "Welcome to our Terms of Use",
    effectiveDate: "June 2, 2026",
    welcomeParagraphs: [
      "These Terms of Use govern your access to and use of the HFEI website, agent web application, farmer web application, and related services operated by Hashmar through the HFEI platform.",
      "The Platform is designed for field agents and farmers in rural communities and may support offline capture with later synchronization when connectivity is available.",
    ],
    sections: [
      section("introduction", "Introduction", [
        "By accessing or using the Platform, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not use the Platform.",
        "These Terms apply to all use of the Platform on mobile and desktop devices.",
      ]),
      section("user-eligibility", "User eligibility", [
        "You must be at least 18 years old to create an agent account or act as an authorized field agent on the Platform.",
        "Farmers may access the Platform only after verification through approved registration and identity workflows. Agents must obtain any consent required by applicable law before submitting personal, biometric, or farm information on behalf of farmers.",
      ]),
      section("use-of-platform", "Use of the platform", [
        "Subject to these Terms, Hashmar grants you a limited, non-exclusive, non-transferable, revocable license to use the Platform for agricultural registration, verification, and support purposes.",
        "You may not use the Platform for unlawful, misleading, harmful, or unauthorized commercial purposes.",
      ]),
      section("user-content", "User content", [
        "You may submit information, documents, images, biometric data, and farm records through the Platform. You retain ownership of your content, but grant Hashmar a license to use, store, process, and display it as necessary to operate the Platform and deliver services.",
        "You represent that you have all rights and consents needed to submit content, including data collected on behalf of farmers.",
      ]),
      section("third-party-services", "Third party services", [
        "The Platform may integrate with or link to third-party services such as identity verification tools, messaging providers, hosting infrastructure, or financing partners. Hashmar does not control third-party services, and your use of them may be subject to separate terms.",
        "We may suspend or terminate access where we reasonably believe these Terms have been violated or where required by law.",
        `For questions about these Terms, contact us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`,
      ]),
    ],
  },
  "data-protection": {
    path: "/data-protection",
    title: "HFEI Data Protection",
    welcomeTitle: "Welcome to our data protection notice",
    effectiveDate: "June 2, 2026",
    welcomeParagraphs: [
      "This notice explains how Hashmar processes personal data in connection with the HFEI platform, including the website, agent web application, and farmer web application.",
      "It applies to field agents, farmers, website visitors, and other individuals whose personal data we process, and should be read together with our Privacy Policy and Terms of Use.",
    ],
    sections: [
      section("introduction", "Introduction", [
        "Hashmar is committed to processing personal data lawfully, fairly, and transparently in support of digital farmer identity, farm data management, and improved access to agricultural services.",
        "By using the Platform, you acknowledge the data processing practices described in this notice.",
      ]),
      section("who-we-are", "Who we are", [
        "Hashmar operates the HFEI Farmer Empowerment Initiative platform for verified farmer registration, field agent workflows, and related agricultural services.",
        `For data protection enquiries, contact us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`,
      ]),
      section("information-we-collect", "Information we collect", [
        "We process personal data that is necessary to deliver our services, including:",
      ], [
        "Identification and contact details for agents and farmers.",
        "Biometric data captured during approved verification workflows.",
        "Farm location, crop, cooperative, and production-related records.",
        "Technical logs, device information, and usage activity.",
        "Support communications and consent records where applicable.",
      ]),
      section("how-we-use-data", "How we use your data", [
        "We process personal data to provide and maintain the Platform, register farmers, secure accounts, support offline registration, improve service quality, and respond to support requests.",
        "We retain personal data only for as long as necessary for these purposes and applicable legal requirements.",
      ]),
      section("your-rights", "Your rights", [
        "Depending on applicable law, you may have the right to request access, correction, deletion, restriction, portability, or objection to certain processing of your personal data, and to withdraw consent where processing is based on consent.",
        "We may share personal data with service providers and partners that help us operate the Platform, subject to contractual safeguards. We do not sell personal data.",
        `To exercise your rights or ask questions about this notice, contact us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`,
      ]),
    ],
  },
};

export const LEGAL_PAGE_LIST = Object.values(LEGAL_PAGES);
