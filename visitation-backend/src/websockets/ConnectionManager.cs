using System.Net.WebSockets;
using System.Collections.Concurrent;

public class ConnectionManager
{
    // You can use WebSocket as the key, or a custom connection ID
    private readonly ConcurrentDictionary<WebSocket, (string OrganizationID, string UserID)> _connections = new();

    public void AddOrUpdate(WebSocket socket, string orgId, string userId)
        => _connections[socket] = (orgId, userId);

    public (string OrganizationID, string UserID)? Get(WebSocket socket)
        => _connections.TryGetValue(socket, out var value) ? value : null;

    public void Remove(WebSocket socket)
        => _connections.TryRemove(socket, out _);

    public IEnumerable<(WebSocket Socket, string OrganizationID, string UserID)> GetAll()
        => _connections.Select(kvp => (kvp.Key, kvp.Value.OrganizationID, kvp.Value.UserID));
}