// /api/international-pincode-check/route.js

let shiprocketToken = null;
let tokenFetchedAt = null;

async function getShiprocketToken() {
  const shouldRefresh = !shiprocketToken || (Date.now() - tokenFetchedAt) > 1000 * 60 * 60 * 23;

  if (!shouldRefresh) return shiprocketToken;

  const loginRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: "bx@Yei24sVId7CcfLRZKbaO0*h$iP4sf",
    }),
  });

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

    // For India, use domestic Shiprocket API
    if (countryCode === "IN") {
      return await checkIndianPincode(pincode, quantity);
    }

    // For other countries, use Shiprocket International API
    return await checkInternationalShiprocket(pincode, countryCode, quantity);

  } catch (error) {
    console.error("Pincode check error:", error);
    return Response.json(
      { serviceable: false, error: error.message },
      { status: 500 }
    );
  }
}

// India-specific using Shiprocket Domestic
async function checkIndianPincode(pincode, quantity) {
  const pickupPostcode = "360002";
  const weight = parseInt(process.env.SHIPPING_WEIGHT) || 100;
  const length = parseInt(process.env.SHIPPING_LENGTH) || 10;
  const width = parseInt(process.env.SHIPPING_WIDTH) || 10;
  const height = parseInt(process.env.SHIPPING_HEIGHT) || 10;

  const totalWeight = (weight / 1000) * quantity;
  const volumetricWeight = ((length * width * height) / 5000) * quantity;
  const chargeableWeight = Math.max(totalWeight, volumetricWeight);

  const token = await getShiprocketToken();

  const url = new URL("https://apiv2.shiprocket.in/v1/external/courier/serviceability");
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
  const serviceable = data?.status === 200 && data.data?.available_courier_companies?.length > 0;

  let shippingCharge = 0;
  let expectedDate = "";

  if (serviceable) {
    const courier = data.data.available_courier_companies.find(
      (c) => c.courier_company_id === data.data.shiprocket_recommended_courier_id
    ) || data.data.available_courier_companies[0];

    shippingCharge = courier?.freight_charge || courier?.rate || courier?.shipping_cost || 0;

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
    country: "IN"
  });
}

// International using Shiprocket International API
async function checkInternationalShiprocket(pincode, countryCode, quantity) {
  try {
    const token = await getShiprocketToken();
    
    const weight = parseInt(process.env.SHIPPING_WEIGHT) || 100;
    const length = parseInt(process.env.SHIPPING_LENGTH) || 10;
    const width = parseInt(process.env.SHIPPING_WIDTH) || 10;
    const height = parseInt(process.env.SHIPPING_HEIGHT) || 10;

    const totalWeight = (weight / 1000) * quantity;
    const volumetricWeight = ((length * width * height) / 5000) * quantity;
    const chargeableWeight = Math.max(totalWeight, volumetricWeight);

    // Shiprocket International Serviceability Check
    const payload = {
      pickup_postcode: "360002",
      delivery_country: countryCode,
      delivery_postcode: pincode,
      weight: chargeableWeight,
      length: length,
      breadth: width,
      height: height,
      declared_value: 5000 * quantity, // Approximate product value in INR
    };

    const res = await fetch("https://apiv2.shiprocket.in/v1/external/courier/international/serviceability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // If Shiprocket international fails, fallback to Zippopotam validation
      return await fallbackToZippopotam(pincode, countryCode);
    }

    const data = await res.json();
    
    // Check if serviceable
    const serviceable = data?.data?.available_courier_companies?.length > 0;

    if (!serviceable) {
      return Response.json({
        serviceable: false,
        error: "International delivery not available to this location",
        country: countryCode
      });
    }

    // Get recommended courier or first available
    const courier = data.data.available_courier_companies[0];
    
    const shippingCharge = courier?.freight_charge || courier?.rate || 0;
    
    // Calculate estimated delivery (usually 7-15 days for international)
    const estimatedDays = courier?.etd || 10; // Default 10 days if not provided
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);
    
    const expectedDate = deliveryDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    return Response.json({
      serviceable: true,
      expectedDate: expectedDate,
      shippingCharge: parseFloat(shippingCharge.toFixed(2)),
      country: countryCode,
      estimatedDays: estimatedDays,
      courierName: courier?.courier_name || "International Courier"
    });

  } catch (error) {
    console.error("Shiprocket International API error:", error);
    // Fallback to Zippopotam for postal code validation
    return await fallbackToZippopotam(pincode, countryCode);
  }
}

// Fallback to Zippopotam for postal code validation only
async function fallbackToZippopotam(pincode, countryCode) {
  try {
    const res = await fetch(`https://api.zippopotam.us/${countryCode}/${pincode}`);
    
    if (!res.ok) {
      return Response.json({
        serviceable: false,
        error: "Invalid postal code or delivery not available",
        country: countryCode
      });
    }

    const data = await res.json();
    
    // Extract location details
    const places = data.places || [];
    const locationOptions = places.map(place => ({
      city: place["place name"],
      state: place.state,
      stateAbbr: place["state abbreviation"],
    }));

    // Return with estimated international shipping
    return Response.json({
      serviceable: true,
      expectedDate: "10-15 business days",
      shippingCharge: 2500, // Fallback flat rate
      country: countryCode,
      countryName: data.country,
      locations: locationOptions,
      note: "Estimated delivery time and cost. Final rates calculated at checkout."
    });

  } catch (error) {
    console.error("Zippopotam API error:", error);
    return Response.json({
      serviceable: false,
      error: "Could not verify postal code",
      country: countryCode
    });
  }
}