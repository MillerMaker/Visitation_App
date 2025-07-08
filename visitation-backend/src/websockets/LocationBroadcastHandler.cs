using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

public class LocationBroadcastHandler
{
    private readonly UserLocations _locations;
    private readonly ConnectionManager _connections;

    public LocationBroadcastHandler(UserLocations locations, ConnectionManager connections)
    {
        _locations = locations;
        _connections = connections;
    }

    public async Task BroadcastUserLocations(WebSocket socket)
    {
        var connection = _connections.Get(socket);
        if (connection != null) {
            var userLocations = _locations.GetLocationsForOrg(connection.Value.OrganizationID);
            var message = JsonSerializer.Serialize(userLocations);
            var buffer = Encoding.UTF8.GetBytes(message);
            await socket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }
}