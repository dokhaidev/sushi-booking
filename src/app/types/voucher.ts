export interface Voucher {
    id: number;
    code: string;
    discount_value: number;
    start_date: string;
    end_date: string;
    status: string;
    usage_limit: number;
}