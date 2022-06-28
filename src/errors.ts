export class ContractAddressRequired extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = ContractAddressRequired.name;
    }
}

export class UnsupportedAbi extends Error {
    constructor() {
        super('Unsupported abi');
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = UnsupportedAbi.name;
    }
}

export class InvalidMnid extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = InvalidMnid.name;
    }
}