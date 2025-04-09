// @ts-ignore
import { isObjectSubset } from "./lib";

import itinerarySchema from "../data/itinerary.schema.json";
import receiptSchema from "../data/receipt.schema.json";

function check() {
  if (isObjectSubset(itinerarySchema, receiptSchema)) {
    console.log("OK");
  } else {
    throw new Error("itinerarySchema is not a subset of receiptSchema");
  }
}

check();
