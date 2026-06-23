import { Navigate, useLocation } from "react-router-dom";
import LegalPageLayout from "../../components/legal/LegalPageLayout";
import { LEGAL_PAGES } from "./legalContent";

const PATH_TO_SLUG = Object.fromEntries(
  Object.entries(LEGAL_PAGES).map(([slug, page]) => [page.path, slug]),
);

export default function LegalPage() {
  const { pathname } = useLocation();
  const page = LEGAL_PAGES[PATH_TO_SLUG[pathname]];

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return <LegalPageLayout page={page} />;
}
