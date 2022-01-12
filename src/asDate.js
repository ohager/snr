function asDate (dateTime) {
  return new Date(dateTime.getUTCFullYear(), dateTime.getUTCMonth(), dateTime.getUTCDate())
}

module.exports = {
  asDate
}
