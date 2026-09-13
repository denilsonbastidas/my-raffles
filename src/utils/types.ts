export interface PrizeType {
  title: string;
  amount: string;
}

export interface RaffleType {
  name: string;
  description: string;
  images: string[];
  ticketPrice: string;
  visible: boolean;
  minValue: number;
  prizes?: PrizeType[];
}
export interface ResponseAuthType {
  message: string;
  token: string;
}

export interface TicketType {
  numberTickets: number;
  fullName: string;
  email: string;
  phone: string;
  reference: string;
  voucher: string;
  paymentMethod: string;
  amountPaid: string;
  approved: string;
  _id: string;
  approvalCodes: string[];
  createdAt?: string;
}
