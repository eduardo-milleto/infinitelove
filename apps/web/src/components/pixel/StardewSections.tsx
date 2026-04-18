import { useState } from 'react';

// ============================================
// PixelSprite helper
// ============================================
type Palette = Record<string, string>;

function PixelSprite({
  data,
  palette,
  scale = 4,
  className = '',
  style = {},
}: {
  data: string;
  palette: Palette;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const rows = data.trim().split('\n').map((r) => r.trim());
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: w * scale,
        height: h * scale,
        imageRendering: 'pixelated',
        ...style,
      }}
    >
      <svg
        width={w * scale}
        height={h * scale}
        viewBox={`0 0 ${w} ${h}`}
        style={{ display: 'block', imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
      >
        {rows.map((row, y) =>
          row.split('').map((ch, x) => {
            const color = palette[ch];
            if (!color) return null;
            return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />;
          }),
        )}
      </svg>
    </div>
  );
}

const HEART_DATA = `
.rr..rr.
rRRrrRRr
rRRRRRRr
rRRRRRRr
.rRRRRr.
..rRRr..
...rr...
`;
const HEART_PALETTE: Palette = { r: '#a83250', R: '#ff6b8a' };

const MINI_HEART_DATA = `
rr.rr
rRRRr
.rRr.
..r..
`;
const MINI_HEART_PALETTE: Palette = { r: '#c94c4c', R: '#ff6b8a' };

const NOTE_DATA = `
...NN
...NN
...NN
..NNN
nnNN.
nnn..
.n...
`;
const NOTE_PALETTE: Palette = { n: '#2d1b3d', N: '#5a3a6b' };

const TREE_DATA = `
...gggggg...
..ggGGGGgg..
.ggGGGGGGgg.
ggGGGGGGGGgg
ggGGGGGGGGgg
.ggGGGGGGgg.
..ggGGGGgg..
...gggggg...
......bb....
......bb....
......bb....
.....bbbb...
`;
const TREE_PALETTE: Palette = { g: '#3d5c2a', G: '#5a8a3e', b: '#4a2c1a' };

const FLOWER_DATA = `
.p.p.
ppppp
pPOPp
ppppp
.p.p.
..g..
..g..
.ggg.
`;
const FLOWER_PALETTE: Palette = { p: '#ff9cbe', P: '#ffc4d8', O: '#f0c040', g: '#5a8a3e' };

const GIFT_DATA = `
..rRRRr..
.rRrrrRr.
rRRRRRRRr
rRryyyRRr
rRRyyyRRr
rRRRRRRRr
.rrrrrrr.
`;
const GIFT_PALETTE: Palette = { r: '#8b2a3a', R: '#c94c4c', y: '#f0c040' };

// ============================================
// TIMELINE
// ============================================
const TIMELINE = [
  { date: '18/04/2025', title: 'Level 1 — O começo', body: 'A gente se olhou e a quest principal começou.' },
  { date: '30/05/2025', title: 'Level 3 — Primeiro beijo', body: 'Cutscene em câmera lenta, com trilha sonora e tudo.' },
  { date: '15/07/2025', title: 'Level 5 — Show juntos', body: 'Braços levantados, voz rouca, coração cheio.' },
  { date: '08/10/2025', title: 'Level 7 — Primeira viagem', body: 'Dois achievements desbloqueados: "perder-se juntos" e "rir muito".' },
  { date: '22/12/2025', title: 'Level 9 — Natal a dois', body: 'Ceia, pijama, filme pela metade.' },
  { date: '18/04/2026', title: 'Boss final — 1 ano!', body: 'Você é a melhor recompensa deste jogo.' },
];

