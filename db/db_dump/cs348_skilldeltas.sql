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
-- Table structure for table `skilldeltas`
--

DROP TABLE IF EXISTS `skilldeltas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skilldeltas` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `armor_class` int NOT NULL DEFAULT '0',
  `current_health` int NOT NULL DEFAULT '0',
  `max_health` int NOT NULL DEFAULT '0',
  `strength` int NOT NULL DEFAULT '0',
  `dexterity` int NOT NULL DEFAULT '0',
  `intelligence` int NOT NULL DEFAULT '0',
  `wisdom` int NOT NULL DEFAULT '0',
  `charisma` int NOT NULL DEFAULT '0',
  `constitution` int NOT NULL DEFAULT '0',
  `athletics` int NOT NULL DEFAULT '0',
  `acrobatics` int NOT NULL DEFAULT '0',
  `sleight_of_hand` int NOT NULL DEFAULT '0',
  `stealth` int NOT NULL DEFAULT '0',
  `arcana` int NOT NULL DEFAULT '0',
  `history` int NOT NULL DEFAULT '0',
  `investigation` int NOT NULL DEFAULT '0',
  `nature` int NOT NULL DEFAULT '0',
  `religion` int NOT NULL DEFAULT '0',
  `animal_handling` int NOT NULL DEFAULT '0',
  `insight` int NOT NULL DEFAULT '0',
  `medicine` int NOT NULL DEFAULT '0',
  `perception` int NOT NULL DEFAULT '0',
  `survival` int NOT NULL DEFAULT '0',
  `deception` int NOT NULL DEFAULT '0',
  `intimidation` int NOT NULL DEFAULT '0',
  `performance` int NOT NULL DEFAULT '0',
  `persuasion` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skilldeltas`
--

LOCK TABLES `skilldeltas` WRITE;
/*!40000 ALTER TABLE `skilldeltas` DISABLE KEYS */;
INSERT INTO `skilldeltas` VALUES (1,10,25,30,8,19,14,10,13,13,-1,6,4,4,4,2,4,2,2,0,0,0,2,0,1,1,1,1),(2,10,37,52,10,12,14,8,18,14,0,1,1,4,2,2,5,2,2,-1,-1,-1,-1,-1,7,7,4,4),(3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(4,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(6,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(7,0,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(8,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(9,10,11,13,17,12,8,9,10,15,4,1,1,1,-1,-1,-1,0,-1,0,2,0,2,0,0,0,0,0),(10,10,10,10,10,17,12,8,16,12,0,4,4,6,1,1,1,1,0,1,0,0,0,0,1,1,1,3),(11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(12,3,12,20,10,14,11,13,9,12,4,2,2,5,3,2,2,2,3,1,3,1,4,2,0,1,0,1);
/*!40000 ALTER TABLE `skilldeltas` ENABLE KEYS */;
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
