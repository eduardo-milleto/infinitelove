import { InfiniteCounter } from '../InfiniteCounter';

const EDU_IMG = '/characters/edu.png';
const ISA_IMG = '/characters/isa.png';
const DOG_IMG = '/characters/dog.png';
const CAT_IMG = '/characters/cat.png';

const KEYFRAMES = `
@keyframes char-breathe { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-2px) scale(1.015); } }
@keyframes char-breathe-offset { 0%,100% { transform: translateY(-1px) scale(1); } 50% { transform: translateY(-4px) scale(1.02); } }
@keyframes dog-wag { 0%,100% { transform: scaleX(1); } 20% { transform: scaleX(1.04); } 40% { transform: translateX(2px); } 60% { transform: scaleX(0.98); } 80% { transform: translateX(-2px); } }
@keyframes cat-idle { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
@keyframes heart-bump { 0%,100% { transform: translateX(-50%) scale(1); opacity: 0.95; } 50% { transform: translateX(-50%) translateY(-4px) scale(1.18); opacity: 1; } }
@keyframes sway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
@keyframes twinkle { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
@keyframes cloud-drift { 0% { transform: translateX(-20vw); } 100% { transform: translateX(120vw); } }
@keyframes cloud-drift-2 { 0% { transform: translateX(120vw); } 100% { transform: translateX(-20vw); } }
`;

