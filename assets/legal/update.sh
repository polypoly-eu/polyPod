#!/bin/sh

for i in en de
do
    curl https://polypoly-citizens.eu/${i}/privacy-policy-polypod-plain/ > ${i}/privacy-policy.html
done
