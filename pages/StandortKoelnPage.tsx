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
      keywords={[
        "Photovoltaik Köln",
        "Solar Köln",
        "Solaranlagen Köln",
        "PV-Anlage Köln",
        "Solarstrom Köln",
        "Solarförderung NRW"
      ]}
      regionalOffers={[
        "Förderprogramme für Solaranlagen in NRW",
        "Photovoltaik-Komplettpaket für Kölner Haushalte",
        "Agri-PV Lösungen für nordrhein-westfälische Landwirtschaft"
      ]}
      geoData={{
        city: "Köln",
        state: "Nordrhein-Westfalen",
        postalCode: "50667",
        latitude: 50.9375,
        longitude: 6.9603
      }}
    />
  );
};

export default StandortKoelnPage;
