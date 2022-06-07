import { Predicate } from 'hkt-ts/Predicate'
import { Refinement } from 'hkt-ts/Refinement'

export const POOR_SUCCESS_RATE = 0.01

const MIN_RUNS = 1000

/**
 * Throws a TypedIoArbitraryGeneratorError when the success rate of an Arbitrary.filter is less than a specified percentage.
 * Intended to avoid test cases hanging without any error to indicate where the problem is. It will allow for 1000 runs to
 * occur before beginning to attempt to compare the success rate accurrately.
 *
 * The first parameter is a string to direct the user to where the error occurred, the second the predicate to wrap this
 * behavior around, and the third optional parameter is a number between 0 and 1 to represent the percentage of success it
 * will fail on - defaults to 0.01 to indicate 1% success rate is considered a failure.
 */
export function throwOnPoorSuccessRate<A>(
  name: string,
  predicate: Predicate<A>,
  rate?: number,
): Predicate<A>

export function throwOnPoorSuccessRate<A, B extends A>(
  name: string,
  refinement: Refinement<A, B>,
  rate?: number,
): Refinement<A, B>

export function throwOnPoorSuccessRate<A>(
  name: string,
  predicate: Predicate<A>,
  rate: number = POOR_SUCCESS_RATE,
): Predicate<A> {
  let successful = 0
  let total = 0

  return (value: A): boolean => {
    const isSuccess = predicate(value)

    total += 1
    if (isSuccess) successful += 1

    // Throw if the error rate is too high
    if (total > MIN_RUNS && successful / total < rate) {
      throw new TypedIoArbitraryGeneratorError(
        `Unable to generate valid values for @typed/io Schema ${name}. ` +
          `An override must be provided for the schema.`,
      )
    }

    return isSuccess
  }
}

export class TypedIoArbitraryGeneratorError extends Error {}
