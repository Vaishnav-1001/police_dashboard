import { useState } from "react";
import { formatFileSize } from "../../utils/formatters";

function UploadZone({ kind, title, files, setFiles, accept, acceptLabel }) {
  const [error, setError] = useState("");
  const addFiles = (incoming) => {
    const accepted = []; let rejected = false;
    Array.from(incoming || []).forEach((file) => {
      if (accept(file)) accepted.push(file); else rejected = true;
    });
    if (rejected) { setError(`Only ${acceptLabel} are allowed in ${title}`); window.setTimeout(() => setError(""), 2600); }
    setFiles((current) => [...current, ...accepted]);
  };
  return <div className="upload-zone">
    <div className="zone-head"><span className={`zone-title ${kind}`}>{title}</span><span className="zone-badge">{files.length} file{files.length === 1 ? "" : "s"}</span></div>
    <label className="zone-drop" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
      <svg className="zone-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      <div className="zone-drop-text">Drag &amp; drop {kind === "photo" ? "photos" : "videos"} here</div><div className="zone-drop-sub">{acceptLabel} · Max 2GB per file</div>
      <input type="file" hidden multiple accept={kind === "photo" ? "image/png,image/jpeg" : "video/mp4,video/quicktime"} onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
    </label>
    <label className="zone-browse" role="button">Browse {kind === "photo" ? "Photos" : "Videos"}<input type="file" hidden multiple accept={kind === "photo" ? "image/png,image/jpeg" : "video/mp4,video/quicktime"} onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}/></label>
    <div className="zone-error">{error}</div><div className="file-list">{files.map((file, i) => <div className="file-item" key={`${file.name}-${file.lastModified}-${i}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span className="file-name">{file.name}</span><span className="file-size">{formatFileSize(file.size)}</span><button className="file-remove" title="Remove" type="button" onClick={() => setFiles((current) => current.filter((_, index) => index !== i))}>✕</button></div>)}</div>
  </div>;
}

export default function EvidenceUpload({ photoFiles, setPhotoFiles, videoFiles, setVideoFiles }) {
  return <div className="upload-grid"><UploadZone kind="photo" title="Photo Evidence" files={photoFiles} setFiles={setPhotoFiles} accept={(f) => f.type.startsWith("image/") || /\.(jpe?g|png)$/i.test(f.name)} acceptLabel="JPG, PNG"/><UploadZone kind="video" title="Video Evidence" files={videoFiles} setFiles={setVideoFiles} accept={(f) => f.type.startsWith("video/") || /\.(mp4|mov)$/i.test(f.name)} acceptLabel="MP4, MOV"/></div>;
}
