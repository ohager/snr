/* eslint-disable camelcase */
const { Address } = require('@signumjs/core')
const chunk = require('lodash.chunk')
const { FeeQuantPlanck, Amount } = require('@signumjs/util')
const { generateMasterKeys } = require('@signumjs/crypto')

function chopFraction (amountString) {
  const found = amountString.indexOf('.')
  return found !== -1 ? amountString.substr(0, amountString.indexOf('.')) : amountString
}

function hasValidAddress (operator) {
  try {
    Address.fromReedSolomonAddress(operator.platform)
    return true
  } catch (e) {
    return false
  }
}

const EpsilonAmount = Amount.fromSigna(0.1)
const MaxMultiOut = 128

function calculateMultiOutFee (recipientCount) {
  const factor = Math.ceil(((recipientCount * 8) / 1024) * 6)
  return Amount.fromPlanck(FeeQuantPlanck).multiply(factor)
}

function calculateDistributionAmount (balanceAmount, payees, maxPayeesPerTx = MaxMultiOut) {
  if (balanceAmount.lessOrEqual(EpsilonAmount)) {
    throw Error(`Too little balance on payers account: ${balanceAmount.getSigna()}`)
  }

  if (!payees.length) {
    throw Error('No payee available')
  }

  const availableAmount = balanceAmount.clone().subtract(EpsilonAmount) // reserve some Signa
  const chunkedOperators = chunk(payees, maxPayeesPerTx)
  for (const operators of chunkedOperators) { // represents number of tx
    const txFee = calculateMultiOutFee(operators.length)
    availableAmount.subtract(txFee)
  }
  return availableAmount.divide(payees.length)
}

function dedupeByAddress (payableOperators) {
  const uniqueAddresses = new Map()
  for (const op of payableOperators) {
    if (!uniqueAddresses.has(op.platform)) {
      uniqueAddresses.set(op.platform, op)
    }
  }
  return Array.from(uniqueAddresses.values())
}

const main = async (context, opts) => {
  console.info(new Date(), 'SNR Pay started', !opts.exec ? 'DRY RUN' : '')
  const { database, ledger, config } = context
  let payableOperators = await database.scan_peermonitor.findMany({
    where: {
      reward_state: 'Queued'
    }
  })

  payableOperators = dedupeByAddress(payableOperators)

  const invalidOperatorIds = payableOperators.filter(op => !hasValidAddress(op)).map(({ announced_address }) => announced_address)
  if (invalidOperatorIds.length) {
    await database.scan_peermonitor.updateMany({
      where: {
        announced_address: { in: invalidOperatorIds }
      },
      data: {
        reward_state: 'InvalidAddress',
        reward_time: null
      }
    })
  }

  const legitOperators = payableOperators.filter(hasValidAddress)
  const keys = generateMasterKeys(config.passphrase)
  let amount = Amount.fromSigna(opts.amount || 0)
  if (amount.lessOrEqual(EpsilonAmount)) {
    const payerId = Address.fromPublicKey(keys.publicKey).getNumericId()
    const { balanceNQT } = await ledger.account.getAccountBalance(payerId)
    amount = calculateDistributionAmount(Amount.fromPlanck(balanceNQT), legitOperators)
  }

  const chunkedOperators = chunk(legitOperators, MaxMultiOut)
  const totalCosts = Amount.Zero()
  let hadAtLeastOneError = false
  for (const operators of chunkedOperators) {
    const recipientCount = operators.length
    const recipientIds = operators.map(({ platform }) => Address.fromReedSolomonAddress(platform).getNumericId())
    const fee = calculateMultiOutFee(recipientCount)
    totalCosts.add(amount.clone().multiply(recipientCount)).add(fee)
    try {
      if (opts.exec) {
        const transactionId = await ledger.transaction.sendSameAmountToMultipleRecipients(
          chopFraction(amount.getPlanck()),
          chopFraction(fee.getPlanck()),
          recipientIds,
          keys.publicKey,
          keys.signPrivateKey
        )

        const ids = operators.map(({ announced_address }) => announced_address)
        await database.scan_peermonitor.updateMany({
          where: {
            announced_address: { in: ids }
          },
          data: {
            reward_state: 'Paid',
            reward_time: new Date()
          }
        })
        console.info('\nSuccessfully sent:', transactionId)
      } else {
        console.info('\n===========================================')
        console.info('                  DRY RUN')
        console.info('===========================================')

        await Promise.resolve() // dummy op
        console.info(`\nWould have sent ${amount.getSigna().toString()} (Fee: ${fee.getSigna().toString()}) to:`)
        // eslint-disable-next-line camelcase
        console.table(operators.map(({ platform }) => platform))
      }
    } catch (e) {
      console.error('⚠ - Failure:', e)
      hadAtLeastOneError = true
    }
  }

  console.info('\n====================================================')
  if (hadAtLeastOneError) {
    console.info('⚠ AT LEAST ONE ERROR OCCURRED')
  } else {
    console.info('✅ SUCCESS')
  }
  // next line is a workaround for a small bug in signumjs
  console.info(`TOTAL PAID: ${totalCosts} (fees included)`)
  console.info(`TRANSACTIONS: ${chunkedOperators.length}`)
  console.info(`RECIPIENTS: ${legitOperators.length}`)
  console.info('====================================================')
  console.info(new Date(), 'SNR Pay finished')
}
module.exports = {
  main,
  calculateMultiOutFee,
  calculateDistributionAmount
}
