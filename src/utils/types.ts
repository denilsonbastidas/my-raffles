export interface PrizeType {
  title: string;
  amount: string;
}

export interface RaffleType {
  _id?: string;
  status?: "active" | "closed";
  createdAt?: string;
  closedAt?: string;
  totalSold?: number;
  totalSoldWithNoAproved?: number;
  name: string;
  description: string;
  images: string[];
  ticketPrice: string;
  visible: boolean;
  minValue: number;
  prizes?: PrizeType[];
}
export interface RaffleRecord extends RaffleType {
  _id: string;
  status: "active" | "closed";
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
  approved: boolean;
  raffleId: string;
  rejected?: boolean;
  _id: string;
  approvalCodes: string[];
  createdAt?: string;
}
