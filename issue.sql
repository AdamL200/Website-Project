
-- make sure the websiteuser account is set up and has the correct privileges
CREATE USER IF NOT EXISTS websiteuser IDENTIFIED BY 'websitepassword';
GRANT INSERT, SELECT, UPDATE, DELETE ON website.* TO websiteuser;

DROP TABLE IF EXISTS issues;

CREATE TABLE IF NOT EXISTS issues (
  id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  appliance VARCHAR(25) NOT NULL,
  age INT NOT NULL,
  manufacturer VARCHAR(25) NOT NULL,
  summary VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  pay INT NOT NULL,
  location VARCHAR(30),
  date VARCHAR(20),
  username VARCHAR(50),
  status VARCHAR(20),
  technician VARCHAR(30)

);

INSERT INTO issues(appliance,age,manufacturer,summary,description,pay,location,username,date,status,technician)
	VALUES("microwave", "5", "Bosch", "My microwave broke", "I was using my microwave one day and I think the fuse is blown and I do not know how to fix it", "20", "200,305", "customer1", "25/11/2022,11:55", "unresolved", "Joe Faraday");

INSERT INTO issues(appliance,age,manufacturer,summary,description,pay,location,username,date,status,technician)
	VALUES("dishwasher", "2", "Amazon Electrics", "My Dishwasher flooded", "I was using my dishwasher one day when suddenly it started throwing water all over my kitchen", "50", "203,302","customer2", "25/12/2022,17:05", "pending", "Joanna Faraday");
