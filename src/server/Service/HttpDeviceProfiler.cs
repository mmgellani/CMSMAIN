using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Cms360.Contract;
using Cms360.Data;
using Cms360.Data.Model;
using Cms360.Service;
using Wangkanai.Detection;

namespace Cms360.Server
{
    public sealed class HttpDeviceProfiler : IDeviceProfiler
    {
        private const string EncryptionSalt = "UqA24EjKxWOUHpXqBvjd8mWhJLa7dxVPbew/7JfUejI=";
        private readonly ICryptoService crypto;
        private readonly IDetection detection;

        public HttpDeviceProfiler(ICryptoService crypto, IDetection detection)
        {
            this.crypto = crypto;
            this.detection = detection;
        }

        public string DeriveFingerprint(IUser user)
        {
            if (user == null)
                throw new ArgumentNullException($"{nameof(user)}");

            string browserName = detection?.Browser.Name;
            string browserVersion = detection?.Browser.Version.ToString();
            string browserType = detection?.Browser.Type.ToString();
            string deviceType = detection?.Device.Type.ToString();

            var blocks = new string[]
            {
                browserName, browserVersion, browserType, deviceType, user.Email
            };

            string data = string.Empty;

            foreach (string block in blocks)
            {
                if (!string.IsNullOrWhiteSpace(block))
                    data = data + block.Trim();
            }

            return this.crypto.CreateKey(EncryptionSalt, data);
        }

        public string DeriveFingerprintWebSite(string user)
        {
            if (user == null)
                throw new ArgumentNullException($"{nameof(user)}");

            string browserName = detection?.Browser.Name;
            string browserVersion = detection?.Browser.Version.ToString();
            string browserType = detection?.Browser.Type.ToString();
            string deviceType = detection?.Device.Type.ToString();

            var blocks = new string[]
            {
                browserName, browserVersion, browserType, deviceType, user
            };

            string data = string.Empty;

            foreach (string block in blocks)
            {
                if (!string.IsNullOrWhiteSpace(block))
                    data = data + block.Trim();
            }

            return this.crypto.CreateKey(EncryptionSalt, data);
        }

        public string DeriveFingerprintMobile(string user)
        {
            if (String.IsNullOrEmpty(user))
                throw new ArgumentNullException($"{nameof(user)}");

            string browserName = "Chrome";
            string browserVersion = "128.0.6613.138";
            string browserType = "Browser";
            string deviceType = "Desktop";

            var blocks = new string[]
            {
                browserName, browserVersion, browserType, deviceType, user
            };

            string data = string.Empty;

            foreach (string block in blocks)
            {
                if (!string.IsNullOrWhiteSpace(block))
                    data = data + block.Trim();
            }

            return this.crypto.CreateKey(EncryptionSalt, data);
        }
    }
}