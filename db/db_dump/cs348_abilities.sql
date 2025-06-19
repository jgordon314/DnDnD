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
-- Table structure for table `abilities`
--

DROP TABLE IF EXISTS `abilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `abilities` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `skill_delta_id` int unsigned DEFAULT NULL,
  `type` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `skill_delta_id` (`skill_delta_id`),
  CONSTRAINT `abilities_ibfk_1` FOREIGN KEY (`skill_delta_id`) REFERENCES `skilldeltas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `abilities`
--

LOCK TABLES `abilities` WRITE;
/*!40000 ALTER TABLE `abilities` DISABLE KEYS */;
INSERT INTO `abilities` VALUES (1,'Attack (BattleAxe)','1d8/1d10 Slashing Damage',NULL,1),(2,'Drink Health Potion','Heal 2d4',NULL,1),(3,'Attack (Longbow)','1d8 Piercing',NULL,1),(4,'Hybrid Transformation','As a bonus action, you transform into a special hybrid form for up to 1 hour. You can speak, use equipment, and wear armor while in this form, and can revert to your normal form as a bonus action. You automatically revert to your normal form if you fall unconscious or die.',8,2),(5,'Rage','In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action.\r\nWhile raging, you gain the following benefits if you aren\'t wearing heavy armor:\r\nYou have advantage on Strength checks and Strength saving throws.\r\nWhen you make a melee weapon attack using Strength, you gain a bonus to the damage roll that increases as you gain levels as a barbarian, as shown in the Rage Damage column of the Barbarian table.\r\nYou have resistance to bludgeoning, piercing, and slashing damage.\r\nIf you are able to cast spells, you can\'t cast them or concentrate on them while raging.\r\nYour rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven\'t attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.\r\nOnce you have raged the number of times shown for your barbarian level in the Rages column of the Barbarian table, you must finish a long rest before you can rage again',NULL,2),(6,'Unarmed Strike','Strike with your fists.',NULL,1),(7,'Dash','Move up to double your movement for this turn.',NULL,1),(8,'Dash (Bonus Action)','Move up to double your movement for this turn.',NULL,2),(9,'Attack (Dagger)','1d4 Slashing',NULL,1);
/*!40000 ALTER TABLE `abilities` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-19 11:38:32
