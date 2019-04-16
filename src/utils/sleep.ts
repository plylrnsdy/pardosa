/**
 * Block the function n milliseconds.
 * @param {number} n
 * @example
 * await sleep(1000)
 */
export default function sleep(n: number) {
    return new Promise<void>(resolve => setTimeout(resolve, n))
}
