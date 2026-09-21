import { formatDate } from "../../utils/formatters";

export default function CaseDetail({ caseItem }) {
  if (!caseItem) return null;
  return <div className="case-detail-grid">
    <div className="case-detail-card"><div className="detail-heading">Selected Case</div><div className="detail-title">{caseItem.name}</div><div className="detail-meta"><strong>{caseItem.case_number}</strong> · {caseItem.case_type} · {caseItem.priority} priority<br/>Status: {caseItem.status} · District: {caseItem.district}<br/>Reported: {formatDate(caseItem.date_reported)} · Assigned: {caseItem.assigned_detective || "Unassigned"}</div><div className="detail-description">{caseItem.description || "No case description was provided."}</div></div>
    <div className="case-detail-card"><div className="detail-heading">Evidence</div><div className="evidence-links">{(caseItem.evidence || []).length ? caseItem.evidence.map((file, i) => <a key={`${file.url}-${i}`} className="evidence-link" href={file.url} target="_blank" rel="noopener noreferrer"><span>{file.name}</span><span>{file.file_type}</span></a>) : <div style={{color:"var(--text-muted)",fontSize:12}}>No evidence files attached.</div>}</div></div>
  </div>;
}
