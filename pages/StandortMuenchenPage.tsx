import React from 'react';
import StandortPage from '../components/StandortPage';

const StandortMuenchenPage: React.FC = () => {
  return (
    <StandortPage
      locationKey="muenchen"
      city="München"
      state="Bayern"
      regionCode="DE-BY"
      postalCode="80331"
      latitude={48.135125}
      longitude={11.581981}
      radiusKm={160}
      keywords={[
        "Photovoltaik München",
        "Solar München",
        "Solaranlagen München",
        "PV-Anlage München",
        "Solarstrom München",
        "Solarförderung Bayern"
      ]}
      regionalOffers={[
        "Förderprogramme für Solaranlagen in Bayern",
        "Photovoltaik-Komplettpaket für Münchner Haushalte",
        "Agri-PV Lösungen für bayerische Landwirtschaft"
      ]}
      geoData={{
        city: "München",
        state: "Bayern",
        postalCode: "80331",
        latitude: 48.135125,
        longitude: 11.581981
      }}
    />
  );
};

export default StandortMuenchenPage;