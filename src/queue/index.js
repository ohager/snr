/* eslint-disable camelcase */
const semverGte = require('semver/functions/gte')
const semverCoerce = require('semver/functions/coerce')
const { hasValidAddress } = require('../hasValidAddress')
const hasMinimumVersion = (target) => (operator) => semverGte(semverCoerce(operator.version), semverCoerce(target))

function asDate (dateTime) {
  return new Date(dateTime.getUTCFullYear(), dateTime.getUTCMonth(), dateTime.getUTCDate())
}

const fulfillsLastSeen = (operator) => {
  const today = asDate(new Date())
  return operator.last_online_at.getTime() - today.getTime() > 0
}

function findDuplicateOperatorIds (operators) {
  const addresses = new Set()
  const duplicates = []
  for (const op of operators) {
    if (addresses.has(op.platform)) {
      duplicates.push(op.announced_address)
    } else {
      addresses.add(op.platform)
    }
  }
  return duplicates
}

const main = async (context, opts) => {
  console.info(new Date(), 'SNR Queue started')
  const { minVersion, availability, exec } = opts
  const { database } = context

  const highlyAvailableOperators = await database.scan_peermonitor.findMany({
    where: {
      availability: {
        gte: availability
      }
    }
  })

  let eligibleOperators = highlyAvailableOperators
    .filter(hasValidAddress)
    .filter(hasMinimumVersion(minVersion))
    .filter(fulfillsLastSeen)

  const duplicateOperatorIds = findDuplicateOperatorIds(eligibleOperators)

  eligibleOperators = eligibleOperators
    .filter(({ announced_address }) => !duplicateOperatorIds.includes(announced_address))

  if (exec) {
    const eligibleOperatorIds = eligibleOperators
      .map(({ announced_address }) => announced_address)
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
    await database.scan_peermonitor.updateMany({
      where: {
        announced_address: {
          in: duplicateOperatorIds
        }
      },
      data: {
        reward_state: 'Duplicate'
      }
    })
  }

  if (!exec) {
    console.info('\n===========================================')
    console.info('                  DRY RUN')
    console.info('===========================================')
  }

  if (duplicateOperatorIds) {
    console.info('\n\n Found the following duplicates')
    console.table(duplicateOperatorIds.map(id => ({ announcedAddress: id })))
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
