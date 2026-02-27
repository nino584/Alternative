import { C, T } from '../constants/theme.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import Footer from '../components/layout/Footer.jsx';
import SEO from '../components/SEO.jsx';

export default function NotFoundPage({ setPage, L, mobile }) {
  return (
    <div style={{ paddingTop: mobile ? 56 : 80, minHeight: '100vh', background: C.cream, display: 'flex', flexDirection: 'column' }}>
      <SEO title="Page Not Found — Alternative" description="The page you're looking for doesn't exist." />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <p style={{ fontFamily: "'Alido',serif", fontSize: 80, color: C.lgray, marginBottom: 8, lineHeight: 1 }}>404</p>
          <h1 style={{ ...T.displaySm, color: C.black, marginBottom: 12 }}>
            {L?.pageNotFound || 'Page Not Found'}
          </h1>
          <p style={{ ...T.body, color: C.gray, lineHeight: 1.8, marginBottom: 32 }}>
            {L?.pageNotFoundDesc || "The page you're looking for doesn't exist or has been moved."}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <HoverBtn onClick={() => setPage('home')} variant="primary">
              {L?.goHome || 'Go Home'}
            </HoverBtn>
            <HoverBtn onClick={() => setPage('catalog')} variant="secondary">
              {L?.browseCatalog || 'Browse Catalog'}
            </HoverBtn>
          </div>
        </div>
      </div>
      <Footer setPage={setPage} L={L} mobile={mobile} />
    </div>
  );
}
