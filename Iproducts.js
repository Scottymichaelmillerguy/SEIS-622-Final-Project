export interface IProduct {
    itemId: number;
    image: string;
    description: string;
    price: number;
    quantity: number;
}

export interface IDepartment {
    name: string;
    products: IProduct[];
}

export interface IStore {
    departments: IDepartment[];
}
