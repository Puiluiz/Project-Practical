export class VerifyPaymentDto {
  transactionId: string;
  userId: number;
  phone: string;  // Add phone to the DTO
}
