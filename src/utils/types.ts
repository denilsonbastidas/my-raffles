export interface RaffleType {
  description: string;
  images: string[];
  ticketPrice: number;
  visible: boolean;
  minValue: number;
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
  approved: string;
  _id: string;
  approvalCodes: string[];
}
