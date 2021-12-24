curl 'https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06' \
  -H 'authority: api.thegraph.com' \
  -H 'sec-ch-ua: "Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"' \
  -H 'accept: */*' \
  -H 'content-type: application/json' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'origin: https://quickswap.exchange' \
  -H 'sec-fetch-site: cross-site' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-dest: empty' \
  -H 'referer: https://quickswap.exchange/' \
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8' \
  --data-raw '{"operationName":"pairs","query":"fragment PairFields on Pair {reserve0,reserve1,token0 { decimals,id, symbol, name }\n token1 { decimals,id, symbol, name } \n  id  trackedReserveETH\n  volumeUSD\n  reserveUSD\n  totalSupply\n  __typename\n}\n\nquery pairs {\n  pairs(first: 300, orderBy: trackedReserveETH orderDirection: desc) {\n    ...PairFields\n    __typename\n  }\n}\n"}' \
  --compressed | jq > quick1.json

curl 'https://api.thegraph.com/subgraphs/name/ss-sonic/dfyn-v4' \
  -H 'authority: api.thegraph.com' \
  -H 'sec-ch-ua: "Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"' \
  -H 'accept: */*' \
  -H 'content-type: application/json' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'origin: https://quickswap.exchange' \
  -H 'sec-fetch-site: cross-site' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-dest: empty' \
  -H 'referer: https://quickswap.exchange/' \
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8' \
  --data-raw '{"operationName":"pairs","query":"fragment PairFields on Pair {reserve0,reserve1,token0 { decimals,id, symbol, name }\n token1 { decimals,id, symbol, name } \n  id  trackedReserveETH\n  volumeUSD\n  reserveUSD\n  totalSupply\n  __typename\n}\n\nquery pairs {\n  pairs(first: 250, orderBy: trackedReserveETH orderDirection: desc) {\n    ...PairFields\n    __typename\n  }\n}\n"}' \
  --compressed | jq > dfyn1.json


curl 'https://api.thegraph.com/subgraphs/name/medariox/quicksushi' \
  -H 'authority: api.thegraph.com' \
  -H 'sec-ch-ua: "Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"' \
  -H 'accept: */*' \
  -H 'content-type: application/json' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'origin: https://quickswap.exchange' \
  -H 'sec-fetch-site: cross-site' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-dest: empty' \
  -H 'referer: https://quickswap.exchange/' \
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8' \
  --data-raw '{"operationName":"pairs","query":"fragment PairFields on Pair {reserve0,reserve1,token0 { decimals,id, symbol, name }\n token1 { decimals,id, symbol, name } \n  id  trackedReserveETH\n  volumeUSD\n  reserveUSD\n  totalSupply\n  __typename\n}\n\nquery pairs {\n  pairs(first: 250, orderBy: trackedReserveETH orderDirection: desc) {\n    ...PairFields\n    __typename\n  }\n}\n"}' \
  --compressed | jq > sushi.json