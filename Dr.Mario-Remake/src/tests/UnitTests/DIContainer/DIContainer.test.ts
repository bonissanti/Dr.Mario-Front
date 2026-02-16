import {describe, beforeEach, expect, it} from 'vitest';
import {DIContainer} from "../../../app/stores/DependencyInjection/Container/DIContainer.ts";

class CreditCard {
    owner: string | undefined;
    address: string | undefined;
    number: number = 0;

    set(owner: string, address: string, number: number) {
        this.owner = owner;
        this.address = address;
        this.number = number;
    }
}

class ShoppingBag {
    items: number[] = [];
    total = 0;
    addItem(item: { price: number }) {
        this.items.push(item.price);
        this.total += item.price;
    }
}

class Transaction {
    private creditCard: any;
    private shoppingBag: any;

    constructor(creditCard: any, shoppingBag: any) {
        this.creditCard = creditCard;
        this.shoppingBag = shoppingBag;
    }
    public transfer() {
        console.log(`Transfering ${this.shoppingBag.total} to ${this.creditCard.owner}`);
    }
}

const httpContext = {
    headers: {
        "content-type": "application/json"
    },
    body: {
        url: "https://www.myStore.com/checkout"
    }
}
const httpContext2 = {
    headers: {
        "content-type": "application/json"
    },
    body: {
        url: "https://www.myStore.com/checkout"
    }
}


class SendOrder {
    private creditCard: any;
    private shoppingBag: any;

    constructor(creditCard: any, shoppingBag: any) {
        this.creditCard = creditCard;
        this.shoppingBag = shoppingBag;
    }
    send() {
        console.log(`Sending ${this.shoppingBag.total} to ${this.creditCard.address}`);
    }
}

describe('DIContainer test', () => {
    let container: DIContainer;

    beforeEach(() => {
        container = new DIContainer();
        container.register('creditCard', CreditCard, 'scoped');
        container.register('shoppingBag', ShoppingBag, 'scoped');
        container.register('transaction', Transaction, 'transient', ['creditCard', 'shoppingBag']);
        container.register('sendOrder', SendOrder, 'transient', ['creditCard', 'shoppingBag']);

    })

    it('Resolve dependencies - scope DI', async () => {

        const creditCard = container.resolve('creditCard', httpContext);
        const shoppingBag = container.resolve('shoppingBag', httpContext);

        const creditCard2 = container.resolve('creditCard', httpContext2);
        const shoppingBag2 = container.resolve('shoppingBag', httpContext2);

        creditCard.set('Mario', 'Rua ABC', 1000);
        shoppingBag.addItem({ price: 100 });

        creditCard2.set('Luigi', 'Rua CBA', 1000);
        shoppingBag2.addItem({ price: 400 });

        const transaction = container.resolve('transaction', httpContext).transfer();
        const transaction2 = container.resolve('transaction', httpContext2).transfer();

        container.clearContext(httpContext);
        container.clearContext(httpContext2);

        expect(transaction.shoppingBag.total).toBe(100);
        expect(transaction2.shoppingBag.total).toBe(400);
    })
})