export default function Header({ onSearchFocus }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  return <header className="header">
    <div><span className="header-label">Case Management</span><h1 className="header-title">Active Investigation Dashboard</h1></div>
    <div className="header-right">
      <div className="search-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input onFocus={onSearchFocus} type="text" placeholder="Search cases, suspects..."/></div>
      <button className="header-icon-btn" type="button" aria-label="Notifications"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg><span className="notification-dot"/></button>
      <span className="header-date">{today}</span>
    </div>
  </header>;
}
