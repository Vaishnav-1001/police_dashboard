import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({
  view,
  onNavigate,
  children,
  onSearchFocus,
  user,
  onLogout,
}) {
  return (
    <>
      <Sidebar
        view={view}
        onNavigate={onNavigate}
        user={user}
        onLogout={onLogout}
      />

      <main className="main">
        <Header
          onSearchFocus={onSearchFocus}
          user={user}
        />

        <div className="content">
          {children}
        </div>
      </main>

      <button
        className="help-btn"
        title="Help"
        type="button"
      >
        ?
      </button>
    </>
  );
}