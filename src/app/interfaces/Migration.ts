export interface Migration{
    _id?: string;
    op: string;
    address: string;
    email: string;
    imagePath: string;
    _date: string;
}