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
