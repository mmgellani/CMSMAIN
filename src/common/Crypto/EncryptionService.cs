using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Security.Cryptography;
using Newtonsoft.Json.Linq;
using System.Linq;
using Newtonsoft.Json;


namespace common.Crypto
{

    public class EncryptionService
    {
        private readonly string _encryptionKey;

        public EncryptionService(string encryptionKey)
        {
            if (string.IsNullOrEmpty(encryptionKey) || encryptionKey.Length != 16)
            {
                throw new ArgumentException("Encryption key must be a 16-character string.");
            }

            _encryptionKey = encryptionKey;
        }
        private static JToken ConvertKeysToCamelCase(JToken token)
        {
            if (token is JObject obj)
            {
                return new JObject(obj.Properties()
                    .Select(p => new JProperty(ToCamelCase(p.Name), ConvertKeysToCamelCase(p.Value))));
            }
            else if (token is JArray array)
            {
                return new JArray(array.Select(ConvertKeysToCamelCase));
            }
            return token;
        }

        private static string ToCamelCase(string input)
        {
            if (string.IsNullOrEmpty(input) || !char.IsUpper(input[0]))
                return input;

            return char.ToLower(input[0]) + input.Substring(1);
        }
        public string Encrypt(string plainText)
        {

            JToken jsonObject = JToken.Parse(plainText);
            JToken camelCaseJsonObject = ConvertKeysToCamelCase(jsonObject);
            string camelCaseJson = JsonConvert.SerializeObject(camelCaseJsonObject, Formatting.Indented);

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(_encryptionKey);
                aes.IV = new byte[16];

                using (ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV))
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                        {
                            using (StreamWriter sw = new StreamWriter(cs))
                            {
                                sw.Write(camelCaseJson);
                            }
                        }
                        return Convert.ToBase64String(ms.ToArray());
                    }
                }
            }
        }

        public string Encrypt_plain(string plainText)
        {

            JToken jsonObject = JToken.Parse(plainText);

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(_encryptionKey);
                aes.IV = new byte[16];

                using (ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV))
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                        {
                            using (StreamWriter sw = new StreamWriter(cs))
                            {
                                sw.Write(jsonObject);
                            }
                        }
                        return Convert.ToBase64String(ms.ToArray());
                    }
                }
            }
        }

        public string Decrypt(string encryptedText)
        {
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(_encryptionKey);
                aes.IV = new byte[16]; // Same IV as used during encryption

                using (ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV))
                {
                    using (MemoryStream ms = new MemoryStream(Convert.FromBase64String(encryptedText)))
                    {
                        using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                        {
                            using (StreamReader sr = new StreamReader(cs))
                            {
                                return sr.ReadToEnd();
                            }
                        }
                    }
                }
            }
        }
    }
}
