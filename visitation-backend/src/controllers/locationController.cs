using System.Security.Claims;
using Microsoft.AspNetCore.Mvc; 
using Microsoft.Data.SqlClient;

public static class LocationController
{
    public static void MapLocationRoutes(WebApplication app, string connectionString)
    {
        app.MapGet("/visitsAtLocation", async (HttpContext httpContext, int locationID) =>
        {
            var orgClaim = httpContext.User.FindFirst("OrganizationID");
            if (orgClaim == null)
                return Results.Unauthorized();

            int organizationID = int.Parse(orgClaim.Value);

            List<Visit> visits = new();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                    await conn.OpenAsync();

                    string query = @"
                    SELECT
                        v.VisitID,
                        v.VisitDate,
                        v.CreatedBy,
                        v.VisitOutcome,
                        v.Notes,
                        u.FirstName,
                        u.LastName

                    FROM Visits v
                    LEFT JOIN USERS u ON v.CreatedBy = u.ID
                    WHERE v.LocationID = @locationID
                    AND u.OrganizationID = @organizationID;";

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@locationID", locationID);
                        cmd.Parameters.AddWithValue("@organizationID", organizationID);

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                visits.Add(new Visit(
                                    reader.GetInt32(0), // Id
                                    reader.GetDateTime(1), // DateVisited
                                    reader.GetInt32(2), // CreatedBy
                                    reader.GetString(3), // VisitOutcome
                                    reader.GetString(4), // Notes
                                    reader.GetString(5), // FirstName
                                    reader.GetString(6)  // LastName
                                ));
                            }
                        }
                    }
                }

            return Results.Ok(visits);
        });

        app.MapGet("/nearbylocations", async (float latitude, float longitude, int radius, HttpContext httpContext) => {
            var orgClaim = httpContext.User.FindFirst("OrganizationID");
            if (orgClaim == null)
                return Results.Unauthorized();
            int organizationID = int.Parse(orgClaim.Value);

            List<Location> locations = new();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();


                    // The following query gets all locations within the specified radius
                    // This query also determines whether each location has been 'visited' 
                    // by the user's parent organization.
                    string query = @"
                        SELECT 
                            l.Id, 
                            l.Hash, 
                            l.Number, 
                            l.Street, 
                            l.City, 
                            l.State, 
                            l.Country, 
                            l.Postcode, 
                            l.Point.STDistance(geography::Point(@lat, @long, 4326)) AS DistanceMeters,
                            l.Point.Lat AS Latitude,
                            l.Point.Long AS Longitude,
                            CASE WHEN 
                                    v.LocationID IS NOT NULL 
                                    AND u.OrganizationID = @OrganizationID
                                THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS Visited
                            FROM Location l
                            LEFT JOIN Visits v ON l.Id = v.LocationID 
                            LEFT JOIN Users u ON v.CreatedBy = u.ID
                            WHERE l.Point.STDistance(geography::Point(@lat, @long, 4326)) <= @radius
                            ORDER BY DistanceMeters;";

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@lat", latitude);
                        cmd.Parameters.AddWithValue("@long", longitude);
                        cmd.Parameters.AddWithValue("@radius", radius);
                        cmd.Parameters.AddWithValue("@OrganizationID", organizationID);

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                locations.Add(new Location(
                                    reader.GetInt32(0), // Id
                                    reader.GetString(1), // Hash
                                    reader.GetString(2), // Number
                                    reader.GetString(3), // Street
                                    reader.GetString(4), // City
                                    reader.GetString(5), // State
                                    reader.GetString(6), // Country
                                    reader.GetString(7), // Postcode
                                    reader.GetDouble(8), // DistanceMeters
                                    reader.GetDouble(9), // Latitude
                                    reader.GetDouble(10), // Longitude
                                    reader.GetBoolean(11) // Visited
                                ));
                            }
                        }
                    }
                }

            } catch (Exception e)
            {
                Console.Write($"Error inside nearbylocations {e}");
            }

            return Results.Ok(locations);
        })
        .WithName("getNearbyLocations");


        // Provide location ID, and a new visit entry will be created
        app.MapPost("newvisit", async (int locationID, string visitOutcome, string notes, HttpContext httpContext) => {
            var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Results.Unauthorized(); 

            int userID = int.Parse(userIdClaim.Value); 
            
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                await conn.OpenAsync();

                string query = @"
                        INSERT INTO Visits (LocationID, CreatedBy, VisitOutcome, Notes)
                        VALUES (@locationID, @userID, @visitOutcome, @notes);";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@locationID", locationID);
                    cmd.Parameters.AddWithValue("@userID", userID);
                    cmd.Parameters.AddWithValue("@visitOutcome", visitOutcome);
                    cmd.Parameters.AddWithValue("@notes", notes);
                    await cmd.ExecuteNonQueryAsync();
                }
            }

            return Results.Ok(new { message = "Visit created successfully." });
        });
    }

        record Location(
            int Id, 
            string Hash, 
            string Number, 
            string Street, 
            string City, 
            string State, 
            string Country, 
            string Postcode, 
            double DistanceMeters,
            double Latitude,
            double Longitude,
            bool Visited
        );

        record Visit(
            int Id, 
            DateTime VisitDate, 
            int CreatedBy, 
            string VisitOutcome,
            string Notes,
            string FirstName,
            string LastName
        );
}

