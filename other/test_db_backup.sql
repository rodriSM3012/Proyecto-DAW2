-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-05-2026 a las 16:14:27
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `test2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alerta`
--

CREATE TABLE `alerta` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `email_enviado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `alerta`
--

INSERT INTO `alerta` (`id`, `producto_id`, `fecha`, `leida`, `email_enviado`) VALUES
(1, 8, '2026-05-04 14:45:41', 1, 0),
(2, 11, '2026-05-04 14:45:41', 1, 0),
(3, 12, '2026-05-04 14:45:41', 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimiento`
--

CREATE TABLE `movimiento` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `tipo` enum('entrada','salida','ajuste') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `usuario_id` int(11) NOT NULL,
  `detalle` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `movimiento`
--

INSERT INTO `movimiento` (`id`, `producto_id`, `tipo`, `cantidad`, `fecha`, `usuario_id`, `detalle`) VALUES
(1, 1, 'entrada', 13, '2026-04-05 14:27:50', 3, 'Movimiento histórico'),
(2, 1, 'entrada', 18, '2026-04-20 14:27:50', 3, 'Movimiento histórico'),
(3, 1, 'entrada', 7, '2026-04-23 14:27:50', 3, 'Movimiento histórico'),
(4, 2, 'entrada', 16, '2026-04-05 14:27:50', 3, 'Movimiento histórico'),
(5, 2, 'salida', 13, '2026-04-14 14:27:50', 3, 'Movimiento histórico'),
(6, 2, 'salida', 2, '2026-04-29 14:27:50', 3, 'Movimiento histórico'),
(7, 3, 'entrada', 16, '2026-04-11 14:27:50', 3, 'Movimiento histórico'),
(8, 3, 'entrada', 2, '2026-04-25 14:27:50', 3, 'Movimiento histórico'),
(9, 3, 'salida', 1, '2026-04-09 14:27:50', 3, 'Movimiento histórico'),
(10, 4, 'salida', 6, '2026-04-07 14:27:50', 3, 'Movimiento histórico'),
(11, 4, 'entrada', 5, '2026-04-14 14:27:50', 3, 'Movimiento histórico'),
(12, 4, 'entrada', 12, '2026-04-15 14:27:50', 3, 'Movimiento histórico'),
(13, 5, 'entrada', 2, '2026-04-18 14:27:50', 3, 'Movimiento histórico'),
(14, 5, 'salida', 14, '2026-05-01 14:27:50', 3, 'Movimiento histórico'),
(15, 5, 'salida', 16, '2026-04-13 14:27:50', 3, 'Movimiento histórico'),
(16, 6, 'salida', 17, '2026-04-16 14:27:50', 3, 'Movimiento histórico'),
(17, 6, 'entrada', 4, '2026-05-03 14:27:50', 3, 'Movimiento histórico'),
(18, 6, 'entrada', 12, '2026-04-14 14:27:50', 3, 'Movimiento histórico'),
(19, 7, 'entrada', 8, '2026-04-13 14:27:50', 3, 'Movimiento histórico'),
(20, 7, 'salida', 7, '2026-05-02 14:27:50', 3, 'Movimiento histórico'),
(21, 7, 'salida', 1, '2026-04-08 14:27:50', 3, 'Movimiento histórico'),
(22, 8, 'salida', 10, '2026-04-14 14:27:50', 3, 'Movimiento histórico'),
(23, 8, 'salida', 5, '2026-05-04 14:27:50', 3, 'Movimiento histórico'),
(24, 8, 'salida', 16, '2026-04-10 14:27:50', 3, 'Movimiento histórico'),
(25, 9, 'entrada', 10, '2026-04-07 14:27:50', 3, 'Movimiento histórico'),
(26, 9, 'salida', 3, '2026-04-30 14:27:50', 3, 'Movimiento histórico'),
(27, 9, 'salida', 2, '2026-04-21 14:27:50', 3, 'Movimiento histórico'),
(28, 10, 'salida', 16, '2026-04-13 14:27:50', 3, 'Movimiento histórico'),
(29, 10, 'salida', 14, '2026-04-28 14:27:50', 3, 'Movimiento histórico'),
(30, 10, 'salida', 15, '2026-04-25 14:27:50', 3, 'Movimiento histórico'),
(31, 11, 'salida', 3, '2026-04-23 14:27:50', 3, 'Movimiento histórico'),
(32, 11, 'salida', 13, '2026-04-22 14:27:50', 3, 'Movimiento histórico'),
(33, 11, 'salida', 15, '2026-05-03 14:27:50', 3, 'Movimiento histórico'),
(34, 12, 'salida', 12, '2026-04-24 14:27:50', 3, 'Movimiento histórico'),
(35, 12, 'salida', 7, '2026-04-25 14:27:50', 3, 'Movimiento histórico'),
(36, 12, 'entrada', 9, '2026-05-02 14:27:50', 3, 'Movimiento histórico'),
(64, 12, 'entrada', 10, '2026-05-04 15:01:09', 2, NULL),
(65, 11, 'ajuste', 20, '2026-05-04 15:05:30', 2, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_unitario` decimal(10,2) NOT NULL DEFAULT 0.00,
  `stock_actual` int(11) NOT NULL DEFAULT 0,
  `stock_minimo` int(11) NOT NULL DEFAULT 0,
  `categoria_abc` enum('A','B','C') NOT NULL DEFAULT 'C',
  `codigo_qr` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `nombre`, `descripcion`, `precio_unitario`, `stock_actual`, `stock_minimo`, `categoria_abc`, `codigo_qr`, `activo`, `creado_en`, `actualizado_en`) VALUES
(1, 'Tuerca M8', 'Tuerca hexagonal métrica 8 mm', 0.15, 1238, 100, 'C', 'c6252744-47af-11f1-9aa3-00d86139b7e7', 1, '2026-05-04 13:52:49', '2026-05-04 16:05:30'),
(2, 'Arandela M8', 'Arandela plana M8', 0.05, 801, 200, 'C', 'c6253261-47af-11f1-9aa3-00d86139b7e7', 1, '2026-05-04 13:52:49', '2026-05-04 16:05:30'),
(3, 'Tornillo M6x20', 'Tornillo de cabeza plana M6x20', 0.08, 517, 150, 'C', 'c62532ff-47af-11f1-9aa3-00d86139b7e7', 1, '2026-05-04 13:52:49', '2026-05-04 16:05:30'),
(4, 'Taladro percutor', 'Taladro percutor 750W', 149.99, 19, 2, 'A', 'c6253351-47af-11f1-9aa3-00d86139b7e7', 1, '2026-05-04 13:52:49', '2026-05-04 16:05:30'),
(5, 'Cinta aislante', 'Cinta aislante negra 19mm x 20m', 2.50, 17, 10, 'C', 'c62533a0-47af-11f1-9aa3-00d86139b7e7', 1, '2026-05-04 13:52:49', '2026-05-04 16:05:30'),
(6, 'Guantes protección', 'Guantes de trabajo talla L', 6.75, 29, 15, 'B', 'c6253ce6-47af-11f1-9aa3-00d86139b7e7', 1, '2026-05-04 13:52:49', '2026-05-04 16:05:30'),
(7, 'Caja herramientas vacía', 'Caja metálica vacía 45x25x20 cm', 32.00, 12, 3, 'B', 'c6253d64-47af-11f1-9aa3-00d86139b7e7', 1, '2026-05-04 13:52:49', '2026-05-04 16:05:30'),
(8, 'Lubricante WD-40', 'Aceite lubricante multiusos 400ml', 9.99, 0, 5, 'A', 'c6253db3-47af-11f1-9aa3-00d86139b7e7', 1, '2026-05-04 13:52:49', '2026-05-04 16:05:30'),
(9, 'Broca metal 10mm', 'Broca HSS para metal 10 mm', 4.20, 65, 20, 'C', 'c6253e00-47af-11f1-9aa3-00d86139b7e7', 1, '2026-05-04 13:52:49', '2026-05-04 16:05:30'),
(10, 'Escuadra metálica', 'Escuadra de 90° 150 mm', 1.80, 155, 30, 'B', 'c6253e42-47af-11f1-9aa3-00d86139b7e7', 1, '2026-05-04 13:52:49', '2026-05-04 16:05:30'),
(11, 'Flexómetro 5m', 'Flexómetro metálico 5 metros', 12.50, 14, 5, 'A', 'c6253e85-47af-11f1-9aa3-00d86139b7e7', 1, '2026-05-04 13:52:49', '2026-05-04 16:05:30'),
(12, 'Sierra circular', 'Sierra circular 1200W con disco de 185 mm', 10.00, 10, 1, 'B', 'c6253ecc-47af-11f1-9aa3-00d86139b7e7', 1, '2026-05-04 13:52:49', '2026-05-04 16:05:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` enum('admin','operador','auditor') NOT NULL DEFAULT 'operador',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `email`, `password_hash`, `rol`, `created_at`) VALUES
(2, 'Rodrigo Sánchez', 'rodrigo@example.com', '$2b$12$KQkZKCR9ummrBZiX1HCZnO/KdYdmjcAs93q6lL9IkehtYwZo2PL3K', 'admin', '2026-05-01 12:09:12'),
(3, 'Operador', 'operador@example.com', '$2b$12$q0oppc3MF.vgJzV9u2j2TeAgsjq9OLKpCTti.LYZg6ImZaowZ9pK2', 'operador', '2026-05-01 12:24:21'),
(4, 'Auditor', 'auditor@example.com', '$2b$12$BJfB58zzHF91sLHMw3gk5.a1vv5XVJj75YBELeMdJvjOGKWr0HGxm', 'auditor', '2026-05-01 12:24:36');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alerta`
--
ALTER TABLE `alerta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_alerta_producto` (`producto_id`);

--
-- Indices de la tabla `movimiento`
--
ALTER TABLE `movimiento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_movimiento_producto` (`producto_id`),
  ADD KEY `fk_movimiento_usuario` (`usuario_id`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_qr` (`codigo_qr`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alerta`
--
ALTER TABLE `alerta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `movimiento`
--
ALTER TABLE `movimiento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alerta`
--
ALTER TABLE `alerta`
  ADD CONSTRAINT `fk_alerta_producto` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`);

--
-- Filtros para la tabla `movimiento`
--
ALTER TABLE `movimiento`
  ADD CONSTRAINT `fk_movimiento_producto` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`),
  ADD CONSTRAINT `fk_movimiento_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
