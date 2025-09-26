import React from 'react';
import StandortPage from '../components/StandortPage';

const StandortKoelnPage: React.FC = () => {
  return (
    <StandortPage
      locationKey="koeln"
      city="Köln"
      state="Nordrhein-Westfalen"
      regionCode="DE-NW"
      postalCode="50667"
      latitude={50.9375}
      longitude={6.9603}
      radiusKm={140}
    />
  );
};

export default StandortKoelnPage;
