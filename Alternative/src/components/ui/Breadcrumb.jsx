import { C, T } from '../../constants/theme.js';

export default function Breadcrumb({ items, setPage, mobile }) {
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" style={{ padding: mobile ? '12px 20px' : '12px 40px', maxWidth: 1360, margin: '0 auto' }}>
      <ol style={{ display: 'flex', alignItems: 'center', gap: 0, listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && <span style={{ ...T.labelSm, color: C.lgray, fontSize: 9, margin: '0 8px' }}>/</span>}
              {isLast ? (
                <span style={{ ...T.labelSm, color: C.black, fontSize: 9 }}>{item.label}</span>
              ) : (
                <button onClick={() => item.page ? setPage(item.page) : null}
                  style={{ ...T.labelSm, color: C.gray, fontSize: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.tan}
                  onMouseLeave={e => e.currentTarget.style.color = C.gray}>
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
