import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8001/predict/", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Tahmin başarısız oldu. Lütfen tekrar deneyin.");
      }

      const result = await response.json();
      setPrediction(result.class);
      setConfidence((result.confidence * 100).toFixed(2) + "%"); // Yüzde olarak gösterme
      // Base64 formatına dönüştürülmüş resmi görüntüleme
      const fileUrl = URL.createObjectURL(selectedFile);
      setImageUrl(fileUrl);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Patates Hastalıkları Tahmini</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={!selectedFile || loading}>Tahmin Et</button>
      </form>
      {imageUrl && <img src={imageUrl} alt="Yüklenen Fotoğraf" style={{ maxWidth: "300px", marginTop: "10px" }} />}
      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {prediction && <p>Class: {prediction}</p>}
      {confidence && <p>Confidence: {confidence}</p>}
    </div>
  );
}

export default App;
