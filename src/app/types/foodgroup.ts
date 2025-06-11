export interface Group {
    id: number;
    name: string;
    category?: {
        id: number;
        name: string;
    };
}