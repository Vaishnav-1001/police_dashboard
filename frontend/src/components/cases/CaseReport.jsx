import { useMemo, useState } from "react";
import EvidenceUpload from "./EvidenceUpload";
import { priorityClass } from "../../utils/formatters";
import { registerCase } from "../../api/cases";

const badgeText = { 1: "Step 1 of 2 · Case Intake", 2: "Step 2 of 2 · Evidence Upload", 3: "Complete · Registered" };

const KERALA_DISTRICTS = [
  "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", 
  "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", 
  "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"
];

export default function CaseReport({ onClose, onRegistered, onToast }) {
  const defaultDate = useMemo(() => new Date().toISOString().slice(0, 16), []);
  const [stage, setStage] = useState(1);
  const [form, setForm] = useState({ 
    name: "", 
    type: "", 
    priority: "Medium", 
    district: "Thiruvananthapuram", // Updated to match your dynamic options
    date: defaultDate, 
    detective: "Officer", 
    desc: "" 
  });
  const [photoFiles, setPhotoFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  
  const reset = () => { 
    setStage(1); 
    setForm({
      name: "",
      type: "",
      priority: "Medium",
      district: "Thiruvananthapuram",
      date: new Date().toISOString().slice(0, 16),
      officer: "",
      desc: ""
    }); 
    setPhotoFiles([]); 
    setVideoFiles([]); 
    setError(""); 
    setSuccess(null); 
  };

  const submitDetails = (e) => { 
    e.preventDefault(); 
    if (!form.name.trim() || !form.type) { 
      setError("Please fill in case name and type"); 
      onToast("Please fill in case name and type", true); 
      return; 
    } 
    setError(""); 
    setStage(2); 
    onToast("Case details saved — attach evidence, then register"); 
  };

  const submitCase = async () => {
    setSubmitting(true);
    try {
      const data = new FormData();
      const fields = { 
        name: form.name.trim(), 
        case_type: form.type, 
        priority: form.priority, 
        district: form.district, 
        date_reported: form.date ? form.date.split("T")[0] : "", 
        assigned_officer: (form.officer || ""), 
        description: form.desc.trim() 
      };
      Object.entries(fields).forEach(([key, value]) => data.append(key, value));
      photoFiles.forEach((file) => data.append("photos", file));
      videoFiles.forEach((file) => data.append("videos", file));
      
      const result = await registerCase(data);
      if (result.case && typeof onRegistered === "function") {
        onRegistered(result.case);
      }
      
      const info = { 
        id: result.case_id, 
        meta: `${fields.case_type} · ${fields.priority} priority · ${fields.district} · ${fields.assigned_officer || "Unassigned"}`, 
        files: `${photoFiles.length} photo(s) · ${videoFiles.length} video(s) safely archived` 
      };
      setSuccess(info); 
      setStage(3); 
      onToast("Case successfully recorded");
    } catch (err) { 
      setError(err.message); 
      onToast(err.message, true); 
    } finally { 
      setSubmitting(false); 
    }
  };

  return (
    <div className="panel report-panel">
      <div className="panel-header">
        <div className="panel-title"><div className="panel-title-bar"/>Case Intake &amp; Evidence</div>
        <span className="panel-badge">
          {badgeText[stage]}{stage === 2 && ` · ${photoFiles.length + videoFiles.length} file${photoFiles.length + videoFiles.length === 1 ? "" : "s"}`}
        </span>
      </div>
      
      <div className="panel-body">
        <div className="stepper">
          <div className={`step ${stage === 1 ? "active" : stage > 1 ? "done" : ""}`}><span className="step-num">1</span>Case Intake</div>
          <div className="step-line"/>
          <div className={`step ${stage === 2 ? "active" : stage > 2 ? "done" : ""}`}><span className="step-num">2</span>Evidence Upload</div>
          <div className="step-line"/>
          <div className={`step ${stage === 3 ? "active" : ""}`}><span className="step-num">✓</span>Registered</div>
        </div>

        {stage === 1 && (
          <form onSubmit={submitDetails} noValidate>
            <div className="form-grid">
              <div className="form-field field-full">
                <label htmlFor="case-name">Case Name <span className="req">*</span></label>
                <input id="case-name" className={error && !form.name.trim() ? "invalid" : ""} value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              
              <div className="form-field">
                <label htmlFor="case-type">Case Type <span className="req">*</span></label>
                <select id="case-type" className={error && !form.type ? "invalid" : ""} value={form.type} onChange={(e) => update("type", e.target.value)}>
                  <option value="">— Select type —</option>
                  {["Homicide", "Armed Robbery", "Burglary", "Assault", "Fraud / Forgery", "Narcotics", "Missing Person", "Cybercrime"].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="case-priority">Priority</label>
                <select id="case-priority" value={form.priority} onChange={(e) => update("priority", e.target.value)}>
                  {["Low", "Medium", "High", "Critical"].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="case-district">District</label>
                <select id="case-district" value={form.district} onChange={(e) => update("district", e.target.value)}>
                  <option value="">— Select a district —</option>
                  {KERALA_DISTRICTS.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="case-date">Incident Date &amp; Time</label>
                <input id="case-date" type="datetime-local" value={form.date} onChange={(e) => update("date", e.target.value)}/>
              </div>

              <div className="form-field field-full">
                <label htmlFor="case-detective">Assigned Officer</label>
                <input id="case-detective" value={form.officer} onChange={(e) => update("officer", e.target.value)} placeholder="e.g. Officer Akash"/>
              </div>

              <div className="form-field field-full">
                <label htmlFor="case-desc">Case Description</label>
                <textarea id="case-desc" value={form.desc} onChange={(e) => update("desc", e.target.value)} placeholder="Brief summary of the incident, witnesses, leads..."/>
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="primary-btn">Continue to Evidence →</button>
              <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
              <span className="form-hint">Fields marked <span style={{color: "var(--accent-red)"}}>*</span> are required</span>
            </div>
          </form>
        )}

        {stage === 2 && (
          <>
            <div className="case-summary">
              <span className="case-id">#DRAFT</span>
              <span className="case-name">{form.name}</span>
              <span className="tag tag-type">{form.type}</span>
              <span className={`tag ${priorityClass(form.priority)}`}>{form.priority}</span>
              <span className="case-district">{form.district}</span>
            </div>
            
            <EvidenceUpload photoFiles={photoFiles} setPhotoFiles={setPhotoFiles} videoFiles={videoFiles} setVideoFiles={setVideoFiles}/>
            
            <div className="register-row">
              <button className="link-btn" type="button" onClick={() => setStage(1)}>← Back to case details</button>
              <button className="primary-btn register-btn" type="button" disabled={submitting} onClick={submitCase}>
                {submitting ? "Storing in Database..." : "✓ Register Case"}
              </button>
            </div>
          </>
        )}

        {stage === 3 && success && (
          <div className="success-box">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3>Case Registered</h3>
            <span className="case-id">#{success.id}</span>
            <p className="success-meta">{success.meta}</p>
            <p className="success-files">{success.files}</p>
            <div className="success-actions">
              <button className="primary-btn" type="button" onClick={reset}>File Another Case</button>
              <button className="zone-browse" type="button" onClick={onClose}>View All Cases</button>
            </div>
          </div>
        )}

        {error && <div className="zone-error" style={{marginTop: 12}}>{error}</div>}
      </div>
    </div>
  );
}
