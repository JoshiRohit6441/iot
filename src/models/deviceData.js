const mongoose = require("mongoose");

const DeviceSchema = mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  voltage: {
    type: Number,
    required: true,
  },
  amphere: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const DeviceData = mongoose.model("DeviceData", DeviceSchema);

module.exports = DeviceData;
