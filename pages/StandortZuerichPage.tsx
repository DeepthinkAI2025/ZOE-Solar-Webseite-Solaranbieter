import React from 'react';
import StandortPage from '../components/StandortPage';

const StandortZuerichPage: React.FC = () => {
  return (
    <StandortPage
      locationKey="zuerich"
      city="Zürich"
      state="Zürich"
      regionCode="CH-ZH"
      postalCode="8001"
      latitude={47.376887}
      longitude={8.541694}
      radiusKm={90}
      keywords={[
        "Photovoltaik Zürich",
        "Solar Zürich",
        "Solaranlagen Zürich",
        "PV-Anlage Zürich",
        "Solarstrom Zürich",
        "Solarförderung Zürich"
      ]}
      regionalOffers={[
        "Förderprogramme für Solaranlagen in Zürich",
        "Photovoltaik-Komplettpaket für Zürcher Haushalte",
        "Agri-PV Lösungen für Zürcher Landwirtschaft"
      ]}
      geoData={{
        city: "Zürich",
        state: "Zürich",
        postalCode: "8001",
        latitude: 47.376887,
        longitude: 8.541694
      }}
    />
  );
};

export default StandortZuerichPage;