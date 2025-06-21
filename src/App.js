import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [transcriptData, setTranscriptData] = useState([]);
  const [curriculumData, setCurriculumData] = useState([]);

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("files", file);

    const res = await axios.post("http://localhost:5000/upload", formData);
    const [data] = res.data.filesData; // single file only
    if (type === "transcript") {
      setTranscriptData(data);
    } else {
      setCurriculumData(data);
    }
  };

  return (
    <div className="container">
      <h1>🎓 <span className="title-highlight">TTrack – Torrens Degree Tracker</span></h1>
      <p>Built by students for academic advisors at Torrens University Australia.</p>
      <em>Guided by Dr. Atif Qureshi – Software Development Management, 2025</em>

      <div className="button-row">
        <label className="upload-btn">
          📄 Upload Transcript
          <input
            type="file"
            accept=".xlsx, .xls"
            hidden
            onChange={(e) => handleUpload(e, "transcript")}
          />
        </label>

        <label className="upload-btn">
          📚 Upload Curriculum
          <input
            type="file"
            accept=".xlsx, .xls"
            hidden
            onChange={(e) => handleUpload(e, "curriculum")}
          />
        </label>
      </div>

      <div className="box">
        <h3>Transcript Table</h3>
        <div className="scroll-box">
          <pre>{JSON.stringify(transcriptData, null, 2)}</pre>
        </div>
      </div>

      <div className="box">
        <h3>Curriculum Table</h3>
        <div className="scroll-box">
          <pre>{JSON.stringify(curriculumData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
