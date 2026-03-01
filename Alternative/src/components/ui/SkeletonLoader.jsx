import { C } from '../../constants/theme.js';

const shimmer = `
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`;

const skeletonStyle = {
  background: `linear-gradient(90deg, ${C.offwhite} 0%, ${C.cream} 50%, ${C.offwhite} 100%)`,
  backgroundSize: '800px 100%',
  animation: 'shimmer 1.5s ease-in-out infinite',
};

export function SkeletonBox({ width, height, style }) {
  return (
    <>
      <style>{shimmer}</style>
      <div style={{ width: width || '100%', height: height || 20, ...skeletonStyle, ...style }} />
    </>
  );
}

export function SkeletonProductCard({ mobile }) {
  return (
    <div style={{ background: C.offwhite }}>
      <style>{shimmer}</style>
      <div style={{ width: '100%', aspectRatio: '3/4', ...skeletonStyle }} />
      <div style={{ padding: mobile ? 12 : 16 }}>
        <div style={{ height: 8, width: '40%', marginBottom: 8, ...skeletonStyle }} />
        <div style={{ height: 12, width: '70%', marginBottom: 8, ...skeletonStyle }} />
        <div style={{ height: 14, width: '30%', ...skeletonStyle }} />
      </div>
    </div>
  );
}

export function SkeletonProductGrid({ count = 8, mobile }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 3 }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} mobile={mobile} />
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3, style }) {
  return (
    <div style={style}>
      <style>{shimmer}</style>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ height: 12, width: i === lines - 1 ? '60%' : '100%', marginBottom: 10, ...skeletonStyle }} />
      ))}
    </div>
  );
}
