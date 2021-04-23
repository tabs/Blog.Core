using QRCoder;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Common.Helper
{
    public interface IQRCode
    {
        Bitmap GetQRCode(string url, int pixel);
    }

    public class QRCodeHelper : IQRCode
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="url">存储内容</param>
        /// <param name="pixel">像素大小</param>
        /// <returns></returns>
        public Bitmap GetQRCode(string url, int pixel)
        {
            QRCodeGenerator generator = new QRCodeGenerator();
            QRCodeData codeData = generator.CreateQrCode(url, QRCodeGenerator.ECCLevel.M, true);
            QRCode qrcode = new QRCode(codeData);
            Bitmap qrImage = qrcode.GetGraphic(pixel, Color.Black, Color.White, true);
            return qrImage;
        }
    }
}
