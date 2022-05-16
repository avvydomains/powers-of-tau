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
