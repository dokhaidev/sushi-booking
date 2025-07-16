export interface Voucher {
  id: number;
  code: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  status: string;
  usage_limit: number;
  used: number;
  required_points?: number;
  required_total?: number;
  is_personal?: boolean;
  describe?: string;
}

export interface VoucherAdd {
  code: string;
  usage_limit: number;
  used?: number;
  discount_value: number;
  start_date: string;
  end_date: string;
  status?: string;
  required_points?: number;
  required_total?: number;
  is_personal?: boolean;
  describe?: string;
}