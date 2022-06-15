# The generator package for endpoints used by the endpoints API

## Generate endpoints.json

To generate an endpoints.json file outside the polyPod directory run:

    npm run build

## Add an endpoint

To add an endpoint just add endpointId and an object with the the URL and auth to endpoints.js

If you want to use the demo feature to test the API add the URL you want to test with under "demoTest".
("auth" can be left out)
