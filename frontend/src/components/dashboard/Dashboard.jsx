export default function Dashboard({ onOpenCaseFiles }) {
  return <section className="view active">
    <div className="empty-state"><div className="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg></div><h3>No Case Workspace Open</h3><p>Open the <strong>Case Files</strong> module from the sidebar to report a new case, upload suspect media evidence and view case details.</p><button className="primary-btn empty-btn" onClick={onOpenCaseFiles}>Open Case Files</button></div>
  </section>;
}
