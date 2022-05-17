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
  return hash
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

const beacon = async () => {
  let msg = '0x6164631ffbb4ef773d47dde35b03d3376a28c657479cd8ff4e8431016ba3dc53_0x4f1d29b5890a0cfe02c32b2d8a0ae70a41aa418cc8c9b1ca65c08d20dafe6561_0x3f0f2ffdb8ba0bf6ccf3e8328f7b08ee67cdab949ba5195d3d732d8809356f19_0xeb696be528ad1f588df019d4d9991563a303362b08b4be59007fe2c45c1a8e0d_0xfd7c901d58034afb68a8edc85ac3702833e9a4e110f992ebc65979631e6a01ef_0x27ae8707234eacd58e2bab403b34387792fbb1f602beb5023790b15b8c57c3da_0xec4fb0c46aab0797ae632c4124c406f74375ce0058f2fca7306e3225d6f795c6_0xcc8cefae7ed1c11234b01e7dc58aae47045438f5860a86916442cc411068ab38_0x149ab8818ac146a3442807999ee61235590be67025afc1ca1f4151f731d96a64_0x52eee16e81552d3f2bc3edd8b9e94d71edcc46a2b2271e256c5b843e20cc02b7_0x2227270213633b65f8353f78a004c52405f44a91d77b67aec85dd8d0e6a14de3'
  let startTime = parseInt(Date.now() / 1000)
  const iterations = Math.pow(2, 36)
  const update = 1000000
  for (let i = 0; i < iterations; i += 1) {
    msg = crypto.createHash('sha256').update(msg).digest('hex')
    if (i % update === 0 && i > 0) {
      let pct = (i / iterations) * 100
      let now = parseInt(Date.now() / 1000)
      let timePerIteration = (now - startTime) / i
      let remainingIterations = iterations - i
      let timeEstimate = remainingIterations * timePerIteration
      console.log(`${i}/${iterations} (${pct}%)`)
      console.log(`${parseInt(timeEstimate / 60)} minutes remaining`)
    }
  }
  fs.writeFileSync('finalize/beacon.txt', msg, 'utf8')
}

const main = async () => {
  const cmd = process.argv[2]
  await {
    'write-hash': writeHash,
    'verify': verify,
    'contribute': contribute,
    'beacon': beacon,
  }[cmd]()
}

main().then(() => process.exit(0))
