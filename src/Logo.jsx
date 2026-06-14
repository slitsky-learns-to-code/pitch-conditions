// The "Pitch Conditions" wordmark + soccer-ball logo, as an inline SVG
// component. Inlining (vs. an <img> tag) keeps it crisp at any size and lets
// CSS control the dimensions. The `className` flows onto the <svg> so the
// stylesheet can size it responsively (see .logo in index.css).
//
// role="img" + aria-label give screen readers a single readable name for the
// whole graphic instead of trying to announce each shape.
export default function Logo({ className }) {
  return (
    <svg
      viewBox="0 0 680 130"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Pitch Conditions"
    >
      <text
        x="0"
        y="62"
        fill="currentColor"
        fontFamily="sans-serif"
        fontSize="52"
        fontWeight="700"
        letterSpacing="-0.5"
      >
        Pitch Conditions
      </text>
      <g transform="translate(480, 5)">
        <circle cx="34" cy="34" r="34" fill="#ffffff" stroke="#0a1428" strokeWidth="1.5" />
        <polygon points="34,18 47,27.5 42,43 26,43 21,27.5" fill="#13213d" />
        <polygon points="34,18 47,27.5 56,21 50,9 39,11" fill="none" stroke="#13213d" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="47,27.5 42,43 53,52 63,42 56,29" fill="none" stroke="#13213d" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="42,43 26,43 22,55 34,62 46,55" fill="none" stroke="#13213d" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="26,43 21,27.5 12,29 5,42 15,52" fill="none" stroke="#13213d" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="21,27.5 34,18 29,11 18,9 12,21" fill="none" stroke="#13213d" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="34" y1="18" x2="34" y2="4" stroke="#13213d" strokeWidth="1.5" />
        <line x1="47" y1="27.5" x2="60" y2="22" stroke="#13213d" strokeWidth="1.5" />
        <line x1="42" y1="43" x2="52" y2="54" stroke="#13213d" strokeWidth="1.5" />
        <line x1="26" y1="43" x2="20" y2="56" stroke="#13213d" strokeWidth="1.5" />
        <line x1="21" y1="27.5" x2="8" y2="24" stroke="#13213d" strokeWidth="1.5" />
      </g>
    </svg>
  )
}
