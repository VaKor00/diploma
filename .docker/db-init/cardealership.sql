CREATE DATABASE IF NOT EXISTS `cardealership`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `cardealership`;

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


CREATE TABLE `carousel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img` text NOT NULL,
  `name` text NOT NULL,
  `descript` text NOT NULL,
  `button` text NOT NULL,
  `link` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `cars` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model_id` int NOT NULL,
  `complectation_id` int NOT NULL,
  `color_id` int NOT NULL,
  `vin` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dealer_id` int NOT NULL,
  `img_1` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `img_2` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `img_3` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `img_4` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `img_5` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `price` int NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `city` (
  `id` int NOT NULL AUTO_INCREMENT,
  `city` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `phone` text NOT NULL,
  `vin_car` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `colors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `color_name` text NOT NULL,
  `color_code` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `complectation` (
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
  `cruise_control` tinyint(1) NOT NULL,
  `apple_carplay_android_auto` tinyint(1) NOT NULL,
  `audio_speakers` int NOT NULL,
  `usb` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `condition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `condition` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `dealers` (
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
  `login` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `models` (
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
  `min_price` int NOT NULL,
  `img` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description_full` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `salon_photo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `features` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `car_id` int NOT NULL,
  `vin` text NOT NULL,
  `price` int NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

CREATE TABLE `technical_service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dealer_id` int NOT NULL,
  `client_id` int NOT NULL,
  `modelcar_id` int DEFAULT NULL,
  `vin` text NOT NULL,
  `date_service` date NOT NULL,
  `time_service` time NOT NULL,
  `status_ts` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` int NOT NULL,
  `login` text NOT NULL,
  `password` text NOT NULL,
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `dealer_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;