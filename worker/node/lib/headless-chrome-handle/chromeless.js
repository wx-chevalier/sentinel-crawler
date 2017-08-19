// @flow

const { Chromeless } = require('chromeless');

async function run() {
  const chromeless = new Chromeless();

  const screenshot = await chromeless
    .goto('https://www.baidu.com')
    .type('chromeless', 'input[name="wd"]')
    .press(13)
    .press(13)
    .wait('#resultStats')
    .screenshot();

  console.log(screenshot); // prints local file path or S3 url

  await chromeless.end();
}

run().catch(console.error.bind(console));
