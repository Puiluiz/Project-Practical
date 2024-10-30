import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ManybahtService {
  private readonly apiUrl = `https://gift.truemoney.com/campaign/vouchers/`;

  // ฟังก์ชันในการเริ่มต้นการชำระเงินด้วย Truewallet
  async initiatePayment(hash: string): Promise<number> {
    console.log(hash)
    try {
      const response = await fetch(`https://gift.truemoney.com/campaign/vouchers/${hash}/redeem`, {
        headers: {
          "accept": "application/json",
          "accept-language": "en-US,en;q=0.7",
          "content-type": "application/json",
          "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Brave\";v=\"121\", \"Chromium\";v=\"121\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "Host": "gift.truemoney.com",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "Referer": "https://gift.truemoney.com/campaign/card",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        body: JSON.stringify({
          mobile: "0968641077",  // หมายเลขโทรศัพท์ตัวอย่าง
          voucher_hash: hash
        }),
        method: "POST"
      });

      const data = await response.json();
      if (data.status.code === "SUCCESS") {
        return parseFloat(data.data.my_ticket.amount_baht.replace(/,/g, ''));;  // คืนค่าจำนวนเงินที่แลกสำเร็จ
      } else {
        console.log(data)
        console.log("Failed to redeem code: " + hash);
        throw new HttpException('การแลกรหัสล้มเหลว', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error('Error redeeming voucher:', error.response);
      throw new HttpException('เกิดข้อผิดพลาดในการแลกรหัสบัตรกำนัล', HttpStatus.BAD_REQUEST);
    }
  }
}
