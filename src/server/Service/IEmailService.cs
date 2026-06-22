using MimeKit;

namespace Cms360.Server
{
    public interface IEmailService
    {
        MimeMessage GetMessageObjForAuthLoginEmail(string emailID, string emailWording);
        MimeMessage GetMessageObjForEmail(string emailID);

        MimeMessage GetMessageObjForAuthLoginEmailEx(string emailID, string emailWording);
        MimeMessage GetMessageObjForEmailEx(string emailID);

        MimeMessage GetMessageObjForAuthLoginEmailStep(string emailID, string emailWording);
        MimeMessage GetMessageObjForEmailStep(string emailID);

        MimeMessage GetMessageObjForAuthLoginEmailHadaf(string emailID, string emailWording);
        MimeMessage GetMessageObjForEmailHadaf(string emailID);
    }
}