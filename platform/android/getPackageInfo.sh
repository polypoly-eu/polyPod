# Extract the android package info from a built apk file.
# Usage ./getVersionCode.sh <path-to-aapt> <path-to-apk> <info-key>
line=`$1 dump badging "$2" | grep package:\ name`
if [[ $line =~ $3=\'([^\']+)\' ]]; then
    echo ${BASH_REMATCH[1]}
else
    echo "Failed to find $3"
    exit 1
fi
