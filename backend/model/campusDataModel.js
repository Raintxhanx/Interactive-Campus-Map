// model/campusDataModel.js
const db = require('../config/db');

module.exports = {
  async getAll() {
    const [rows] = await db.query(
      `SELECT ID_Kampus, Nama_Kampus, latitude, longitude, url 
       FROM daftar_kampus_1`
    );

    return rows.map((row) => ({
      id_kampus: row.ID_Kampus,
      name: row.Nama_Kampus,
      coords: [row.latitude, row.longitude],
      url: row.url,
    }));
  },

  async search(query) {
    const [rows] = await db.query(
      `SELECT ID_Kampus, Nama_Kampus, latitude, longitude, url 
       FROM daftar_kampus_1
       WHERE Nama_Kampus LIKE ?`,
      [`%${query}%`]
    );

    return rows.map((row) => ({
      id_kampus: row.ID_Kampus,
      name: row.Nama_Kampus,
      coords: [row.latitude, row.longitude],
      url: row.url,
    }));
  },

  async add(nama, latitude, longitude, url) {
    await db.query(
      `INSERT INTO daftar_kampus_1 (Nama_Kampus, latitude, longitude, url)
       VALUES (?, ?, ?, ?)`,
      [nama, latitude, longitude, url]
    );
  },
  
  // 🔥 UPDATE kampus
  async update(id, nama, latitude, longitude, url) {
    await db.query(
      `UPDATE daftar_kampus_1
       SET Nama_Kampus = ?, latitude = ?, longitude = ?, url = ?
       WHERE ID_Kampus = ?`,
      [nama, latitude, longitude, url, id]
    );
  },

  // 🔥 DELETE kampus
  async remove(id) {
    await db.query(
      `DELETE FROM daftar_kampus_1 WHERE ID_Kampus = ?`,
      [id]
    );
  }
};
