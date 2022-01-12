/* global describe, it, expect */

const { calculateMultiOutFee } = require('../index')
describe('calculateMultiOutFee', () => {
  it('should calculate correctly the fee', () => {
    expect(calculateMultiOutFee(128).getSigna()).toBe('0.0441')
    expect(calculateMultiOutFee(64).getSigna()).toBe('0.02205')
    expect(calculateMultiOutFee(32).getSigna()).toBe('0.0147')
    expect(calculateMultiOutFee(16).getSigna()).toBe('0.00735')
    expect(calculateMultiOutFee(8).getSigna()).toBe('0.00735')
    expect(calculateMultiOutFee(1).getSigna()).toBe('0.00735')
  })
})
