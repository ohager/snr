/* eslint-disable camelcase */
const semverGte = require('semver/functions/gte')
const semverCoerce = require('semver/functions/coerce')
const { hasValidAddress } = require('../hasValidAddress')
const hasMinimumVersion = (target) => (operator) => semverGte(semverCoerce(operator.version), semverCoerce(target))

function asDate (dateTime) {
  return new Date(dateTime.getUTCFullYear(), dateTime.getUTCMonth(), dateTime.getUTCDate())
}

const lastSeenToday = (operator) => {
  const today = asDate(new Date())
  return operator.last_online_at.getTime() - today.getTime() > 0
}

function findDuplicates (operators) {
  const platforms = new Set()
  const addresses = new Set()
  const duplicates = []
  for (const op of operators) {
    if (platforms.has(op.platform) || addresses.has(op.announced_address)) {
      duplicates.push(op.id)
    } else {
      platforms.add(op.platform)
      addresses.add(op.announced_address)
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
    .filter(lastSeenToday)

  const duplicates = findDuplicates(eligibleOperators)

  eligibleOperators = eligibleOperators
    .filter(({ id }) => !duplicates.includes(id))

  if (exec) {
    const eligibleIds = eligibleOperators
      .map(({ id }) => id)
    await database.scan_peermonitor.updateMany({
      where: {
        id: {
          in: eligibleIds
        }
      },
      data: {
        reward_state: 'Queued'
      }
    })
    await database.scan_peermonitor.updateMany({
      where: {
        id: {
          in: duplicates
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

  if (duplicates) {
    console.info('\n\n Found the following duplicates')
    console.table(duplicates.map(id => ({ id })))
  }

  console.info('\n\n Queueing the following operators')
  console.table(eligibleOperators.map(o => ({
    id: o.id,
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
