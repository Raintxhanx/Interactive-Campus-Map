import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/addKampus.css"; // Pastikan path ini benar

// FIX ICON LEAFLET
const DefaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function AddKampus() {
  const navigate = useNavigate();

  // State Form
  const [formData, setFormData] = useState({
    nama_kampus: "",
    url: "",
    latitude: -6.200000,
    longitude: 106.816666,
  });

  // Refs untuk Peta
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    // 1. Inisialisasi Peta
    const map = L.map(mapContainerRef.current).setView(
      [formData.latitude, formData.longitude], 
      11
    );
    mapInstanceRef.current = map;

    // Tile Layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    // 2. Marker Awal (Default)
    const initialMarker = L.marker([formData.latitude, formData.longitude], {
      draggable: true // Fitur drag marker
    }).addTo(map);
    
    markerRef.current = initialMarker;

    // 3. Event: Update koordinat saat Marker di-drag
    initialMarker.on('dragend', function (e) {
      const position = e.target.getLatLng();
      updateCoordinates(position.lat, position.lng);
    });

    // 4. Event: Pindah Marker saat Peta diklik
    map.on('click', function(e) {
      const { lat, lng } = e.latlng;
      initialMarker.setLatLng([lat, lng]); // Pindahkan marker
      updateCoordinates(lat, lng); // Update state form
    });

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run once

  // Helper untuk update state koordinat
  const updateCoordinates = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: parseFloat(lat.toFixed(6)), // Limit desimal agar rapi
      longitude: parseFloat(lng.toFixed(6))
    }));
  };

  // Handle Input Text
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch("http://localhost:3000/api/add_kampus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Kampus berhasil ditambahkan!");
        navigate("/"); // Redirect ke home setelah sukses
      } else {
        alert("❌ Gagal menambahkan kampus.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan koneksi.");
    }
  };

  return (
    <div className="page-container">
      <div className="header-section">
        <h1 className="header-title">Tambah Lokasi Kampus</h1>
        <button onClick={() => navigate("/")} className="btn-back">
          &larr; Kembali ke Home
        </button>
      </div>

      <div className="content-grid">
        {/* KOLOM KIRI: FORM */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nama Kampus</label>
              <input
                type="text"
                name="nama_kampus"
                className="form-input"
                placeholder="Contoh: Universitas Indonesia"
                value={formData.nama_kampus}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL Website</label>
              <input
                type="url"
                name="url"
                className="form-input"
                placeholder="https://ui.ac.id"
                value={formData.url}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Latitude</label>
              <input
                type="number"
                className="form-input"
                value={formData.latitude}
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label">Longitude</label>
              <input
                type="number"
                className="form-input"
                value={formData.longitude}
                readOnly
              />
            </div>

            <button type="submit" className="btn-submit">
              Simpan Data
            </button>
          </form>
        </div>

        {/* KOLOM KANAN: PETA */}
        <div className="card">
          <p className="map-instruction">
            Klik di peta atau geser marker untuk menentukan lokasi kampus.
          </p>
          <div id="map-picker" ref={mapContainerRef}></div>
        </div>
      </div>
    </div>
  );
}