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
-- Table structure for table `characterabilities`
--

DROP TABLE IF EXISTS `characterabilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `characterabilities` (
  `character_id` int unsigned NOT NULL,
  `ability_id` int unsigned NOT NULL,
  `activation_count` int unsigned NOT NULL DEFAULT '0',
  `max_uses` int DEFAULT NULL,
  `available_uses` int DEFAULT NULL,
  PRIMARY KEY (`character_id`,`ability_id`),
  KEY `ability_id` (`ability_id`),
  CONSTRAINT `characterabilities_ibfk_1` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`),
  CONSTRAINT `characterabilities_ibfk_2` FOREIGN KEY (`ability_id`) REFERENCES `abilities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `characterabilities`
--

LOCK TABLES `characterabilities` WRITE;
/*!40000 ALTER TABLE `characterabilities` DISABLE KEYS */;
INSERT INTO `characterabilities` VALUES (1,4,0,1,1),(1,6,0,NULL,NULL),(1,7,0,NULL,NULL),(2,6,0,NULL,NULL),(2,7,0,NULL,NULL),(3,5,1,1,0),(3,6,0,NULL,NULL),(3,7,0,NULL,NULL),(4,6,0,NULL,NULL),(4,7,0,NULL,NULL),(4,8,0,NULL,NULL);
/*!40000 ALTER TABLE `characterabilities` ENABLE KEYS */;
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
