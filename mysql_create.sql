CREATE TABLE `location` (
	`locationid` INT NOT NULL AUTO_INCREMENT,
	`parentlocation` INT,
	`name` varchar(25),
	`tag` varchar(25) NOT NULL UNIQUE,
	`description` VARCHAR(255),
	PRIMARY KEY (`locationid`)
);

CREATE TABLE `dataType` (
	`datatypeid` INT NOT NULL AUTO_INCREMENT,
	`name` varchar(25) NOT NULL,
	`tag` varchar(25) NOT NULL,
	`symbol` varchar(5),
	`description` TEXT,
	PRIMARY KEY (`datatypeid`)
);

CREATE TABLE `readings` (
	`readingid` INT NOT NULL AUTO_INCREMENT,
	`locationid` INT NOT NULL,
	`datatypeid` INT NOT NULL,
	`reading` FLOAT NOT NULL,
	`timestamp` DATETIME NOT NULL,
	PRIMARY KEY (`readingid`)
);

ALTER TABLE `location` ADD CONSTRAINT `location_fk0` FOREIGN KEY (`parentlocation`) REFERENCES `location`(`locationid`);

ALTER TABLE `readings` ADD CONSTRAINT `readings_fk0` FOREIGN KEY (`locationid`) REFERENCES `location`(`locationid`);

ALTER TABLE `readings` ADD CONSTRAINT `readings_fk1` FOREIGN KEY (`datatypeid`) REFERENCES `dataType`(`datatypeid`);

