-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema create_paper
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema create_paper
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `create_paper` DEFAULT CHARACTER SET utf8 ;
USE `create_paper` ;

-- -----------------------------------------------------
-- Table `create_paper`.`create_paper`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `create_paper`.`create_paper` (
  `id` INT NOT NULL,
  `topic` VARCHAR(1000) NOT NULL,
  `message` VARCHAR(10000) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
