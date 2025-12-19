-- Adminer 4.8.1 MySQL 8.0.44 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `Account_type`;
CREATE TABLE `Account_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `Cars`;
CREATE TABLE `Cars` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model_id` int NOT NULL,
  `complectation_id` int NOT NULL,
  `color_id` int NOT NULL,
  `VIN` text NOT NULL,
  `dealer_id` int NOT NULL,
  `img_1` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `img_2` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `img_3` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `img_4` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `img_5` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Cars` (`id`, `model_id`, `complectation_id`, `color_id`, `VIN`, `dealer_id`, `img_1`, `img_2`, `img_3`, `img_4`, `img_5`, `price`) VALUES
(1,	1,	2,	1,	'1J4FJ78L0KL478512',	2,	'img/cars/M6_blue.jpeg',	'img/cars/M6_blue.jpeg',	'img/cars/M6_blue.jpeg',	'img/cars/M6_blue.jpeg',	'img/cars/M6_blue.jpeg',	2750700),
(2,	1,	4,	2,	'1J4FJ78L0DB478432',	2,	'img/cars/M6_blue.jpeg',	'img/cars/M3_red.jpeg',	'img/cars/M3_red.jpeg',	'l5_white.jpeg',	'img/cars/M3_red.jpeg',	2850700),
(24,	2,	5,	2,	'1J4FJ78L0DB478432',	2,	'img/cars/M3_red.jpeg',	'',	'',	'',	'',	2950700);

DROP TABLE IF EXISTS `City`;
CREATE TABLE `City` (
  `id` int NOT NULL AUTO_INCREMENT,
  `city` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `City` (`id`, `city`) VALUES
(1,	'Москва'),
(2,	'Воронеж'),
(3,	'Краснодар'),
(4,	'Ростов-на-Дону'),
(5,	'Санкт-Петербург'),
(6,	'Волгоград'),
(7,	'Белгород'),
(8,	'Архангельск');

DROP TABLE IF EXISTS `Clients`;
CREATE TABLE `Clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `phone` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `Colors`;
CREATE TABLE `Colors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `color_name` text NOT NULL,
  `color_code` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Colors` (`id`, `color_name`, `color_code`) VALUES
(1,	'Красный',	'#8B0000'),
(2,	'Синий',	'#00008B'),
(3,	'Серый',	'#808080'),
(4,	'Черный',	'#000000');

