// UploadPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadPage.css";
import Footer from "../components/Footer";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // ✅ Load saved results from localStorage on mount
  useEffect(() => {
    const savedResults = localStorage.getItem("results");
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  // ✅ Save results to localStorage whenever they change
  useEffect(() => {
    if (results.length > 0) {
      localStorage.setItem("results", JSON.stringify(results));
    } else {
      localStorage.removeItem("results");
    }
  }, [results]);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    localStorage.removeItem("results"); // clear extracted text if needed
    navigate("/auth/login"); // redirect to login
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (files.length + selected.length > 7) {
      alert("You can only upload up to 7 files at once.");
      return;
    }
    setFiles([...files, ...selected]);
  };

  const handleChooseFile = () => {
    document.getElementById("file-upload").click();
  };

  const handleDeleteFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
    if (!updated.length) document.getElementById("file-upload").value = "";
  };

  const handleDeleteText = () => {
    setResults([]);
  };

  const handleUpload = async () => {
    if (!files.length) return alert("Please select files first!");
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5007/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log("Upload Progress:", percent + "%");
        },
      });

      setResults(res.data.results || []);
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Upload failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">


        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
        <div className="heading-box"> <h1>📄 Upload & Extract</h1> </div>

      <div className="upload-box">
        <input
          id="file-upload"
          type="file"
          accept=".pdf,image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <button
          className="choose-btn"
          onClick={handleChooseFile}
          disabled={files.length >= 7}
        >
          📂 Choose Files
        </button>

        {files.length > 0 && (
          <div className="file-grid">
            {files.map((f, idx) => (
              <div key={idx} className="file-card">
                <p className="file-name">{f.name}</p>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteFile(idx)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={loading || !files.length}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="output-box">
          <div className="output-header">
            <h2>📑 Extracted Text</h2>
            <button className="delete-text-btn" onClick={handleDeleteText}>
              ❌
            </button>
          </div>

          <div className="results-grid">
            {results.map((res, idx) => (
              <div key={idx} className="result-card">
                <h3>{`File ${idx + 1}`}</h3>
                <pre>{res.text}</pre>

                {res.engagement && (
                  <div className="engagement-box">
                    <p>📝 Words: {res.engagement.wordCount}</p>
                    <p>📏 Avg Sentence: {res.engagement.avgSentenceLength}</p>
                    <p>😊 Sentiment: {res.engagement.sentiment}</p>
                    <p>🎭 Tone: {res.engagement.tone}</p>
                    <p>
                      🏷️ Hashtags:{" "}
                      {res.engagement.hashtags.join(", ") || "None"}
                    </p>
                    {res.engagement.suggestedHashtags.length > 0 && (
                      <p>
                        💡 Suggestions:{" "}
                        {res.engagement.suggestedHashtags.join(", ")}
                      </p>
                    )}
                    <p>😀 Emojis: {res.engagement.emojiCount}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
