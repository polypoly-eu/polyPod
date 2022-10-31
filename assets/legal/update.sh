#!/bin/sh

for i in en de da
do
    curl https://polypoly-citizens.eu/${i}/privacy-policy-polypod-plain/ > ${i}/privacy-policy.html
done

