-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: cs348
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` json DEFAULT NULL,
  `skill_delta_id` int unsigned DEFAULT NULL,
  `ability_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `skill_delta_id` (`skill_delta_id`),
  KEY `ability_id` (`ability_id`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`skill_delta_id`) REFERENCES `skilldeltas` (`id`),
  CONSTRAINT `items_ibfk_2` FOREIGN KEY (`ability_id`) REFERENCES `abilities` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'Longbow','{\"Cost\": \"50 gp\", \"Range\": \"150ft./600ft.\", \"Damage\": \"1d8\", \"Weight\": \"2lb.\", \"Properties\": \"Ammunition, Heavy, Range, Two-Handed, Slow\", \"Attack Type\": \"Ranged\", \"Damage Type\": \"Piercing\"}',NULL,3),(2,'Rations (1 day)','{\"Cost\": \"5 gp\", \"Weight\": \"20lb.\", \"Description\": \"Rations consist of dry foods suitable for extended travel, including jerky, dried fruit, hardtack, and nuts.\"}',NULL,NULL),(3,'Studded Leather Armor','{\"Cost\": \"45 gp\", \"Weight\": \"13lb.\", \"Armor Class\": \"12\"}',4,NULL),(4,'Shield','{\"Cost\": \"10 gp\", \"Weight\": \"6lb.\", \"Armor Class\": \"+2\"}',4,NULL),(5,'Potion of Healing',NULL,NULL,2),(6,'Chain Shirt','{\"Cost\": \"50 gp\", \"Weight\": \"20lb.\", \"Armor Class\": \"13\"}',3,NULL),(7,'Zirzimog\'s Battle Axe','{\"Cost\": \"10 gp\", \"Reach\": \"5ft.\", \"Damage\": \"1d8+4(1d10+4)\", \"Weight\": \"4lb.\", \"Properties\": \"Versatile (1d10)\", \"Attack Type\": \"Melee\", \"Damage Type\": \"Slashing\"}',NULL,1),(8,'Dagger','{\"Cost\": \"2 gp\", \"Range\": \"20ft./60ft.\", \"Reach\": \"5ft.\", \"Damage\": \"1d4\", \"Weight\": \"1lb.\", \"Properties\": \"Finesse, Light, Thrown\", \"Attack Type\": \"Melee\", \"Damage Type\": \"Piercing\"}',NULL,9);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-19 11:38:31
