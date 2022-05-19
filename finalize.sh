#!/bin/bash

snarkjs() {
  npx snarkjs "$@"
}

# check README.md for beacon details. 
# generated using `node cli.js beacon`
beacon=$(cat finalize/beacon.txt)

final_contribution=$(ls contributions | tail -1)

echo "generating beacon"
snarkjs powersoftau beacon contributions/$final_contribution/contribution.ptau finalize/beacon.ptau $beacon 10 -n="Beacon"

echo "preparing phase 2"
snarkjs powersoftau prepare phase2 finalize/beacon.ptau finalize/final.ptau -v

echo "verifying"
snarkjs powersoftau verify finalize/final.ptau
