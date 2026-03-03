export const TYPES = [
  { value: "rent",     label: "For Rent"  },
  { value: "buy",      label: "For Sale"  },
  { value: "exchange", label: "Exchange"  },
  { value: "donation", label: "Donation"  },
];


export const TYPE_LABELS = Object.fromEntries(TYPES.map((t) => [t.value, t.label]));

export const PROPERTY_TYPES = [
  { value: "house",      label: "House"      },
  { value: "apartment",  label: "Apartment"  },
  { value: "studio",     label: "Studio"     },
  { value: "maisonette", label: "Maisonette" },
  { value: "villa",      label: "Villa"      },
  { value: "land",       label: "Land"       },
  { value: "commercial", label: "Commercial" },
  { value: "other",      label: "Other"      },
];


export const PROPERTY_TYPE_LABELS = Object.fromEntries(
  PROPERTY_TYPES.map((t) => [t.value, t.label])
);

export const FEATURES = [
  { value: "garden",          label: "Garden"            },
  { value: "balcony",         label: "Balcony"           },
  { value: "parking",         label: "Parking"           },
  { value: "storage",         label: "Storage"           },
  { value: "elevator",        label: "Elevator"          },
  { value: "furnished",       label: "Furnished"         },
  { value: "pets_allowed",    label: "Pets Allowed"      },
  { value: "solar_water",     label: "Solar Water Heater"},
  { value: "alarm",           label: "Alarm System"      },
  { value: "air_conditioning",label: "Air Conditioning"  },
];


export const BEDROOM_OPTIONS = ["1", "2", "3", "4+"];