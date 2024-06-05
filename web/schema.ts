// To parse this data:
//
//   import { Convert, CompositeReceipt, Merchant, Receipt } from "./file";
//
//   const compositeReceipt = Convert.toCompositeReceipt(json);
//   const merchant = Convert.toMerchant(json);
//   const receipt = Convert.toReceipt(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * A receipt composite with both the receipt and merchant information
 */
export interface CompositeReceipt {
    merchant: Merchant;
    receipt:  Receipt;
    [property: string]: any;
}

/**
 * A Versa merchant returned by the registry, associated with the sender client_id
 */
export interface Merchant {
    /**
     * Hex color
     */
    brand_color: string;
    id:          string;
    logo:        null | string;
    name:        string;
    website?:    null | string;
}

/**
 * A Versa itemized receipt
 */
export interface Receipt {
    actions:     Action[] | null;
    header:      Header;
    itemization: Itemization;
    payment:     null | Payment;
    version:     string;
}

export interface Action {
    name: string;
    url:  string;
    [property: string]: any;
}

export interface Header {
    amount:     number;
    created_at: number;
    /**
     * ISO 4217 currency code
     */
    currency:    Currency;
    customer:    null | Customer;
    location:    null | LocationObject;
    mcc:         null | string;
    receipt_id:  string;
    subtotal?:   number;
    third_party: ThirdParty | null;
}

/**
 * ISO 4217 currency code
 */
export enum Currency {
    Aud = "aud",
    CAD = "cad",
    Chf = "chf",
    Cnh = "cnh",
    Eur = "eur",
    Gbp = "gbp",
    Jpy = "jpy",
    Usd = "usd",
}

export interface Customer {
    address: null | ArrivalAddressObject;
    email:   null | string;
    name:    string;
    phone:   null | string;
    [property: string]: any;
}

export interface ArrivalAddressObject {
    city:           null | string;
    country:        string;
    lat:            number;
    lon:            number;
    postal_code:    null | string;
    region:         null | string;
    street_address: null | string;
    [property: string]: any;
}

export interface LocationObject {
    address:         null | ArrivalAddressObject;
    google_place_id: null | string;
    name:            null | string;
    phone:           null | string;
    url:             null | string;
    [property: string]: any;
}

export interface ThirdParty {
    first_party_relation: FirstPartyRelation;
    /**
     * Determines whether the merchant or third party gets top billing on the receipt
     */
    make_primary: boolean;
    merchant:     MerchantClass;
}

export enum FirstPartyRelation {
    Bnpl = "bnpl",
    DeliveryService = "delivery_service",
    Marketplace = "marketplace",
    PaymentProcessor = "payment_processor",
    Platform = "platform",
    PointOfSale = "point_of_sale",
}

/**
 * A Versa merchant returned by the registry, associated with the sender client_id
 */
export interface MerchantClass {
    /**
     * Hex color
     */
    brand_color: string;
    id:          string;
    logo:        null | string;
    name:        string;
    website?:    null | string;
}

export interface Itemization {
    general:       { [key: string]: any };
    lodging:       { [key: string]: any };
    ecommerce:     { [key: string]: any };
    car_rental:    { [key: string]: any };
    transit_route: TransitRoute;
    subscription:  null | Subscription;
    flight:        { [key: string]: any } | null;
    [property: string]: any;
}

export interface Subscription {
    subscription_items:      SubscriptionItem[];
    invoice_level_discounts: any;
    [property: string]: any;
}

export interface SubscriptionItem {
    current_period_end:   number | null;
    current_period_start: number | null;
    description:          string;
    discounts:            InvoiceLevelDiscountElement[] | null;
    interval:             Interval | null;
    interval_count:       number | null;
    metadata:             MetadatumElement[] | null;
    quantity:             number | null;
    subscription_type:    SubscriptionType;
    taxes:                TaxElement[] | null;
    unit_cost:            number | null;
    [property: string]: any;
}

export interface InvoiceLevelDiscountElement {
    amount:        number;
    discount_type: DiscountType;
    name:          string;
    rate:          any;
    [property: string]: any;
}

export enum DiscountType {
    Fixed = "fixed",
    Percentage = "percentage",
}

export enum Interval {
    Day = "day",
    Month = "month",
    Week = "week",
    Year = "year",
}

export interface MetadatumElement {
    metadata_type: MetadataType;
    name:          string;
    value:         string;
    [property: string]: any;
}

export enum MetadataType {
    Asin = "asin",
    Other = "other",
    Sku = "sku",
    Unspsc = "unspsc",
}

export enum SubscriptionType {
    OneTime = "one_time",
    Recurring = "recurring",
}

