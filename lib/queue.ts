import LinkedList from './linked-list';

export default class Queue<T> {

    protected list: LinkedList<T>

    constructor(array?: T[]) {
        this.list = new LinkedList<T>(array);
    }

    enqueue(...items: T[]): Queue<T> {
        this.list.add(...items);
        return this;
    }
    dequeue(): T | undefined {
        return this.list.remove(0);
    }
    peek(): T | undefined {
        return this.list.get(0);
    }

    size(): number {
        return this.list.size();
    }
    isEmpty(): boolean {
        return this.list.isEmpty();
    }

    toArray(): T[] {
        return this.list.toArray();
    }
    toJSON() {
        return this.list.toJSON();
    }
}
