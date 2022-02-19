const fs = require('fs')
const crypto = require('crypto')
const uuid = require('uuid')
const snarkjs = require('snarkjs')
const readline = require('readline')

const logger = {
  debug: (msg) => {
    console.log(msg)
  },
  info: (msg) => {
    console.log(msg)
  }
}


const _calculateHash = (filename) => {
  return new Promise((resolve, reject) => {
    const hashSum = crypto.createHash('sha256')
    const s = fs.createReadStream(filename)
    s.on('data', (chunk) => {
      hashSum.update(chunk)
    })
    s.on('end', () => {
      resolve(hashSum.digest('hex'))
    })
  })
}

const _writeHash = async (contributionName) => {
  const folder = `./contributions/${contributionName}`
  const filename = `${folder}/contribution.ptau`
  const hash = await _calculateHash(filename)
  fs.writeFileSync(`${folder}/hash`, hash)
}

const writeHash = async () => {
  const contributionName = process.argv[3]
  await _writeHash(contributionName)
}

const verify = async () => {
  const contributions = fs.readdirSync('./contributions')
  for (let i = 0; i < contributions.length; i += 1) {
    let folder = `./contributions/${contributions[i]}`
    let actual = fs.readFileSync(`${folder}/hash`, 'utf8')
    let expected = await _calculateHash(`${folder}/contribution.ptau`)
    let match = actual === expected
    console.log(folder)
    console.log(` - ${match ? 'Hash valid' : 'Hash invalid'}`)
  }
}

const _captureUserInput = (question) => {
  return new Promise((resolve, reject) => {
    const r1 = readline.createInterface({ input: process.stdin, output: process.stdout })
    r1.question(question + '\n => ', (answer) => {
      resolve(answer)
    })
  })
}

const contribute = async () => {
  const contributions = fs.readdirSync('./contributions')
  const lastContributionFolder = contributions[contributions.length - 1]
  const lastContributionFile = `contributions/${lastContributionFolder}/contribution.ptau`
  const lastContributionNumber = parseInt(lastContributionFolder.split('_')[0])
  let contributionNumber = (lastContributionNumber + 1).toString()
  while (contributionNumber.length < 4) { contributionNumber = '0' + contributionNumber }
  let defaultEntropy = ''
  for (let i = 0; i < 1000; i += 1) {
    defaultEntropy += uuid.v4()
  }
  const contributionName = await _captureUserInput("What do you want to name your contribution?")
  console.log('')
  const nextContributionName = `${contributionNumber}_${contributionName}`
  const nextContributionFolder = `contributions/${nextContributionName}`
  if (!fs.existsSync(nextContributionFolder)) fs.mkdirSync(nextContributionFolder)
  const nextContributionFile = `${nextContributionFolder}/contribution.ptau`
  const userEntropy = await _captureUserInput("Please enter random characters on your keyboard.")
  const finalEntropy = defaultEntropy + userEntropy
  console.log('')
  console.log('Generating contribution (this might take some time)')
  await snarkjs.powersOfTau.contribute(lastContributionFile, nextContributionFile, contributionName, finalEntropy, logger);
  const hash = await _writeHash(nextContributionName)
  console.log('')
  console.log('*****************************************************************************************')
  console.log('**                                                                                     **')
  console.log('**                              Contribution is complete                               **')
  console.log('**                                                                                     **')
  console.log('**                            SAVE YOUR CONTRIBUTION HASH!                             **')
  console.log('**                                                                                     **')
  console.log(`** Contribution hash: ${hash} **`)
  console.log('**                                                                                     **')
  console.log('*****************************************************************************************')
}

const main = async () => {
  const cmd = process.argv[2]
  await {
    'write-hash': writeHash,
    'verify': verify,
    'contribute': contribute,
  }[cmd]()
}

main().then(() => process.exit(0))
