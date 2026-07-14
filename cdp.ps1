$code = @"
using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

public class CDPClient {
    public static string SendCommand(string wsUrl, string message) {
        using (var ws = new ClientWebSocket()) {
            ws.ConnectAsync(new Uri(wsUrl), CancellationToken.None).Wait();
            var bytes = Encoding.UTF8.GetBytes(message);
            ws.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, CancellationToken.None).Wait();
            
            var buffer = new byte[1024 * 1024];
            var result = ws.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None).Result;
            string response = Encoding.UTF8.GetString(buffer, 0, result.Count);
            ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None).Wait();
            return response;
        }
    }
}
"@
Add-Type -TypeDefinition $code -Language CSharp
[CDPClient]::SendCommand($args[0], $args[1])
