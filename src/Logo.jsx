// The Pitch Conditions logo. It's a transparent PNG in /public, so we just
// reference it by URL. `className` flows onto the <img> for responsive sizing
// (see .logo in index.css). alt text gives screen readers the name.
export default function Logo({ className }) {
  return <img src="/logo.png" alt="Pitch Conditions" className={className} />
}
