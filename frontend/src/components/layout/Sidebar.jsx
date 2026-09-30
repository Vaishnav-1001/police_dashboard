const icons = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),

  casefiles: (
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  ),

  suspects: (
    <>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),

  map: (
    <>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </>
  ),

  alerts: (
    <>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </>
  ),

  reports: (
    <>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </>
  ),
};


export default function Sidebar({
  view,
  onNavigate,
  user,
  onLogout,
}) {
  const items = [
    ["dashboard", "Dashboard", "Dashboard"],
    ["casefiles", "Case Files", "Case Files"],
    ["placeholder:suspects", "Suspects", "Suspects"],
    ["placeholder:map", "Dispatch Map", "Dispatch Map"],
    ["placeholder:alerts", "Alerts", "Alerts"],
    ["placeholder:reports", "Reports", "Reports"],
  ];


  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <span className="logo-text">
          POLICE HUB
        </span>
      </div>


      <nav className="sidebar-nav">

        {items.map(([key, label, title]) => (
          <a
            key={key}
            href="#"
            className={`nav-item ${
              view === key ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(key, title);
            }}
          >

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {icons[key.split(":")[1] || key]}
            </svg>

            {label}

          </a>
        ))}

      </nav>


      <div className="sidebar-user">
  <div className="user-avatar">
    {user?.username?.slice(0, 2).toUpperCase() || "OF"}
  </div>

  <div className="sidebar-user-info">
    <span className="user-name">
      {user?.username || "Officer"}
    </span>

    <span className="user-badge">
    </span>
  </div>
</div>

<button
  type="button"
  className="logout-btn"
  onClick={onLogout}
>
  Logout
</button>

    </aside>
  );
}