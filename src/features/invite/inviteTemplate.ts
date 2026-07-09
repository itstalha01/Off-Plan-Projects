// TEMP: Bahria Sky One "Mega Open House" invite (Corner Brick Group event).
// Ported from the original standalone HTML so it can be personalised with a
// client name and rendered to a PDF client-side. Remove after the event —
// see InviteDownload.tsx and the banners on the home / partner pages.

/** Escape a user-supplied string for safe interpolation into innerHTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Google Fonts used by the invite (loaded on demand before rendering).
export const INVITE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,600&family=Inter:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@600;700&display=swap";

// All selectors are scoped under #invite-render so nothing leaks into the app
// while the node is briefly mounted off-screen for capture.
const INVITE_CSS = `
#invite-render{
  --cream:#FBF8F3; --ink:#191512; --maroon:#A31E22; --terracotta:#B0603A;
  --gold:#C79A4B; --gold-soft:#E7D3A1; --line:rgba(25,21,18,0.12);
  width:640px; font-family:'Inter',sans-serif;
}
#invite-render *{ box-sizing:border-box; margin:0; padding:0; }
#invite-render .card{
  width:640px; background:var(--cream); border:1px solid var(--line);
  border-radius:2px; overflow:hidden; position:relative;
}
#invite-render .brands{ display:flex; align-items:center; justify-content:center; gap:22px; padding:30px 20px 18px; }
#invite-render .brand{ display:flex; flex-direction:column; align-items:center; gap:6px; }
#invite-render .brand .mark{ width:44px; height:44px; border-radius:50%; border:1.5px solid var(--ink); display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; font-weight:700; font-size:15px; color:var(--ink); }
#invite-render .brand .mark.alt{ border-color:var(--maroon); color:var(--maroon); }
#invite-render .brand .name{ font-size:10.5px; font-weight:700; letter-spacing:0.08em; color:var(--ink); text-align:center; }
#invite-render .brand .sub{ font-size:7.5px; letter-spacing:0.14em; color:#8a8078; }
#invite-render .divider-v{ width:1px; height:46px; background:var(--line); }
#invite-render .for-you{ margin:0 28px 6px; border-top:1px solid var(--gold-soft); border-bottom:1px solid var(--gold-soft); padding:14px 4px; text-align:center; }
#invite-render .for-you .eyebrow{ font-size:10px; letter-spacing:0.22em; color:var(--terracotta); font-weight:600; text-transform:uppercase; }
#invite-render .for-you .name-line{ margin-top:6px; font-family:'Playfair Display',serif; font-style:italic; font-weight:600; font-size:26px; color:var(--ink); padding-bottom:4px; display:inline-block; min-width:220px; }
#invite-render .for-you .hint{ margin-top:8px; font-size:9.5px; color:#a89c8a; letter-spacing:0.03em; }
#invite-render .urdu-headline{ font-family:'Noto Nastaliq Urdu',serif; color:var(--maroon); text-align:center; font-size:30px; line-height:1.5; padding:18px 24px 4px; font-weight:700; }
#invite-render .urdu-headline.english-headline{ font-family:'Playfair Display',serif; font-style:italic; font-size:22px; letter-spacing:0.02em; line-height:1.3; }
#invite-render .mega{ text-align:center; margin:6px 0 2px; }
#invite-render .mega span{ background:var(--maroon); color:#fff; font-family:'Playfair Display',serif; font-weight:900; letter-spacing:0.14em; font-size:14px; padding:4px 16px; }
#invite-render h1.event-title{ text-align:center; font-family:'Playfair Display',serif; font-weight:900; font-size:40px; letter-spacing:0.01em; margin:8px 10px 4px; color:var(--ink); }
#invite-render h1.event-title .accent{ color:var(--maroon); }
#invite-render .subtitle{ text-align:center; font-family:'Playfair Display',serif; font-size:16px; color:#3a332c; line-height:1.5; margin:0 0 14px; }
#invite-render .rule{ width:120px; height:1px; background:var(--line); margin:0 auto 16px; }
#invite-render .datetime{ display:flex; align-items:center; justify-content:center; gap:14px; flex-wrap:wrap; padding:0 16px 14px; font-family:'Playfair Display',serif; font-weight:600; font-size:16px; color:var(--ink); }
#invite-render .datetime .sep{ width:1px; height:20px; background:var(--line); }
#invite-render .pill{ background:var(--maroon); color:#fff; font-family:'Inter',sans-serif; font-weight:700; padding:3px 9px; border-radius:3px; font-size:14px; }
#invite-render .ord{ font-size:9px; vertical-align:super; }
#invite-render .urdu-welcome{ font-family:'Noto Nastaliq Urdu',serif; text-align:center; color:var(--ink); font-size:22px; line-height:1.9; padding:22px 20px 24px; }
#invite-render .monument{ position:relative; height:230px; margin:0 0 4px; display:flex; align-items:flex-end; justify-content:center; background:linear-gradient(to top, #e9e1d3 0%, transparent 70%); }
#invite-render .minaret{ width:16px; background:linear-gradient(180deg,var(--terracotta),#8a4326); height:190px; border-radius:8px 8px 0 0; position:relative; margin:0 96px; }
#invite-render .minaret::after{ content:""; position:absolute; top:-16px; left:50%; transform:translateX(-50%); width:22px; height:16px; background:var(--gold); border-radius:50% 50% 0 0; }
#invite-render .dome-wrap{ display:flex; flex-direction:column; align-items:center; margin-bottom:0; }
#invite-render .dome{ width:120px; height:100px; background:linear-gradient(180deg,#f2ede2,#cfc4ab); border-radius:100px 100px 0 0; position:relative; }
#invite-render .dome::after{ content:""; position:absolute; top:-14px; left:50%; transform:translateX(-50%); width:14px; height:16px; background:var(--gold); border-radius:4px; }
#invite-render .base{ width:200px; height:70px; background:linear-gradient(180deg,var(--terracotta),#7a3a20); margin-top:-2px; position:relative; border-radius:2px 2px 0 0; }
#invite-render .base::before{ content:""; position:absolute; top:8px; left:50%; transform:translateX(-50%); width:34px; height:56px; background:#4a2413; border-radius:16px 16px 0 0; }
#invite-render .tea{ background:#fff; text-align:center; font-family:'Playfair Display',serif; font-weight:600; font-size:15px; color:var(--ink); padding:12px 16px; border-top:1px solid var(--line); margin-top:8px; }
#invite-render .venue{ background:var(--ink); color:var(--gold-soft); text-align:center; font-size:12.5px; letter-spacing:0.03em; padding:10px 16px; font-weight:500; }
#invite-render .venue a{ color:inherit; text-decoration:underline; text-underline-offset:2px; text-decoration-color:rgba(231,211,161,0.5); }
`;

/**
 * Build the full invite markup (scoped styles + card) with the client name
 * baked in. When `name` is blank the eyebrow/name line is omitted so the PDF
 * doesn't show an empty personalised ribbon.
 */
