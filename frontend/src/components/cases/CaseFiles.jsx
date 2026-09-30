import { useEffect, useMemo, useRef, useState } from "react";
import CaseFilters from "./CaseFilters";
import CaseTable from "./CaseTable";
import CaseDetail from "./CaseDetail";
import CaseReport from "./CaseReport";

export default function CaseFiles({
  cases,
  onRefresh,
  onRegistered,
  onToast,
  loading,
  error,
  openReport,
  onReportOpened,
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [district, setDistrict] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef(null);
  // Open the Case Report automatically when requested by App.jsx
  useEffect(() => {
    if (openReport) {
      setShowReport(true);

      if (onReportOpened) {
        onReportOpened();
      }
    }
  }, [openReport, onReportOpened]);

  const districts = useMemo(
    () => [...new Set(cases.map((c) => c.district).filter(Boolean))].sort(),
    [cases],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return cases.filter((c) => {
      const hay = [
        c.case_number,
        c.name,
        c.case_type,
        c.district,
        c.assigned_officer,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!q || hay.includes(q)) &&
        (!status || c.status === status) &&
        (!priority || c.priority === priority) &&
        (!district || c.district === district)
      );
    });
  }, [cases, query, status, priority, district]);

  return (
    <section className="view active">
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <div className="panel-title-bar" />
            All Reported Cases
          </div>

          <span className="panel-badge">
            {filtered.length} case
            {filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="panel-body">
          <div className="case-files-toolbar">
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                Every registered case is stored in the database and appears
                here.
              </div>
            </div>

            <div className="case-files-actions">
              <button
                className="secondary-btn"
                type="button"
                onClick={() => {
                  onRefresh();
                  onToast("Case list refreshed");
                }}
              >
                ↻ Refresh
              </button>

              <button
                className="primary-btn"
                type="button"
                onClick={() => {
                  setShowReport(true);

                  setTimeout(() => {
                    reportRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100);
                }}
              >
                + Report New Case
              </button>
            </div>
          </div>

          <CaseFilters
            query={query}
            setQuery={setQuery}
            status={status}
            setStatus={setStatus}
            priority={priority}
            setPriority={setPriority}
            district={district}
            setDistrict={setDistrict}
            districts={districts}
          />

          {loading && <div className="case-empty">Loading cases...</div>}

          {error && !loading && <div className="case-empty">{error}</div>}

          <CaseTable
            cases={filtered}
            selectedCase={selectedCase}
            onSelect={setSelectedCase}
          />

          <CaseDetail caseItem={selectedCase} />
        </div>
      </div>

      {showReport && (
        <div ref={reportRef}>
          <CaseReport
            onClose={() => setShowReport(false)}
            onRegistered={(newCase) => {
              onRegistered(newCase);
              setSelectedCase(newCase);
              setShowReport(false);
            }}
            onToast={onToast}
          />
        </div>
      )}
    </section>
  );
}