DROP TABLE IF EXISTS `Complectation`;
CREATE TABLE `Complectation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model_id` int NOT NULL,
  `complectation_name` text NOT NULL,
  `price` int NOT NULL,
  `engine` int NOT NULL,
  `track_fuel` float NOT NULL,
  `city_fuel` float NOT NULL,
  `transmission` text NOT NULL,
  `brakes` text NOT NULL,
  `wheel_drive` text NOT NULL,
  `weight` int NOT NULL,
  `headlights` text NOT NULL,
  `hatch` tinyint(1) NOT NULL,
  `tinting` tinyint(1) NOT NULL,
  `airbag` int NOT NULL,
  `heated_front_seats` tinyint(1) NOT NULL,
  `heated_rear_seats` tinyint(1) NOT NULL,
  `salon` text NOT NULL,
  `seats` text NOT NULL,
  `conditions` tinyint(1) NOT NULL,
  `Cruise_control` tinyint(1) NOT NULL,
  `apple_Carplay_android_auto` tinyint(1) NOT NULL,
  `audio_speakers` int NOT NULL,
  `usb` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Complectation` (`id`, `model_id`, `complectation_name`, `price`, `engine`, `track_fuel`, `city_fuel`, `transmission`, `brakes`, `wheel_drive`, `weight`, `headlights`, `hatch`, `tinting`, `airbag`, `heated_front_seats`, `heated_rear_seats`, `salon`, `seats`, `conditions`, `Cruise_control`, `apple_Carplay_android_auto`, `audio_speakers`, `usb`) VALUES
(1,	1,	'Standard',	2750700,	180,	7.3,	8.7,	'Автоматическая',	'Дисковые',	'Передний',	1460,	'Светодиодные',	1,	1,	6,	1,	1,	'Кожаный с элементом пластика',	'Кожаные',	0,	1,	1,	6,	4),
(2,	1,	'Standard+',	2750700,	180,	7.3,	8.7,	'Автоматическая',	'Дисковые',	'Передний',	1460,	'Светодиодные',	1,	1,	6,	1,	1,	'Кожаный с элементом пластика',	'Кожаные',	0,	1,	1,	6,	4),
(3,	1,	'Dream',	2750700,	180,	7.3,	8.7,	'Автоматическая',	'Дисковые',	'Передний',	1460,	'Светодиодные',	1,	1,	6,	1,	1,	'Кожаный с элементом пластика',	'Кожаные',	0,	1,	1,	6,	4),
(4,	1,	'Lux',	2750700,	190,	7.3,	8.7,	'Автоматическая',	'Дисковые',	'Передний',	1460,	'Светодиодные',	1,	1,	6,	1,	1,	'Кожаный с элементом пластика',	'Кожаные',	3,	1,	1,	6,	4),
(5,	2,	'Standard',	2928700,	200,	7.3,	8.7,	'Автоматическая',	'Дисковые',	'Полный',	1460,	'Светодиодные',	1,	1,	6,	1,	1,	'Кожаный с элементом пластика',	'Кожаные',	0,	1,	1,	6,	4),
(6,	2,	'Dream',	2928700,	210,	7.3,	8.7,	'Автоматическая',	'Дисковые',	'Полный',	1460,	'Светодиодные',	1,	1,	6,	1,	1,	'Кожаный с элементом пластика',	'Кожаные',	0,	1,	1,	6,	4);

DROP TABLE IF EXISTS `Dealers`;
CREATE TABLE `Dealers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `city` int NOT NULL,
  `city_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `street` text NOT NULL,
  `home` text NOT NULL,
  `name` text NOT NULL,
  `open` time NOT NULL,
  `closed` time NOT NULL,
  `timezone` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` text NOT NULL,
  `coord_x` float NOT NULL,
  `coord_y` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Dealers` (`id`, `city`, `city_name`, `street`, `home`, `name`, `open`, `closed`, `timezone`, `phone`, `coord_x`, `coord_y`) VALUES
(2,	3,	'Краснодар',	'ул. Солнечная',	'3/2',	'PHOENIX Солнечный',	'09:00:00',	'19:00:00',	'+3',	'+78615553535',	38.989,	45.0727);

DROP TABLE IF EXISTS `Models`;
CREATE TABLE `Models` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model_name` text NOT NULL,
  `length` int NOT NULL,
  `width` int NOT NULL,
  `height` int NOT NULL,
  `whellbase` int NOT NULL,
  `clearance` int NOT NULL,
  `trunk` int NOT NULL,
  `fuel_tank` int NOT NULL,
  `engine_m` int NOT NULL,
  `min_price` int DEFAULT NULL,
  `img` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description_full` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `salon_photo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `features` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Models` (`id`, `model_name`, `length`, `width`, `height`, `whellbase`, `clearance`, `trunk`, `fuel_tank`, `engine_m`, `min_price`, `img`, `description`, `description_full`, `salon_photo`, `features`) VALUES
(1,	'M6',	4200,	1705,	1680,	2450,	21,	480,	60,	180,	2750700,	'img/cars/M6_blue.jpeg',	'Современный седан D класса, сочетающий динамичный дизайн, комфорт и практичность для ежедневных поездок и дальних путешествий.',	'PHOENIX M6: стиль, простор и надёжность в каждой детали\r\n\r\nPHOENIX M6 — современный седан D класса, сочетающий динамичный дизайн, комфорт и практичность для ежедневных поездок и дальних путешествий.\r\n\r\nПод капотом — бодрый двигатель мощностью 180 л. с., обеспечивающий уверенное ускорение и комфортную езду как в городе, так и на трассе. Объём топливного бака — 60 л: этого достаточно для длительных поездок без частых остановок на заправку.\r\n\r\nПросторный багажник объёмом 480 л позволяет легко разместить всё необходимое: от покупок до туристического снаряжения. Габариты автомобиля (4200×1705×1680 мм) и колёсная база 2450 мм гарантируют устойчивость и манёвренность, а клиренс 21 см даёт уверенность на просёлочных дорогах и в условиях городского бездорожья.\r\n\r\nPHOENIX M6 — выбор тех, кто ценит баланс динамики, комфорта и функциональности.',	'img/cars/car_salon_1.jpeg',	'[\r\n  { \"x\": 20, \"y\": 30, \"comment\": \"Комментарий 1\" },\r\n  { \"x\": 50, \"y\": 60, \"comment\": \"Комментарий 2\" }\r\n]'),
(2,	'E3 CROSS',	4200,	1705,	1680,	2450,	21,	480,	60,	180,	2928700,	'img/cars/M6_blue.jpeg',	'Современный седан D класса, сочетающий динамичный дизайн, комфорт и практичность для ежедневных поездок и дальних путешествий.',	'PHOENIX M6: стиль, простор и надёжность в каждой детали\r\n\r\nPHOENIX M6 — современный седан D класса, сочетающий динамичный дизайн, комфорт и практичность для ежедневных поездок и дальних путешествий.\r\n\r\nПод капотом — бодрый двигатель мощностью 180 л. с., обеспечивающий уверенное ускорение и комфортную езду как в городе, так и на трассе. Объём топливного бака — 60 л: этого достаточно для длительных поездок без частых остановок на заправку.\r\n\r\nПросторный багажник объёмом 480 л позволяет легко разместить всё необходимое: от покупок до туристического снаряжения. Габариты автомобиля (4200×1705×1680 мм) и колёсная база 2450 мм гарантируют устойчивость и манёвренность, а клиренс 21 см даёт уверенность на просёлочных дорогах и в условиях городского бездорожья.\r\n\r\nPHOENIX M6 — выбор тех, кто ценит баланс динамики, комфорта и функциональности.',	'img/cars/car_salon_1.jpeg',	'[\r\n  { \"x\": 20, \"y\": 30, \"comment\": \"Комментарий 1\" },\r\n  { \"x\": 50, \"y\": 60, \"comment\": \"Комментарий 2\" }\r\n]');

DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` int NOT NULL,
  `login` text NOT NULL,
  `password` text NOT NULL,
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `banks`;
CREATE TABLE `banks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `logo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `deposit_min` int NOT NULL,
  `min_percent` int NOT NULL,
  `max_percent` int NOT NULL,
  `min_month` int NOT NULL,
  `max_month` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `banks` (`id`, `name`, `logo`, `deposit_min`, `min_percent`, `max_percent`, `min_month`, `max_month`) VALUES
