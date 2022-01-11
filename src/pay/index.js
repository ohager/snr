/* eslint-disable camelcase */
const { Address } = require('@signumjs/core')
const chunk = require('lodash.chunk')
const { FeeQuantPlanck, Amount } = require('@signumjs/util')
const { generateMasterKeys } = require('@signumjs/crypto')

function hasValidAddress (operator) {
  try {
    Address.fromReedSolomonAddress(operator.announced_address)
    return true
  } catch (e) {
    return false
  }
}

const MaxMultiOut = 128

function calculateMultiOutFee (recipientCount) {
  const factor = Math.ceil(recipientCount / MaxMultiOut)
  return Amount.fromPlanck(FeeQuantPlanck).multiply(factor)
}

const main = async (context, opts) => {
  console.info(new Date(), 'SNR Pay started', !opts.exec ? "DRY RUN" : "")
  const { database, ledger, config } = context
  const payableOperators = await database.scan_peermonitor.findMany({
    where: {
      reward_state: 'Queued'
    }
  })

  const legitOperators = payableOperators.filter(hasValidAddress)
  const amount = Amount.fromSigna(opts.amount)
  const keys = generateMasterKeys(config.passphrase)
  const chunkedOperators = chunk(legitOperators, MaxMultiOut)
  const totalCosts = Amount.Zero()
  let hadAtLeastOneError = false
  for (const operators of chunkedOperators) {
    const recipientCount = operators.length
    const recipientIds = operators.map(({ announced_address }) => Address.fromReedSolomonAddress(announced_address).getNumericId())
    const recipientAddresses = operators.map(({ announced_address }) => announced_address)
    const fee = calculateMultiOutFee(recipientCount)
    totalCosts.add(amount).multiply(recipientCount).add(fee)
    try {
      if (opts.exec) {
        const transactionId = await ledger.transaction.sendSameAmountToMultipleRecipients(
          amount.getPlanck(),
          fee.getPlanck(),
          recipientIds,
          keys.publicKey,
          keys.signPrivateKey
        )
        await database.scan_peermonitor.updateMany({
          where: {
            announced_address: { in: recipientAddresses }
          },
          data: {
            reward_state: 'Sent',
            reward_time: new Date()
          }
        })
        console.info('\nSuccessfully sent:', transactionId)
      } else {
        await Promise.resolve() // dummy op
        console.info(`\nWould have sent ${amount.getSigna().toString()} (Fee: ${fee.getSigna().toString()}) to:`)
        // eslint-disable-next-line camelcase
        console.table(operators.map(({ announced_address }) => announced_address))
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
  console.info(`TOTAL PAID: ${totalCosts.getSigna().toString()} (fees included)`)
  console.info(`TRANSACTIONS: ${chunkedOperators.length}`)
  console.info(`RECIPIENTS: ${legitOperators.length}`)
  console.info('====================================================')
  console.info(new Date(), 'SNR Pay finished')
}
module.exports = {
  main
}
