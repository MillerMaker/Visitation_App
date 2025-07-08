using System.Collections.Concurrent;

public class UserLocations {
    ConcurrentDictionary<string, ConcurrentDictionary<string, UserLocation>> _locationsByOrg = new();

    public void UpdateLocation(string userID, string organizationID, double latitude, double longitude) {
        var userLocation = new UserLocation {
            UserId = userID,
            OrganizationID = organizationID,
            Latitude = latitude,
            Longitude = longitude
        };

        _locationsByOrg.AddOrUpdate(organizationID,
            new ConcurrentDictionary<string, UserLocation> { [userID] = userLocation }, //Add logic
            (key, existingDict) => {
                existingDict[userID] = userLocation;
                return existingDict;
            } // Update Logic
        );
    }

    public List<UserLocation> GetLocationsForOrg(string orgId) {
        if (_locationsByOrg.TryGetValue(orgId, out var users)) {
            return users.Values.ToList();
        }
        return new List<UserLocation>();
    }
    
    public class UserLocation {
        public required string UserId { get; set; }
        public required string OrganizationID{ get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
