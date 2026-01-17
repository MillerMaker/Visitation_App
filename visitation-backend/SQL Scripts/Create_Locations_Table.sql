CREATE TABLE Location (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Hash NVARCHAR(50),
    Number NVARCHAR(40),
    Street NVARCHAR(100),
	Unit NVARCHAR(100),
    City NVARCHAR(100),
	State NVARCHAR(100),
	Country NVARCHAR(100),
    Postcode NVARCHAR(20),
    Point GEOGRAPHY -- SQL Server spatial type
);