export default function CaseFilters({ query, setQuery, status, setStatus, priority, setPriority, district, setDistrict, districts }) {
  return <div className="case-filter-row">
    <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search case number, name, type or district..." />
    <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option><option>Open</option><option>Under Investigation</option><option>Closed</option></select>
    <select value={priority} onChange={(e) => setPriority(e.target.value)}><option value="">All priorities</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select>
    <select value={district} onChange={(e) => setDistrict(e.target.value)}><option value="">All districts</option>{districts.map((d) => <option key={d} value={d}>{d}</option>)}</select>
  </div>;
}