export function buildInviteHtml(name: string): string {
  const trimmed = name.trim();
  const forYou = trimmed
    ? `<div class="for-you">
        <div class="eyebrow">This invitation is Exclusive for</div>
        <div class="name-line">${escapeHtml(trimmed)}</div>
      </div>`
    : "";

  return `
<div id="invite-render">
  <style>${INVITE_CSS}</style>
  <div class="card">
    <div class="brands">
      <div class="brand">
        <div class="mark">OZ</div>
        <div class="name">OZ DEVELOPERS</div>
        <div class="sub">PVT. LTD — RISING BEYOND</div>
      </div>
      <div class="divider-v"></div>
      <div class="brand">
        <div class="mark alt">CB</div>
        <div class="name">CORNER BRICK GROUP</div>
        <div class="sub">&nbsp;</div>
      </div>
    </div>
    ${forYou}
    <div class="urdu-headline english-headline">CORNER BRICK GROUP IS COMING</div>
    <div class="mega"><span>MEGA</span></div>
    <h1 class="event-title">OPEN <span class="accent">HOUSE</span> EVENT</h1>
    <p class="subtitle">At Bahria Sky One<br>Presented By CB Group</p>
    <div class="rule"></div>
    <div class="datetime">
      <span>Sunday <span class="pill">12<span class="ord">th</span> July</span></span>
      <span class="sep"></span>
      <span>Time <span class="pill">1 PM</span> to <span class="pill">9 PM</span></span>
    </div>
    <div class="urdu-welcome">آپ کو خوش آمدید کہتے ہیں</div>
    <div class="monument">
      <div class="minaret"></div>
      <div class="dome-wrap">
        <div class="dome"></div>
        <div class="base"></div>
      </div>
      <div class="minaret"></div>
    </div>
    <div class="tea">Exclusive Hi‑Tea Get Together For Investors &amp; Business Owners</div>
    <div class="venue"><a href="https://share.google/j6UU0S7HI3nNDRzum" target="_blank" rel="noopener noreferrer">📍 Bahria Sky One, Phase 4, Bahria Orchard Lahore</a></div>
  </div>
</div>`;
}
