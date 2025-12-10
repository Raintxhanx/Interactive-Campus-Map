import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/editKampus.css"; // Style baru

// Fix Icon Leaflet
const DefaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function EditKampus() {
  const navigate = useNavigate();
  const { id } = useParams(); // Ambil ID dari URL

  // State Form
  const [formData, setFormData] = useState({
    nama_kampus: "",
    url: "",
    latitude: -6.200000, // Default sementara
    longitude: 106.816666,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // 1. FETCH DATA EXISTING
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Karena route backend yg tersedia hanya getAll (/kampus),
        // Kita fetch semua lalu cari ID yg sesuai.
        // (Idealnya backend menyediakan route GET /kampus/:id)
        const response = await fetch("http://localhost:3000/api/kampus");
        const data = await response.json();

        // Cari kampus berdasarkan ID (pastikan tipe data cocok string/number)
        const foundKampus = data.find((k) => k.id_kampus == id); 
        
        if (foundKampus) {
          setFormData({
            nama_kampus: foundKampus.name, // sesuaikan dengan key dari backend
            url: foundKampus.url,
            latitude: parseFloat(foundKampus.coords[0]), // Leaflet butuh float
            longitude: parseFloat(foundKampus.coords[1]),
          });
        } else {
          alert("Data kampus tidak ditemukan!");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // 2. INISIASI MAP (Setelah data loading selesai)
  useEffect(() => {
    if (isLoading || mapInstanceRef.current) return;

    // Buat Peta dengan koordinat dari data yang sudah difetch
    const map = L.map(mapContainerRef.current).setView(
      [formData.latitude, formData.longitude],
      13
    );
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    // Buat Marker
    const marker = L.marker([formData.latitude, formData.longitude], {
      draggable: true,
    }).addTo(map);
    markerRef.current = marker;

    // Event Drag Marker
    marker.on("dragend", function (e) {
      const position = e.target.getLatLng();
      updateCoordinates(position.lat, position.lng);
    });

    // Event Click Map
    map.on("click", function (e) {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      updateCoordinates(lat, lng);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isLoading]); // Hanya jalan setelah loading false

  // Helper update state koordinat
  const updateCoordinates = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. HANDLE UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Sesuaikan payload dengan yang diminta backend controller (req.body)
    const payload = {
      nama_kampus: formData.nama_kampus,
      url: formData.url,
      latitude: formData.latitude,
      longitude: formData.longitude
    };

    try {
      const res = await fetch(`http://localhost:3000/api/update_kampus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Kampus berhasil diupdate!");
        navigate("/");
      } else {
        alert("❌ Gagal update kampus.");
      }
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  // 4. HANDLE DELETE
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3000/api/delete_kampus/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("🗑️ Kampus berhasil dihapus!");
        navigate("/");
      } else {
        alert("❌ Gagal menghapus kampus.");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (isLoading) return <div style={{textAlign:"center", marginTop: 50}}>Loading data...</div>;

  return (
    <div className="page-container">
      <div className="header-section">
        <h1 className="header-title">Edit Data Kampus</h1>
        <button onClick={() => navigate("/")} className="btn-back">
          &larr; Batal
        </button>
      </div>

      <div className="content-grid">
        {/* FORM */}
        <div className="card">
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Nama Kampus</label>
              <input
                type="text"
                name="nama_kampus"
                className="form-input"
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

            {/* Tombol Aksi */}
            <div className="button-group">
              <button type="submit" className="btn-update">
                Update Data
              </button>
              
              <button type="button" onClick={handleDelete} className="btn-delete">
                Delete
              </button>
            </div>
          </form>
        </div>

        {/* MAP */}
        <div className="card">
          <p className="map-instruction">
            Geser marker merah untuk mengubah lokasi kampus.
          </p>
          <div id="map-picker" ref={mapContainerRef}></div>
        </div>
      </div>
    </div>
  );
}