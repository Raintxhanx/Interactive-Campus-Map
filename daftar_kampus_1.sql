-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3307
-- Generation Time: Dec 10, 2025 at 10:41 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `daftar_kampus`
--

-- --------------------------------------------------------

--
-- Table structure for table `daftar_kampus_1`
--

CREATE TABLE `daftar_kampus_1` (
  `id_kampus` int(11) NOT NULL,
  `nama_kampus` varchar(255) NOT NULL,
  `latitude` decimal(10,6) NOT NULL,
  `longitude` decimal(10,6) NOT NULL,
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `daftar_kampus_1`
--

INSERT INTO `daftar_kampus_1` (`id_kampus`, `nama_kampus`, `latitude`, `longitude`, `url`) VALUES
(1, 'Universitas Indonesia', -6.361000, 106.832000, 'https://www.ui.ac.id'),
(2, 'Institut Teknologi Bandung', -6.891000, 107.610000, 'https://www.itb.ac.id'),
(3, 'Universitas Gadjah Mada', -7.770000, 110.377000, 'https://www.ugm.ac.id'),
(4, 'Universitas Airlangga', -7.290000, 112.740000, 'https://www.unair.ac.id'),
(5, 'Institut Pertanian Bogor', -6.590000, 106.750000, 'https://www.ipb.ac.id'),
(6, 'Universitas Diponegoro', -6.985000, 110.408000, 'https://www.undip.ac.id'),
(7, 'Universitas Hasanuddin', -5.121000, 119.532000, 'https://www.unhas.ac.id'),
(8, 'Universitas Brawijaya', -7.975000, 112.634000, 'https://www.ub.ac.id'),
(9, 'Universitas Padjadjaran', -6.902000, 107.633000, 'https://www.unpad.ac.id'),
(10, 'Universitas Negeri Jakarta', -6.208000, 106.826000, 'https://www.unj.ac.id');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `daftar_kampus_1`
--
ALTER TABLE `daftar_kampus_1`
  ADD PRIMARY KEY (`id_kampus`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `daftar_kampus_1`
--
ALTER TABLE `daftar_kampus_1`
  MODIFY `id_kampus` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
