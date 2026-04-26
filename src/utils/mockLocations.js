export const mockLocations = {
  'Sector 4': [40.7128, -74.0060], // roughly NYC
  'Community Center': [40.7200, -73.9900],
  'Downtown': [40.7000, -74.0150],
  'default': [40.7150, -74.0000]
};

export const getCoordinates = (locationString) => {
  if (mockLocations[locationString]) {
    return mockLocations[locationString];
  }
  
  // Create a somewhat stable "random" coordinate based on the string length
  // so the same location string always gets the same coordinate
  const seed = locationString.length;
  const latOffset = (seed % 10) * 0.005;
  const lngOffset = (seed % 7) * 0.005;
  
  return [
    mockLocations['default'][0] + latOffset,
    mockLocations['default'][1] + lngOffset
  ];
};
