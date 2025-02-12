export interface CallOptions {
    id: string;
}

export class Call {
    public readonly id: string;

    public constructor({ id }: CallOptions) {
        this.id = id;
    }
}