function GroundShadow({ width, bottom, left, opacity = 0.3 }: { width: number; bottom: string; left: string; opacity?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left,
        transform: 'translateX(-50%)',
        width,
        height: Math.max(6, width * 0.15),
        background: `radial-gradient(ellipse at center, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,0) 70%)`,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

export function HeroScene() {
  return (
    <div className="relative">
      <style>{KEYFRAMES}</style>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 420,
          minHeight: 360,
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #f5c8a0 0%, #e89a7a 38%, #e8dcc4 50%, #c8b896 100%)',
          borderRadius: 20,
          border: '3px solid #2d1a0f',
          boxShadow: '0 6px 0 rgba(45,26,15,0.18), inset 0 0 0 2px rgba(255,255,255,0.1)',
          imageRendering: 'pixelated',
        }}
      >
        {/* Sol */}
        <div
          style={{
            position: 'absolute',
            top: '18%',
            left: '18%',
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#fff6c0',
            boxShadow: '0 0 40px #ffd97a',
            zIndex: 1,
          }}
        />

        {/* Nuvens */}
        <div style={{ position: 'absolute', top: '14%', left: '10%', animation: 'cloud-drift 120s linear infinite', zIndex: 1 }}>
          <svg width="120" height="40" viewBox="0 0 30 10" shapeRendering="crispEdges">
            <rect x="4" y="3" width="22" height="5" fill="#fff" opacity="0.85" />
            <rect x="6" y="2" width="18" height="7" fill="#fff" opacity="0.85" />
            <rect x="10" y="1" width="10" height="2" fill="#fff" opacity="0.85" />
          </svg>
        </div>
        <div style={{ position: 'absolute', top: '24%', right: '15%', animation: 'cloud-drift-2 160s linear infinite', zIndex: 1 }}>
          <svg width="90" height="30" viewBox="0 0 30 10" shapeRendering="crispEdges">
            <rect x="4" y="3" width="22" height="5" fill="#fff" opacity="0.8" />
            <rect x="6" y="2" width="18" height="7" fill="#fff" opacity="0.8" />
          </svg>
        </div>

        {/* Parede */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '72%', background: 'linear-gradient(to bottom, #e4c8a0 0%, #d4b088 60%, #b8946a 100%)', zIndex: 2 }} />
        {/* moldura teto */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: '#6a3a1a', zIndex: 2 }} />
        {/* rodapé */}
        <div style={{ position: 'absolute', top: '70%', left: 0, right: 0, height: 6, background: '#5a3a1a', zIndex: 2, boxShadow: '0 2px 0 rgba(0,0,0,0.3)' }} />

        {/* Piso */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%', background: 'linear-gradient(to bottom, #a06a3a 0%, #7a4a24 100%)', zIndex: 2 }} />
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={`plank${i}`} style={{ position: 'absolute', bottom: 0, left: `${i * 7.5}%`, width: 2, height: '28%', background: 'rgba(60,30,10,0.5)', zIndex: 2 }} />
        ))}

        {/* Janela direita */}
        <div
          style={{
            position: 'absolute',
            top: '12%',
            right: '8%',
            width: 140,
            height: 130,
            background: 'linear-gradient(to bottom, #f5c8a0 0%, #e89a7a 50%, #c94c6a 100%)',
            border: '6px solid #2a1812',
            boxShadow: 'inset 0 0 0 2px #4a3a30, 4px 4px 0 rgba(0,0,0,0.3)',
            zIndex: 3,
          }}
        >
          <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', width: 28, height: 28, borderRadius: '50%', background: '#fff6c0', boxShadow: '0 0 24px #ffd97a' }} />
          <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '55%' }} viewBox="0 0 140 70" preserveAspectRatio="none" shapeRendering="crispEdges">
            <rect x="0" y="30" width="18" height="40" fill="#6a3a4a" />
            <rect x="18" y="15" width="22" height="55" fill="#7a4a5a" />
            <rect x="40" y="35" width="16" height="35" fill="#6a3a4a" />
            <rect x="56" y="8" width="28" height="62" fill="#8b5a6a" />
            <rect x="84" y="25" width="20" height="45" fill="#6a3a4a" />
            <rect x="104" y="5" width="36" height="65" fill="#8b5a6a" />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 3, background: '#2a1812', transform: 'translateY(-50%)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 3, background: '#2a1812', transform: 'translateX(-50%)' }} />
        </div>

        {/* Cortinas */}
        {[0, 6].map((off, i) => (
          <div key={`curtR${i}`} style={{ position: 'absolute', top: '10%', right: `calc(6% + ${off}px)`, width: 8, height: 145, background: 'linear-gradient(to right, #7a2a4a, #c94c6a, #8b3a5a)', animation: `sway 5s ease-in-out ${i * 0.2}s infinite`, transformOrigin: 'top center', zIndex: 3, opacity: 0.9 }} />
        ))}
        {[0, 6].map((off, i) => (
          <div key={`curtL${i}`} style={{ position: 'absolute', top: '10%', right: `calc(8% + 132px + ${off}px)`, width: 8, height: 145, background: 'linear-gradient(to right, #8b3a5a, #c94c6a, #7a2a4a)', animation: `sway 5s ease-in-out ${i * 0.2 + 0.3}s infinite`, transformOrigin: 'top center', zIndex: 3, opacity: 0.9 }} />
        ))}

        {/* Luzes de cordão */}
        {Array.from({ length: 14 }).map((_, i) => {
          const x = 4 + i * 6.8;
          const y = 5 + Math.sin(i * 0.8) * 1.5;
          return (
            <div
              key={`light${i}`}
              style={{
                position: 'absolute',
                top: `${y}%`,
                left: `${x}%`,
                width: 7,
                height: 9,
                background: '#ffd97a',
                borderRadius: '50% 50% 30% 30%',
                boxShadow: '0 0 8px #ffd97a, 0 0 16px rgba(255,217,122,0.5)',
                animation: `twinkle 2s ease-in-out ${i * 0.15}s infinite`,
                zIndex: 3,
              }}
            />
          );
        })}

        {/* Sofá central + casal */}
        <div style={{ position: 'absolute', bottom: '14%', left: '50%', transform: 'translateX(-50%)', zIndex: 4 }}>
          {/* casal atrás do encosto */}
          <div style={{ position: 'absolute', bottom: 46, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'flex-end' }}>
            <img
              src={EDU_IMG}
              alt="Eduardo"
              style={{ width: 120, height: 'auto', imageRendering: 'pixelated', animation: 'char-breathe 4s ease-in-out infinite' }}
            />
            <img
              src={ISA_IMG}
              alt="Isabella"
              style={{ width: 128, height: 'auto', imageRendering: 'pixelated', animation: 'char-breathe-offset 4.2s ease-in-out 0.4s infinite', marginLeft: -36 }}
            />
            {/* coração batendo */}
            <div style={{ position: 'absolute', top: -26, left: '50%', animation: 'heart-bump 1.4s ease-in-out infinite', fontSize: 22 }}>❤</div>
          </div>

          {/* sofá */}
          <div style={{ position: 'relative', width: 300, height: 74, background: '#c94c6a', borderRadius: '10px 10px 6px 6px', boxShadow: 'inset 0 -8px 0 rgba(0,0,0,0.22), 0 5px 0 #2a2220' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 28, background: 'linear-gradient(to bottom, #d95c7a, #b93c5a)', borderRadius: '10px 10px 0 0' }} />
            <div style={{ position: 'absolute', top: 28, left: 6, right: 6, height: 2, background: 'rgba(0,0,0,0.25)' }} />
            <div style={{ position: 'absolute', top: 34, left: 14, width: 36, height: 22, background: '#f0c040', borderRadius: 5 }} />
            <div style={{ position: 'absolute', top: 34, left: '50%', transform: 'translateX(-50%)', width: 36, height: 22, background: '#ede0c3', borderRadius: 5 }} />
            <div style={{ position: 'absolute', top: 34, right: 14, width: 36, height: 22, background: '#d97760', borderRadius: 5 }} />
            <div style={{ position: 'absolute', top: -4, left: -8, width: 12, height: 76, background: '#8b3a5a', borderRadius: 6 }} />
            <div style={{ position: 'absolute', top: -4, right: -8, width: 12, height: 76, background: '#8b3a5a', borderRadius: 6 }} />
            <div style={{ position: 'absolute', bottom: -7, left: 18, width: 8, height: 7, background: '#2a2220' }} />
            <div style={{ position: 'absolute', bottom: -7, right: 18, width: 8, height: 7, background: '#2a2220' }} />
          </div>
          <GroundShadow bottom="-12px" left="50%" width={320} opacity={0.32} />
        </div>

        {/* Cachorro esquerda */}
        <div style={{ position: 'absolute', bottom: '5%', left: '18%', zIndex: 5 }}>
          <img
            src={DOG_IMG}
            alt="chihuahua"
            style={{ width: 86, height: 'auto', imageRendering: 'pixelated', animation: 'dog-wag 3.2s ease-in-out infinite', display: 'block' }}
          />
          <GroundShadow bottom="-4px" left="50%" width={86} opacity={0.35} />
        </div>

        {/* Gato direita */}
        <div style={{ position: 'absolute', bottom: '5%', right: '22%', zIndex: 5 }}>
          <img
            src={CAT_IMG}
            alt="gato"
            style={{ width: 78, height: 'auto', imageRendering: 'pixelated', animation: 'cat-idle 5s ease-in-out infinite', display: 'block' }}
          />
          <GroundShadow bottom="-4px" left="50%" width={74} opacity={0.35} />
        </div>

        {/* Tapete */}
        <div
          style={{
            position: 'absolute',
            bottom: '3%',
            left: '22%',
            right: '22%',
            height: 22,
            background: 'repeating-linear-gradient(90deg, #c94c4c 0, #c94c4c 14px, #f0c040 14px, #f0c040 28px)',
            borderRadius: 3,
            opacity: 0.88,
            border: '2px solid #8b2a2a',
            zIndex: 2,
          }}
        />
      </div>

      {/* Counter overlay abaixo da cena */}
      <div className="mt-6">
        <InfiniteCounter />
      </div>
    </div>
  );
}
