# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.19)
# Database: meterMiser
# Generation Time: 2017-10-18 14:08:07 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table ActivityLog
# ------------------------------------------------------------

CREATE TABLE `ActivityLog` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` int(2) NOT NULL,
  `message` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table LocationHours
# ------------------------------------------------------------

CREATE TABLE `LocationHours` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sunOpen` int(2) DEFAULT NULL,
  `sunClose` int(2) DEFAULT NULL,
  `monOpen` int(2) DEFAULT NULL,
  `monClose` int(2) DEFAULT NULL,
  `tuesOpen` int(2) DEFAULT NULL,
  `tuesClose` int(2) DEFAULT NULL,
  `wedOpen` int(2) DEFAULT NULL,
  `wedClose` int(2) DEFAULT NULL,
  `thursOpen` int(2) DEFAULT NULL,
  `thursClose` int(2) DEFAULT NULL,
  `friOpen` int(2) DEFAULT NULL,
  `friClose` int(2) DEFAULT NULL,
  `satOpen` int(2) DEFAULT NULL,
  `satClose` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Locations
# ------------------------------------------------------------

CREATE TABLE `Locations` (
  `locationId` int(6) unsigned NOT NULL,
  `name` varchar(32) NOT NULL DEFAULT '',
  `addr1` varchar(32) NOT NULL DEFAULT '',
  `addr2` varchar(32) DEFAULT NULL,
  `city` varchar(32) NOT NULL DEFAULT '',
  `state` char(2) DEFAULT NULL COMMENT 'Limiting to US Only',
  `zip5` int(5) NOT NULL,
  `zip4` int(4) DEFAULT NULL,
  PRIMARY KEY (`locationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Readings
# ------------------------------------------------------------

CREATE TABLE `Readings` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'From the system',
  `thermCreated` datetime NOT NULL COMMENT 'From the thermostat',
  `thermLocked` tinyint(1) DEFAULT NULL,
  `dispTemp` int(3) DEFAULT NULL,
  `heatSetPoint` int(3) DEFAULT NULL,
  `coolSetPoint` int(3) DEFAULT NULL,
  `displayUnits` char(1) DEFAULT '' COMMENT 'F is farenheit, C is celsius',
  `statusHeat` int(1) DEFAULT NULL,
  `statusCool` int(1) DEFAULT NULL,
  `heatLowerSetPt` int(3) DEFAULT NULL,
  `heatUpperSetPt` int(3) DEFAULT NULL,
  `coolLowerSetPt` int(3) DEFAULT NULL,
  `coolUpperSetPt` int(3) DEFAULT NULL,
  `schedHeatSp` int(3) DEFAULT NULL,
  `schedCoolSp` int(3) DEFAULT NULL,
  `systemSwitchPos` int(1) DEFAULT NULL,
  `equipmentStatus` char(3) DEFAULT NULL COMMENT 'On or Off, indicates if heating or cooling at time of poll',
  `fanPosition` char(4) DEFAULT NULL COMMENT 'Auto, Off, On',
  `fanRunning` tinyint(1) DEFAULT NULL,
  `weatherIsDefined` tinyint(1) DEFAULT NULL,
  `weatherIsValid` tinyint(1) DEFAULT NULL,
  `weatherTemp` int(2) DEFAULT NULL,
  `weatherTempUnit` char(9) DEFAULT NULL COMMENT 'Celsius or Farenheit',
  `weatherCondition` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Thermostats
# ------------------------------------------------------------

CREATE TABLE `Thermostats` (
  `thermostatId` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `deviceName` varchar(32) DEFAULT NULL,
  `userDefinedName` varchar(32) DEFAULT NULL,
  `macId` varchar(32) DEFAULT NULL,
  `DomainId` int(5) DEFAULT NULL,
  `canControlSchedule` tinyint(1) NOT NULL,
  `willSupportSchedule` tinyint(1) NOT NULL,
  `fanCanControl` tinyint(1) DEFAULT NULL,
  `fanCanSetAuto` tinyint(1) DEFAULT NULL,
  `fanCanSetOn` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`thermostatId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Users
# ------------------------------------------------------------

CREATE TABLE `Users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` text NOT NULL,
  `password` varbinary(32) NOT NULL DEFAULT '',
  `fname` varchar(32) DEFAULT NULL,
  `lname` varchar(32) DEFAULT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `smsphone` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
