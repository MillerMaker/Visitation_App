SELECT
	VisitID,
	VisitDate,
	CreatedBy,
	Notes
FROM Location l
LEFT JOIN Visits v
ON l.ID = v.LocationID
WHERE LocationID = 8811;