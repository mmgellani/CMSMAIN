using Microsoft.Azure.NotificationHubs;

namespace AppBackend.Models
{
    public class Notifications
    {
        public static Notifications Instance = new Notifications();

        public NotificationHubClient Hub { get; set; }

        private Notifications()
        {
            Hub = NotificationHubClient.CreateClientFromConnectionString("Endpoint=sb://cmsmobilehub.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=a2hk5brzqzfkHvNEJpl9XSI5CtpdZFgZelKc+PjB60s=", "cmsmobilenotification");
        }
    }


    public class NotificationsHadaf
    {
        public static NotificationsHadaf Instance = new NotificationsHadaf();

        public NotificationHubClient Hub { get; set; }

        private NotificationsHadaf()
        {
            Hub = NotificationHubClient.CreateClientFromConnectionString("Endpoint=sb://cmsmobilehub.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=/N7nNmcEyoxPlrJKE3nfC0TrSsy/9q8HB8GDi6G9AOM=", "hadaf");
        }
    }
}