export function Timeline() {
  return (
    <section className="timeline-section" id="linhadotempo">
      <div className="section-label">LINHA DO TEMPO</div>
      <h2 className="section-title">como a gente foi evoluindo</h2>
      <div className="timeline">
        <div className="timeline-line" />
        {TIMELINE.map((t, i) => (
          <div key={i} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
            <div className="timeline-node" />
            <div className="timeline-card">
              <div className="timeline-date">{t.date}</div>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// CARTINHA
// ============================================
export function Letter() {
  return (
    <section className="letter-section" id="cartinha">
      <div className="section-label">CARTINHA</div>
      <h2 className="section-title">pra você ler devagar</h2>
      <div className="letter-scroll">
        <div className="letter-body">
          <p>Oi, meu amor.</p>
          <p>
            Se eu tentasse escrever tudo que eu sinto, faltaria linha. Mas vou tentar em poucas
            palavras: você é minha pessoa favorita. A pessoa que me faz rir quando eu nem tô afim,
            que entende meus silêncios, que divide o último pedaço de qualquer coisa comigo.
          </p>
          <p>
            Um ano parece pouco quando eu lembro de cada dia, e muito quando eu penso em tudo que a
            gente viveu. Você virou o lugar pra onde eu volto depois de qualquer dia difícil — meu
            save point.
          </p>
          <p>
            Obrigado por cada olhar, cada mensagem boba de manhã, cada abraço que segura mais
            apertado quando sabe que eu preciso. Obrigado por ser você, do seu jeitinho que eu amo
            tanto.
          </p>
          <p>
            Esse site é minha tentativa (meio nerd, meio apaixonada) de dizer: eu te escolheria de
            novo, em qualquer timeline, em qualquer save, em qualquer vale.
          </p>
          <p style={{ textAlign: 'right', fontStyle: 'italic' }}>— seu, pra sempre</p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// PLAYLIST
// ============================================
const PLAYLIST = [
  { title: 'a primeira música nossa', artist: '—', mood: 'suave', dur: '3:42' },
  { title: 'essa a gente cantou junto', artist: '—', mood: 'animada', dur: '4:18' },
  { title: 'aquela do carro', artist: '—', mood: 'noturna', dur: '3:55' },
  { title: 'a que eu lembro de você', artist: '—', mood: 'chorosa', dur: '4:02' },
  { title: 'a do domingo de manhã', artist: '—', mood: 'tranquila', dur: '3:30' },
];

export function Playlist() {
  const [playing, setPlaying] = useState<number | null>(null);
  return (
    <section className="playlist-section" id="playlist">
      <div className="section-label">TRILHA SONORA</div>
      <h2 className="section-title">nossas músicas</h2>
      <div className="playlist-box">
        <div className="playlist-header">
          <PixelSprite data={NOTE_DATA} palette={NOTE_PALETTE} scale={3} />
          <div>
            <div style={{ fontFamily: 'var(--pixel)', fontSize: 14, letterSpacing: 2 }}>
              NOSSAS MÚSICAS.MP3
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{PLAYLIST.length} faixas · edite depois</div>
          </div>
        </div>
        <ul className="playlist-list">
          {PLAYLIST.map((p, i) => (
            <li
              key={i}
              className={playing === i ? 'active' : ''}
              onClick={() => setPlaying(playing === i ? null : i)}
            >
              <span className="pl-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="pl-title">{p.title}</span>
              <span className="pl-mood">[{p.mood}]</span>
              <span className="pl-dur">{p.dur}</span>
              <span className="pl-play">{playing === i ? '▮▮' : '▶'}</span>
            </li>
          ))}
        </ul>
        {playing !== null && (
          <div className="playlist-progress">
            <div className="pp-bar" />
            <div style={{ fontSize: 11, fontFamily: 'var(--pixel)', marginTop: 6, opacity: 0.7 }}>
              ♪ tocando: {PLAYLIST[playing]?.title}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================
// MAPA
// ============================================
const PLACES = [
  { x: 22, y: 30, label: 'onde a gente se conheceu', date: 'mar/2025' },
  { x: 55, y: 42, label: 'primeiro encontro', date: 'abr/2025' },
  { x: 38, y: 65, label: 'primeira viagem', date: 'out/2025' },
  { x: 72, y: 28, label: 'show inesquecível', date: 'jul/2025' },
  { x: 65, y: 72, label: 'nosso restaurante', date: 'todo mês' },
  { x: 20, y: 75, label: 'praia do aniversário', date: 'abr/2026' },
];

export function MapSection() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="map-section" id="mapa">
      <div className="section-label">CARTOGRAFIA</div>
      <h2 className="section-title">lugares que a gente marcou</h2>
      <div className="map-container">
        <div className="map-bg">
          <div className="map-grid" />
          <svg className="map-path" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 22 30 Q 40 35, 55 42 T 72 28" stroke="#8b5a2c" strokeWidth="0.6" strokeDasharray="1 1.5" fill="none" />
            <path d="M 55 42 Q 50 55, 38 65 T 20 75" stroke="#8b5a2c" strokeWidth="0.6" strokeDasharray="1 1.5" fill="none" />
            <path d="M 38 65 Q 55 70, 65 72" stroke="#8b5a2c" strokeWidth="0.6" strokeDasharray="1 1.5" fill="none" />
          </svg>
          {PLACES.map((p, i) => (
            <button
              key={i}
              className={`map-pin ${active === i ? 'active' : ''}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={() => setActive(active === i ? null : i)}
              aria-label={p.label}
            >
              <div className="pin-heart">
                <PixelSprite data={MINI_HEART_DATA} palette={MINI_HEART_PALETTE} scale={3} />
              </div>
              {active === i && (
                <div className="pin-tooltip">
                  <div style={{ fontFamily: 'var(--pixel)', fontSize: 10, letterSpacing: 1, opacity: 0.7 }}>
                    {p.date.toUpperCase()}
                  </div>
                  <div>{p.label}</div>
                </div>
              )}
            </button>
          ))}
          <div style={{ position: 'absolute', top: '12%', left: '72%', transform: 'scale(0.7)' }}>
            <PixelSprite data={TREE_DATA} palette={TREE_PALETTE} scale={3} />
          </div>
          <div style={{ position: 'absolute', top: '55%', left: '8%', transform: 'scale(0.7)' }}>
            <PixelSprite data={TREE_DATA} palette={TREE_PALETTE} scale={3} />
          </div>
          <div style={{ position: 'absolute', top: '20%', left: '40%', transform: 'scale(0.6)' }}>
            <PixelSprite data={FLOWER_DATA} palette={FLOWER_PALETTE} scale={3} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// ACHIEVEMENTS
// ============================================
const ACHIEVEMENTS = [
  { icon: '💌', title: 'primeira mensagem', desc: 'Você mandou um "oi" que mudou tudo.', unlocked: true, rarity: 'comum' },
  { icon: '👀', title: 'primeiro olhar', desc: 'O tempo desacelerou.', unlocked: true, rarity: 'raro' },
  { icon: '💋', title: 'primeiro beijo', desc: 'Cutscene desbloqueada.', unlocked: true, rarity: 'épico' },
  { icon: '🎤', title: 'cantoria no chuveiro', desc: 'Você me viu no meu pior momento vocal.', unlocked: true, rarity: 'raro' },
  { icon: '🚗', title: 'road trip', desc: '500km de playlist e risada.', unlocked: true, rarity: 'épico' },
  { icon: '🛌', title: 'domingo preguiçoso', desc: 'O combo supremo: você + cobertor + pão.', unlocked: true, rarity: 'comum' },
  { icon: '🎂', title: '1 ano juntos', desc: 'Boss principal derrotado com louvor.', unlocked: true, rarity: 'lendário' },
  { icon: '💍', title: 'próximo nível', desc: '???', unlocked: false, rarity: 'lendário' },
];

export function Achievements() {
  return (
    <section className="ach-section" id="achievements">
      <div className="section-label">CONQUISTAS</div>
      <h2 className="section-title">achievements desbloqueados</h2>
      <div className="ach-grid">
        {ACHIEVEMENTS.map((a, i) => (
          <div key={i} className={`ach-card ${a.unlocked ? '' : 'locked'} rarity-${a.rarity}`}>
            <div className="ach-icon">{a.unlocked ? a.icon : '🔒'}</div>
            <div>
              <div className="ach-title">{a.unlocked ? a.title : '???'}</div>
              <div className="ach-desc">{a.desc}</div>
              <div className="ach-rarity">{a.rarity}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// INVENTORY
// ============================================
const INVENTORY = [
  { icon: '🌹', name: 'rosa murchinha', qty: 1, desc: 'Aquela do primeiro encontro. Prensada num livro.' },
  { icon: '🎫', name: 'ingresso do cinema', qty: 2, desc: 'Filme esquecido, mão dada gravada na memória.' },
  { icon: '📷', name: 'polaroid', qty: 7, desc: 'Cada uma vale mil emojis.' },
  { icon: '🧸', name: 'ursinho', qty: 1, desc: 'Ganhou nome no segundo dia.' },
  { icon: '✉️', name: 'bilhete secreto', qty: 3, desc: '"Boa sorte hoje" dentro da mochila.' },
  { icon: '🍫', name: 'embalagem guardada', qty: 1, desc: 'Do primeiro chocolate que a gente dividiu.' },
  { icon: '🔑', name: 'chave extra', qty: 1, desc: 'A da sua casa. Significa tudo.' },
  { icon: '⭐', name: 'estrela de memória', qty: 99, desc: 'Coletável infinito.' },
];

export function Inventory() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <section className="inv-section" id="inventario">
      <div className="section-label">INVENTÁRIO</div>
      <h2 className="section-title">coisas que eu guardo de você</h2>
      <div className="inv-wrapper">
        <div className="inv-grid">
          {Array.from({ length: 24 }).map((_, i) => {
            const item = INVENTORY[i];
            return (
              <button
                key={i}
                className={`inv-slot ${selected === i ? 'selected' : ''}`}
                onClick={() => item && setSelected(selected === i ? null : i)}
                disabled={!item}
              >
                {item && (
                  <>
                    <div className="inv-icon">{item.icon}</div>
                    {item.qty > 1 && <div className="inv-qty">{item.qty}</div>}
                  </>
                )}
              </button>
            );
          })}
        </div>
        <div className="inv-detail">
          {selected !== null && INVENTORY[selected] ? (
            <>
              <div className="inv-detail-icon">{INVENTORY[selected].icon}</div>
              <div className="inv-detail-name">{INVENTORY[selected].name}</div>
              <div className="inv-detail-desc">{INVENTORY[selected].desc}</div>
              {INVENTORY[selected].qty > 1 && (
                <div className="inv-detail-qty">× {INVENTORY[selected].qty}</div>
              )}
            </>
          ) : (
            <div style={{ opacity: 0.5, textAlign: 'center', padding: 20, fontSize: 13 }}>
              Clique num item pra ler a história dele.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FINAL CARD
// ============================================
export function FinalCard() {
  const [opened, setOpened] = useState(false);
  return (
    <section className="final-section" id="final">
      <div className="section-label">CARTA FINAL</div>
      <h2 className="section-title">uma surpresa</h2>
      <div className="final-wrap">
        {!opened ? (
          <button className="gift-button" onClick={() => setOpened(true)}>
            <div style={{ animation: 'gift-bounce 1.5s ease-in-out infinite' }}>
              <PixelSprite data={GIFT_DATA} palette={GIFT_PALETTE} scale={8} />
            </div>
            <div className="gift-label">abrir presente</div>
          </button>
        ) : (
          <div className="final-open">
            <div className="final-hearts">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    animation: `heart-burst 1.2s ease-out ${i * 0.05}s forwards`,
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    ['--angle' as any]: `${i * 45}deg`,
                  }}
                >
                  <PixelSprite data={HEART_DATA} palette={HEART_PALETTE} scale={3} />
                </div>
              ))}
            </div>
            <div className="final-text">
              <div
                style={{
                  fontFamily: 'var(--pixel)',
                  fontSize: 20,
                  letterSpacing: 3,
                  color: '#c94c4c',
                  marginBottom: 16,
                }}
              >
                ★ RECOMPENSA FINAL ★
              </div>
              <p style={{ fontSize: 22, lineHeight: 1.5 }}>
                Feliz 1 ano, meu amor. Que venham mais mil saves juntos.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                <div style={{ animation: 'heart-pulse 1.2s ease-in-out infinite' }}>
                  <PixelSprite data={HEART_DATA} palette={HEART_PALETTE} scale={5} />
                </div>
                <div style={{ animation: 'heart-pulse 1.2s ease-in-out 0.2s infinite' }}>
                  <PixelSprite data={HEART_DATA} palette={HEART_PALETTE} scale={5} />
                </div>
                <div style={{ animation: 'heart-pulse 1.2s ease-in-out 0.4s infinite' }}>
                  <PixelSprite data={HEART_DATA} palette={HEART_PALETTE} scale={5} />
                </div>
              </div>
              <button className="pixel-btn" style={{ marginTop: 32 }} onClick={() => setOpened(false)}>
                fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
