export default function Stats({ metrics }) {
  return <div className="stats-row">
    <div className="stat-card"><div className="stat-label">Open Cases</div><div className="stat-value">{metrics.openCases}</div><div className="stat-change positive">{metrics.todayCases} new today</div></div>
    <div className="stat-card"><div className="stat-label">Critical Cases</div><div className="stat-value">{metrics.criticalCases}</div><div className="stat-change warning">Requires attention</div></div>
    <div className="stat-card"><div className="stat-label">Evidence Items</div><div className="stat-value">{metrics.evidenceItems}</div><div className="stat-change positive">{metrics.evidenceToday} added today</div></div>
    <div className="stat-card"><div className="stat-label">Closed Cases</div><div className="stat-value">{metrics.closedCases}</div><div className="stat-change up">Current records</div></div>
  </div>;
}
