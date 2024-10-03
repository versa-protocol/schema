// Example code that deserializes and serializes the model.
// extern crate serde;
// #[macro_use]
// extern crate serde_derive;
// extern crate serde_json;
//
// use generated_module::receipt;
//
// fn main() {
//     let json = r#"{"answer": 42}"#;
//     let model: receipt = serde_json::from_str(&json).unwrap();
// }

use serde::{Deserialize, Serialize};

/// A Versa itemized receipt
#[derive(Debug, Serialize, Deserialize)]
pub struct Receipt {
  pub actions: Vec<Action>,
  pub header: Header,
  pub itemization: Itemization,
  pub payments: Vec<PaymentElement>,
  pub schema_version: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Action {
  pub name: String,
  pub url: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Header {
  /// ISO 4217 currency code
  pub currency: Currency,
  pub customer: Option<Customer>,
  pub invoice_asset_id: Option<String>,
  pub invoice_number: Option<String>,
  pub invoiced_at: i64,
  pub location: Option<ReceiptSchema>,
  pub mcc: Option<String>,
  pub paid: i64,
  pub receipt_asset_id: Option<String>,
  pub subtotal: i64,
  pub third_party: Option<ThirdParty>,
  pub total: i64,
}

/// ISO 4217 currency code
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Currency {
  Aud,
  Cad,
  Chf,
  Cnh,
  Eur,
  Gbp,
  Jpy,
  Usd,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Customer {
  pub address: Option<AddressClass>,
  pub email: Option<String>,
  pub metadata: Vec<MetadatumElement>,
  pub name: String,
  pub phone: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AddressClass {
  pub city: Option<String>,
  pub country: Option<String>,
  pub lat: Option<f64>,
  pub lon: Option<f64>,
  pub postal_code: Option<String>,
  pub region: Option<String>,
  pub street_address: Option<String>,
  pub tz: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MetadatumElement {
  pub key: String,
  pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ReceiptSchema {
  pub address: Option<AddressClass>,
  pub google_place_id: Option<String>,
  pub image: Option<String>,
  pub name: Option<String>,
  pub phone: Option<String>,
  pub url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ThirdParty {
  pub first_party_relation: FirstPartyRelation,
  /// Determines whether the merchant or third party gets top billing on the receipt
  pub make_primary: bool,
  pub merchant: Merchant,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum FirstPartyRelation {
  Bnpl,
  #[serde(rename = "delivery_service")]
  DeliveryService,
  Marketplace,
  #[serde(rename = "payment_processor")]
  PaymentProcessor,
  Platform,
  #[serde(rename = "point_of_sale")]
  PointOfSale,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Merchant {
  pub address: Option<AddressClass>,
  pub brand_color: Option<String>,
  pub legal_name: Option<String>,
  pub logo: Option<String>,
  pub name: String,
  pub vat_number: Option<String>,
  pub website: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Itemization {
  pub car_rental: Option<CarRentalClass>,
  pub ecommerce: Option<EcommerceClass>,
  pub flight: Option<FlightClass>,
  pub general: Option<GeneralClass>,
  pub lodging: Option<LodgingClass>,
  pub subscription: Option<SubscriptionClass>,
  pub transit_route: Option<TransitRouteClass>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CarRentalClass {
  pub driver_name: String,
  pub invoice_level_adjustments: Vec<InvoiceLevelAdjustmentElement>,
  pub items: Vec<ItemElement>,
  pub odometer_reading_in: i64,
  pub odometer_reading_out: i64,
  pub rental_at: i64,
  pub rental_location: ReceiptSchema,
  pub return_at: i64,
  pub return_location: ReceiptSchema,
  pub vehicle: Option<Vehicle>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InvoiceLevelAdjustmentElement {
  pub adjustment_type: AdjustmentType,
  pub amount: i64,
  pub name: Option<String>,
  pub rate: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AdjustmentType {
  Discount,
  Fee,
  Other,
  Tip,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ItemElement {
  pub adjustments: Option<Vec<InvoiceLevelAdjustmentElement>>,
  pub date: Option<String>,
  pub description: String,
  pub group: Option<String>,
  pub metadata: Option<Vec<MetadatumElement>>,
  pub product_image_asset_id: Option<String>,
  pub quantity: Option<f64>,
  pub subtotal: i64,
  pub taxes: Option<Vec<TaxElement>>,
  pub unit: Option<String>,
  pub unit_cost: Option<i64>,
  pub unspsc: Option<String>,
  pub url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TaxElement {
  pub amount: i64,
  pub name: String,
  pub rate: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Vehicle {
  pub description: String,
  pub image: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EcommerceClass {
  pub invoice_level_adjustments: Vec<InvoiceLevelAdjustmentElement>,
  pub invoice_level_line_items: Vec<ItemElement>,
  pub shipments: Vec<Shipment>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Shipment {
  pub destination_address: Option<AddressClass>,
  pub expected_delivery_at: Option<i64>,
  pub items: Vec<ItemElement>,
  pub shipment_status: ShipmentStatus,
  pub tracking_number: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ShipmentStatus {
  Delivered,
  #[serde(rename = "in_transit")]
  InTransit,
  Prep,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FlightClass {
  pub invoice_level_adjustments: Vec<InvoiceLevelAdjustmentElement>,
  pub itinerary_locator: Option<String>,
  pub tickets: Vec<TicketElement>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TicketElement {
  pub number: Option<String>,
  pub passenger: Option<String>,
  pub record_locator: Option<String>,
  pub segments: Vec<SegmentElement>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SegmentElement {
  pub adjustments: Vec<InvoiceLevelAdjustmentElement>,
  pub arrival_airport_code: String,
  pub arrival_at: Option<i64>,
  pub arrival_tz: Option<String>,
  pub class_of_service: Option<String>,
  pub departure_airport_code: String,
  pub departure_at: Option<i64>,
  pub departure_tz: Option<String>,
  pub fare: i64,
  pub flight_number: Option<String>,
  pub taxes: Vec<TaxElement>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GeneralClass {
  pub invoice_level_adjustments: Vec<InvoiceLevelAdjustmentElement>,
  pub line_items: Vec<ItemElement>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LodgingClass {
  pub check_in: i64,
  pub check_out: i64,
  pub guests: Option<String>,
  pub invoice_level_adjustments: Vec<InvoiceLevelAdjustmentElement>,
  pub items: Vec<ItemElement>,
  pub location: ReceiptSchema,
  pub metadata: Option<Vec<MetadatumElement>>,
  pub room: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SubscriptionClass {
  pub invoice_level_adjustments: Vec<InvoiceLevelAdjustmentElement>,
  pub subscription_items: Vec<SubscriptionItem>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SubscriptionItem {
  pub adjustments: Vec<InvoiceLevelAdjustmentElement>,
  pub current_period_end: Option<i64>,
  pub current_period_start: Option<i64>,
  pub description: String,
  pub interval: Option<Interval>,
  pub interval_count: Option<i64>,
  pub metadata: Vec<MetadatumElement>,
  pub quantity: Option<f64>,
  pub subscription_type: SubscriptionType,
  pub subtotal: i64,
  pub taxes: Vec<TaxElement>,
  pub unit_cost: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Interval {
  Day,
  Month,
  Week,
  Year,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SubscriptionType {
  #[serde(rename = "one_time")]
  OneTime,
  Recurring,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TransitRouteClass {
  pub invoice_level_adjustments: Vec<InvoiceLevelAdjustmentElement>,
  pub transit_route_items: Vec<TransitRouteItem>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TransitRouteItem {
  pub arrival_at: Option<i64>,
  pub arrival_location: Option<ReceiptSchema>,
  pub departure_at: Option<i64>,
  pub departure_location: Option<ReceiptSchema>,
  pub fare: i64,
  pub metadata: Vec<MetadatumElement>,
  pub mode: Option<Mode>,
  pub passenger: Option<String>,
  pub polyline: Option<String>,
  pub taxes: Vec<TaxElement>,
  pub adjustments: Option<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Mode {
  Bus,
  Car,
  Ferry,
  Other,
  Rail,
  Taxi,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaymentElement {
  pub ach_payment: Option<AchPaymentClass>,
  pub amount: i64,
  pub card_payment: Option<CardPaymentClass>,
  pub paid_at: i64,
  pub payment_type: PaymentType,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AchPaymentClass {
  pub routing_number: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CardPaymentClass {
  pub last_four: String,
  pub network: Network,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Network {
  Amex,
  Diners,
  Discover,
  #[serde(rename = "eftpos_au")]
  EftposAu,
  Jcb,
  Mastercard,
  Unionpay,
  Visa,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PaymentType {
  Ach,
  Card,
}
