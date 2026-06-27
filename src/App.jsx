import { Routes, Route, NavLink } from 'react-router-dom'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import HomePage from './pages/HomePage'
import UsaWeatherPage from './pages/UsaWeatherPage'

// App is now just the "shell": a shared header (logo, theme toggle, nav) plus
// a <Routes> block that swaps in the right page based on the URL. The actual
// content lives in the page components under src/pages/.
//
// <BrowserRouter> (which provides routing) wraps <App> in main.jsx.
export default function App() {
  // NavLink gives us an `isActive` flag so we can highlight the current tab.
  const navClass = ({ isActive }) =>
    `nav-link${isActive ? ' is-active' : ''}`

  return (
    <main className="app">
      <header className="header">
        <h1 className="brand">
          <Logo className="logo" />
        </h1>

        <ThemeToggle />

        {/* Tabs. NavLink renders an <a> that updates the URL without a full
            page reload, and marks itself active when its `to` matches. */}
        <nav className="nav">
          <NavLink to="/" className={navClass} end>
            Host Cities
          </NavLink>
          <NavLink to="/usa" className={navClass}>
            USA at the World Cup
          </NavLink>
        </nav>
      </header>

      {/* Exactly one <Route> renders, based on the current path. */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/usa" element={<UsaWeatherPage />} />
      </Routes>
    </main>
  )
}
