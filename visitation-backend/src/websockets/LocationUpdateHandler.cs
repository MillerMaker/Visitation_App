using System.Net.WebSockets;
using System.Text.Json;
public class LocationUpdateHandler
{
    private readonly UserLocations _locations;
    private readonly ConnectionManager _connections;

    public LocationUpdateHandler(UserLocations locations, ConnectionManager connections){
        _locations = locations;
        _connections = connections;
    }

public Task HandleMessage(WebSocket socket, string message)
{
    try{
        var userData = JsonSerializer.Deserialize<LocationUpdateMessage>(message);
        if (userData != null) {
            _locations.UpdateLocation(userData.userID, userData.organizationID, userData.latitude, userData.longitude);
            _connections.AddOrUpdate(socket, userData.organizationID, userData.userID);
        }
    }
    catch (Exception e) {
        Console.WriteLine($"Error deserializing JSON: {e}");
    }
    return Task.CompletedTask;
}
}