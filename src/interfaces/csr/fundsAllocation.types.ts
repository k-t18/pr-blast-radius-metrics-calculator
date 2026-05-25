export interface CSRFundsAllocation {
    name: string;
    value: number;
}

export interface CSRFundsAllocationResponse {
    fundsAllocation: CSRFundsAllocation[];
}