export interface TaxElement {
    amount: number;
    name:   string;
    rate:   number | null;
    [property: string]: any;
}

export interface TransitRoute {
    arrival_address?:         null | ArrivalAddressObject;
    arrival_time?:            number;
    departure_address?:       null | ArrivalAddressObject;
    departure_time?:          number;
    invoice_level_discounts?: InvoiceLevelDiscountElement[] | null;
    metadata?:                MetadatumElement[] | null;
    polyline?:                null | string;
    taxes?:                   TaxElement[] | null;
    tip?:                     number | null;
    [property: string]: any;
}

export interface Payment {
    paid_at:      number;
    payment_type: PaymentType;
    card_payment: any;
    ach_payment:  any;
    [property: string]: any;
}

export enum PaymentType {
    Ach = "ach",
    Card = "card",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toCompositeReceipt(json: string): CompositeReceipt {
        return cast(JSON.parse(json), r("CompositeReceipt"));
    }

    public static compositeReceiptToJson(value: CompositeReceipt): string {
        return JSON.stringify(uncast(value, r("CompositeReceipt")), null, 2);
    }

    public static toMerchant(json: string): Merchant {
        return cast(JSON.parse(json), r("Merchant"));
    }

    public static merchantToJson(value: Merchant): string {
        return JSON.stringify(uncast(value, r("Merchant")), null, 2);
    }

    public static toReceipt(json: string): Receipt {
        return cast(JSON.parse(json), r("Receipt"));
    }

