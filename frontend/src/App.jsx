import { useEffect, useMemo, useRef, useState } from "react";

import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import Stats from "./components/dashboard/Stats";
import CaseFiles from "./components/cases/CaseFiles";
import Login from "./components/auth/Login";

import { getCurrentUser, logout } from "./api/auth";

import { useCases } from "./hooks/useCases";
import { getCaseMetrics } from "./utils/metrices";

function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div
      id="toast"
      className="show"
      style={{
        borderColor: toast.error ? "rgba(239,68,68,.4)" : "rgba(34,197,94,.4)",

        background: toast.error ? "#241212" : "#12241a",

        color: toast.error ? "#fecaca" : "#bbf7d0",
      }}
    >
      {toast.message}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(undefined);
  const [view, setView] = useState("dashboard");
  const [openCaseReport, setOpenCaseReport] = useState(false);
  const [toast, setToast] = useState(null);

  const timer = useRef(null);

  // Check authentication when the app starts.
  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const { cases, loading, error, refreshCases, prependCase } = useCases({
    pollingMs: 15000,
    enabled: user !== undefined && user !== null,
  });

  const metrics = useMemo(() => getCaseMetrics(cases), [cases]);

  const showToast = (message, isError = false) => {
    setToast({
      message,
      error: isError,
    });

    window.clearTimeout(timer.current);

    timer.current = window.setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  const navigate = (next) => {
    setView(next.startsWith("placeholder") ? "placeholder" : next);
  };

  async function handleLogout() {
    try {
      await logout();

      setUser(null);
      setView("dashboard");
    } catch (error) {
      showToast(error.message || "Logout failed.", true);
    }
  }

  // Authentication check is still running.
  if (user === undefined) {
    return <div className="auth-loading">Loading...</div>;
  }

  // User isn't logged in.
  if (user === null) {
    return (
      <Login
        onLogin={(loggedInUser) => {
          setUser(loggedInUser);
          setView("dashboard");
        }}
      />
    );
  }

  // User is authenticated.
  return (
    <Layout
      view={view}
      onNavigate={(next) => navigate(next)}
      onSearchFocus={() => {
        if (view !== "casefiles") {
          setView("casefiles");
        }
      }}
      user={user}
      onLogout={handleLogout}
    >
      <Stats metrics={metrics} />

      {view === "dashboard" && (
        <Dashboard
          onOpenCaseFiles={() => {
            setOpenCaseReport(true);
            setView("casefiles");
          }}
        />
      )}

      {view === "casefiles" && (
        <CaseFiles
          cases={cases}
          loading={loading}
          error={error}
          onRefresh={refreshCases}
          onRegistered={prependCase}
          onToast={showToast}
          openReport={openCaseReport}
          onReportOpened={() => setOpenCaseReport(false)}
        />
      )}

      {view === "placeholder" && (
        <section className="view active">
          <div className="empty-state">
            <div className="empty-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />

                <line x1="12" y1="8" x2="12" y2="12" />

                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h3>Module</h3>

            <p>This module is not part of the current demo build.</p>

            <button
              className="primary-btn empty-btn"
              onClick={() => setView("dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </section>
      )}

      <Toast toast={toast} />
    </Layout>
  );
}
