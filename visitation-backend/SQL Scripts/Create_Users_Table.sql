USE VisitTrackingDB

CREATE TABLE Users (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(20), 
    LastName NVARCHAR(20),
	Phone NVARCHAR(20),
	Email NVARCHAR(50),
);