(1,	'Сигма Банк',	'/',	20,	24,	29,	12,	72),
(2,	'КомБанк',	'/',	10,	23,	27,	12,	84);

DROP TABLE IF EXISTS `carousel`;
CREATE TABLE `carousel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img` text NOT NULL,
  `name` text NOT NULL,
  `descript` text NOT NULL,
  `button` text NOT NULL,
  `link` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `carousel` (`id`, `img`, `name`, `descript`, `button`, `link`) VALUES
(1,	'img/start/stone.jpeg',	'PHOENIX STONE',	'от 2 699 000 ₽*',	'Подробнее',	'vk.com');

DROP TABLE IF EXISTS `condition`;
CREATE TABLE `condition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `condition` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `condition` (`id`, `condition`, `type`) VALUES
(1,	'* Минимальная цена указана за покупку автомобиля 2024 года выпуска любой комплектации и при покупке авто в кредит от 12 до 84 месяцев.',	1),
(2,	'** Phoenix M2 - автомобиль B класса, выпускавшийся с 2014 по 2022 год. На данный момент автомобиль снят с производства.',	1),
(3,	'*** Премии “автомобиль года”: 3-е место в номинации “народный выбор” (2015, 2017, 2018), 2-е место в номинациях “революционный дизайн” (2015, 2016) и “выбор автокритиков” (2015, 2016), 1-е место в номинации “народный выбор” (2016).',	1),
(4,	'**** Анализ был проведен сервисом AutoRussia.ru и получил максимальное значение соотношение цены и качества среди отечественных автомобильных брендов.',	1),
(5,	'***** Автокредитования проводится банками партнерами - В-Банк, ДонБанкИнвест, ПЗВ, КомБанк, Сигма Банк. Кредитная ставка варьируется от 17% до 36% годовых. Первоначальный взнос автокредита от 10% до 70% от стоимости авто.',	1);

DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `car_id` int NOT NULL,
  `vin` text NOT NULL,
  `price` int NOT NULL,
  `user_id` int NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `startpage`;
CREATE TABLE `startpage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `edit_content` int NOT NULL,
  `desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `button_bool` int DEFAULT NULL,
  `button` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `link` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `img` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `priority` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `startpage` (`id`, `name`, `edit_content`, `desc`, `button_bool`, `button`, `link`, `img`, `priority`) VALUES
(1,	'О бренде',	1,	'Бренд Phoenix начал свою карьеру в автомобилестроении с 2014 году, дебютировав с легендарного седана M2**. Данная модель получила множество наград от автомобильных изданий и неоднократно становилась призером конкурса “автомобиль года”***. Цель бренда является обеспечением соотечественников, высококачественными автомобилями. Компания смогла этого добиться и имеет отличный баланс**** между ценой и качеством на отечественном авторынке.',	NULL,	NULL,	NULL,	'img/startpage/1.jpeg',	1),
(2,	'Модельный ряд',	0,	NULL,	NULL,	NULL,	NULL,	NULL,	2),
(3,	'Дилеры',	0,	NULL,	NULL,	NULL,	NULL,	NULL,	3);

DROP TABLE IF EXISTS `techical_service`;
CREATE TABLE `techical_service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dealer_id` int NOT NULL,
  `client_id` int NOT NULL,
  `modelcar_id` int NOT NULL,
  `vin` text NOT NULL,
  `date_service` date NOT NULL,
  `time_service` time NOT NULL,
  `status_ts` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 2025-12-18 16:07:44
