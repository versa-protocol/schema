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
use std::collections::HashMap;

/// A Versa itemized receipt
#[derive(Serialize, Deserialize)]
pub struct Receipt {
    actions: Option<Vec<Action>>,

    header: Header,

    itemization: Itemization,

    payment: Option<Payment>,

    version: String,
}

#[derive(Serialize, Deserialize)]
pub struct Action {
    name: String,

    url: String,
}

#[derive(Serialize, Deserialize)]
pub struct Header {
    amount: i64,

    created_at: i64,

    /// ISO 4217 currency code
    currency: Currency,

    customer: Option<Customer>,

    location: Option<LocationClass>,

    mcc: Option<String>,

    receipt_id: String,

    subtotal: Option<i64>,

    third_party: Option<ThirdParty>,
}

/// ISO 4217 currency code
#[derive(Serialize, Deserialize)]
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

#[derive(Serialize, Deserialize)]
pub struct Customer {
    address: Option<AddressClass>,

    email: Option<String>,

    name: String,

    phone: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct AddressClass {
    city: Option<String>,

    country: String,

    lat: f64,

    lon: f64,

    postal_code: Option<String>,

    region: Option<String>,

    street_address: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct LocationClass {
    address: Option<AddressClass>,

    google_place_id: Option<String>,

    name: Option<String>,

    phone: Option<String>,

    url: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct ThirdParty {
    first_party_relation: FirstPartyRelation,

    /// Determines whether the merchant or third party gets top billing on the receipt
    make_primary: bool,

    merchant: Merchant,
}

#[derive(Serialize, Deserialize)]
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

#[derive(Serialize, Deserialize)]
pub struct Merchant {
    /// Hex color
    brand_color: String,

    logo: Option<String>,

    name: String,

    website: Option<String>,

    id: Option<serde_json::Value>,
}

#[derive(Serialize, Deserialize)]
pub struct Itemization {
    general: HashMap<String, Option<serde_json::Value>>,

    lodging: HashMap<String, Option<serde_json::Value>>,

    ecommerce: HashMap<String, Option<serde_json::Value>>,

    car_rental: HashMap<String, Option<serde_json::Value>>,

    transit_route: HashMap<String, Option<serde_json::Value>>,

    subscription: Subscription,

    flight: HashMap<String, Option<serde_json::Value>>,
}

#[derive(Serialize, Deserialize)]
pub struct Subscription {
    subscription_items: Vec<SubscriptionItem>,

    invoice_level_discounts: Option<serde_json::Value>,
}

#[derive(Serialize, Deserialize)]
pub struct SubscriptionItem {
    current_period_end: Option<i64>,

    current_period_start: Option<i64>,

    description: String,

    discounts: Option<Vec<DiscountElement>>,

    interval: Option<Interval>,

    interval_count: Option<i64>,

    metadata: Option<Vec<MetadatumElement>>,

    quantity: Option<f64>,

    taxes: Option<Vec<TaxElement>>,

    #[serde(rename = "type")]
    subscription_item_type: SubscriptionItemType,

    unit_cost: Option<f64>,
}

#[derive(Serialize, Deserialize)]
pub struct DiscountElement {
    amount: i64,

    name: String,

    #[serde(rename = "type")]
    receipt_schema_type: DiscountType,

    rate: Option<serde_json::Value>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum DiscountType {
    Fixed,

    Percentage,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Interval {
    Day,

    Month,

    Week,

    Year,
}

#[derive(Serialize, Deserialize)]
pub struct MetadatumElement {
    name: String,

    #[serde(rename = "type")]
    receipt_schema_type: MetadatumType,

    value: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MetadatumType {
    Asin,

    Other,

    Sku,

    Unspsc,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SubscriptionItemType {
    #[serde(rename = "one_time")]
    OneTime,

    Recurring,
}

#[derive(Serialize, Deserialize)]
pub struct TaxElement {
    amount: i64,

    name: String,

    rate: Option<f64>,
}

#[derive(Serialize, Deserialize)]
pub struct Payment {
    paid_at: i64,

    #[serde(rename = "type")]
    payment_type: PaymentType,

    card_payment: Option<serde_json::Value>,

    ach_payment: Option<serde_json::Value>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PaymentType {
    Ach,

    Card,
}
