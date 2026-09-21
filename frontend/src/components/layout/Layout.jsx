import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ view, onNavigate, children, onSearchFocus }) {
  return <><Sidebar view={view} onNavigate={onNavigate}/><main className="main"><Header onSearchFocus={onSearchFocus}/><div className="content">{children}</div></main><button className="help-btn" title="Help" type="button">?</button></>;
}
