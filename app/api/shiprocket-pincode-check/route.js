// /api/international-pincode-check/route.js

let shiprocketToken = null;
let tokenFetchedAt = null;

async function getShiprocketToken() {
  const shouldRefresh =
    !shiprocketToken ||
    Date.now() - tokenFetchedAt > 1000 * 60 * 60 * 23;

  if (!shouldRefresh) return shiprocketToken;

  const loginRes = await fetch(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: "JIDFq^QFCiOMf3^3L&iZxyBmUX1A8t*O", // ✅ Move to env — never hardcode passwords
      }),
    }
  );

  const loginData = await loginRes.json();

  if (!loginRes.ok) {
    console.error("Shiprocket Login Failed", loginData);
    throw new Error("Failed to authenticate with Shiprocket");
  }

  shiprocketToken = loginData.token;
  tokenFetchedAt = Date.now();

  return shiprocketToken;
}

export async function GET(req) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get("pincode");
    const country = searchParams.get("country") || "IN";
    const quantity = parseInt(searchParams.get("quantity")) || 1;

    if (!pincode) {
      return Response.json(
        { serviceable: false, error: "Pincode is required" },
        { status: 400 }
      );
    }

    const countryCode = country.toUpperCase();

    if (countryCode === "IN") {
      return await checkIndianPincode(pincode, quantity);
    }

    return await checkInternationalShiprocket(pincode, countryCode, quantity);
  } catch (error) {
    console.error("Pincode check error:", error);
    return Response.json(
      { serviceable: false, error: error.message },
      { status: 500 }
    );
  }
}

// ─── India domestic ────────────────────────────────────────────────────────────
async function checkIndianPincode(pincode, quantity) {
  const pickupPostcode = process.env.PICKUP_POSTCODE || "360002";
  const weight = parseInt(process.env.SHIPPING_WEIGHT) || 100; // grams
  const length = parseInt(process.env.SHIPPING_LENGTH) || 10;
  const width = parseInt(process.env.SHIPPING_WIDTH) || 10;
  const height = parseInt(process.env.SHIPPING_HEIGHT) || 10;

  const totalWeight = (weight / 1000) * quantity;
  const volumetricWeight = ((length * width * height) / 5000) * quantity;
  const chargeableWeight = Math.max(totalWeight, volumetricWeight);

  const token = await getShiprocketToken();

  const url = new URL(
    "https://apiv2.shiprocket.in/v1/external/courier/serviceability"
  );
  url.searchParams.append("pickup_postcode", pickupPostcode);
  url.searchParams.append("delivery_postcode", pincode);
  url.searchParams.append("cod", 0);
  url.searchParams.append("weight", chargeableWeight.toFixed(2));
  url.searchParams.append("length", length);
  url.searchParams.append("width", width);
  url.searchParams.append("height", height);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Shiprocket API error: ${res.statusText}`);
  }

  const data = await res.json();
  const serviceable =
    data?.status === 200 &&
    data.data?.available_courier_companies?.length > 0;

  let shippingCharge = 0;
  let expectedDate = "";

  if (serviceable) {
    const courier =
      data.data.available_courier_companies.find(
        (c) =>
          c.courier_company_id ===
          data.data.shiprocket_recommended_courier_id
      ) || data.data.available_courier_companies[0];

    shippingCharge =
      courier?.freight_charge || courier?.rate || courier?.shipping_cost || 0;

    if (courier?.etd) {
      const originalDate = new Date(courier.etd);
      const finalDate = new Date(originalDate);
      finalDate.setDate(originalDate.getDate() + 5);

      expectedDate = finalDate.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    }
  }

  return Response.json({
    serviceable,
    expectedDate,
    shippingCharge: parseFloat(shippingCharge.toFixed(2)) || 0,
    country: "IN",
  });
}

// ─── International via Shiprocket ──────────────────────────────────────────────
//
// Shiprocket International Serviceability is a GET request.
// Required params: pickup_postcode, delivery_country (ISO Alpha-2), cod (must be 0), weight (kg)
// Optional params: length, breadth, height
// NOTE: There is NO delivery_postcode for international — country-level only.
//
async function checkInternationalShiprocket(pincode, countryCode, quantity) {
  try {
    const token = await getShiprocketToken();

    const pickupPostcode = process.env.PICKUP_POSTCODE || "360002";
    const weight = parseInt(process.env.SHIPPING_WEIGHT) || 100; // grams
    const length = parseInt(process.env.SHIPPING_LENGTH) || 10;
    const width = parseInt(process.env.SHIPPING_WIDTH) || 10;
    const height = parseInt(process.env.SHIPPING_HEIGHT) || 10;

    const totalWeight = (weight / 1000) * quantity;
    const volumetricWeight = ((length * width * height) / 5000) * quantity;
    const chargeableWeight = Math.max(totalWeight, volumetricWeight);

    // ✅ Correct: GET request with query params (not POST with body)
    // ✅ Correct: uses delivery_country, NOT delivery_postcode
    // ✅ Correct: cod must be 0 for international
    const url = new URL(
      "https://apiv2.shiprocket.in/v1/external/courier/international/serviceability"
    );
    url.searchParams.append("pickup_postcode", pickupPostcode);
    url.searchParams.append("delivery_country", countryCode);
    url.searchParams.append("cod", 0);
    url.searchParams.append("weight", chargeableWeight.toFixed(2));
    url.searchParams.append("length", length);
    url.searchParams.append("breadth", width); // Shiprocket uses "breadth" for international
    url.searchParams.append("height", height);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok || !data?.data?.available_courier_companies?.length) {
      // Country is not serviceable by Shiprocket
      return Response.json({
        serviceable: false,
        error: "International delivery not available to this country",
        country: countryCode,
      });
    }

    const couriers = data.data.available_courier_companies;

    // Pick the cheapest courier (sort by freight_charge ascending)
    const courier = couriers.sort(
      (a, b) =>
        (a.freight_charge || a.rate || 0) - (b.freight_charge || b.rate || 0)
    )[0];

    // Pull real values from Shiprocket response — no hardcoded fallbacks
    const shippingCharge = courier.freight_charge || courier.rate || 0;

    // etd from Shiprocket international is usually an integer (days)
    const estimatedDays =
      typeof courier.etd === "number"
        ? courier.etd
        : typeof courier.etd === "string" && !isNaN(Number(courier.etd))
        ? Number(courier.etd)
        : courier.estimated_delivery_days || null;

    let expectedDate = "";
    if (estimatedDays) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);
      expectedDate = deliveryDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    return Response.json({
      serviceable: true,
      expectedDate,
      shippingCharge: parseFloat(shippingCharge.toFixed(2)),
      country: countryCode,
      estimatedDays,
      courierName: courier.courier_name || "International Courier",
      // Postal code is passed through for the frontend to display/store,
      // but Shiprocket international serviceability is country-level only.
      postalCode: pincode,
    });
  } catch (error) {
    console.error("Shiprocket International API error:", error);
    return Response.json(
      {
        serviceable: false,
        error: "Could not verify international delivery availability",
        country: countryCode,
      },
      { status: 500 }
    );
  }
}