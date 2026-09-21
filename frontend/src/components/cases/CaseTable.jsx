import { formatDate, priorityClass, statusClass } from "../../utils/formatters";

export default function CaseTable({ cases, selectedCase, onSelect }) {
  return <div className="case-table-wrap">
    <table className="case-table"><thead><tr><th>Case</th><th>Case Name</th><th>Type</th><th>Priority</th><th>Status</th><th>District</th><th>Reported</th><th>Evidence</th></tr></thead>
      <tbody>{cases.map((c) => <tr key={c.case_number} className={selectedCase?.case_number === c.case_number ? "selected" : ""} onClick={() => onSelect(c)}>
        <td className="case-number-cell">{c.case_number}</td><td className="case-name-cell">{c.name}</td><td>{c.case_type}</td><td><span className={`status-tag ${priorityClass(c.priority)}`}>{c.priority}</span></td><td><span className={`status-tag ${statusClass(c.status)}`}>{c.status}</span></td><td>{c.district}</td><td>{formatDate(c.date_reported)}</td><td className="evidence-count">{Number(c.evidence_count || (c.evidence || []).length || 0)}</td>
      </tr>)}</tbody></table>
    {!cases.length && <div className="case-empty">No cases match the current filters.</div>}
  </div>;
}