    public static receiptToJson(value: Receipt): string {
        return JSON.stringify(uncast(value, r("Receipt")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "CompositeReceipt": o([
        { json: "merchant", js: "merchant", typ: r("Merchant") },
        { json: "receipt", js: "receipt", typ: r("Receipt") },
    ], "any"),
    "Merchant": o([
        { json: "brand_color", js: "brand_color", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "logo", js: "logo", typ: u(null, "") },
        { json: "name", js: "name", typ: "" },
        { json: "website", js: "website", typ: u(undefined, u(null, "")) },
    ], false),
    "Receipt": o([
        { json: "actions", js: "actions", typ: u(a(r("Action")), null) },
        { json: "header", js: "header", typ: r("Header") },
        { json: "itemization", js: "itemization", typ: r("Itemization") },
        { json: "payment", js: "payment", typ: u(null, r("Payment")) },
        { json: "version", js: "version", typ: "" },
    ], false),
    "Action": o([
        { json: "name", js: "name", typ: "" },
        { json: "url", js: "url", typ: "" },
    ], "any"),
    "Header": o([
        { json: "amount", js: "amount", typ: 0 },
        { json: "created_at", js: "created_at", typ: 0 },
        { json: "currency", js: "currency", typ: r("Currency") },
        { json: "customer", js: "customer", typ: u(null, r("Customer")) },
        { json: "location", js: "location", typ: u(null, r("LocationObject")) },
        { json: "mcc", js: "mcc", typ: u(null, "") },
        { json: "receipt_id", js: "receipt_id", typ: "" },
        { json: "subtotal", js: "subtotal", typ: u(undefined, 0) },
        { json: "third_party", js: "third_party", typ: u(r("ThirdParty"), null) },
    ], false),
    "Customer": o([
        { json: "address", js: "address", typ: u(null, r("ArrivalAddressObject")) },
        { json: "email", js: "email", typ: u(null, "") },
        { json: "name", js: "name", typ: "" },
        { json: "phone", js: "phone", typ: u(null, "") },
    ], "any"),
    "ArrivalAddressObject": o([
        { json: "city", js: "city", typ: u(null, "") },
        { json: "country", js: "country", typ: "" },
        { json: "lat", js: "lat", typ: 3.14 },
        { json: "lon", js: "lon", typ: 3.14 },
        { json: "postal_code", js: "postal_code", typ: u(null, "") },
        { json: "region", js: "region", typ: u(null, "") },
        { json: "street_address", js: "street_address", typ: u(null, "") },
    ], "any"),
    "LocationObject": o([
        { json: "address", js: "address", typ: u(null, r("ArrivalAddressObject")) },
        { json: "google_place_id", js: "google_place_id", typ: u(null, "") },
        { json: "name", js: "name", typ: u(null, "") },
        { json: "phone", js: "phone", typ: u(null, "") },
        { json: "url", js: "url", typ: u(null, "") },
    ], "any"),
    "ThirdParty": o([
        { json: "first_party_relation", js: "first_party_relation", typ: r("FirstPartyRelation") },
        { json: "make_primary", js: "make_primary", typ: true },
        { json: "merchant", js: "merchant", typ: r("MerchantClass") },
    ], false),
    "MerchantClass": o([
        { json: "brand_color", js: "brand_color", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "logo", js: "logo", typ: u(null, "") },
        { json: "name", js: "name", typ: "" },
        { json: "website", js: "website", typ: u(undefined, u(null, "")) },
    ], false),
    "Itemization": o([
        { json: "general", js: "general", typ: m("any") },
        { json: "lodging", js: "lodging", typ: m("any") },
        { json: "ecommerce", js: "ecommerce", typ: m("any") },
        { json: "car_rental", js: "car_rental", typ: m("any") },
        { json: "transit_route", js: "transit_route", typ: r("TransitRoute") },
        { json: "subscription", js: "subscription", typ: u(null, r("Subscription")) },
        { json: "flight", js: "flight", typ: u(m("any"), null) },
    ], "any"),
    "Subscription": o([
        { json: "subscription_items", js: "subscription_items", typ: a(r("SubscriptionItem")) },
        { json: "invoice_level_discounts", js: "invoice_level_discounts", typ: "any" },
    ], "any"),
    "SubscriptionItem": o([
        { json: "current_period_end", js: "current_period_end", typ: u(0, null) },
        { json: "current_period_start", js: "current_period_start", typ: u(0, null) },
        { json: "description", js: "description", typ: "" },
        { json: "discounts", js: "discounts", typ: u(a(r("InvoiceLevelDiscountElement")), null) },
        { json: "interval", js: "interval", typ: u(r("Interval"), null) },
        { json: "interval_count", js: "interval_count", typ: u(0, null) },
        { json: "metadata", js: "metadata", typ: u(a(r("MetadatumElement")), null) },
        { json: "quantity", js: "quantity", typ: u(3.14, null) },
        { json: "subscription_type", js: "subscription_type", typ: r("SubscriptionType") },
        { json: "taxes", js: "taxes", typ: u(a(r("TaxElement")), null) },
        { json: "unit_cost", js: "unit_cost", typ: u(3.14, null) },
    ], "any"),
    "InvoiceLevelDiscountElement": o([
        { json: "amount", js: "amount", typ: 0 },
        { json: "discount_type", js: "discount_type", typ: r("DiscountType") },
        { json: "name", js: "name", typ: "" },
        { json: "rate", js: "rate", typ: "any" },
    ], "any"),
    "MetadatumElement": o([
        { json: "metadata_type", js: "metadata_type", typ: r("MetadataType") },
        { json: "name", js: "name", typ: "" },
        { json: "value", js: "value", typ: "" },
    ], "any"),
    "TaxElement": o([
        { json: "amount", js: "amount", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "rate", js: "rate", typ: u(3.14, null) },
    ], "any"),
    "TransitRoute": o([
        { json: "arrival_address", js: "arrival_address", typ: u(undefined, u(null, r("ArrivalAddressObject"))) },
        { json: "arrival_time", js: "arrival_time", typ: u(undefined, 0) },
        { json: "departure_address", js: "departure_address", typ: u(undefined, u(null, r("ArrivalAddressObject"))) },
        { json: "departure_time", js: "departure_time", typ: u(undefined, 0) },
        { json: "invoice_level_discounts", js: "invoice_level_discounts", typ: u(undefined, u(a(r("InvoiceLevelDiscountElement")), null)) },
        { json: "metadata", js: "metadata", typ: u(undefined, u(a(r("MetadatumElement")), null)) },
        { json: "polyline", js: "polyline", typ: u(undefined, u(null, "")) },
        { json: "taxes", js: "taxes", typ: u(undefined, u(a(r("TaxElement")), null)) },
        { json: "tip", js: "tip", typ: u(undefined, u(0, null)) },
    ], "any"),
    "Payment": o([
        { json: "paid_at", js: "paid_at", typ: 0 },
        { json: "payment_type", js: "payment_type", typ: r("PaymentType") },
        { json: "card_payment", js: "card_payment", typ: "any" },
        { json: "ach_payment", js: "ach_payment", typ: "any" },
    ], "any"),
    "Currency": [
        "aud",
        "cad",
        "chf",
        "cnh",
        "eur",
        "gbp",
        "jpy",
        "usd",
    ],
    "FirstPartyRelation": [
        "bnpl",
        "delivery_service",
        "marketplace",
        "payment_processor",
        "platform",
        "point_of_sale",
    ],
    "DiscountType": [
        "fixed",
        "percentage",
    ],
    "Interval": [
        "day",
        "month",
        "week",
        "year",
    ],
    "MetadataType": [
        "asin",
        "other",
        "sku",
        "unspsc",
    ],
    "SubscriptionType": [
        "one_time",
        "recurring",
    ],
    "PaymentType": [
        "ach",
        "card",
    ],
};
