import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/index";
import AddKampus from "./pages/addKampus";
import CariKampus from "./pages/cariKampus";
import EditKampus from "./pages/editKampus";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add_kampus" element={<AddKampus />} />
        <Route path="/cari_kampus" element={<CariKampus />} />
        <Route path="/edit_kampus/:id" element={<EditKampus />} />
      </Routes>
    </BrowserRouter>
  );
}
