const processData = {
  canStartRace: (ongoingRace, race) => {
    if (ongoingRace === '' && race.registrationIds.length > 0) { return true }
    return false
  },
  canStopRace: (result, laps) => {
    let canStop = true
    result.map(V => { if (V.laps < laps) { canStop = false } })
    return canStop
  },
  returnIdNameMap: (objs) => {
    let result = {}
    if (objs && objs.length > 0) { objs.map(obj => { result[obj.id] = obj.nameCht }) }
    return result
  },
  returnRegMap: (objs) => {
    let result = {}
    if (objs && objs.length > 0) { objs.map(obj => { result[obj.id] = obj }) }
    return result
  },
  returnFormattedTime: (milS) => {
    const sec = ((milS % 60000) / 1000).toFixed(2)
    const min = Math.floor(milS / 60000)
    return min + ':' + (sec < 10 ? '0' : '') + sec
  },
  returnLapRecord: (result, laps, startTime, raceStatus) => {
    let output = []
    let lastRecord = startTime
    let lapsLeft = laps
    let i

    if (result.length > 0) {
      for (i = 1; i <= result.length; i += 1) {
        if (result[i]) {
          output.push(processData.returnFormattedTime(result[i] - lastRecord))
          lastRecord = result[i]
          lapsLeft -= 1
        } else if (lapsLeft > 0 && raceStatus === 'started') {
          output.push('🕒')
          lapsLeft -= 1
        }
      }
    }
    for (i = 0; i < lapsLeft; i += 1) { output.push('-') }
    return output
  },
  returnAdvanceToId: (index, advancingRules) => {
    for (var i = 0; i < advancingRules.length; i += 1) {
      if (index >= advancingRules[i].rankFrom && index <= advancingRules[i].rankTo) { return advancingRules[i].toRace }
    }
    return undefined
  },
  returnMovedArray: (arr, oldIndex, newIndex) => {
    while (oldIndex < 0) { oldIndex += arr.length }
    while (newIndex < 0) { newIndex += arr.length }
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length
      while ((k--) + 1) { arr.push(undefined) }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
    return arr
  },
  returnOngoingRace: (ongoingRaceId, orderedRaces) => {
    if (ongoingRaceId === '') { return '' }
    for (let i = 0; i < orderedRaces.length; i += 1) { if (orderedRaces[i].id === ongoingRaceId) { return i } }
    return ''
  },
  returnRaceResult: (race, regs) => {
    if (race.result.length > 0) { return race.result }
    let sortTable = []
    let incomplete = []
    let notStarted = []
    const lastRecordIndex = race.laps

    race.registrationIds.map(regId => {
      const reg = regs.filter(V => (V.id === regId))[0]
      if (reg) {
        const record = race.recordsHashTable[reg.epc]
        if (record) {
          if (record[lastRecordIndex]) {
            sortTable.push([reg.epc, reg.id, reg.raceNumber, record[lastRecordIndex], record.length - 1, record])
          } else {
            incomplete.push([reg.epc, reg.id, reg.raceNumber, record[record.length - 1], record.length - 1, record])
          }
        } else {
          notStarted.push([reg.epc, reg.id, reg.raceNumber, 0, 0, [], reg.id])
        }
      }
    })
    sortTable.sort((a, b) => a[3] - b[3]) // sort completed racer by last lap record
    incomplete.sort((a, b) => b[4] - a[4]) // sort incompleted by laps
    incomplete.sort((a, b) => (a[4] === b[4]) ? a[3] - b[3] : 0) // sort incompleted same-lap by time
    notStarted.sort((a, b) => a[2] - b[2]) // sort notStart by raceNumber
    sortTable = sortTable.concat(incomplete).concat(notStarted)
    // sortTable: [epc, name, raceNumber, timestamp, laps, record]
    return sortTable.map((item, index) => ({ epc: item[0], registration: item[1], sum: (item[3]) ? processData.returnFormattedTime(item[3] - race.startTime) : '-', laps: item[4], lapRecords: processData.returnLapRecord(item[5], race.laps, race.startTime, race.raceStatus), advanceTo: processData.returnAdvanceToId(index, race.advancingRules) }))
  },
  returnRaceWithTrimmedResult: (race) => {
    let output = {...race}
    const lastRecordIndex = race.laps - 1
    output.result = output.result.map(V => {
      if (V.lapRecords.length > (lastRecordIndex + 1)) {
        // 只取 lastRecordIndex + 1筆資料
        V.lapRecords.splice(lastRecordIndex + 1, (V.lapRecords.length - (lastRecordIndex + 1)))
      }
      return V
    })
    return output
  },
  returnRaceResultSubmitArray: (race, races) => {
    let output = [{ id: race.id, result: race.result, raceStatus: 'submitted', submitTime: Date.now() }]
    let racesToAdvanceHashTable = {}
    race.result.map(record => {
      if (record.advanceTo) {
        if (!racesToAdvanceHashTable[record.advanceTo]) {
          const race = races.filter(V => (V.id === record.advanceTo))[0]
          racesToAdvanceHashTable[record.advanceTo] = { id: race.id, registrationIds: race.registrationIds }
        }
        if (racesToAdvanceHashTable[record.advanceTo].registrationIds.indexOf(record.registration) === -1) { racesToAdvanceHashTable[record.advanceTo].registrationIds.push(record.registration) }
      }
    })
    for (var i in racesToAdvanceHashTable) {
      output.push(racesToAdvanceHashTable[i])
    }
    return output
  },
  returnSelectedRace: (orderedRaces, ongoingRace) => {
    if (ongoingRace) { return ongoingRace }
    const selectedRaceStatusByOrder = ['started', 'ended', 'init']
    for (var i = 0; i < selectedRaceStatusByOrder.length; i += 1) {
      for (var j = 0; j < orderedRaces.length; j += 1) {
        if (orderedRaces[j].raceStatus === selectedRaceStatusByOrder[i]) { return j }
      }
    }
    return orderedRaces.length - 1
  },
  returnDeferredHashTable: (hashTable, latency) => {
    const now = Date.now()
    let output = {}
    for (var i in hashTable) {
      let result = []
      hashTable[i].map(V => { if ((V + latency) <= now) { result.push(V) } })
      output[i] = result
    }
    return output
  },
  returnDeferredTimeArray: (orgHashTable, trimmedHashTable, latency) => {
    const now = Date.now()
    let deferredTimes = []
    for (let i in orgHashTable) {
      let updateCount = orgHashTable[i].length - trimmedHashTable[i].length
      for (let j = 0; j < updateCount; j += 1) {
        deferredTimes.push((latency + now) - orgHashTable[i][orgHashTable[i].length - 1 - j])
      }
    }
    return deferredTimes
  },
  returnDeferredRaceStatus: (raceStatus, latency, endTime) => {
    let output = raceStatus
    if (output === 'ended' || output === 'submitted') {
      if (endTime + latency > Date.now()) { output = 'started' }
    }
    return output
  },
  returnRacesByOrder: function (races, order) {
    let result = []
    order.map(raceId => { races.map(race => { if (race.id === raceId) { result.push(race) } }) })
    return result
  }
}

export default processData
