-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 45.56.104.8    Database: blobberdb_development
-- ------------------------------------------------------
-- Server version	5.5.52-0+deb8u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Settings`
--

DROP TABLE IF EXISTS `Settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `Settings_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Settings`
--

LOCK TABLES `Settings` WRITE;
/*!40000 ALTER TABLE `Settings` DISABLE KEYS */;
INSERT INTO `Settings` VALUES (1,'dark','false','2016-11-30 14:18:54','2017-02-05 08:24:20',1),(2,'leaderboard','true','2016-11-30 14:20:05','2017-01-22 19:21:14',1),(3,'mass','false','2016-11-30 14:20:07','2017-01-17 12:26:04',1),(4,'chat','true','2016-11-30 14:20:09','2017-01-08 12:09:52',1),(5,'move','true','2016-11-30 14:21:31','2016-11-30 17:27:07',1),(6,'dark','true','2016-12-15 09:49:06','2017-01-25 09:41:33',2),(7,'mass','false','2016-12-15 09:49:49','2017-01-25 09:38:59',2),(8,'leaderboard','true','2016-12-15 09:49:59','2016-12-15 09:50:07',2),(9,'chat','true','2016-12-15 09:50:02','2016-12-15 09:50:05',2);
/*!40000 ALTER TABLE `Settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserBalancePayment`
--

DROP TABLE IF EXISTS `UserBalancePayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserBalancePayment` (
  `notification_type` varchar(30) DEFAULT NULL,
  `operation_type` varchar(30) DEFAULT NULL,
  `id_operation` varchar(50) DEFAULT NULL,
  `userid` varchar(50) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `useremail` varchar(512) DEFAULT NULL,
  `vcb_old_value` int(12) DEFAULT NULL,
  `vcb_new_value` int(12) DEFAULT NULL,
  `vcb_balance_diff` int(12) DEFAULT NULL,
  `transaction_id` varchar(50) DEFAULT NULL,
  `transaction_date` varchar(20) DEFAULT NULL,
  `items_operation_type` varchar(20) DEFAULT NULL,
  `items_sku` varchar(20) DEFAULT NULL,
  `items_amount` varchar(20) DEFAULT NULL,
  `blobdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserBalancePayment`
--

LOCK TABLES `UserBalancePayment` WRITE;
/*!40000 ALTER TABLE `UserBalancePayment` DISABLE KEYS */;
INSERT INTO `UserBalancePayment` VALUES ('user_balance_operation','inGamePurchase','66438568','10210078089256409','Vincent Brepoels','BE',6750,5100,-1650,NULL,NULL,NULL,NULL,NULL,'2016-11-29 12:23:09'),('user_balance_operation','internal','66438592','10210078089256409','Vincent Brepoels','BE',5100,7100,2000,NULL,NULL,NULL,NULL,NULL,'2016-11-29 12:23:27'),('user_balance_operation','inGamePurchase','66440692','109639777553681644106','Vincent Brepoels','BE',4800,2100,-2700,NULL,NULL,NULL,NULL,NULL,'2016-11-29 12:59:06'),('user_balance_operation','internal','66440771','109639777553681644106','Vincent Brepoels','BE',2100,4100,2000,NULL,NULL,NULL,NULL,NULL,'2016-11-29 13:00:22'),('user_balance_operation','internal','66440775','109639777553681644106','Vincent Brepoels','BE',4100,6100,2000,NULL,NULL,NULL,NULL,NULL,'2016-11-29 13:00:26'),('user_balance_operation','internal','66440777','109639777553681644106','Vincent Brepoels','BE',6100,8100,2000,NULL,NULL,NULL,NULL,NULL,'2016-11-29 13:00:28'),('user_balance_operation','inGamePurchase','66440789','109639777553681644106','Vincent Brepoels','BE',8100,2100,-6000,NULL,NULL,NULL,NULL,NULL,'2016-11-29 13:00:47'),('user_balance_operation','inGamePurchase','66440789','109639777553681644106','Vincent Brepoels','BE',8100,2100,-6000,NULL,NULL,'add','Santaclaus','','2016-11-29 14:16:28'),('user_balance_operation','inGamePurchase','66546638','109639777553681644106','Vincent Brepoels','BE',3100,100,-3000,NULL,NULL,'add','Robot1','','2016-11-30 11:35:02'),('user_balance_operation','internal','66560122','10210078089256409','Vincent Brepoels','BE',7100,9100,2000,NULL,NULL,'','','','2016-11-30 14:43:27'),('user_balance_operation','internal','66560126','10210078089256409','Vincent Brepoels','BE',9100,11100,2000,NULL,NULL,'','','','2016-11-30 14:43:30'),('user_balance_operation','internal','66950761','10210078089256409','Vincent Brepoels','BE',11100,13100,2000,NULL,NULL,'','','','2016-12-03 08:25:46'),('user_balance_operation','internal','69646327',':{','','',0,2000,2000,NULL,NULL,'','','','2016-12-21 06:50:27'),('user_balance_operation','internal','70361404','10210078089256409','Vincent Brepoels','BE',13100,15100,2000,NULL,NULL,'','','','2016-12-26 14:47:54'),('user_balance_operation','internal','71338101',':{','','',2000,4000,2000,NULL,NULL,'','','','2017-01-02 17:51:06'),('user_balance_operation','internal','73037825',':{','','',4000,6000,2000,NULL,NULL,'','','','2017-01-16 06:07:11');
/*!40000 ALTER TABLE `UserBalancePayment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserPayment`
--

DROP TABLE IF EXISTS `UserPayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserPayment` (
  `notification_type` varchar(30) DEFAULT NULL,
  `vc_name` varchar(30) DEFAULT NULL,
  `vc_sku` varchar(30) DEFAULT NULL,
  `vc_quantity` float DEFAULT NULL,
  `vc_currency` float DEFAULT NULL,
  `vc_amount` varchar(30) DEFAULT NULL,
  `purchase_total_currency` varchar(30) DEFAULT NULL,
  `purchase_total_amount` float DEFAULT NULL,
  `userid` varchar(50) DEFAULT NULL,
  `userip` varchar(30) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `usercountry` varchar(4) DEFAULT NULL,
  `userzip` varchar(10) DEFAULT NULL,
  `transaction_id` varchar(50) DEFAULT NULL,
  `transaction_payment_date` varchar(30) DEFAULT NULL,
  `transaction_payment_method` varchar(30) DEFAULT NULL,
  `transaction_dry_run` int(2) DEFAULT NULL,
  `pd_payment_cur` varchar(4) DEFAULT NULL,
  `pd_payment_amount` float DEFAULT NULL,
  `pd_pay_method_sum_currency` varchar(4) DEFAULT NULL,
  `pd_pay_method_sum_amount` varchar(4) DEFAULT NULL,
  `xsolla_balance_sum_cur` varchar(4) DEFAULT NULL,
  `xsolla_balance_sum_amount` float DEFAULT NULL,
  `payout_currency` varchar(4) DEFAULT NULL,
  `payout_amount` float DEFAULT NULL,
  `xsolla_fee_cur` varchar(4) DEFAULT NULL,
  `xsolla_fee_amount` float DEFAULT NULL,
  `payment_method_fee_cur` varchar(4) DEFAULT NULL,
  `payment_method_fee_amount` float DEFAULT NULL,
  `vat_currency` varchar(4) DEFAULT NULL,
  `vat_amount` float DEFAULT NULL,
  `sales_tax_cur` varchar(4) DEFAULT NULL,
  `sales_tax_amount` float DEFAULT NULL,
  `payout_currency_rate` varchar(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserPayment`
--

LOCK TABLES `UserPayment` WRITE;
/*!40000 ALTER TABLE `UserPayment` DISABLE KEYS */;
INSERT INTO `UserPayment` VALUES ('payment','Coins','2',3250,0,'4.99','USD',4.99,'10210078089256409','91.183.93.196','Vincent Brepoels','MY','','240675907','2016-11-29T15:24:54+03:00','1380',1,'USD',4.99,'USD','4.99','USD',0,'USD',4.49,'USD',0.25,'USD',0.25,'USD',0,'USD',0,'1');
/*!40000 ALTER TABLE `UserPayment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserValidation`
--

DROP TABLE IF EXISTS `UserValidation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserValidation` (
  `notification_type` varchar(30) DEFAULT NULL,
  `userip` varchar(30) DEFAULT NULL,
  `userphone` varchar(40) DEFAULT NULL,
  `useremail` varchar(512) DEFAULT NULL,
  `userid` varchar(40) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `usercountry` varchar(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserValidation`
--

LOCK TABLES `UserValidation` WRITE;
/*!40000 ALTER TABLE `UserValidation` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserValidation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `displayName` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `provider` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'10210078089256409','Vinz2','Vincent Brepoels','facebook','2016-11-30 14:17:58','2017-02-05 14:36:54'),(2,'109639777553681644106','♉҉Ed҉ZiF҉y♉','Vincent Brepoels','google','2016-12-02 09:56:25','2017-01-25 08:40:21'),(3,'112087008033114081000',NULL,'Louis Brepoels','google','2016-12-03 10:25:00','2016-12-03 10:25:00'),(4,'112683819159520522167','shaddowBullet ','shaddowBullet Cox','google','2016-12-03 11:32:34','2016-12-03 11:32:45'),(5,'102320619198034360379',NULL,'Man Man','google','2016-12-14 03:56:51','2016-12-14 03:56:51'),(6,'641150366056835',NULL,'Shawaka A. Salh','facebook','2016-12-20 13:01:02','2016-12-20 13:01:02'),(7,'118059204862255960436','saveme','???','google','2017-01-10 10:20:01','2017-01-10 10:20:15'),(8,'1625798637725928',NULL,'?l Ãrrøw Ÿ?hÿå','facebook','2017-01-16 18:30:22','2017-01-16 18:30:22'),(9,'111056004488610250024',NULL,'Christopher Faniel','google','2017-01-17 18:09:10','2017-01-17 18:09:10'),(10,'1310556329005765',NULL,'Yulia Dulevich','facebook','2017-01-26 14:08:44','2017-01-26 14:08:44');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UsersLogging`
--

DROP TABLE IF EXISTS `UsersLogging`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UsersLogging` (
  `userId` varchar(50) DEFAULT NULL,
  `content` varchar(4000) DEFAULT NULL,
  `logdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UsersLogging`
--

LOCK TABLES `UsersLogging` WRITE;
/*!40000 ALTER TABLE `UsersLogging` DISABLE KEYS */;
INSERT INTO `UsersLogging` VALUES ('109639777553681644106','{\"notification_type\":\"user_balance_operation\",\"id_operation\":66440789,\"operation_type\":\"inGamePurchase\",\"user\":{\"id\":\"109639777553681644106\",\"name\":\"Vincent Brepoels\",\"country\":\"BE\"},\"items_operation_type\":\"add\",\"items\":[{\"sku\":\"Santaclaus\",\"amount\":1}],\"virtual_currency_balance\":{\"old_value\":8100,\"new_value\":2100,\"diff\":-6000}}','2016-11-29 14:14:08'),('109639777553681644106','{\"notification_type\":\"user_balance_operation\",\"id_operation\":66440789,\"operation_type\":\"inGamePurchase\",\"user\":{\"id\":\"109639777553681644106\",\"name\":\"Vincent Brepoels\",\"country\":\"BE\"},\"items_operation_type\":\"add\",\"items\":[{\"sku\":\"Santaclaus\",\"amount\":1}],\"virtual_currency_balance\":{\"old_value\":8100,\"new_value\":2100,\"diff\":-6000}}','2016-11-29 14:15:01'),('109639777553681644106','{\"notification_type\":\"user_balance_operation\",\"id_operation\":66440789,\"operation_type\":\"inGamePurchase\",\"user\":{\"id\":\"109639777553681644106\",\"name\":\"Vincent Brepoels\",\"country\":\"BE\"},\"items_operation_type\":\"add\",\"items\":[{\"sku\":\"Santaclaus\",\"amount\":1}],\"virtual_currency_balance\":{\"old_value\":8100,\"new_value\":2100,\"diff\":-6000}}','2016-11-29 14:16:28'),('109639777553681644106','{\"notification_type\":\"user_balance_operation\",\"id_operation\":66546638,\"operation_type\":\"inGamePurchase\",\"user\":{\"id\":\"109639777553681644106\",\"name\":\"Vincent Brepoels\",\"country\":\"BE\"},\"items_operation_type\":\"add\",\"items\":[{\"sku\":\"Robot1\",\"amount\":1}],\"virtual_currency_balance\":{\"old_value\":3100,\"new_value\":100,\"diff\":-3000}}','2016-11-30 11:35:02'),('10210078089256409','{\"notification_type\":\"user_balance_operation\",\"id_operation\":66560122,\"operation_type\":\"internal\",\"user\":{\"id\":\"10210078089256409\",\"name\":\"Vincent Brepoels\",\"country\":\"BE\"},\"virtual_currency_balance\":{\"old_value\":7100,\"new_value\":9100,\"diff\":2000}}','2016-11-30 14:43:27'),('10210078089256409','{\"notification_type\":\"user_balance_operation\",\"id_operation\":66560126,\"operation_type\":\"internal\",\"user\":{\"id\":\"10210078089256409\",\"name\":\"Vincent Brepoels\",\"country\":\"BE\"},\"virtual_currency_balance\":{\"old_value\":9100,\"new_value\":11100,\"diff\":2000}}','2016-11-30 14:43:30'),('10210078089256409','{\"notification_type\":\"user_balance_operation\",\"id_operation\":66950761,\"operation_type\":\"internal\",\"user\":{\"id\":\"10210078089256409\",\"name\":\"Vincent Brepoels\",\"country\":\"BE\"},\"virtual_currency_balance\":{\"old_value\":11100,\"new_value\":13100,\"diff\":2000}}','2016-12-03 08:25:46'),(':{','{\"notification_type\":\"user_balance_operation\",\"id_operation\":69646327,\"operation_type\":\"internal\",\"user\":{\"id\":\":{\"},\"virtual_currency_balance\":{\"old_value\":0,\"new_value\":2000,\"diff\":2000}}','2016-12-21 06:50:27'),('10210078089256409','{\"notification_type\":\"user_balance_operation\",\"id_operation\":70361404,\"operation_type\":\"internal\",\"user\":{\"id\":\"10210078089256409\",\"name\":\"Vincent Brepoels\",\"country\":\"BE\"},\"virtual_currency_balance\":{\"old_value\":13100,\"new_value\":15100,\"diff\":2000}}','2016-12-26 14:47:54'),(':{','{\"notification_type\":\"user_balance_operation\",\"id_operation\":71338101,\"operation_type\":\"internal\",\"user\":{\"id\":\":{\"},\"virtual_currency_balance\":{\"old_value\":2000,\"new_value\":4000,\"diff\":2000}}','2017-01-02 17:51:06'),(':{','{\"notification_type\":\"user_balance_operation\",\"id_operation\":73037825,\"operation_type\":\"internal\",\"user\":{\"id\":\":{\"},\"virtual_currency_balance\":{\"old_value\":4000,\"new_value\":6000,\"diff\":2000}}','2017-01-16 06:07:11');
/*!40000 ALTER TABLE `UsersLogging` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-02-08  4:33:26
