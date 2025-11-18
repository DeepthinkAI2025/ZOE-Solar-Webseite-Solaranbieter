import React from 'react';
import StandortPage from '../components/StandortPage';

const StandortFrankfurtPage: React.FC = () => {
  return (
    <StandortPage
      locationKey="frankfurt"
      city="Frankfurt am Main"
      state="Hessen"
      regionCode="DE-HE"
      postalCode="60311"
      latitude={50.1109}
      longitude={8.6821}
      radiusKm={130}
      keywords={[
        "Photovoltaik Frankfurt",
        "Solar Frankfurt",
        "Solaranlagen Frankfurt",
        "PV-Anlage Frankfurt",
        "Solarstrom Frankfurt",
        "Solarförderung Hessen"
      ]}
      regionalOffers={[
        "Förderprogramme für Solaranlagen in Hessen",
        "Photovoltaik-Komplettpaket für Frankfurter Haushalte",
        "Agri-PV Lösungen für hessische Landwirtschaft"
      ]}
      geoData={{
        city: "Frankfurt am Main",
        state: "Hessen",
        postalCode: "60311",
        latitude: 50.1109,
        longitude: 8.6821
      }}
    />
  );
};

export default StandortFrankfurtPage;
