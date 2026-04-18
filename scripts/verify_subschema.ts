// @ts-ignore
import { isObjectSubset } from "./lib";

import itinerarySchema from "../events/itinerary.schema.json";
import receiptSchema from "../events/receipt.schema.json";

function check() {
  if (isObjectSubset(itinerarySchema, receiptSchema)) {
    console.log("OK");
  } else {
    throw new Error("itinerarySchema is not a subset of receiptSchema");
  }
}

check();
