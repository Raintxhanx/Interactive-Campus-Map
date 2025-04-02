package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	// "strings"

	_ "github.com/go-sql-driver/mysql" // Import MySQL driver
)

type Kampus struct {
	ID_Kampus int       `json:"id_kampus"`
	Name      string    `json:"name"`
	Coords    []float64 `json:"coords"`
	URL       string    `json:"url"`
}

func main() {
	// Hubungkan ke database MySQL
	dsn := "root:@tcp(127.0.0.1:3307)/daftar_kampus" // Sesuaikan dengan kredensial MySQL Anda
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Cek koneksi ke database
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	// Menyajikan file HTML, CSS, dan JS
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	})

	// Endpoint untuk menampilkan form tambah kampus
	http.HandleFunc("/add_kampus", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			// Menyajikan form HTML
			http.ServeFile(w, r, "add_kampus.html")
		} else if r.Method == "POST" {
			// Ambil data dari form
			namaKampus := r.FormValue("nama_kampus")
			latitude := r.FormValue("latitude")
			longitude := r.FormValue("longitude")
			url := r.FormValue("url")

			// Validasi input
			if namaKampus == "" || latitude == "" || longitude == "" || url == "" {
				http.Error(w, "Semua field harus diisi", http.StatusBadRequest)
				return
			}

			// Insert data kampus baru ke database
			_, err := db.Exec("INSERT INTO daftar_kampus_1 (Nama_Kampus, latitude, longitude, url) VALUES (?, ?, ?, ?)",
				namaKampus, latitude, longitude, url)
			if err != nil {
				http.Error(w, "Gagal menambahkan data kampus", http.StatusInternalServerError)
				log.Println("Error inserting data:", err)
				return
			}

			// Redirect ke halaman utama atau halaman sukses
			http.Redirect(w, r, "/", http.StatusFound)
		}
	})

	http.HandleFunc("/api/kampus", func(w http.ResponseWriter, r *http.Request) {
		kampusData, err := ambilDataKampus(db) // Menggunakan db yang ada di main()

		// Pastikan kita menggunakan variabel err yang ada
		if err != nil {
			http.Error(w, "Error fetching data kampus", http.StatusInternalServerError)
			log.Println("Error fetching kampus data:", err)
			return
		}

		// Kirim data kampus dalam format JSON jika tidak ada error
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(kampusData); err != nil {
			http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
			log.Println("Error encoding JSON:", err)
		}
	})

	http.HandleFunc("/api/cari_kampus", func(w http.ResponseWriter, r *http.Request) {
		// Mengambil query string untuk pencarian (misalnya, ?search=kampus)
		searchQuery := r.URL.Query().Get("search")

		// Ambil data kampus dari database berdasarkan pencarian
		kampusData, err := ambilDataKampusFilter(db, searchQuery)
		if err != nil {
			http.Error(w, "Error fetching kampus data", http.StatusInternalServerError)
			log.Println("Error fetching kampus data:", err)
			return
		}

		// Kirim data kampus dalam format JSON
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(kampusData); err != nil {
			http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
			log.Println("Error encoding JSON:", err)
			return
		}
	})

	// Menangani endpoint untuk menyajikan form HTML
	http.HandleFunc("/cari_kampus", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			http.ServeFile(w, r, "cari_kampus.html")
		}
	})

	// Jalankan server
	http.ListenAndServe(":8080", nil)
}

// Fungsi untuk mengambil data kampus dari database
func ambilDataKampus(db *sql.DB) ([]Kampus, error) {
	// Query untuk mengambil data kampus
	rows, err := db.Query("SELECT ID_Kampus, Nama_Kampus, latitude, longitude, url FROM daftar_kampus_1")
	if err != nil {
		log.Println("Error querying database:", err)
		return nil, err
	}
	defer rows.Close()

	var kampusData []Kampus

	// Iterasi melalui hasil query
	for rows.Next() {
		var k Kampus
		var latitude, longitude float64

		// Scan data dari database
		if err := rows.Scan(&k.ID_Kampus, &k.Name, &latitude, &longitude, &k.URL); err != nil {
			log.Println("Error scanning data:", err)
			return nil, err
		}

		// Gabungkan latitude dan longitude ke dalam array coords
		k.Coords = []float64{latitude, longitude}

		// Masukkan data kampus ke dalam array kampusData
		kampusData = append(kampusData, k)
	}

	// Cek apakah ada error setelah iterasi rows
	if err := rows.Err(); err != nil {
		log.Println("Error reading rows:", err)
		return nil, err
	}

	// Mengembalikan data kampus
	return kampusData, nil
}

// Fungsi untuk mengambil data kampus dari database dengan filter pencarian
func ambilDataKampusFilter(db *sql.DB, searchQuery string) ([]Kampus, error) {
	// Query untuk mengambil data kampus berdasarkan pencarian
	query := "SELECT ID_Kampus, Nama_Kampus, latitude, longitude, url FROM daftar_kampus_1 WHERE Nama_Kampus LIKE ?"
	rows, err := db.Query(query, "%"+searchQuery+"%")
	if err != nil {
		log.Println("Error querying database:", err)
		return nil, err
	}
	defer rows.Close()

	var kampusData []Kampus
	for rows.Next() {
		var k Kampus
		var latitude, longitude float64
		if err := rows.Scan(&k.ID_Kampus, &k.Name, &latitude, &longitude, &k.URL); err != nil {
			log.Println("Error scanning data:", err)
			return nil, err
		}
		k.Coords = []float64{latitude, longitude}
		kampusData = append(kampusData, k)
	}

	if err := rows.Err(); err != nil {
		log.Println("Error reading rows:", err)
		return nil, err
	}

	return kampusData, nil
}
