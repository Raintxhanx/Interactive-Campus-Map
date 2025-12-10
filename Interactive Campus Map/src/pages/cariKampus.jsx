import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/cariKampus.css"; // Pastikan path css sesuai

// FIX: Marker Icon Leaflet (Standar Wajib)
const DefaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function CariKampus() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("Universitas Indonesia");
  
  // Refs untuk menyimpan instance agar tidak hilang saat re-render
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null); // Layer khusus menampung marker

  // 1. Inisialisasi Peta (Hanya Sekali)
  useEffect(() => {
    if (mapInstanceRef.current) return; // Cegah double render

    // Buat Peta
    const map = L.map(mapContainerRef.current).setView([-6.200000, 106.816666], 10);
    
    // Tile Layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Buat LayerGroup kosong untuk menampung marker nanti
    const layerGroup = L.layerGroup().addTo(map);
    
    // Simpan ke refs
    mapInstanceRef.current = map;
    markersLayerRef.current = layerGroup;

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Logic Pencarian (Dijalankan saat searchTerm berubah)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    // DEBOUNCE: Tunggu user berhenti mengetik 500ms baru fetch
    const delaySearch = setTimeout(() => {
      if (searchTerm.trim() === "") return;

      fetch(`http://localhost:3000/api/cari_kampus?search=${searchTerm}`)
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then((data) => {
          // A. Bersihkan marker lama TANPA menghapus peta
          markersLayerRef.current.clearLayers();

          if (data.length === 0) {
            console.log("Tidak ada kampus ditemukan");
            return;
          }

          // B. Tambahkan marker baru
          data.forEach((kampus) => {
             // Validasi data
            if(!kampus.coords) return; 

            const marker = L.marker(kampus.coords);
            
            marker.bindPopup(`
              <div style="text-align:center">
                <b>${kampus.name}</b><br>
                <a href="${kampus.url}" target="_blank" style="color:#4CAF50; font-weight:bold">
                  Kunjungi Website
                </a>
              </div>
            `);

            marker.on("click", () => {
              mapInstanceRef.current.flyTo(kampus.coords, 15, {
                animate: true,
                duration: 1.5,
              });
            });

            // Masukkan marker ke layer group
            markersLayerRef.current.addLayer(marker);
          });

          // C. Opsional: Zoom otomatis agar semua marker terlihat
          if (data.length > 0) {
            mapInstanceRef.current.flyTo(data[0].coords, 14, {
              animate: true,
              duration: 1.3,
            });
          }
        })
        .catch((err) => {
          console.error("Gagal mengambil data:", err);
        });
    }, 500); // Waktu tunda 500ms

    // Cleanup timeout jika user mengetik lagi sebelum 500ms
    return () => clearTimeout(delaySearch);

  }, [searchTerm]); // Dependency: searchTerm

  return (
    <div className="page-container">
      <h1>Cari Lokasi Kampus</h1>

      <div className="search-wrapper">
        <button className="btn-back" onClick={() => navigate("/")}>
          &larr; Home
        </button>

        <input
          type="text"
          className="search-input"
          value={searchTerm}
          placeholder="Ketik nama kampus..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div id="map" ref={mapContainerRef}></div>
    </div>
  );
}