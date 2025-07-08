public class LocationUpdateMessage {
    public required string userID { get; set; }
    public required string organizationID { get; set; }
    public double latitude { get; set; }
    public double longitude { get; set; }
}