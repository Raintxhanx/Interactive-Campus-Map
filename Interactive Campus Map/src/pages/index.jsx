import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "../css/index.css";

// Konfigurasi Icon Marker Leaflet
const DefaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Home() {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null); // Ref untuk elemen DIV
  const mapInstanceRef = useRef(null);  // Ref untuk instance Peta

  useEffect(() => {
    // 1. Cek apakah peta sudah ada. Jika sudah, jangan inisiasi lagi (Strict Mode React 18 safe)
    if (mapInstanceRef.current) return;

    // 2. Inisiasi Map
    const map = L.map(mapContainerRef.current).setView([-6.2, 106.816666], 10);
    mapInstanceRef.current = map; // Simpan ke ref

    // 3. Tile Layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // 4. Fetch Data dengan Async/Await
    const fetchKampus = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/kampus");
        if (!response.ok) throw new Error("Gagal mengambil data");
        
        const kampusData = await response.json();

        kampusData.forEach((kampus) => {
          // Validasi koordinat sederhana
          if (!kampus.coords) return;

          const marker = L.marker(kampus.coords).addTo(map);

          marker.bindPopup(`
            <div style="text-align: center;">
              <b style="font-size: 14px;">${kampus.name}</b><br/>
              <a href="${kampus.url}" target="_blank"
                style="color: #4CAF50; text-decoration: none; font-weight: bold;">
                Kunjungi Website
              </a>
              <br/>
              <span id="edit-${kampus.id_kampus}"
                style="cursor: pointer; color: blue; text-decoration: underline; font-size: 13px;">
                Edit
              </span>
            </div>
          `);

          marker.on("click", () => {
            map.flyTo(kampus.coords, 15, {
              animate: true,
              duration: 1.5,
            });
          });

            // Event ketika popup muncul → pasang event listener EDIT
          marker.on("popupopen", () => {
            const editBtn = document.getElementById(`edit-${kampus.id_kampus}`);
            if (editBtn) {
              editBtn.addEventListener("click", () => {
                navigate(`/edit_kampus/${kampus.id_kampus}`);
              });
            }
          });
        });
      } catch (err) {
        console.error("API ERROR:", err);
      }
    };

    fetchKampus();

    // Cleanup saat component unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="container">
      <h1>Peta Sebaran Kampus</h1>

      {/* Menggunakan ref, bukan ID hardcode */}
      <div id="map" ref={mapContainerRef}></div>

      <div className="button-group">
        <button onClick={() => navigate("/add_kampus")}>
          ➕ Tambah Kampus
        </button>

        <button onClick={() => navigate("/cari_kampus")}>
          🔍 Cari Kampus
        </button>
      </div>
    </div>
  );
}