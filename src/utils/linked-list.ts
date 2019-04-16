interface LinkedListNode<T> {
    content: T | undefined
    next: LinkedListNode<T> | undefined
}

function createNode<T>(content?: T, next?: LinkedListNode<T>): LinkedListNode<T> {
    return { content, next }
}

export default class LinkedList<T> {

    private head: LinkedListNode<T> = createNode<T>()
    private tail: LinkedListNode<T> = this.head
    private _size: number = 0

    constructor(array?: T[]) {
        array && array.forEach(element => this.add(element));
    }

    private indexInRange(index: number): boolean {
        return 0 <= index && index < this._size;
    }
    private hasPreviousNode(index: number): boolean {
        return -1 <= --index && index < this._size;
    }

    firstNode(): LinkedListNode<T> | undefined {
        return this.head.next;
    }
    first(): T | undefined {
        return this.head.next && this.head.next.content;
    }
    last(): T | undefined {
        return this.tail.content;
    }
    get(index: number): T | undefined {
        if (this.indexInRange(index)) {
            let node = this.getNode(index);
            return node && node.content;
        }
    }
    private getNode(index: number): LinkedListNode<T> | undefined {
        let current = this.head;
        for (let i = -1; current; current = current.next as LinkedListNode<T>)
            if (i++ == index)
                return current;
        return undefined;
    }
    add(...items: T[]): LinkedList<T> {
        for (let i = 0, len = items.length; i < len; i++)
            this.insertAfter(this.tail, items[i]);
        return this;
    }
    insert(index: number, item: T): LinkedList<T> {
        if (this.hasPreviousNode(index)) {
            let previous = this.getNode(index - 1) as LinkedListNode<T>;
            this.insertAfter(previous, item);
        }
        return this;
    }
    private insertAfter(current: LinkedListNode<T>, item: T): void {
        current.next = createNode<T>(item, current.next);
        if (current === this.tail)
            this.tail = current.next;
        this._size++;
    }
    remove(index: number): T | undefined {
        if (this.hasPreviousNode(index) && this.indexInRange(index)) {
            let previous = this.getNode(index - 1) as LinkedListNode<T>;
            return this.removeAfter(previous).content;
        }
    }
    private removeAfter(current: LinkedListNode<T>): LinkedListNode<T> {
        let node = current.next as LinkedListNode<T>;
        current.next = node.next;
        if (node === this.tail)
            this.tail = current;
        this._size--;
        return node;
    }
    contains(item: T): boolean {
        for (let current = this.head; current; current = current.next as LinkedListNode<T>)
            if (current.content === item)
                return true;
        return false;
    }
    [Symbol.iterator]() {
        let iterator = {
            current: this.head,
            next: () => {
                // ENHANCE: use local variable instead of using property of object
                let current = iterator.current = iterator.current.next as LinkedListNode<T>;
                if (current)
                    return { value: current.content, done: false };
                else
                    return { value: null, done: true };
            }
        }
        return iterator;
    }

    size(): number {
        return this._size;
    }
    isEmpty(): boolean {
        return this._size === 0;
    }

    toArray(): T[] {
        let array = [] as T[];
        for (let current = this.head.next; current; current = current.next)
            array.push(current.content as T);
        return array;
    }
    toJSON() {
        return this.toArray();
    }
}
