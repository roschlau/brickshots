/**
 * Creates a comparator function that sorts items based on a given order.
 *
 * @param order The order in which the items are to be sorted.
 *
 * @returns The comparator function that sorts items based on the given order. This function will throw if either of the
 *          values passed to it are not present in `order`.
 */
export function byOrder<T>(order: readonly T[]): (a: T, b: T) => number {
  const orderIndex = new Map<T, number>()
  order.forEach((value, index) => {
    orderIndex.set(value, index)
  })
  return (a: T, b: T) => {
    const aIndex = orderIndex.get(a)
    const bIndex = orderIndex.get(b)
    if (aIndex === undefined) {
      throw Error('Value ' + a + ' not present in ' + order.toString())
    }
    if (bIndex === undefined) {
      throw Error('Value ' + b + ' not present in ' + order.toString())
    }
    return aIndex - bIndex
  }
}
