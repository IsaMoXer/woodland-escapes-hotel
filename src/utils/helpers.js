import {
  formatDistance,
  parseISO,
  differenceInDays,
  parse,
  format,
  isBefore,
  startOfDay,
} from "date-fns";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = dateStr =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = value =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );

// ******** Functions for new booking *********

export const convertToTimestamp = dateString => {
  // Regular expression to match the dd/mm/yyyy format
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;

  // Check if the date string matches the regex
  if (!regex.test(dateString)) {
    //throw new Error("Invalid date format. Please use dd/mm/yyyy.");
    return;
  }
  // Parse the date string (dd/mm/yyyy)
  const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());

  // Format it to the desired timestamp format (yyyy-MM-dd HH:mm:ss)
  const formattedDate = format(parsedDate, "yyyy-MM-dd HH:mm:ss");

  return formattedDate;
};

export const validateDateFormat = value => {
  // Remove spaces from the input value
  const trimmedValue = value.replace(/\s+/g, "");

  // Regular expression to match dd/mm/yyyy format
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
  return regex.test(trimmedValue);
};

export const validateDateRange = (startDate, endDate) => {
  // Parse the date string (dd/mm/yyyy)
  const parsedStartDate = parse(startDate, "dd/MM/yyyy", new Date());
  const parsedEndDate = parse(endDate, "dd/MM/yyyy", new Date());

  // Check if the start date is earlier than the end date
  const startIsEarlierThanEnd =
    new Date(parsedStartDate) <= new Date(parsedEndDate);

  return startIsEarlierThanEnd;
};

// Checks if a date is earlier than today (for creating bookings for example)
export const validateNotInPast = date => {
  // Split the input date string
  const [day, month, year] = date.split("/").map(Number);
  const selectedDate = new Date(year, month - 1, day); // Create a Date object
  const today = startOfDay(new Date()); // Get today's date at start of day

  // Return true if selectedDate is today or in the future; false if it's in the past
  return !isBefore(selectedDate, today);
};

// Checks if there are conflicts with data when creating a new booking
export const checkForBookingOverlap = (
  startDate,
  endDate,
  existingBookings
) => {
  // Convert new booking dates to Date objects
  const newStartDate = new Date(convertToTimestamp(startDate));
  const newEndDate = new Date(convertToTimestamp(endDate));

  return existingBookings?.some(booking => {
    // Convert existing booking dates to Date objects
    const existingStartDate = new Date(booking.startDate); // Assuming Supabase stores dates in a compatible format
    const existingEndDate = new Date(booking.endDate); // Assuming Supabase stores dates in a compatible format

    // Check for overlap
    return newStartDate < existingEndDate && newEndDate > existingStartDate;
  });
};

export const calculateNumOfNights = (startDate, endDate) => {
  // Parse the date string (dd/mm/yyyy)
  const parsedStartDate = parse(startDate, "dd/MM/yyyy", new Date());
  const parsedEndDate = parse(endDate, "dd/MM/yyyy", new Date());

  // Calculate the number of nights
  const nights = differenceInDays(parsedEndDate, parsedStartDate);

  return nights;
};

// function for developing phase to use as fake data
export function generateGuestList(numGuests) {
  const guestList = [];
  const nationalities = [
    "American",
    "Canadian",
    "British",
    "French",
    "German",
    "Italian",
    "Spanish",
    "Japanese",
    "Chinese",
    "Indian",
  ];
  const usedIds = new Set(); // To keep track of used IDs

  while (guestList.length < numGuests) {
    // Generate a unique ID
    let id;
    do {
      id = Math.floor(10 + Math.random() * 90); // Generate a random ID between 10 and 99
    } while (usedIds.has(id)); // Check if the ID is already used

    // Mark the ID as used
    usedIds.add(id);

    // Generate random guest details
    const firstName = [
      "John",
      "Jane",
      "Michael",
      "Emily",
      "David",
      "Sarah",
      "Christopher",
      "Olivia",
      "Matthew",
      "Isabella",
    ][Math.floor(Math.random() * 10)];
    const lastName = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Davis",
      "Miller",
      "Wilson",
      "Anderson",
      "Taylor",
      "Thomas",
    ][Math.floor(Math.random() * 10)];
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const nationalId = Math.floor(100000 + Math.random() * 900000);
    const nationality =
      nationalities[Math.floor(Math.random() * nationalities.length)];

    // Create the guest object
    const guest = {
      id,
      fullName,
      email,
      nationalId,
      nationality,
    };

    // Add the guest object to the guest list
    guestList.push(guest);
  }

  return guestList;
}

// Function to generate country code given the country name
//  Also used to check if a country exists
export const getCountryCode = async countryName => {
  // The countryName is case insensitive, so no need to format
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data && data.length > 0) {
      // Return the alpha-2 country code
      return data[0].cca2.toLowerCase(); // Use cca3 for alpha-3 code if needed
    } else {
      throw new Error("Country not found");
    }
  } catch (error) {
    console.error("Error:", error);
    return null; // Return null or handle the error as needed
  }
};

export const generateCountryFlagHttp = async countryName => {
  const countryCode = await getCountryCode(countryName);
  if (countryCode) {
    const countryFlag = `https://flagcdn.com/${countryCode}.svg`;
    return countryFlag;
  }

  return null;
};
