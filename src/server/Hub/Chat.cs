/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

using Microsoft.AspNetCore.SignalR;

namespace Cms360.Server.Hubs {

    public class Chat : Hub {
        public void BroadcastMessage (string name, string message) {
            Clients.All.SendAsync ("broadcastMessage", name, message);
        }
        public void Echo (string name, string message) {
            Clients.Client (Context.ConnectionId).SendAsync ("echo", name, message + " (echo from server)");
        }
    }
}