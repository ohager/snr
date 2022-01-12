/* eslint-disable camelcase */
const semverGte = require('semver/functions/gte')
const semverCoerce = require('semver/functions/coerce')
const { hasValidAddress } = require('../hasValidAddress')

const hasMinimumVersion = (target) => (operator) => semverGte(semverCoerce(operator.version), semverCoerce(target))

const fulfillsLastSeen = (target) => (operator) => {
  return operator.last_online_at.getTime() - target.getTime() > 0
}

const main = async (context, opts) => {
  console.info(new Date(), 'SNR Queue started')
  const { minVersion, availability, lastSeen, exec } = opts
  const { database } = context

  const highlyAvailableOperators = await database.scan_peermonitor.findMany({
    where: {
      availability: {
        gte: availability
      }
    }
  })

  const eligibleOperators = highlyAvailableOperators
    .filter(hasValidAddress)
    .filter(hasMinimumVersion(minVersion))
    .filter(fulfillsLastSeen(lastSeen))

  if (exec) {
    const eligibleOperatorIds = eligibleOperators.map(({ announced_address }) => announced_address)
    await database.scan_peermonitor.updateMany({
      where: {
        announced_address: {
          in: eligibleOperatorIds
        }
      },
      data: {
        reward_state: 'Queued'
      }
    })
  }

  if (!exec) {
    console.info('\n===========================================')
    console.info('                  DRY RUN')
    console.info('===========================================')
  }

  console.info('\n\n Queueing the following operators')
  console.table(eligibleOperators.map(o => ({
    announcedAddress: o.announced_address,
    platform: o.platform,
    version: o.version,
    availability: o.availability,
    lastOnlineAt: o.last_online_at
  })))

  console.info(new Date(), 'SNR Queue finished')
}
module.exports = {
  main
}
