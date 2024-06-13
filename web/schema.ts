/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * A Versa itemized receipt
 */
export interface Receipt {
  version: string;
  header: {
    receipt_id: string;
    /**
     * ISO 4217 currency code
     */
    currency: "usd" | "eur" | "jpy" | "gbp" | "aud" | "cad" | "chf" | "cnh";
    total: number;
    subtotal: number;
    paid: number;
    created_at: number;
    mcc: string | null;
    third_party: {
      first_party_relation:
        | "bnpl"
        | "delivery_service"
        | "marketplace"
        | "payment_processor"
        | "platform"
        | "point_of_sale";
      /**
       * Determines whether the merchant or third party gets top billing on the receipt
       */
      make_primary: boolean;
      merchant: Merchant;
    } | null;
    customer: {
      name: string;
      email: string | null;
      address: null | Address;
      phone: string | null;
    } | null;
    location: Place | null;
  };
  itemization: Itemization;
  actions:
    | null
    | {
        name: string;
        url: string;
      }[];
  payments:
    | null
    | {
        [k: string]: unknown;
      }[];
}
export interface Merchant {
  name: string;
  /**
   * Hex color
   */
  brand_color: string;
  logo: string | null;
  website: string | null;
}
export interface Address {
  street_address: string | null;
  city: string | null;
  region: null | string;
  country: null | string;
  postal_code: string | null;
  lat: number | null;
  lon: number | null;
}
export interface Place {
  name: string | null;
  address: null | Address;
  phone: string | null;
  url: null | string;
  google_place_id: string | null;
  image: null | string;
}
export interface Itemization {
  general: {} | null;
  lodging: Lodging | null;
  ecommerce: {} | null;
  car_rental: CarRental | null;
  transit_route: TransitRoute | null;
  subscription: Subscription | null;
  flight: Flight | null;
}
export interface Lodging {
  /**
   * @minItems 1
   */
  lodging_items: LodgingItem[];
  invoice_level_discounts: null | Discount[];
}
export interface LodgingItem {
  check_in: number;
  check_out: number;
  location: Place;
  /**
   * @minItems 1
   */
  items: Item[];
  room?: null | string;
  guests?: null | string;
  metadata?: null | ItemMetadata[];
}
export interface Item {
  description: string;
  total: number;
  quantity?: null | number;
  uniit_cost?: null | number;
  unit?: null | string;
  taxes?: null | Tax[];
  metadata?: null | ItemMetadata[];
  product_image?: null | string;
  group?: null | string;
  url?: null | string;
  discounts?: null | Discount[];
}
export interface Tax {
  amount: number;
  rate: number | null;
  name: string;
}
export interface ItemMetadata {
  metadata_type: "sku" | "unspsc" | "asin" | "other";
  name: string;
  value: string;
}
export interface Discount {
  amount: number;
  name: string;
  discount_type: "fixed" | "percentage";
}
export interface CarRental {
  rental_at: number;
  return_at: number;
  rental_location: Place;
  return_location: Place;
  vehicle: {
    description: string;
    image: string | null;
  } | null;
  driver_name: string;
  odometer_reading_in: number;
  odometer_reading_out: number;
  /**
   * @minItems 1
   */
  items: Item[];
}
export interface TransitRoute {
  departure_address: null | Address;
  arrival_address: null | Address;
  departure_at: number;
  arrival_at: number;
  polyline: null | string;
  taxes: null | Tax[];
  invoice_level_discounts: null | Discount[];
  metadata: null | ItemMetadata[];
  tip: number | null;
  fare: number;
}
export interface Subscription {
  /**
   * @minItems 1
   */
  subscription_items: {
    subscription_type: "one_time" | "recurring";
    description: string;
    interval: null | ("day" | "week" | "month" | "year");
    interval_count: number | null;
    current_period_start: number | null;
    current_period_end: number | null;
    quantity: number | null;
    unit_cost: number | null;
    taxes: null | Tax[];
    metadata: null | ItemMetadata[];
    discounts: null | Discount[];
  }[];
}
export interface Flight {
  /**
   * @minItems 1
   */
  tickets: FlightTicket[];
  itinerary_locator: null | string;
  invoice_level_discounts: null | Discount[];
}
export interface FlightTicket {
  /**
   * @minItems 1
   */
  segments: FlightSegment[];
  number: null | string;
  record_locator: null | string;
  passenger: null | string;
}
export interface FlightSegment {
  fare: number;
  departure_airport_code: string;
  arrival_airport_code: string;
  departure_at: null | number;
  arrival_at: null | number;
  flight_number: null | string;
  class_of_service: null | string;
  taxes: null | Tax[];
  discounts: null | Discount[];
}
