USE VisitTrackingDB

CREATE TABLE Visits (
    VisitID INT IDENTITY(1,1) PRIMARY KEY,
    CreatedBy INT, 
    LocationID INT NOT NULL,
    VisitDate DATETIME NOT NULL DEFAULT GETDATE(),
    VisitOutcome VARCHAR(50), -- Receptive, Unreceptive, Didn't Answer, etc.
    Notes NVARCHAR(MAX),
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id),
    FOREIGN KEY (LocationID) REFERENCES Location(Id)
);

