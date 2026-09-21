import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import Stats from "./components/dashboard/Stats";
import CaseFiles from "./components/cases/CaseFiles";
import { useCases } from "./hooks/useCases";
import { getCaseMetrics } from "./utils/metrices";

function Toast({ toast }) {
  if (!toast) return null;
  return <div id="toast" className="show" style={{ borderColor: toast.error ? "rgba(239,68,68,.4)" : "rgba(34,197,94,.4)", background: toast.error ? "#241212" : "#12241a", color: toast.error ? "#fecaca" : "#bbf7d0" }}>{toast.message}</div>;
}

export default function App() {
  const [view, setView] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const { cases, loading, error, refreshCases, prependCase } = useCases({ pollingMs: 5000 });
  const metrics = useMemo(() => getCaseMetrics(cases), [cases]);

  const showToast = (message, isError=false) => {
    setToast({message, error:isError});
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2600);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const navigate = (next) => setView(next.startsWith("placeholder") ? "placeholder" : next);
  return <Layout view={view} onNavigate={(next)=>navigate(next)} onSearchFocus={()=>{ if(view!=="casefiles") setView("casefiles"); }}>
    <Stats metrics={metrics}/>
    {view === "dashboard" && <Dashboard onOpenCaseFiles={()=>setView("casefiles")}/>}
    {view === "casefiles" && <CaseFiles cases={cases} loading={loading} error={error} onRefresh={refreshCases} onRegistered={prependCase} onToast={showToast}/>}
    {view === "placeholder" && <section className="view active"><div className="empty-state"><div className="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><h3>Module</h3><p>This module is not part of the current demo build.</p><button className="primary-btn empty-btn" onClick={()=>setView("dashboard")}>Back to Dashboard</button></div></section>}
    <Toast toast={toast}/>
  </Layout>;
}
