CREATE TABLE UserInvites (
    OrganizationID INT NOT NULL,
	Phone VARCHAR(15), 
	Email NVARCHAR(50),
    FOREIGN KEY (OrganizationID) REFERENCES Organizations(ID)
);