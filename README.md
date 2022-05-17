# Powers of Tau Ceremony

## How to Contribute

1. Create a fork of this repository on GitHub 
2. Run the code below
3. [Create a new pull request](https://docs.github.com/en/enterprise-server@3.4/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) from your fork to this repository


```
# Clone the repo and change working directory
git clone git@github.com:YOUR-USERNAME/powers-of-tau.git
cd powers-of-tau

# Check out a new branch
git checkout -b myname-contribution

# Install node dependencies
npm install

# Add your contribution (Important: Save the contribution hash that is shown when the contribution finishes)
node cli.js contribute

# Commit & push
git add contributions/*
git commit -m "Myname - contribution"
git push origin myname-contribution
```

## Hash Verification

When you submit a contribution, the program will print out the hash of your contribution when finished. Please share the hash in the #powers-of-tau channel in Discord when you have completed. The idea is that since we are using Github to maintain the ceremony, it's possible (though extremely unlikely) that Github compromises the entire ceremony. 

[A full list of the hashes being maintained on Google Sheets](https://docs.google.com/spreadsheets/d/1wjdT_eYXYNlRO5abM5GE7tIuYL8t2EAETQizGpIqemA/edit?usp=sharing).

*Edit: perhaps signed commits would have been a reasonable solution to this problem.*


## Random Beacon

The random beacon will be generated using a seed, generated from the following information: 

- Hash
- Parent Hash
- TxnHash from each transaction in the block

This information will be separated by underscores (`_`)

As an example, for block 14822000, information can be pulled from https://snowtrace.io/block/14822000 and compiled as follows:

`0x624964800ee4d844a9fddc4414991c08a1cc58f14e7f872f368ea9fe0e8652c3_0x5eea867e9c7cc2484740c34ae93d5d8b499a076304d11d2b5751314daf630567_0x4798cd4aca4e3875b33aaf7d94d6d9ffed9b154b07c22fac3efceadd54edd85d_0xde96033a03faab9acb504c8b7fedb9a75dcc098e4c70a8d3b5fd4d5dea1664b4_0xa31bf4945d6c2e30ff0d50f01e0c9d7c73b4f9ca397cf95e5f0d8f04cf73a72c_0x3af39c3eb6da09210eac137492112fe9b63262ff81b336f76af1dd77efda2790_0xbac52e73bbb200a9f479129735bc5cd54ef8c19a722d690496380b5d4a60e714_0x0986db918080a23a56d3cde0f1186ba8781ed21eddb8a4ce244215febe924687_0xd078976cea78a5499dc22a8d6fae15c82a08ba6d4c9d04b9c62ae158445c3652`

We will then perform 2^36 iterations of SHA256 on this seed.

The seed will be generated from block 14823000, which at the time of writing is expected to be around 15 minutes in the future. 


