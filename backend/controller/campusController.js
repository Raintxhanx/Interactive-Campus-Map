// controller/campusController.js
const Kampus = require('../model/campusDataModel');

module.exports = {
  async getAll(req, res) {
    try {
      const data = await Kampus.getAll();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching kampus data" });
    }
  },

  async search(req, res) {
    try {
      const query = req.query.search || "";
      const data = await Kampus.search(query);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error searching kampus" });
    }
  },

  async add(req, res) {
    try {
      const { nama_kampus, latitude, longitude, url } = req.body;

      if (!nama_kampus || !latitude || !longitude || !url) {
        return res.status(400).json({ error: "Semua field harus diisi" });
      }

      await Kampus.add(nama_kampus, latitude, longitude, url);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error adding kampus" });
    }
  },

  // 🔥 UPDATE kampus
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nama_kampus, latitude, longitude, url } = req.body;

      if (!id || !nama_kampus || !latitude || !longitude || !url) {
        return res.status(400).json({ error: "Semua field harus diisi" });
      }

      await Kampus.update(id, nama_kampus, latitude, longitude, url);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating kampus" });
    }
  },

  // 🔥 DELETE kampus
  async remove(req, res) {
    try {
      const { id } = req.params;

      if (!id) return res.status(400).json({ error: "ID tidak ditemukan" });

      await Kampus.remove(id);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting kampus" });
    }
  }
};
