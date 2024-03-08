const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;
require("./src/database/connect");
const DeviceData = require("./src/models/deviceData");
const fs = require("fs");
const cron = require("node-cron");

app.use(express.json());

app.listen(port, () => {
  console.log(`Application is running on port number ${port}`);
});

const jsonData = fs.readFileSync("data.json");
const data = JSON.parse(jsonData);

app.post("/data", async (req, res) => {
  try {
    const promises = [];

    for (const dataArray of data) {
      for (const item of dataArray) {
        const newData = new DeviceData(item);
        await newData.save();
        promises.push(newData);
      }
    }

    const newDataArray = await Promise.all(promises);
    res.status(201).json(newDataArray);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// -------------------------------------------------------------------

let fetchedData = [];

let dataIndex = 0;
let currentDate = new Date();
let lastFetchedHour = currentDate.getHours();

const fetchInterval = cron.schedule("*/1 * * * *", async () => {
  
  try {
    const latestData = {};

    const item = data[dataIndex];

    const key = `${item.deviceId}_${currentDate
      .toISOString()
      .slice(0, 10)}_${currentDate.toISOString().slice(11, 19)}`;
    if (
      !latestData[item.deviceId] ||
      latestData[item.deviceId].timestamp < currentDate
    ) {
      latestData[item.deviceId] = {
        timestamp: currentDate,
        data: item,
      };
    }

    const fetchedDataChunk = Object.values(latestData).map(
      (entry) => entry.data
    );

    console.log("Fetched data from devices:", fetchedDataChunk);

    dataIndex = (dataIndex + 1) % data.length;

    currentDate.setHours(currentDate.getHours() + 1);

    if (currentDate.getHours() < lastFetchedHour) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    lastFetchedHour = currentDate.getHours();

    fetchedData = fetchedData.concat(fetchedDataChunk);

    if (dataIndex === 0) {
      fetchInterval.stop();
      console.log("All data fetched. Stopping the fetch process.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

app.get("/fetchData", (req, res) => {
  res.json(fetchedData);
});
