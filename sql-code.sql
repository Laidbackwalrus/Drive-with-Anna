CREATE DATABASE main;
USE main;

CREATE TABLE students (
    studentID int AUTO_INCREMENT,
    firstName char(35),
    lastName char(35),
    email char(255),
    passwordHash char(255),
    sessionID char(32),
    sessionExpiry DATETIME,
    admin BOOL DEFAULT 0,
    PRIMARY KEY (studentID)
);

CREATE TABLE lessons (
    lessonID int AUTO_INCREMENT,
    studentID int NOT NULL,
    length TINYINT,
    startTime DATETIME,
    price int,
    PRIMARY KEY (lessonID),
    FOREIGN KEY (studentID) REFERENCES students(studentID) 
);

CREATE TABLE working_slots (
    time DATETIME
);

/* CREATE TABLE reviews (
    reviewID int AUTO_INCREMENT,
    studentID int,
    rating TINYINT, 
    reviewDate date,
    reviewDis tinytext,
    PRIMARY KEY (reviewID),
    FOREIGN KEY (studentID) REFERENCES students(studentID) 
); */

INSERT INTO working_slots(time)
VALUES ("2023-03-7 11:00:00");
INSERT INTO working_slots(time)
VALUES ("2023-03-7 11:15:00");
INSERT INTO working_slots(time)
VALUES ("2023-03-7 11:30:00");
INSERT INTO working_slots(time)
VALUES ("2023-03-7 11:45:00");


INSERT INTO working_slots(time)
VALUES ("2023-03-15 10:00:00");
INSERT INTO working_slots(time)
VALUES ("2023-03-15 10:15:00");
INSERT INTO working_slots(time)
VALUES ("2023-03-15 10:30:00");
INSERT INTO working_slots(time)
VALUES ("2023-03-15 10:45:00");

INSERT INTO lessons (studentID, length, startTime)
VALUES (2, 1, "2023-03-07 10:00:00");


INSERT INTO reviews (studentID, rating, reviewDate, reviewDis)
VALUES (1, 7, "1963-09-11", "oh thats gooood");

alter table students add sessionExpiry DATETIME NOT NULL;
alter table students drop sessionExpiry;



SELECT l.length, l.startTime, s.firstName, s.lastName, s.email 
FROM lessons AS l 
INNER JOIN students AS s ON l.studentID = s.studentID
WHERE l.date BETWEEN 2023-03-01 10:15:00 AND 2023-03-01 12:15:00;

