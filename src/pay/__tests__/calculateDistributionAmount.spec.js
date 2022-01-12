/* global describe, it, expect */

const { calculateDistributionAmount } = require('../index')
const { Amount } = require('@signumjs/util')
describe('calculateDistributionAmount', () => {
  it('should calculate correctly the amounts', () => {
    const MockedPayees10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const MockedPayees20 = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    ]
    const MockedPayees50 = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    ]

    const Balance = Amount.fromSigna(100)
    expect(calculateDistributionAmount(Balance, MockedPayees10, 5).getSigna()).toBe('9.98853')
    expect(calculateDistributionAmount(Balance, MockedPayees20, 8).getSigna()).toBe('4.9938975')
    expect(calculateDistributionAmount(Balance, MockedPayees50, 6).getSigna()).toBe('1.996677')
  })
  it('should throw error on zero payees', () => {
    const Balance = Amount.fromSigna(100)
    expect(() => calculateDistributionAmount(Balance, [])).toThrow('No payee available')
  })
  it('should throw error on zero or very small balance', () => {
    const Balance = Amount.fromSigna(0.001)
    expect(() => calculateDistributionAmount(Balance, [1, 2, 3, 4])).toThrow('Too little balance on payers account')
  })
})
