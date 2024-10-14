export interface CallOptions {
    id: string;
}

export class Call {
    public readonly id: string;
    
    // private state: number;

    public constructor({ id }: CallOptions) {
        this.id = id;
    }

}