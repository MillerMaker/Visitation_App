using System.Net.WebSockets; 
using System.Text;

public class WebSocketManager {
     
    private readonly LocationBroadcastHandler _broadcastHandler;
    private readonly LocationUpdateHandler _locationUpdateHandler;
    public WebSocketManager( LocationUpdateHandler locationUpdateHandler,LocationBroadcastHandler broadcastHandler) { 
        _locationUpdateHandler = locationUpdateHandler;
        _broadcastHandler = broadcastHandler;
    }

    public void MapWebSocketRoutes(WebApplication app) {
        app.UseWebSockets();
        app.Use(async (context, next) => {
            if (context.WebSockets.IsWebSocketRequest) {
                var socket = await context.WebSockets.AcceptWebSocketAsync();
                await HandleWebSocket(socket);
            } else {
                await next();
            }
        });
    }

    public async Task HandleWebSocket(WebSocket socket) {
        while (socket.State == WebSocketState.Open) {
            var message = await ReceiveMessage(socket);
            if (message == null) break;
 
            await _locationUpdateHandler.HandleMessage(socket, message);
            await _broadcastHandler.BroadcastUserLocations(socket);
        }
        await CloseSocket(socket);
    }

    private async Task<string?> ReceiveMessage(WebSocket socket) {
        var buffer = new byte[1024 * 4];
        var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        if (result.MessageType == WebSocketMessageType.Close)
            return null;
        return Encoding.UTF8.GetString(buffer, 0, result.Count);
    }

    private async Task CloseSocket(WebSocket socket) {
        if (socket.State == WebSocketState.Open)
            await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
    }
}