export interface ISecurityClaimUpd {
    securityClaimId: string;
    description: string;
    enabled: boolean;
    origin: string;
    validationPattern: string;
    createdBy: number;
    createdOn: Date;
    lastUpdatedBy?: number;
    lastUpdatedOn?: Date;
}