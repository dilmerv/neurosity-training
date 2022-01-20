const { Notion } = require("@neurosity/notion");
require("dotenv").config();

const deviceId = process.env.DEVICE_ID || "";
const email = process.env.NEUROSITY_EMAIL || "";
const password = process.env.NEUROSITY_PASSWORD || "";

const verifyEnvs = (email, password, deviceId) => {
    const invalidEnv = (env) => {
      return env === "" || env === 0;
    };
    if (
      invalidEnv(email) ||
      invalidEnv(password) ||
      invalidEnv(deviceId)
    ) {
      console.error(
        "Please verify deviceId, email and password are in .env file, quitting..."
      );
      process.exit(0);
    }
  };

  verifyEnvs(email, password, deviceId);
  
  console.log(`${email} attempting to authenticate to ${deviceId}`);

  const notion = new Notion({
    timesync: true
  });
  
  main();
  
  async function main() {
    console.log(`Logging in`);
    await notion.login({
      email: process.env.NEUROSITY_EMAIL,
      password: process.env.NEUROSITY_PASSWORD
    })
    .catch(error => {
      console.log(error);
      throw new Error(error)
    });
    console.log(`Logged in`);


    const metric = "kinesis";
    const label = "leftArm";

    const trainingOptions = {
        metric,
        label,
        experimentId: "-experiment-123"
    };

    // Subscribe to Kinesis
    notion.kinesis(label).subscribe((kinesis) => {
    console.log("leftArm kinesis detection", kinesis);
    });

    // Subscribe to raw predictions
    notion.predictions(label).subscribe((prediction) => {
    console.log("leftArm prediction", prediction);
    });

    // Tell the user to clear their mind
    console.log("Clear you mind and relax");

    // Tag baseline after a couple seconds
    setTimeout(() => {
    // Note: using the spread operator to bring all properties from trainingOptions into the current object plus adding the new baseline tag. Learn about spread operators here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    notion.training.record({
        ...trainingOptions,
        baseline: true
    });

    // Now tell the user to imagine an active thought
    console.log("Imagine a baseball with your left arm");
    }, 4000);

    // Tell the user to imagine active thought and fit
    setTimeout(() => {
    // Note: You must call fit after a baseline and an active have been recorded.
    notion.training.record({
        ...trainingOptions,
        fit: true
    });
    }, 8000);
  }