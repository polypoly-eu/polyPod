export default {
  files: ["test/*.test.js"],
  nodeResolve: true,
  testRunnerHtml: testFramework =>
    `<html>
      <body>
        <script>var manifestData = {
          "name": "pod.js test suite",
          "author": "polypoly Cooperative",
          "description": "",
          "thumbnail": "",
          "primaryColor": "#fff",
          "links": {},
          "translations": {}
        };</script>
        <script src="dist/pod.js"></script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>`
};
