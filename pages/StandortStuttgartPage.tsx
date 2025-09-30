import React from 'react';
import StandortPage from '../components/StandortPage';

const StandortStuttgartPage: React.FC = () => {
  return (
    <StandortPage
      locationKey="stuttgart"
      city="Stuttgart"
      state="Baden-Württemberg"
      regionCode="DE-BW"
      postalCode="70173"
      latitude={48.7758}
      longitude={9.1829}
      radiusKm={120}
      keywords={[
        "Photovoltaik Stuttgart",
        "Solar Stuttgart",
        "Solaranlagen Stuttgart",
        "PV-Anlage Stuttgart",
        "Solarstrom Stuttgart",
        "Solarförderung Baden-Württemberg"
      ]}
      regionalOffers={[
        "Förderprogramme für Solaranlagen in Baden-Württemberg",
        "Photovoltaik-Komplettpaket für Stuttgarter Haushalte",
        "Agri-PV Lösungen für baden-württembergische Landwirtschaft"
      ]}
      geoData={{
        city: "Stuttgart",
        state: "Baden-Württemberg",
        postalCode: "70173",
        latitude: 48.7758,
        longitude: 9.1829
      }}
    />
  );
};

export default StandortStuttgartPage;
