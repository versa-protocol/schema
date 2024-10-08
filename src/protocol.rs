use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum VersaEnv {
  Prod,
  Test,
}

impl fmt::Display for VersaEnv {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let state = match self {
      VersaEnv::Prod => "prod",
      VersaEnv::Test => "test",
    };
    write!(f, "{}", state)
  }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TransactionHandles {
  pub customer_email: Option<String>,
  pub customer_email_domain: Option<String>,
  /// EXPERIMENTAL
  pub customer_email_uhash: Option<String>,
  pub card_bin: Option<String>,
  pub card_last_four: Option<String>,
  /// EXPERIMENTAL
  pub versa_client_ids: Option<Vec<String>>,
}

impl TransactionHandles {
  pub fn new() -> Self {
    Self {
      customer_email: None,
      customer_email_domain: None,
      customer_email_uhash: None,
      card_bin: None,
      card_last_four: None,
      versa_client_ids: None,
    }
  }

  pub fn with_customer_email(mut self, email_address: String) -> Self {
    self.customer_email = Some(email_address);
    self
  }

  pub fn with_customer_email_domain(mut self, domain: String) -> Self {
    self.customer_email_domain = Some(domain);
    self
  }

  pub fn with_versa_client_ids(mut self, ids: Vec<String>) -> Self {
    self.versa_client_ids = Some(ids);
    self
  }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ReceiptRegistrationRequest {
  /// EXPERIMENTAL, for now, leave as None
  pub receipt_hash: Option<u64>,
  /// The latest schema version of the receipt
  pub schema_version: String,
  /// Provide as many handles as available to ensure the receipt is routed to the correct receivers
  pub handles: TransactionHandles,
  /// The Versa transaction ID, if updating an existing receipt
  pub transaction_id: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Receiver {
  pub address: String,
  pub client_id: String,
  pub org_id: String,
  pub secret: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ReceiptRegistrationResponse {
  pub env: VersaEnv,
  pub receipt_id: String,
  pub transaction_id: String,
  pub receivers: Vec<Receiver>,
  pub encryption_key: String,
}

// Receiver structs

#[derive(Debug, Deserialize, Serialize)]
pub struct Address {
  pub street_address: Option<String>,
  pub city: Option<String>,
  pub region: Option<String>,
  pub country: String,
  pub postal_code: Option<String>,
  pub tz: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Sender {
  pub address: Option<Address>,
  pub brand_color: Option<String>,
  pub logo: Option<String>,
  pub name: String,
  pub vat_number: Option<String>,
  pub website: String,
}

#[derive(Debug, Deserialize)]
pub struct Checkout {
  pub key: String,
  pub receipt_id: String,
  pub receipt_hash: String,
  pub schema_version: String,
  pub transaction_id: String,
  pub sender: Option<Sender>,
  pub handles: TransactionHandles,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Envelope {
  pub encrypted: String,
  pub hash: Option<u64>,
  pub nonce: String,
}
