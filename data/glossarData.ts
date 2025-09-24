export interface GlossarItem {
    term: string;
    definition: string;
}

export const glossarData: GlossarItem[] = [
    // A
    {
        term: 'Abschattung',
        definition: 'Die teilweise oder vollständige Verdeckung von Solarmodulen durch Objekte wie Bäume, Schornsteine oder Nachbargebäude. Abschattung reduziert den Energieertrag und kann durch moderne Wechselrichter mit Schattenmanagement oder Leistungsoptimierer teilweise kompensiert werden.'
    },
    {
        term: 'AC (Alternating Current)',
        definition: 'Englisch für Wechselstrom. Die Art von Strom, die aus unseren Steckdosen kommt und im öffentlichen Stromnetz verwendet wird. Der Wechselrichter wandelt den Gleichstrom (DC) der Solarmodule in Wechselstrom (AC) um.'
    },
    {
        term: 'Agri-Photovoltaik (Agri-PV)',
        definition: 'Ein innovatives Konzept, das die gleichzeitige Nutzung von Flächen für die Landwirtschaft (Agri) und die Photovoltaik (PV) ermöglicht. Spezielle, hoch aufgeständerte Modulkonstruktionen schützen die Pflanzen und erzeugen gleichzeitig Strom.'
    },
    {
        term: 'Albedo',
        definition: 'Das Rückstrahlvermögen einer Oberfläche. Helle Oberflächen haben einen hohen Albedowert und reflektieren viel Sonnenlicht. Dies ist besonders für bifaziale Solarmodule relevant, da sie auch das reflektierte Licht von der Rückseite nutzen können.'
    },
    {
        term: 'Amortisationszeit',
        definition: 'Der Zeitraum, nach dem die anfänglichen Investitionskosten für eine Photovoltaikanlage durch die erzielten Einsparungen und Einnahmen vollständig gedeckt sind. Ab diesem Zeitpunkt erwirtschaftet die Anlage einen reinen Gewinn.'
    },
    {
        term: 'Anlagenbetreiber',
        definition: 'Die natürliche oder juristische Person, die eine Photovoltaikanlage besitzt und für deren Betrieb verantwortlich ist. Der Anlagenbetreiber hat Rechte (z.B. auf Einspeisevergütung) und Pflichten (z.B. Anlagenregistrierung, Wartung).'
    },
    {
        term: 'Aufdach-Anlage',
        definition: 'Die häufigste Montageart, bei der die Solarmodule mit einem Montagesystem auf ein bestehendes Dach montiert werden.'
    },
    {
        term: 'Autarkiegrad',
        definition: 'Gibt in Prozent an, wie viel des eigenen Strombedarfs durch die eigene PV-Anlage (inkl. Speicher) gedeckt werden kann. Ein Autarkiegrad von 70% bedeutet, dass 70% des verbrauchten Stroms selbst erzeugt und nur 30% aus dem Netz bezogen werden müssen.'
    },
    {
        term: 'Azimut',
        definition: 'Die Himmelsrichtung, in die eine Solaranlage ausgerichtet ist. 0° entspricht Norden, 90° Osten, 180° Süden und 270° Westen. Für maximalen Jahresertrag ist in Deutschland eine Ausrichtung nach Süden (180°) optimal.'
    },
    {
        term: 'A-Si (Amorphes Silizium)',
        definition: 'Eine Form von Silizium, die in Dünnschicht-Solarmodulen verwendet wird. Es hat einen geringeren Wirkungsgrad als kristallines Silizium, ist aber flexibler und hat ein besseres Schwachlichtverhalten.'
    },

    // B
    {
        term: 'BAFA (Bundesamt für Wirtschaft und Ausfuhrkontrolle)',
        definition: 'Eine Bundesbehörde, die unter anderem für die Vergabe von Förderungen im Bereich Energieeffizienz und erneuerbare Energien zuständig ist.'
    },
    {
        term: 'Batteriespeicher',
        definition: 'Ein System zur Speicherung von elektrischer Energie. In PV-Anlagen speichert er überschüssigen Solarstrom, der tagsüber erzeugt wird, um ihn zu einem späteren Zeitpunkt (z.B. nachts) verfügbar zu machen. Dies erhöht den Eigenverbrauch und die Autarkie.'
    },
    {
        term: 'Betreiber',
        definition: 'Siehe Anlagenbetreiber. Die Person oder das Unternehmen, das die rechtliche und wirtschaftliche Verantwortung für die PV-Anlage trägt.'
    },
    {
        term: 'Bifaziale Module',
        definition: 'Solarmodule, die auf beiden Seiten (Vorder- und Rückseite) Sonnenlicht in elektrische Energie umwandeln können. Sie nutzen zusätzlich das vom Untergrund reflektierte Licht (Albedo) und können so Mehrerträge von bis zu 25% erzielen.'
    },
    {
        term: 'BImSchG (Bundes-Immissionsschutzgesetz)',
        definition: 'Ein Gesetz zum Schutz vor schädlichen Umwelteinwirkungen. Bei sehr großen PV-Freiflächenanlagen kann eine Genehmigung nach diesem Gesetz erforderlich sein.'
    },
    {
        term: 'BIPV (Gebäudeintegrierte Photovoltaik)',
        definition: 'Building-Integrated Photovoltaics. Hierbei sind die Solarmodule nicht nur auf dem Gebäude montiert, sondern ersetzen als multifunktionales Bauteil Teile der Gebäudehülle, z.B. als Dachziegel, Fassadenelement oder Verglasung.'
    },
    {
        term: 'Blindleistung',
        definition: 'Ein Teil des Wechselstroms, der nicht in Nutzleistung umgewandelt wird, aber zur Aufrechterhaltung von Magnetfeldern in Motoren oder Transformatoren notwendig ist. Moderne Wechselrichter müssen in der Lage sein, zur Netzstabilisierung Blindleistung bereitzustellen.'
    },
    {
        term: 'Bruttostromerzeugung',
        definition: 'Die gesamte von einem Kraftwerk oder einer Anlage erzeugte elektrische Energie, bevor der Eigenbedarf für den Betrieb der Anlage abgezogen wird.'
    },
    {
        term: 'Bypass-Diode',
        definition: 'Eine Diode innerhalb eines Solarmoduls. Wird eine Zelle oder ein Teil des Moduls verschattet, leitet die Bypass-Diode den Strom um diesen Bereich herum. Dies verhindert einen Leistungsabfall des gesamten Modulstrings und schützt das Modul vor Überhitzung (Hotspots).'
    },
    {
        term: 'Blackout',
        definition: 'Ein großflächiger, unkontrollierter Stromausfall, der ganze Regionen oder Länder betreffen kann. PV-Anlagen mit notstromfähigen Speichern können eine gewisse Absicherung dagegen bieten.'
    },

    // C
    {
        term: 'Carport (Solar-Carport)',
        definition: 'Eine Parkplatzüberdachung mit integrierten Solarmodulen. Sie schützt Fahrzeuge vor Witterung und erzeugt gleichzeitig Strom, der idealerweise direkt für das Laden von E-Fahrzeugen genutzt wird.'
    },
    {
        term: 'Charge Controller (Laderegler)',
        definition: 'Ein Gerät, das den Lade- und Entladevorgang einer Batterie steuert. Es schützt die Batterie vor Überladung oder Tiefentladung und optimiert ihre Lebensdauer. Bei modernen Speichersystemen ist der Laderegler oft im Batteriemanagementsystem (BMS) integriert.'
    },
    {
        term: 'Checkliste',
        definition: 'Ein Dokument, das die wichtigsten Punkte zu einem Thema in Listenform zusammenfasst. Checklisten dienen der Überprüfung von Voraussetzungen oder der Abarbeitung von Prozessschritten, z.B. bei der Anlagenplanung.'
    },
    {
        term: 'CIGS-Zellen',
        definition: 'Eine Dünnschicht-Technologie für Solarzellen, die aus einer Verbindung von Kupfer, Indium, Gallium und Selen besteht. CIGS-Module haben den höchsten Wirkungsgrad unter den Dünnschicht-Technologien.'
    },
    {
        term: 'Cloud (Solar-Cloud)',
        definition: 'Ein virtuelles Speichermodell, das von einigen Energieversorgern angeboten wird. Überschüssiger Solarstrom wird bilanziell in die "Cloud" eingespeist und kann zu einem späteren Zeitpunkt wieder "abgerufen" werden. Es handelt sich um ein reines Bilanzierungs- und kein physisches Speichermodell.'
    },
    {
        term: 'Cluster',
        definition: 'In der Photovoltaik bezeichnet ein Cluster eine Gruppe von Solarmodulen, die elektrisch miteinander verbunden sind. Auch eine Ansammlung von Wind- oder Solarparks in einer Region wird als Cluster bezeichnet.'
    },
    {
        term: 'CO2-Zertifikat',
        definition: 'Ein handelbares Zertifikat, das dem Inhaber das Recht gibt, eine Tonne Kohlendioxid (CO2) auszustoßen. Unternehmen, die durch PV-Anlagen CO2 einsparen, können diese Einsparungen potenziell in Form von Zertifikaten vermarkten.'
    },
    {
        term: 'Commissioning (Inbetriebnahme)',
        definition: 'Der Prozess der Inbetriebnahme einer PV-Anlage. Er umfasst die abschließende Prüfung aller Komponenten, die Messung der Leistungsdaten und die offizielle Zuschaltung der Anlage zum Stromnetz.'
    },
    {
        term: 'Contracting',
        definition: 'Ein Geschäftsmodell, bei dem ein Energiedienstleister (Contractor) eine PV-Anlage auf dem Dach eines Kunden (Contractingnehmer) errichtet und betreibt. Der Kunde muss nicht selbst investieren, sondern kauft den Solarstrom zu einem festen Preis vom Contractor.'
    },
    {
        term: 'C-Rate (Batterie)',
        definition: 'Die C-Rate gibt die Lade- bzw. Entladegeschwindigkeit einer Batterie im Verhältnis zu ihrer Kapazität an. Eine C-Rate von 1C bedeutet, dass die Batterie in einer Stunde vollständig ge- oder entladen wird. Eine hohe C-Rate ist für Anwendungen wie Peak Shaving wichtig.'
    },
    // D
    {
        term: 'Dachanlage',
        definition: 'Eine Photovoltaikanlage, die auf dem Dach eines Gebäudes installiert ist. Man unterscheidet zwischen Aufdach-Anlagen (auf der Dacheindeckung) und Indach-Anlagen (anstelle der Dacheindeckung).'
    },
    {
        term: 'Dachhaken',
        definition: 'Ein Befestigungselement, das unter den Dachziegeln an den Dachsparren verschraubt wird. An den Dachhaken werden die Montageschienen für die Solarmodule befestigt.'
    },
    {
        term: 'Dachneigung',
        definition: 'Der Winkel des Daches zur Horizontalen. Eine optimale Dachneigung für PV-Anlagen liegt in Deutschland bei etwa 30-35 Grad. Bei Flachdächern wird diese Neigung durch eine Aufständerung erreicht.'
    },
    {
        term: 'DC (Direct Current)',
        definition: 'Englisch für Gleichstrom. Die Art von Strom, die von Solarmodulen erzeugt und in Batterien gespeichert wird. Er muss durch einen Wechselrichter in Wechselstrom (AC) umgewandelt werden, um im Haushalt oder Netz genutzt werden zu können.'
    },
    {
        term: 'Degradation',
        definition: 'Die natürliche, altersbedingte Abnahme der Leistungsfähigkeit von Solarmodulen. Hersteller garantieren in der Regel eine Restleistung von über 80-85% nach 25-30 Jahren.'
    },
    {
        term: 'Denkmalgeschützt',
        definition: 'Ein Gebäude, das unter Denkmalschutz steht, unterliegt besonderen baurechtlichen Auflagen. Die Installation von PV-Anlagen ist hier oft schwierig, aber durch spezielle Lösungen wie Solardachziegel oder nicht sichtbare Flächen manchmal möglich.'
    },
    {
        term: 'Diffuse Strahlung',
        definition: 'Sonnenstrahlung, die durch Wolken, Dunst oder Luftpartikel gestreut wird und aus allen Richtungen auf die Solarmodule trifft. Sie macht in Deutschland etwa 50% der Gesamtstrahlung aus. Module mit gutem Schwachlichtverhalten nutzen diese Strahlung besonders effizient.'
    },
    {
        term: 'Direktvermarktung',
        definition: 'Ein Modell, bei dem der erzeugte Solarstrom nicht zu einer festen EEG-Vergütung eingespeist, sondern direkt an der Strombörse verkauft wird. Ab einer bestimmten Anlagengröße ist dies verpflichtend. Die Erlöse sind variabel, liegen aber oft über der festen Vergütung.'
    },
    {
        term: 'Dünnschichtmodul',
        definition: 'Eine Art von Solarmodul, bei der das Halbleitermaterial in einer sehr dünnen Schicht auf ein Trägermaterial (z.B. Glas oder Folie) aufgedampft wird. Sie haben einen geringeren Wirkungsgrad, sind aber günstiger in der Herstellung und haben ein gutes Schwachlichtverhalten.'
    },
    {
        term: 'Dynamischer Peak Manager',
        definition: 'Eine innovative Funktion in manchen Wechselrichtern (z.B. Fronius), die den MPP-Tracker so optimiert, dass er auch bei Teilverschattungen sehr schnell und präzise den jeweils optimalen Arbeitspunkt findet, um Ertragsverluste zu minimieren.'
    },
    // E
    {
        term: 'EEG (Erneuerbare-Energien-Gesetz)',
        definition: 'Das zentrale Steuerungsinstrument für den Ausbau der erneuerbaren Energien in Deutschland. Es regelt unter anderem die Einspeisevergütung für Strom aus PV-Anlagen.'
    },
    {
        term: 'Eigenverbrauch',
        definition: 'Der Anteil des selbst erzeugten Solarstroms, der direkt im eigenen Gebäude verbraucht wird. Ein hoher Eigenverbrauch ist der wichtigste Hebel für die Wirtschaftlichkeit einer Anlage, da er den teuren Zukauf von Netzstrom ersetzt.'
    },
    {
        term: 'Einspeisevergütung',
        definition: 'Ein staatlich garantierter Betrag, den Anlagenbetreiber für jede in das öffentliche Netz eingespeiste Kilowattstunde Solarstrom erhalten. Die Höhe wird zum Zeitpunkt der Inbetriebnahme für 20 Jahre festgeschrieben.'
    },
    {
        term: 'Einspeisemanagement',
        definition: 'Die technische Einrichtung zur ferngesteuerten Reduzierung der Einspeiseleistung einer PV-Anlage durch den Netzbetreiber. Dies ist bei größeren Anlagen erforderlich, um bei Netzüberlastung die Stabilität zu sichern. Der Betreiber wird für die entgangenen Erträge entschädigt.'
    },
    {
        term: 'Elektrolyseur',
        definition: 'Ein Gerät, das mithilfe von elektrischem Strom Wasser (H2O) in seine Bestandteile Wasserstoff (H2) und Sauerstoff (O2) aufspaltet. Wird dafür Strom aus erneuerbaren Energien verwendet, spricht man von grünem Wasserstoff.'
    },
    {
        term: 'Energieeffizienz',
        definition: 'Das Verhältnis von erreichtem Nutzen (z.B. Licht, Wärme) zu eingesetzter Energie. Eine hohe Energieeffizienz bedeutet, dass für denselben Nutzen weniger Energie benötigt wird. Dies ist der erste Schritt vor der Installation einer PV-Anlage: erst sparen, dann erzeugen.'
    },
    {
        term: 'Erneuerbare Energien',
        definition: 'Energiequellen, die unbegrenzt zur Verfügung stehen oder sich schnell erneuern. Dazu gehören Sonnenenergie (Photovoltaik, Solarthermie), Windkraft, Wasserkraft, Biomasse und Geothermie.'
    },
    {
        term: 'Ertragsprognose',
        definition: 'Eine computergestützte Simulation, die den voraussichtlichen jährlichen Energieertrag einer PV-Anlage an einem bestimmten Standort berechnet. Sie berücksichtigt Faktoren wie Globalstrahlung, Dachneigung, Ausrichtung, Verschattung und die gewählten Komponenten.'
    },
    {
        term: 'ESG (Environmental, Social, Governance)',
        definition: 'Ein Kriterienkatalog, der die Nachhaltigkeit und ethische Praxis eines Unternehmens in den Bereichen Umwelt (E), Soziales (S) und Unternehmensführung (G) bewertet. Eine eigene PV-Anlage verbessert die ESG-Bilanz erheblich.'
    },
    {
        term: 'Ertragsausfall',
        definition: 'Ein Verlust von erwarteten Energieerträgen, z.B. durch technische Defekte, Netzabschaltungen oder extreme Wetterereignisse. Gegen Ertragsausfälle kann man sich versichern.'
    },

    // F
    {
        term: 'Festpreisangebot',
        definition: 'Ein Angebot, bei dem alle Kosten für ein Projekt (Material, Montage, Inbetriebnahme) zu einem festen Preis zusammengefasst sind. Dies gibt dem Kunden maximale Planungssicherheit und schützt vor unerwarteten Nachforderungen.'
    },
    {
        term: 'Finanzierung',
        definition: 'Die Bereitstellung von Kapital zur Deckung der Investitionskosten einer PV-Anlage. Dies kann durch Eigenkapital, Bankkredite (z.B. KfW) oder Leasing-/Mietmodelle erfolgen.'
    },
    {
        term: 'Flachdach',
        definition: 'Ein Dach mit einer Neigung von weniger als 10 Grad. Für die Installation von PV-Anlagen auf Flachdächern werden spezielle Unterkonstruktionen (Aufständerungen) verwendet, um die Module in einem optimalen Winkel zur Sonne auszurichten.'
    },
    {
        term: 'Flash-Test',
        definition: 'Ein Testverfahren beim Modulhersteller, bei dem jedes einzelne Solarmodul unter Standard-Testbedingungen (STC) mit einem Lichtblitz beleuchtet wird, um seine exakte Nennleistung zu messen. Die Ergebnisse werden in einem "Flash-Protokoll" dokumentiert.'
    },
    {
        term: 'Förderprogramme',
        definition: 'Staatliche oder regionale Initiativen, die den Ausbau erneuerbarer Energien durch finanzielle Anreize wie Zuschüsse, zinsgünstige Kredite oder steuerliche Vorteile unterstützen.'
    },
    {
        term: 'Freiflächenanlage',
        definition: 'Eine PV-Anlage, die nicht auf einem Gebäude, sondern auf einer freien Landfläche (z.B. Acker, Konversionsfläche, Wiese) auf einer Unterkonstruktion montiert wird. Oft auch als Solarpark bezeichnet.'
    },
    {
        term: 'Frequenz',
        definition: 'Die Frequenz des Wechselstroms im Stromnetz. In Europa beträgt sie 50 Hertz (Hz). Wechselrichter müssen diese Frequenz exakt einhalten und bei Abweichungen zur Netzstabilisierung beitragen.'
    },
    {
        term: 'Fronius',
        definition: 'Ein führender österreichischer Hersteller von hochwertigen Wechselrichtern und Systemlösungen für die Photovoltaik. Bekannt für innovative Technologien wie den Dynamic Peak Manager.'
    },
    {
        term: 'Full-Black-Module',
        definition: 'Solarmodule mit schwarzer Rückseitenfolie, schwarzen Rahmen und schwarzen Zellen. Sie bieten eine besonders homogene und ästhetisch ansprechende Optik und werden oft für private Dachanlagen verwendet.'
    },
    {
        term: 'Fernwirktechnik',
        definition: 'Die technische Ausrüstung, die es einem Direktvermarkter oder Netzbetreiber ermöglicht, eine PV-Anlage aus der Ferne zu steuern (z.B. die Leistung zu drosseln). Sie ist eine Voraussetzung für die Direktvermarktung.'
    },
    // G
    {
        term: 'Garantie (Produkt/Leistung)',
        definition: 'Man unterscheidet zwei Arten: Die Produktgarantie deckt Material- und Verarbeitungsfehler am Modul selbst (meist 10-30 Jahre). Die Leistungsgarantie sichert zu, dass das Modul nach einem bestimmten Zeitraum (z.B. 25 Jahre) noch einen definierten Prozentsatz seiner ursprünglichen Nennleistung erbringt (z.B. 85%).'
    },
    {
        term: 'Generatoranschlusskasten (GAK)',
        definition: 'Ein Kasten, in dem die einzelnen Modulstränge (Strings) einer PV-Anlage zusammengeführt, abgesichert und mit dem Wechselrichter verbunden werden. Er enthält oft auch Überspannungsschutz-Einrichtungen.'
    },
    {
        term: 'Genehmigungsverfahren',
        definition: 'Der Prozess zur Erlangung der baurechtlichen und netztechnischen Genehmigungen für die Errichtung einer PV-Anlage. Insbesondere bei großen Freiflächenanlagen kann dies ein komplexer und langwieriger Prozess sein.'
    },
    {
        term: 'Gesamtwirkungsgrad',
        definition: 'Der Wirkungsgrad des gesamten PV-Systems, der die Verluste aller Komponenten (Module, Kabel, Wechselrichter etc.) berücksichtigt. Er ist immer niedriger als der reine Modulwirkungsgrad.'
    },
    {
        term: 'Gewerbespeicher',
        definition: 'Ein Batteriespeichersystem, das für die Anforderungen von Gewerbe- und Industriebetrieben ausgelegt ist. Es hat eine höhere Kapazität und Entladeleistung als ein Heimspeicher und dient oft dem Peak Shaving.'
    },

    {
        term: 'Gewährleistung',
        definition: 'Die gesetzlich vorgeschriebene Haftung des Installateurs für Mängel an der von ihm erbrachten Leistung. Sie ist zu unterscheiden von der Herstellergarantie für die einzelnen Komponenten.'
    },
    {
        term: 'Glas-Glas-Module',
        definition: 'Solarmodule, bei denen die Solarzellen zwischen zwei Glasscheiben statt zwischen einer Glasscheibe und einer Kunststofffolie eingebettet sind. Sie sind extrem langlebig, widerstandsfähig und oft bifazial.'
    },
    {
        term: 'Globalstrahlung',
        definition: 'Die gesamte auf eine horizontale Fläche auftreffende Sonnenstrahlung. Sie setzt sich aus der direkten Strahlung (direkt von der Sonne) und der diffusen Strahlung (durch Wolken gestreut) zusammen. Ihre Messung in kWh/m² ist die Grundlage für jede Ertragsprognose.'
    },
    {
        term: 'Gleichstrom (DC)',
        definition: 'Siehe DC (Direct Current). Strom, der immer in dieselbe Richtung fließt, wie er von Solarmodulen erzeugt oder in Batterien gespeichert wird.'
    },
    {
        term: 'Grünstrom',
        definition: 'Strom, der nachweislich aus erneuerbaren Energiequellen erzeugt wurde. Die Herkunft wird oft durch Herkunftsnachweise (HKN) zertifiziert.'
    },
    {
        term: 'Grundlast',
        definition: 'Die elektrische Leistung, die in einem Gebäude oder Betrieb über den Tag hinweg konstant benötigt wird, also die Mindestlast. Eine PV-Anlage sollte idealerweise die Grundlast an sonnigen Tagen vollständig decken.'
    },
    // H
    {
        term: 'Halbzellen-Technologie',
        definition: 'Eine Modultechnologie, bei der die Solarzellen halbiert werden. Dies reduziert die internen elektrischen Verluste im Modul, was zu einer leichten Steigerung des Wirkungsgrads und der Gesamtleistung führt.'
    },
    {
        term: 'Hauptverteilung',
        definition: 'Der zentrale Punkt in der Elektroinstallation eines Gebäudes, an dem der Strom vom Netzanschluss ankommt und auf die einzelnen Stromkreise verteilt wird. Hier wird auch die PV-Anlage an das Hausnetz angeschlossen.'
    },
    {
        term: 'Hausanschluss',
        definition: 'Der Punkt, an dem die Stromversorgung eines Gebäudes mit dem öffentlichen Stromnetz verbunden ist. Die Kapazität des Hausanschlusses kann die maximal mögliche Größe einer PV-Anlage limitieren.'
    },
    {
        term: 'Hektar (ha)',
        definition: 'Eine Flächeneinheit, die 10.000 Quadratmetern entspricht. Sie wird oft zur Angabe der Größe von Freiflächenanlagen verwendet. Pro Hektar kann man mit etwa 1 Megawatt-Peak (MWp) an PV-Leistung rechnen.'
    },
    {
        term: 'Herkunftsnachweis (HKN)',
        definition: 'Ein elektronisches Dokument, das bescheinigt, wo und wie eine Megawattstunde (MWh) Strom erzeugt wurde. Es dient als Beleg dafür, dass Strom tatsächlich aus erneuerbaren Energien stammt.'
    },
    {
        term: 'HJT (Heterojunction Technology)',
        definition: 'Eine hocheffiziente Solarzellentechnologie, die verschiedene Siliziumschichten kombiniert (kristallin und amorph). HJT-Zellen haben einen exzellenten Wirkungsgrad, ein sehr gutes Temperaturverhalten und eine geringe Degradation.'
    },
    {
        term: 'Hochvolt-Speicher',
        definition: 'Ein Batteriespeichersystem, das mit einer hohen Gleichspannung (typischerweise > 100 Volt) arbeitet. Es ist effizienter, da weniger Umwandlungsverluste auftreten, und wird oft mit Hybrid-Wechselrichtern kombiniert.'
    },
    {
        term: 'Hotspot',
        definition: 'Eine Überhitzung einer einzelnen Solarzelle oder eines Teils davon, meist verursacht durch Verschattung, Verschmutzung oder einen Defekt. Bypass-Dioden im Modul helfen, die Entstehung von Hotspots zu verhindern.'
    },
    {
        term: 'Huawei',
        definition: 'Ein globaler Technologiekonzern, der auch ein führender Hersteller von Wechselrichtern und Energiespeicherlösungen ist. Bekannt für innovative Produkte mit integrierten smarten Funktionen.'
    },
    {
        term: 'Hybrid-Wechselrichter',
        definition: 'Ein Wechselrichter, der nicht nur den Gleichstrom der PV-Module in Wechselstrom umwandelt, sondern auch einen Anschluss für ein Batteriespeichersystem besitzt und dessen Lade- und Entladevorgänge steuert.'
    },
    // I
    {
        term: 'IHK-zertifiziert',
        definition: 'Eine Qualifikation, die durch eine Prüfung bei der Industrie- und Handelskammer (IHK) erworben wird. Sie steht für einen hohen und standardisierten Qualitäts- und Wissensstand von Fachkräften, z.B. im Bereich Solartechnik.'
    },
    {
        term: 'Indach-Anlage',
        definition: 'Eine Montageart, bei der die Solarmodule die herkömmliche Dacheindeckung (z.B. Ziegel) ersetzen und somit eine wasserdichte, homogene Dachfläche bilden. Dies ist eine Form der Gebäudeintegrierten PV (BIPV).'
    },
    {
        term: 'Inbetriebnahme',
        definition: 'Der finale Schritt bei der Errichtung einer PV-Anlage, bei dem die Anlage nach erfolgreicher Prüfung aller Komponenten offiziell an das Stromnetz angeschlossen und der Betrieb aufgenommen wird. Siehe auch Commissioning.'
    },
    {
        term: 'Inselanlage (Off-Grid)',
        definition: 'Eine Photovoltaikanlage, die nicht an das öffentliche Stromnetz angeschlossen ist. Sie wird zur autarken Stromversorgung von abgelegenen Gebäuden oder Anwendungen genutzt und erfordert immer ein Batteriespeichersystem.'
    },
    {
        term: 'Installation',
        definition: 'Der physische Aufbau der Photovoltaikanlage, einschließlich der Montage der Unterkonstruktion, der Module auf dem Dach, der Verkabelung und des Anschlusses des Wechselrichters.'
    },
    {
        term: 'Installationszeit',
        definition: 'Der Zeitraum, der für die eigentliche Montage und den elektrischen Anschluss der PV-Anlage vor Ort benötigt wird. Dieser variiert stark je nach Anlagengröße und Komplexität.'
    },

    {
        term: 'Investitionsabzugsbetrag (IAB)',
        definition: 'Ein steuerliches Instrument für kleine und mittlere Unternehmen in Deutschland. Es erlaubt, bis zu 50% der voraussichtlichen Anschaffungskosten für eine zukünftige Investition (wie eine PV-Anlage) bereits vor der Anschaffung gewinnmindernd abzusetzen.'
    },
    {
        term: 'Inverter',
        definition: 'Der englische Begriff für Wechselrichter. Das Gerät, das den Gleichstrom (DC) der Solarmodule in netzkonformen Wechselstrom (AC) umwandelt.'
    },
    {
        term: 'ISO 9001',
        definition: 'Eine international anerkannte Norm für Qualitätsmanagementsysteme. Eine Zertifizierung nach ISO 9001 bescheinigt einem Unternehmen, dass es definierte und kontrollierte Prozesse zur Sicherstellung seiner Produkt- und Dienstleistungsqualität etabliert hat.'
    },
    {
        term: 'I-U-Kennlinie (Strom-Spannungs-Kennlinie)',
        definition: 'Eine Grafik, die das elektrische Verhalten einer Solarzelle oder eines Moduls bei einer bestimmten Einstrahlung und Temperatur darstellt. Der Punkt auf dieser Kurve, an dem das Produkt aus Strom (I) und Spannung (U) maximal ist, ist der Maximum Power Point (MPP).'
    },
    // J
    {
        term: 'JA Solar',
        definition: 'Ein weltweit führender Hersteller von Hochleistungs-Photovoltaikprodukten, von Wafern und Zellen bis zu kompletten Modulen. Bekannt für ein gutes Preis-Leistungs-Verhältnis.'
    },
    {
        term: 'Jahresarbeitszahl (JAZ)',
        definition: 'Eine Kennzahl für die Effizienz von Wärmepumpen über ein ganzes Jahr. Sie gibt das Verhältnis der abgegebenen Heizwärme zur aufgenommenen elektrischen Energie an. Eine JAZ von 4 bedeutet, dass aus 1 kWh Strom 4 kWh Wärme erzeugt wurden.'
    },
    {
        term: 'Jahresganglinie',
        definition: 'Eine grafische Darstellung des Verlaufs eines Wertes über ein ganzes Jahr, z.B. die Stromerzeugung einer PV-Anlage oder der Stromverbrauch eines Betriebs. Sie hilft, Erzeugung und Verbrauch aufeinander abzustimmen.'
    },
    {
        term: 'Jahresnutzungsgrad',
        definition: 'Ähnlich der JAZ, beschreibt dieser Wert die Effizienz eines Energiesystems über ein Jahr. Bei PV-Anlagen bezieht er sich auf das Verhältnis der tatsächlich erzeugten Energie zur theoretisch möglichen Energie bei konstanter Nennleistung.'
    },
    {
        term: 'Jinko Solar',
        definition: 'Einer der weltweit größten Hersteller von Solarmodulen, bekannt für seine Innovationskraft, insbesondere in der Entwicklung von N-Typ- und TOPCon-Zelltechnologien.'
    },
    {
        term: 'Joint Venture',
        definition: 'Ein gemeinsames Unternehmen, das von zwei oder mehr unabhängigen Firmen gegründet wird, um ein bestimmtes Projekt zu realisieren. Im Bereich großer Solarparks sind Joint Ventures zwischen Projektentwicklern und Investoren üblich.'
    },
    {
        term: 'Joule',
        definition: 'Die physikalische Basiseinheit für Energie, Arbeit und Wärmemenge. In der Energiewirtschaft wird statt Joule meist die Einheit Kilowattstunde (kWh) verwendet. 1 kWh entspricht 3,6 Millionen Joule.'
    },
    {
        term: 'Junction Box (Anschlussdose)',
        definition: 'Die Anschlussdose auf der Rückseite eines Solarmoduls. In ihr befinden sich die Bypass-Dioden und die Anschlusskabel (Strings) zur Verbindung der Module untereinander.'
    },
    {
        term: 'Just-in-Time',
        definition: 'Ein Logistikkonzept, bei dem Materialien erst dann geliefert werden, wenn sie tatsächlich für die Produktion oder Montage benötigt werden. Dies minimiert Lagerkosten und wird auch bei der Anlieferung von PV-Komponenten für Großprojekte angestrebt.'
    },
    {
        term: 'J-V Curve',
        definition: 'Die englische Bezeichnung für die I-U-Kennlinie (Stromdichte J anstatt Strom I). Siehe I-U-Kennlinie.'
    },
    // K
    {
        term: 'Kabelkanal',
        definition: 'Ein geschlossenes System aus Kunststoff oder Metall zur geschützten Verlegung von elektrischen Kabeln. In PV-Anlagen werden Kabelkanäle verwendet, um die DC- und AC-Verkabelung sicher und geordnet zu führen.'
    },
    {
        term: 'Kaskadenschaltung',
        definition: 'Eine Schaltungsart, bei der mehrere Geräte oder Baugruppen hintereinander geschaltet werden. Bei Speichersystemen können mehrere Batteriemodule in Kaskade geschaltet werden, um die Gesamtkapazität zu erhöhen.'
    },
    {
        term: 'KfW (Kreditanstalt für Wiederaufbau)',
        definition: 'Eine deutsche Förderbank, die im Auftrag des Bundes und der Länder Förderprogramme in Bereichen wie Umweltschutz und Mittelstandsfinanzierung durchführt. Das Programm 270 bietet zinsgünstige Kredite für Erneuerbare-Energien-Anlagen.'
    },
    {
        term: 'Kilowatt (kW)',
        definition: 'Eine Einheit für elektrische Leistung. 1 kW = 1.000 Watt.'
    },
    {
        term: 'Kilowattstunde (kWh)',
        definition: 'Eine Einheit für elektrische Energie (Arbeit). Sie beschreibt die Leistung von einem Kilowatt, die über eine Stunde lang erbracht wird. Stromzähler messen den Verbrauch in kWh.'
    },
    {
        term: 'Kilowatt-Peak (kWp)',
        definition: 'Die Maßeinheit für die Spitzenleistung (Nennleistung) einer Photovoltaikanlage unter standardisierten Testbedingungen (STC). Sie dient dem Vergleich der Leistungsfähigkeit verschiedener Module und Anlagen.'
    },
    {
        term: 'Kollektor',
        definition: 'Der Hauptbestandteil einer Solarthermie-Anlage. Im Gegensatz zum PV-Modul erzeugt ein Kollektor keinen Strom, sondern Wärme, indem er eine Trägerflüssigkeit durch die Sonnenenergie erhitzt.'
    },
    {
        term: 'Komponentenauswahl',
        definition: 'Der Prozess der Auswahl der einzelnen Bauteile (Module, Wechselrichter, Unterkonstruktion etc.) für eine PV-Anlage. Eine sorgfältige, auf den Anwendungsfall abgestimmte Komponentenauswahl ist entscheidend für die Effizienz und Langlebigkeit der Anlage.'
    },
    {
        term: 'Konversionsfläche',
        definition: 'Eine Fläche, die früher wirtschaftlich, militärisch oder verkehrstechnisch genutzt wurde und nun brachliegt (z.B. alte Militärbasen, Deponien, Industriebrachen). Diese Flächen eignen sich oft hervorragend für die Errichtung von Freiflächen-Solaranlagen.'
    },
    {
        term: 'Kurzschlussstrom (Isc)',
        definition: 'Der maximale Strom, der von einer Solarzelle oder einem Modul fließen kann, wenn die externen Anschlüsse direkt (ohne Widerstand) miteinander verbunden werden. Er ist ein wichtiger Kennwert im Moduldatenblatt.'
    },

    // L
    {
        term: 'Ladeinfrastruktur',
        definition: 'Die Gesamtheit aller Einrichtungen, die zum Aufladen von Elektrofahrzeugen benötigt werden. Dazu gehören die Ladesäulen (Wallboxen), die Verkabelung, die Anbindung an das Stromnetz und die Abrechnungssysteme.'
    },
    {
        term: 'Lastgang',
        definition: 'Ein detailliertes Profil des Stromverbrauchs eines Unternehmens über einen bestimmten Zeitraum, oft in 15-Minuten-Intervallen aufgezeichnet. Die Analyse des Lastgangs ist die Grundlage für die Dimensionierung einer PV-Anlage und eines Speichers.'
    },
    {
        term: 'Lastspitzenkappung (Peak Shaving)',
        definition: 'Eine wichtige Funktion von gewerblichen Batteriespeichern. Sie decken kurzzeitige, hohe Leistungsbedarfe (Lastspitzen) aus der Batterie, anstatt sie aus dem Netz zu ziehen. Dies reduziert die Netzentgelte, die sich an der höchsten im Jahr aufgetretenen Leistungsspitze orientieren.'
    },
    {
        term: 'Lebensdauer',
        definition: 'Die erwartete technische Betriebsdauer einer Komponente oder Anlage. Hochwertige Solarmodule haben eine Lebensdauer von 30 bis 40 Jahren, während Wechselrichter oft nach 15-20 Jahren getauscht werden.'
    },
    {
        term: 'Leistungselektronik',
        definition: 'Ein Teilgebiet der Elektrotechnik, das sich mit der Schaltung, Steuerung und Umformung elektrischer Energie befasst. Wechselrichter, Laderegler und Leistungsoptimierer sind zentrale Komponenten der Leistungselektronik in einer PV-Anlage.'
    },
    {
        term: 'Leistungsgarantie',
        definition: 'Die Zusage eines Modulherstellers, dass seine Module nach einem definierten Zeitraum (z.B. 25 oder 30 Jahre) noch einen bestimmten Prozentsatz ihrer ursprünglichen Nennleistung erbringen (z.B. 87%).'
    },
    {
        term: 'LeTID (Licht- und temperaturinduzierte Degradation)',
        definition: 'Ein Degradationseffekt, der bei bestimmten Modultypen (oft PERC) bei erhöhten Betriebstemperaturen über einen längeren Zeitraum auftreten und zu Leistungsverlusten führen kann. Die Widerstandsfähigkeit gegen LeTID ist ein wichtiges Qualitätsmerkmal.'
    },
    {
        term: 'LID (Lichtinduzierte Degradation)',
        definition: 'Ein anfänglicher, lichtbedingter Leistungsverlust von Solarmodulen, der hauptsächlich in den ersten Stunden der Sonneneinstrahlung auftritt. Hochwertige Module (insbesondere N-Typ) weisen eine sehr geringe oder keine LID auf.'
    },
    {
        term: 'Lithium-Eisenphosphat (LFP)',
        definition: 'Eine besonders sichere und langlebige Zellchemie für Lithium-Ionen-Batterien. LFP-Batterien sind thermisch sehr stabil (schwer entflammbar) und kommen ohne den kritischen Rohstoff Kobalt aus. Sie sind der bevorzugte Standard für stationäre Energiespeicher.'
    },
    {
        term: 'LG Energy Solution',
        definition: 'Ein globaler südkoreanischer Hersteller von Batteriezellen und kompletten Energiespeichersystemen, bekannt für hohe Qualität und Energiedichte.'
    },
    // M
    {
        term: 'Marktstammdatenregister (MaStR)',
        definition: 'Ein behördliches Register der Bundesnetzagentur, in dem alle Stromerzeugungsanlagen in Deutschland, einschließlich PV-Anlagen und Speicher, verpflichtend registriert werden müssen.'
    },
    {
        term: 'Messkonzept',
        definition: 'Ein Plan, der festlegt, wie und wo die Stromflüsse einer PV-Anlage messtechnisch erfasst werden. Es ist die Grundlage für die korrekte Abrechnung von erzeugtem, selbst verbrauchtem und eingespeistem Strom und muss mit dem Netzbetreiber abgestimmt werden.'
    },
    {
        term: 'Meyer Burger',
        definition: 'Ein führender europäischer Hersteller von hocheffizienten Solarzellen und -modulen mit Produktionsstätten in Deutschland. Bekannt für die innovative Heterojunction (HJT) Technologie.'
    },
    {
        term: 'Mieterstrom',
        definition: 'Ein Geschäftsmodell, bei dem Strom von einer PV-Anlage auf dem Dach eines Wohngebäudes direkt an die Mieter im selben Gebäude verkauft wird. Der Strompreis ist gesetzlich gedeckelt und muss unter dem Tarif des lokalen Grundversorgers liegen.'
    },
    {
        term: 'Modul',
        definition: 'Siehe Solarmodul. Die Basiseinheit einer PV-Anlage, die aus vielen miteinander verschalteten Solarzellen besteht und Sonnenlicht in elektrische Energie umwandelt.'
    },
    {
        term: 'Modulwechselrichter (Mikrowechselrichter)',
        definition: 'Ein sehr kleiner Wechselrichter, der direkt an ein oder zwei Solarmodule angeschlossen wird. Jedes Modul arbeitet unabhängig, was bei komplexen Dächern mit viel Verschattung vorteilhaft sein kann. Die Installation ist jedoch aufwendiger als bei String-Wechselrichtern.'
    },
    {
        term: 'Monitoring',
        definition: 'Die kontinuierliche Überwachung der Leistungsdaten einer PV-Anlage. Moderne Monitoring-Systeme visualisieren die Erzeugung, den Verbrauch und die Einspeisung in Echtzeit über ein Webportal oder eine App und melden Störungen automatisch.'
    },
    {
        term: 'Monokristalline Zellen',
        definition: 'Solarzellen, die aus einem einzigen, reinen Siliziumkristall hergestellt werden. Sie haben eine einheitlich dunkle Farbe und den höchsten Wirkungsgrad unter den gängigen Zelltechnologien.'
    },
    {
        term: 'Montage',
        definition: 'Der handwerkliche Aufbau und die Installation der PV-Anlage vor Ort, inklusive der Anbringung der Unterkonstruktion und der Module.'
    },
    {
        term: 'MPP-Tracker (Maximum Power Point)',
        definition: 'Ein wesentlicher Bestandteil moderner Wechselrichter. Der MPP-Tracker sorgt dafür, dass die Solarmodule stets in ihrem optimalen Arbeitspunkt (dem Punkt der maximalen Leistung) betrieben werden, auch bei wechselnden Einstrahlungs- und Temperaturbedingungen.'
    },
    // N
    {
        term: 'N-Typ-Zellen',
        definition: 'Eine fortschrittliche Art von Silizium-Solarzellen (mit Phosphor dotiert). Im Vergleich zu den Standard P-Typ-Zellen weisen sie eine höhere Effizienz, eine deutlich geringere Degradation (LID/LeTID) und ein besseres Temperaturverhalten auf. Sie gelten als zukunftssichere Technologie.'
    },
    {
        term: 'Nennleistung',
        definition: 'Die Leistung, die ein Solarmodul oder eine Anlage unter Standard-Testbedingungen (STC) erbringt. Sie wird in Watt-Peak (Wp) oder Kilowatt-Peak (kWp) angegeben.'
    },
    {
        term: 'Netzanschluss',
        definition: 'Der physische und rechtliche Punkt, an dem eine PV-Anlage mit dem öffentlichen Stromnetz verbunden wird. Der Prozess erfordert eine Genehmigung durch den zuständigen Netzbetreiber.'
    },
    {
        term: 'Netzbetreiber',
        definition: 'Das Unternehmen, das für den Betrieb, die Instandhaltung und den Ausbau des Stromnetzes in einer bestimmten Region verantwortlich ist. Der Netzbetreiber (nicht der Stromanbieter) ist der Ansprechpartner für den Anschluss einer PV-Anlage.'
    },
    {
        term: 'Netzdienlichkeit',
        definition: 'Die Fähigkeit von dezentralen Erzeugungsanlagen (wie PV-Anlagen), zur Stabilisierung des öffentlichen Stromnetzes beizutragen. Dies kann durch die Bereitstellung von Blindleistung oder durch die Teilnahme am Regelenergiemarkt geschehen.'
    },
    {
        term: 'Netzparität',
        definition: 'Der Punkt, an dem die Kosten für die Erzeugung von einer Kilowattstunde Solarstrom gleich oder geringer sind als die Kosten für den Bezug derselben Menge Strom aus dem öffentlichen Netz. In Deutschland ist die Netzparität längst erreicht.'
    },
    {
        term: 'Netzstrom',
        definition: 'Elektrischer Strom, der aus dem öffentlichen Stromnetz bezogen wird. Der Preis für Netzstrom setzt sich aus den Kosten für Erzeugung, Transport (Netzentgelte), Steuern und Abgaben zusammen.'
    },
    {
        term: 'Niederspannungsrichtlinie',
        definition: 'Eine EU-Richtlinie, die die Sicherheitsanforderungen für elektrische Betriebsmittel festlegt. Wechselrichter und andere PV-Komponenten müssen diese Richtlinie erfüllen, um in der EU verkauft werden zu dürfen.'
    },
    {
        term: 'Notstrom',
        definition: 'Die Fähigkeit eines Systems, bei einem Ausfall des öffentlichen Stromnetzes eine begrenzte Stromversorgung aufrechtzuerhalten. Ein notstromfähiger Speicher kann ausgewählte, wichtige Verbraucher (z.B. Licht, Kühlschrank) weiter versorgen.'
    },
    {
        term: 'Nulleinspeisung',
        definition: 'Eine Betriebsart für PV-Anlagen, bei der der Wechselrichter so geregelt wird, dass kein Strom in das öffentliche Netz eingespeist wird. Der gesamte erzeugte Strom wird entweder direkt verbraucht oder in einem Speicher gespeichert. Dies kann Genehmigungsverfahren vereinfachen.'
    },
    // O
    {
        term: 'OCPP (Open Charge Point Protocol)',
        definition: 'Ein offener Kommunikationsstandard, der es Ladesäulen ermöglicht, mit zentralen Managementsystemen (Backends) verschiedener Anbieter zu kommunizieren. Dies ist entscheidend für die öffentliche Abrechnung und Verwaltung von Ladepunkten.'
    },
    {
        term: 'Off-Grid',
        definition: 'Englischer Begriff für eine Inselanlage, also eine PV-Anlage ohne Anschluss an das öffentliche Stromnetz.'
    },
    {
        term: 'Ohm',
        definition: 'Die physikalische Einheit für den elektrischen Widerstand. Sie gibt an, welche Spannung erforderlich ist, um einen bestimmten Strom durch einen Leiter fließen zu lassen.'
    },
    {
        term: 'On-Grid',
        definition: 'Englischer Begriff für eine netzgekoppelte PV-Anlage, die mit dem öffentlichen Stromnetz verbunden ist. Dies ist der Standardfall in Deutschland.'
    },
    {
        term: 'Online-Monitoring-System',
        definition: 'Ein System zur Fernüberwachung einer PV-Anlage über das Internet. Es ermöglicht dem Betreiber und Installateur, die Leistungsdaten in Echtzeit zu kontrollieren, Erträge zu analysieren und Fehlermeldungen zu empfangen.'
    },
    {
        term: 'Optimizer (Leistungsoptimierer)',
        definition: 'Ein kleines elektronisches Gerät, das an jedes einzelne Solarmodul angeschlossen wird. Es führt das MPP-Tracking auf Modulebene durch und sorgt so dafür, dass jedes Modul seine maximale Leistung erbringt, unabhängig von den anderen Modulen im String. Dies ist besonders vorteilhaft bei Verschattung.'
    },
    {
        term: 'O&M (Operations & Maintenance)',
        definition: 'Englisch für Betrieb und Wartung. Umfasst alle Dienstleistungen, die den reibungslosen und ertragsoptimalen Betrieb einer PV-Anlage sicherstellen, wie z.B. Monitoring, Inspektion, Reinigung und Reparatur.'
    },
    {
        term: 'Oberschwingungen',
        definition: 'Unerwünschte sinusförmige Schwingungen im Stromnetz mit einer Frequenz, die ein Vielfaches der Grundfrequenz (50 Hz) beträgt. Wechselrichter müssen so konstruiert sein, dass sie möglichst wenig Oberschwingungen erzeugen, um die Netzqualität nicht zu beeinträchtigen.'
    },
    {
        term: 'Ökostrom',
        definition: 'Strom, der ausschließlich aus erneuerbaren Energiequellen stammt. Siehe auch Grünstrom.'
    },
    {
        term: 'Ost-West-Anlage',
        definition: 'Eine PV-Anlage, bei der die Module auf beiden Seiten eines Daches – nach Osten und Westen – ausgerichtet sind. Dies führt zu einer gleichmäßigeren Stromproduktion über den Tag verteilt (mit Spitzen am Morgen und am späten Nachmittag) und kann den Eigenverbrauch erhöhen, auch wenn der absolute Jahresertrag etwas geringer ist als bei einer reinen Südausrichtung.'
    },
    // P
    {
        term: 'P-Typ-Zellen',
        definition: 'Die Standardtechnologie für kristalline Silizium-Solarzellen, bei der die Siliziumbasis positiv (p) dotiert ist (meist mit Bor). Sie sind weit verbreitet und kostengünstig, haben aber eine höhere lichtinduzierte Degradation (LID) als moderne N-Typ-Zellen.'
    },
    {
        term: 'Peak Shaving',
        definition: 'Englischer Begriff für Lastspitzenkappung. Die Reduzierung von kurzzeitigen, hohen Stromverbrauchsspitzen durch den gezielten Einsatz eines Batteriespeichers.'
    },
    {
        term: 'PERC-Technologie (Passivated Emitter and Rear Cell)',
        definition: 'Eine Weiterentwicklung der Standard-Solarzelle. Eine zusätzliche reflektierende Schicht auf der Rückseite der Zelle (Passivierung) wirft Licht, das die Zelle ungenutzt durchdrungen hat, zurück in die Zelle. Dies erhöht die Wahrscheinlichkeit der Absorption und steigert den Wirkungsgrad.'
    },
    {
        term: 'Photovoltaik (PV)',
        definition: 'Die direkte Umwandlung von Lichtenergie, meist aus Sonnenlicht, in elektrische Energie mittels Solarzellen. Der Begriff leitet sich vom griechischen Wort für Licht ("Phos") und dem Namen des Physikers Alessandro Volta ab.'
    },
    {
        term: 'Polykristalline Zellen',
        definition: 'Solarzellen, die aus mehreren, unterschiedlich ausgerichteten Siliziumkristallen bestehen. Man erkennt sie an ihrer typischen bläulichen, gebrochenen Kristallstruktur. Sie haben einen etwas geringeren Wirkungsgrad als monokristalline Zellen, waren aber lange Zeit günstiger in der Herstellung.'
    },
    {
        term: 'Portfolio',
        definition: 'Im energiewirtschaftlichen Kontext die Gesamtheit der Stromerzeugungsanlagen, Stromlieferverträge oder Kunden eines Unternehmens. Ein Direktvermarkter managt ein Portfolio aus vielen verschiedenen PV-Anlagen.'
    },
    {
        term: 'Potenzialanalyse',
        definition: 'Eine erste, oft kostenlose Bewertung eines Standortes, um dessen Eignung für eine PV-Anlage zu prüfen. Sie umfasst die Analyse von Dachflächen, Verbrauch, Netzanschluss und eine grobe Wirtschaftlichkeitsschätzung.'
    },
    {
        term: 'Power Purchase Agreement (PPA)',
        definition: 'Ein langfristiger Stromliefervertrag zwischen einem Stromerzeuger (z.B. dem Betreiber einer großen PV-Anlage) und einem Abnehmer (z.B. einem Industrieunternehmen). Der Strom wird zu einem vertraglich festgelegten Preis verkauft, was beiden Seiten Planungssicherheit gibt.'
    },
    {
        term: 'Produktgarantie',
        definition: 'Die Garantie des Herstellers auf Material- und Verarbeitungsfehler einer Komponente. Bei Solarmodulen beträgt sie oft 15 bis 30 Jahre, bei Wechselrichtern 5 bis 10 Jahre.'
    },
    {
        term: 'Projektierung',
        definition: 'Die detaillierte Planung und Auslegung einer PV-Anlage, einschließlich der technischen Zeichnungen, der Auswahl der Komponenten, der statischen Berechnungen und der Erstellung der Genehmigungsunterlagen.'
    },
    // Q
    {
        term: 'Q-Cells',
        definition: 'Ein führender globaler Hersteller von Solarmodulen mit deutschen Wurzeln in der Forschung und Entwicklung. Bekannt für die Q.ANTUM-Technologie, eine Weiterentwicklung der PERC-Zelltechnologie.'
    },
    {
        term: 'Qualitätssicherung',
        definition: 'Alle Maßnahmen, die dazu dienen, eine definierte Qualität eines Produkts oder einer Dienstleistung sicherzustellen. In der PV-Branche umfasst dies z.B. Flash-Tests bei Modulen, VDE-Zertifizierungen für Wechselrichter und die Einhaltung von Montagestandards durch den Installateur.'
    },
    {
        term: 'Quartalsbericht',
        definition: 'Ein Bericht, der die wirtschaftliche Entwicklung eines Unternehmens im Vierteljahresrhythmus darstellt. Für börsennotierte PV-Unternehmen ist dies eine Pflichtveröffentlichung.'
    },
    {
        term: 'Quantum Dots',
        definition: 'Nanometerkleine Halbleiterkristalle, die in der Forschung zur Effizienzsteigerung von Solarzellen eingesetzt werden. Sie können das Lichtspektrum besser ausnutzen und potenziell die theoretische Wirkungsgradgrenze von Silizium überwinden.'
    },
    {
        term: 'Quellcode',
        definition: 'Der in einer Programmiersprache geschriebene Text eines Computerprogramms. Die Software für Monitoring-Systeme oder Wechselrichter basiert auf einem Quellcode, der ihre Funktionen bestimmt.'
    },
    {
        term: 'Quellenspannung',
        definition: 'Die Spannung, die eine Stromquelle (wie eine Solarzelle oder Batterie) im unbelasteten Zustand liefert. Siehe auch Leerlaufspannung.'
    },
    {
        term: 'Querverbund',
        definition: 'Ein Zusammenschluss von Unternehmen entlang der gesamten Wertschöpfungskette, z.B. von der Siliziumproduktion bis zum fertigen Solarpark.'
    },
    {
        term: 'Querverschaltung',
        definition: 'Eine spezielle elektrische Verschaltung von Modulen oder Zellen, die die Auswirkungen von Teilverschattungen reduzieren kann, indem alternative Strompfade geschaffen werden.'
    },
    {
        term: 'Querschnitt (Kabel)',
        definition: 'Die Fläche des leitenden Materials in einem Elektrokabel, angegeben in Quadratmillimetern (mm²). Ein größerer Querschnitt bedeutet einen geringeren elektrischen Widerstand und somit geringere Leitungsverluste. Die Wahl des richtigen Kabelquerschnitts ist entscheidend für die Effizienz einer PV-Anlage.'
    },
    {
        term: 'Quotenmodell',
        definition: 'Ein Fördermechanismus, bei dem Energieversorger gesetzlich verpflichtet werden, einen bestimmten Prozentsatz ihres Stroms aus erneuerbaren Energien zu beziehen. Sie können dies durch den Kauf von Grünstrom-Zertifikaten nachweisen.'
    },
    // R
    {
        term: 'Redundanz',
        definition: 'Das Vorhandensein von zusätzlichen, funktional gleichen oder vergleichbaren Ressourcen in einem System, die bei Ausfall oder Störung der primären Ressource deren Funktion übernehmen. Bei großen Solarparks werden oft mehrere Wechselrichter eingesetzt, um die Redundanz zu erhöhen.'
    },
    {
        term: 'Referenzmodul',
        definition: 'Ein Solarmodul mit exakt vermessenen und stabilen elektrischen Eigenschaften, das zur Kalibrierung von Messgeräten wie Sonnensimulatoren (Flash-Tests) verwendet wird.'
    },
    {
        term: 'Regelenergie',
        definition: 'Energie, die kurzfristig zur Stabilisierung des Stromnetzes benötigt wird, um unvorhergesehene Schwankungen zwischen Erzeugung und Verbrauch auszugleichen. Große Batteriespeicher können am Regelenergiemarkt teilnehmen und durch die Bereitstellung dieser Dienstleistung zusätzliche Einnahmen erzielen.'
    },
    {
        term: 'Rendite',
        definition: 'Der finanzielle Ertrag einer Investition, meist als Prozentsatz des eingesetzten Kapitals ausgedrückt. Die Rendite einer PV-Anlage ergibt sich aus den Stromkosteneinsparungen und den Einnahmen aus der Einspeisung im Verhältnis zu den Investitionskosten.'
    },
    {
        term: 'Repowering',
        definition: 'Die Modernisierung oder der Austausch von Komponenten einer bestehenden Photovoltaikanlage, um deren Leistung und Effizienz zu steigern. Oft werden nach 10-15 Jahren alte Module durch neue, deutlich leistungsstärkere ersetzt.'
    },
    {
        term: 'Restwelligkeit',
        definition: 'Ein kleiner verbleibender Gleichstrom- oder Gleichspannungsanteil im Ausgangssignal eines Wechselrichters. Eine geringe Restwelligkeit ist ein Qualitätsmerkmal für die saubere Umwandlung in reinen Wechselstrom.'
    },
    {
        term: 'Revisionsschacht',
        definition: 'Ein Zugangsschacht für unterirdisch verlegte Leitungen, der Inspektionen und Wartungsarbeiten ermöglicht. Bei großen Freiflächenanlagen werden Revisionsschächte für die Hauptkabeltrassen benötigt.'
    },
    {
        term: 'Rohstoff',
        definition: 'Ein ursprünglicher, unverarbeiteter Stoff, der die Basis für ein Produkt bildet. Der wichtigste Rohstoff für die meisten Solarzellen ist Silizium, das aus Quarzsand gewonnen wird.'
    },
    {
        term: 'RSE (Rundsteuerempfänger)',
        definition: 'Ein Gerät, das im Zählerschrank installiert wird und Signale vom Netzbetreiber empfängt. Es dient dem Einspeisemanagement, also der ferngesteuerten Drosselung der PV-Anlage bei Netzüberlastung.'
    },
    {
        term: 'Rückspeisung',
        definition: 'Der Vorgang, bei dem überschüssiger, nicht selbst verbrauchter Solarstrom von einer PV-Anlage in das öffentliche Stromnetz eingespeist wird.'
    },
    // S
    {
        term: 'SCADA (Supervisory Control and Data Acquisition)',
        definition: 'Ein System zur Überwachung und Steuerung von technischen Prozessen. Bei großen Solarparks wird SCADA eingesetzt, um die Anlage zentral zu überwachen, Daten zu erfassen und bei Bedarf regelnd einzugreifen.'
    },
    {
        term: 'SMA',
        definition: 'Ein weltweit führender deutscher Hersteller von Wechselrichtern und Systemtechnik für die Photovoltaik. Steht für hohe Qualität, Zuverlässigkeit und exzellenten Service.'
    },
    {
        term: 'SolarEdge',
        definition: 'Ein führender Hersteller von Wechselrichtersystemen, die auf Leistungsoptimierern basieren. Dieses System ermöglicht ein MPP-Tracking und Monitoring auf Modulebene.'
    },
    {
        term: 'Solarmodul',
        definition: 'Die Haupteinheit einer PV-Anlage. Ein Solarmodul besteht aus vielen Solarzellen, die in einem Rahmen zwischen einer Glasplatte und einer Rückseitenfolie wetterfest eingeschlossen sind. Es wandelt Sonnenlicht direkt in Gleichstrom um.'
    },
    {
        term: 'Solarstrom',
        definition: 'Elektrischer Strom, der durch die Umwandlung von Sonnenenergie in Photovoltaikanlagen erzeugt wird. Er ist eine Form der erneuerbaren Energie.'
    },
    {
        term: 'Solarzelle',
        definition: 'Das kleinste elektronische Bauteil einer PV-Anlage. Sie besteht meist aus dem Halbleitermaterial Silizium und erzeugt bei Lichteinfall durch den photovoltaischen Effekt eine elektrische Spannung.'
    },
    {
        term: 'Speicher',
        definition: 'Siehe Batteriespeicher. Ein System zur Speicherung von elektrischer Energie.'
    },
    {
        term: 'Statik',
        definition: 'Die Lehre vom Gleichgewicht der Kräfte an ruhenden Körpern. Im Kontext von PV-Anlagen muss ein Statiker prüfen, ob das Dach die zusätzliche Last durch die Module und die Unterkonstruktion sowie zusätzliche Wind- und Schneelasten sicher tragen kann.'
    },
    {
        term: 'STC (Standard Test Conditions)',
        definition: 'Standardisierte Testbedingungen, unter denen die Nennleistung von Solarmodulen im Labor gemessen wird. Diese sind: eine Einstrahlung von 1.000 W/m², eine Zelltemperatur von 25 °C und ein definiertes Lichtspektrum (AM 1,5).'
    },
    {
        term: 'String-Wechselrichter',
        definition: 'Der gängigste Wechselrichtertyp. Mehrere in Reihe geschaltete Solarmodule bilden einen "String", der an einen MPP-Tracker des Wechselrichters angeschlossen wird. Moderne Geräte haben mehrere MPP-Tracker, um verschiedene Dachausrichtungen oder Teilverschattungen zu managen.'
    },
    {
        term: 'Subunternehmer',
        definition: 'Ein Unternehmen, das von einem Hauptauftragnehmer beauftragt wird, einen Teil der vertraglich geschuldeten Leistung zu erbringen. ZOE Solar verzichtet bewusst auf den Einsatz von Subunternehmern, um höchste Qualität zu sichern.'
    },
    {
        term: 'Systemwirkungsgrad',
        definition: 'Der Gesamtwirkungsgrad einer PV-Anlage, der alle Verluste von den Modulen über die Kabel bis zum Wechselrichter berücksichtigt. Er liegt typischerweise bei 80-90% des Modulwirkungsgrades.'
    },
    // T
    {
        term: 'Temperaturkoeffizient',
        definition: 'Ein Wert, der angibt, wie stark die Leistung eines Solarmoduls bei Temperaturänderungen ab- oder zunimmt. Ein niedriger (d.h. weniger negativer) Temperaturkoeffizient ist ein Qualitätsmerkmal, da das Modul bei hohen Temperaturen weniger Leistung verliert.'
    },
    {
        term: 'Terawattstunde (TWh)',
        definition: 'Eine sehr große Einheit für elektrische Energie. Eine TWh entspricht einer Milliarde Kilowattstunden (kWh). Der jährliche Stromverbrauch Deutschlands liegt bei etwa 500 TWh.'
    },
    {
        term: 'Testat',
        definition: 'Eine offizielle Bescheinigung oder ein Prüfbericht von einer autorisierten Stelle (z.B. TÜV), der die Konformität eines Produkts oder Systems mit bestimmten Normen und Standards bestätigt.'
    },
    {
        term: 'Thermografie',
        definition: 'Ein bildgebendes Verfahren, das die Wärmestrahlung eines Objekts sichtbar macht. Mit einer Wärmebildkamera können bei PV-Modulen fehlerhafte Zellen oder Verbindungen (Hotspots) erkannt werden, die sich durch eine erhöhte Temperatur auszeichnen.'
    },
    {
        term: 'TOPCon-Zellen (Tunnel Oxide Passivated Contact)',
        definition: 'Eine fortschrittliche Solarzellentechnologie (ein N-Typ-Wafer), die durch eine ultradünne Oxidschicht und eine Schicht aus polykristallinem Silizium eine sehr gute Oberflächenpassivierung erreicht. Das Ergebnis sind hohe Wirkungsgrade und eine sehr geringe Degradation.'
    },
    {
        term: 'Trafostation',
        definition: 'Eine Station, in der ein Transformator die elektrische Spannung umwandelt. Große PV-Anlagen benötigen oft eine eigene Trafostation, um die erzeugte Niederspannung auf die Mittelspannung des öffentlichen Netzes hochzutransformieren.'
    },
    {
        term: 'Trapezblech',
        definition: 'Eine häufige Dacheindeckung für Industrie- und Gewerbehallen. Für Trapezblechdächer gibt es spezielle, leichte Montagesysteme, bei denen kurze Schienen direkt auf den Hochsicken des Blechs befestigt werden.'
    },
    {
        term: 'Technische Anschlussbedingungen (TAB)',
        definition: 'Die von den Netzbetreibern festgelegten technischen Anforderungen für den Anschluss von Erzeugungsanlagen an ihr Stromnetz. Sie müssen bei der Planung und Installation einer PV-Anlage zwingend eingehalten werden.'
    },
    {
        term: 'Trina Solar',
        definition: 'Einer der weltweit führenden Hersteller von Solarmodulen, der für seine hohe Produktionskapazität und eine breite Palette von Produkten für private, gewerbliche und Utility-Scale-Projekte bekannt ist.'
    },
    {
        term: 'TÜV-Zertifizierung',
        definition: 'Ein Prüfsiegel vom Technischen Überwachungsverein (TÜV), das die Sicherheit, Qualität und Konformität eines Produkts mit relevanten Normen bestätigt. Es ist ein wichtiges Qualitätsmerkmal für PV-Komponenten.'
    },
    // U
    {
        term: 'Umrichter',
        definition: 'Ein allgemeinerer Begriff für Geräte, die elektrische Energie umformen. Ein Wechselrichter ist eine spezielle Art von Umrichter, der Gleichstrom in Wechselstrom umwandelt.'
    },
    {
        term: 'Umwandlungsverluste',
        definition: 'Energieverluste, die bei der Umwandlung von einer Energieform in eine andere auftreten. Der Wirkungsgrad eines Wechselrichters beschreibt dessen Umwandlungsverluste: Ein Wirkungsgrad von 98% bedeutet 2% Umwandlungsverluste.'
    },
    {
        term: 'Unabhängigkeit (energetische)',
        definition: 'Siehe Autarkie. Die Fähigkeit, den eigenen Energiebedarf weitgehend selbst zu decken und somit unabhängig von externen Energieversorgern und deren Preisen zu sein.'
    },
    {
        term: 'Unterkonstruktion',
        definition: 'Das Montagesystem, auf dem die Solarmodule befestigt werden. Es besteht in der Regel aus Aluminium oder Edelstahl und muss die Module sicher auf dem Dach oder der Freifläche verankern und dabei allen Wind- und Schneelasten standhalten.'
    },
    {
        term: 'Überspannungsschutz (SPD)',
        definition: 'Surge Protective Device. Eine Vorrichtung, die die empfindliche Elektronik einer PV-Anlage (insbesondere den Wechselrichter) vor Schäden durch Überspannungen, z.B. infolge eines Blitzeinschlags in der Nähe, schützt.'
    },
    {
        term: 'USV (Unterbrechungsfreie Stromversorgung)',
        definition: 'Ein System, das bei einem Stromausfall eine nahtlose und unterbrechungsfreie Stromversorgung für kritische Verbraucher (z.B. Server, medizinische Geräte) sicherstellt. Dies wird oft durch die Kombination eines Batteriespeichers mit einem speziellen Wechselrichter erreicht.'
    },
    {
        term: 'Utility-Scale',
        definition: 'Ein Begriff, der sehr große Energieprojekte im Kraftwerksmaßstab beschreibt, die direkt zur Versorgung des öffentlichen Netzes dienen. Utility-Scale-Solarparks haben oft eine Leistung von vielen Megawatt.'
    },
    {
        term: 'UV-Beständigkeit',
        definition: 'Die Widerstandsfähigkeit eines Materials gegen die schädliche Wirkung von ultravioletter (UV) Strahlung. Komponenten einer PV-Anlage, die der Witterung ausgesetzt sind (z.B. Kabel, Modul-Rückseitenfolien), müssen eine hohe UV-Beständigkeit aufweisen, um nicht spröde zu werden oder zu vergilben.'
    },
    {
        term: 'U-Wert',
        definition: 'Der Wärmedurchgangskoeffizient. Er gibt an, wie viel Wärme durch ein Bauteil (z.B. ein Fenster oder eine Fassade) pro Flächeneinheit und Temperaturunterschied verloren geht. BIPV-Fassadenelemente können den U-Wert eines Gebäudes verbessern.'
    },
    {
        term: 'Umweltgutachten',
        definition: 'Ein Gutachten, das die potenziellen Auswirkungen eines Bauprojekts (wie eines großen Solarparks) auf die Umwelt (Flora, Fauna, Boden, Wasser) untersucht. Es ist oft Teil des Genehmigungsverfahrens.'
    },
    // V
    {
        term: 'Verbrauch',
        definition: 'Die Menge an elektrischer Energie (in kWh), die von einem Gerät, einem Haushalt oder einem Unternehmen in einem bestimmten Zeitraum benötigt wird.'
    },
    {
        term: 'Vergütungssatz',
        definition: 'Siehe Einspeisevergütung. Der Geldbetrag pro Kilowattstunde, der für die Einspeisung von Strom aus erneuerbaren Energien gezahlt wird.'
    },
    {
        term: 'Verlustleistung',
        definition: 'Die elektrische Leistung, die in einem System (z.B. in Kabeln oder im Wechselrichter) in Wärme umgewandelt wird und somit nicht als Nutzleistung zur Verfügung steht.'
    },
    {
        term: 'Verschattung',
        definition: 'Siehe Abschattung. Die Verdeckung von Solarmodulen, die zu Ertragseinbußen führt.'
    },
    {
        term: 'Versicherung',
        definition: 'Eine PV-Anlage sollte gegen Risiken wie Sturm, Hagel, Feuer, Diebstahl und Bedienungsfehler versichert sein. Zusätzlich gibt es Ertragsausfallversicherungen, die bei einem Anlagenausfall die entgangenen Einnahmen ersetzen.'
    },
    {
        term: 'Verfügbarkeit',
        definition: 'Ein Maß für die Zuverlässigkeit einer Anlage. Sie gibt in Prozent an, wie viel Zeit die Anlage innerhalb eines bestimmten Zeitraums technisch betriebsbereit war. Eine hohe Verfügbarkeit ist entscheidend für die Wirtschaftlichkeit.'
    },
    {
        term: 'VDE-Norm',
        definition: 'Eine vom Verband der Elektrotechnik, Elektronik und Informationstechnik (VDE) herausgegebene technische Regel. VDE-Normen sind anerkannte Regeln der Technik und müssen bei der Planung und Installation von elektrischen Anlagen, einschließlich PV-Anlagen, beachtet werden.'
    },
    {
        term: 'Victron Energy',
        definition: 'Ein niederländischer Hersteller von hochwertigen Komponenten für die autarke Stromversorgung, darunter Wechselrichter, Batterieladegeräte und Speichersysteme. Besonders stark im Off-Grid- und Marine-Bereich.'
    },
    {
        term: 'VNB (Verteilnetzbetreiber)',
        definition: 'Siehe Netzbetreiber. Das Unternehmen, das das lokale Stromverteilnetz betreibt und für den Anschluss von PV-Anlagen zuständig ist.'
    },
    {
        term: 'Volt (V)',
        definition: 'Die physikalische Einheit für die elektrische Spannung. Sie beschreibt den "Druck", mit dem der elektrische Strom durch einen Leiter fließt.'
    },
    // W
    {
        term: 'Wallbox',
        definition: 'Eine an der Wand montierte Ladestation für Elektrofahrzeuge. Sie ermöglicht ein deutlich schnelleres und sichereres Laden als eine herkömmliche Haushaltssteckdose.'
    },
    {
        term: 'Wartung',
        definition: 'Regelmäßige Inspektion und Instandhaltung einer PV-Anlage, um deren sicheren Betrieb, eine lange Lebensdauer und maximale Erträge zu gewährleisten. Umfasst typischerweise Sichtprüfungen, elektrische Messungen und die Reinigung von Komponenten.'
    },
    {
        term: 'Wasserstoff (grüner)',
        definition: 'Wasserstoff, der durch Elektrolyse von Wasser hergestellt wird, wobei der benötigte Strom ausschließlich aus erneuerbaren Energiequellen stammt. Er kann als langfristiger Energiespeicher oder als sauberer Brennstoff und Rohstoff dienen.'
    },
    {
        term: 'Watt (W)',
        definition: 'Die physikalische Basiseinheit für Leistung. Sie gibt an, wie viel Energie pro Zeiteinheit umgesetzt wird (1 Watt = 1 Joule pro Sekunde).'
    },
    {
        term: 'Wärmepumpe',
        definition: 'Ein Heizsystem, das Umweltwärme (aus der Luft, dem Erdreich oder dem Grundwasser) auf ein höheres Temperaturniveau "pumpt", um damit ein Gebäude zu heizen. Sie arbeitet mit Strom und ist in Kombination mit einer PV-Anlage besonders effizient und klimafreundlich.'
    },
    {
        term: 'Wechselrichter',
        definition: 'Das "Herz" jeder Photovoltaikanlage. Er wandelt den von den Solarmodulen erzeugten Gleichstrom (DC) in den im Stromnetz üblichen Wechselstrom (AC) um und überwacht die gesamte Anlage.'
    },
    {
        term: 'Windlast',
        definition: 'Die Kraft, die der Wind auf ein Gebäude und die darauf montierte PV-Anlage ausübt. Die Unterkonstruktion muss so dimensioniert und befestigt sein, dass sie den maximal am Standort zu erwartenden Windlasten sicher standhält.'
    },
    {
        term: 'Wirkungsgrad',
        definition: 'Gibt an, wie viel Prozent der eingestrahlten Sonnenenergie von einem Solarmodul in elektrische Energie umgewandelt wird. Moderne Module erreichen Wirkungsgrade von über 22%.'
    },
    {
        term: 'Wirtschaftlichkeitsberechnung',
        definition: 'Eine detaillierte finanzielle Analyse eines PV-Projekts. Sie stellt die Investitions- und Betriebskosten den erwarteten Einnahmen und Einsparungen gegenüber, um Kennzahlen wie die Rendite und die Amortisationszeit zu ermitteln.'
    },
    {
        term: 'Witterungsschutz',
        definition: 'Der Schutz von Bauteilen vor Witterungseinflüssen wie Regen, Schnee, UV-Strahlung und Temperaturschwankungen. Alle Außenkomponenten einer PV-Anlage müssen witterungsbeständig sein.'
    },
    // X
    {
        term: 'X-Achse',
        definition: 'Die horizontale Achse in einem zweidimensionalen Koordinatensystem. In Ertragsdiagrammen von PV-Anlagen stellt die X-Achse oft den zeitlichen Verlauf (Stunden, Tage, Monate) dar.'
    },
    {
        term: 'X-Kabelverbinder',
        definition: 'Eine umgangssprachliche Bezeichnung für spezielle, kreuzförmige Kabelverbinder, die in der Elektrotechnik für Abzweigungen verwendet werden können.'
    },
    {
        term: 'Xenon-Test',
        definition: 'Ein standardisiertes Prüfverfahren zur Simulation der langfristigen Lichteinwirkung auf Materialien. In Klimakammern werden Solarmodule intensiver Xenon-Lichtstrahlung ausgesetzt, um ihre Alterungs- und UV-Beständigkeit in einem Zeitraffer zu testen.'
    },
    {
        term: 'Xerogel',
        definition: 'Ein hochporöses, festes Material, das in der Forschung als Antireflexbeschichtung für Solarglas verwendet wird, um die Lichtdurchlässigkeit und damit den Wirkungsgrad zu erhöhen.'
    },
    {
        term: 'X-Faktor',
        definition: 'Umgangssprachlich ein unbestimmter, aber entscheidender Faktor. In der PV-Planung kann der "X-Faktor" eine unvorhergesehene lokale Gegebenheit sein, die eine Standardlösung unmöglich macht und eine kreative Ingenieursleistung erfordert.'
    },
    {
        term: 'XML (Extensible Markup Language)',
        definition: 'Eine textbasierte Datensprache zur Darstellung von strukturierten Daten. Einige Monitoring-Systeme und Wechselrichter verwenden XML, um Leistungsdaten für die Weiterverarbeitung zu exportieren.'
    },
    {
        term: 'X-Pol-Antenne',
        definition: 'Eine Antenne mit Kreuzpolarisation, die eine stabilere und zuverlässigere Funkverbindung ermöglicht. Sie wird für die Datenübertragung von PV-Anlagen an entlegenen Standorten eingesetzt, wo die Mobilfunkabdeckung schwach ist.'
    },
    {
        term: 'X-Ray-Analyse',
        definition: 'Die Röntgenanalyse wird in der Qualitätskontrolle von Solarzellen eingesetzt, um mikroskopisch kleine Risse (Mikrorisse) oder fehlerhafte Lötverbindungen zu erkennen, die mit bloßem Auge nicht sichtbar sind.'
    },
    {
        term: 'X-Ständer',
        definition: 'Eine spezielle, kreuzförmige Stützkonstruktion, die bei manchen Montagesystemen für Freiflächenanlagen zur Aussteifung und Stabilisierung verwendet wird.'
    },
    {
        term: 'X-tal',
        definition: 'Eine in der Halbleiterindustrie gebräuchliche Abkürzung für Kristall (vom englischen "crystal"). Die Qualität des Silizium-Kristalls ist entscheidend für den Wirkungsgrad einer Solarzelle.'
    },
    // Y
    {
        term: 'Y-Achse',
        definition: 'Die vertikale Achse in einem zweidimensionalen Koordinatensystem. In Ertragsdiagrammen von PV-Anlagen stellt die Y-Achse oft die Leistung (in kW) oder die Energie (in kWh) dar.'
    },
    {
        term: 'Y-Kabel',
        definition: 'Ein spezielles Solarkabel mit einem Eingang und zwei Ausgängen (in Y-Form), das zur Parallelschaltung von zwei Modulstrings verwendet wird. Siehe auch Y-Stecker.'
    },
    {
        term: 'Y-Schaltung',
        definition: 'Siehe Sternschaltung. Eine grundlegende Schaltungsart in der Dreiphasen-Wechselstromtechnik, bei der die drei Stränge eines Generators oder Verbrauchers an einem gemeinsamen Sternpunkt verbunden sind.'
    },
    {
        term: 'Y-Stecker',
        definition: 'Ein PV-Steckverbinder in Y-Form, der es ermöglicht, zwei Solarmodule oder Strings parallel zu schalten, um deren Ströme zu addieren. Dies wird oft verwendet, um die Anzahl der an einen Wechselrichter-Eingang angeschlossenen Module zu optimieren.'
    },
    {
        term: 'Yearly Production',
        definition: 'Der englische Begriff für den Jahresertrag, also die Gesamtmenge an elektrischer Energie (in kWh), die eine PV-Anlage innerhalb eines Jahres produziert.'
    },
    {
        term: 'Yield',
        definition: 'Der englische Begriff für Ertrag. Der spezifische Jahresertrag (in kWh/kWp) ist eine wichtige Kennzahl, um die Performance von PV-Anlagen an unterschiedlichen Standorten zu vergleichen.'
    },
    {
        term: 'Yttrium',
        definition: 'Ein seltenes Erdmetall, das in der Forschung zur Dotierung von Halbleitermaterialien verwendet wird, um die Effizienz von Solarzellen oder LEDs zu verbessern.'
    },
    {
        term: 'Y-Analyse',
        definition: 'Umgangssprachlich eine Analyse, die sich auf die Frage "Warum?" (engl. "Why?") konzentriert, um die Ursachen für ein Problem (z.B. einen Minderertrag einer Anlage) systematisch zu ergründen.'
    },
    {
        term: 'Y-Koordinate',
        definition: 'Siehe Y-Achse. Der Wert auf der vertikalen Achse eines Graphen.'
    },
    {
        term: 'Y-Modell',
        definition: 'Ein Vorgehensmodell im Projektmanagement, das eine frühe Aufspaltung in zwei parallele Entwicklungsstränge (z.B. Hardware und Software) vorsieht, die am Ende wieder zusammengeführt werden. Dies kann bei der Entwicklung neuer PV-Komponenten Anwendung finden.'
    },
    // Z
    {
        term: 'Zelle (Solarzelle)',
        definition: 'Das kleinste elektronische Bauteil einer PV-Anlage. Sie besteht meist aus dem Halbleitermaterial Silizium und erzeugt bei Lichteinfall durch den photovoltaischen Effekt eine elektrische Spannung.'
    },
    {
        term: 'Zentralwechselrichter',
        definition: 'Ein sehr großer Wechselrichter, der bei Solarparks im Megawatt-Bereich eingesetzt wird. Anstatt vieler kleiner String-Wechselrichter wird die Leistung der gesamten Anlage oder großer Teilbereiche in einer zentralen Einheit gebündelt und umgewandelt.'
    },
    {
        term: 'Zertifikat',
        definition: 'Ein Dokument, das die Konformität eines Produkts oder Systems mit bestimmten Normen und Qualitätsstandards bescheinigt, z.B. ein TÜV-Zertifikat für ein Solarmodul.'
    },
    {
        term: 'Ziegel (Solarziegel)',
        definition: 'Ein Dacheindeckungsmaterial, das die Funktion eines normalen Dachziegels mit der einer Solarzelle kombiniert. Eine Form der gebäudeintegrierten Photovoltaik (BIPV), die eine besonders ästhetische Lösung darstellt.'
    },
    {
        term: 'ZOE Solar',
        definition: 'Ihr Experte für gewerbliche Photovoltaikanlagen. Wir sind herstellerunabhängig, setzen auf eigene Fachteams und bieten schlüsselfertige Energielösungen für maximale Rendite und Nachhaltigkeit.'
    },
    {
        term: 'Zuleitung',
        definition: 'Die elektrische Leitung, die den Strom von der Erzeugungsanlage (z.B. dem Wechselrichter) zum Anschlusspunkt am Hausnetz oder zur Übergabestation führt.'
    },
    {
        term: 'Zähler (Smart Meter)',
        definition: 'Ein digitaler Stromzähler, der den Stromverbrauch und die Einspeisung detailliert (oft in 15-Minuten-Intervallen) erfasst und die Daten an den Netzbetreiber übermitteln kann. Er ist eine Voraussetzung für die Direktvermarktung.'
    },
    {
        term: 'Zählerplatz',
        definition: 'Der Bereich im Zählerschrank, in dem der Stromzähler montiert ist. Er muss den technischen Anschlussbedingungen (TAB) des Netzbetreibers entsprechen.'
    },
    {
        term: 'Zwischenkreis',
        definition: 'Ein interner Schaltkreis in einem Wechselrichter. Er glättet den pulsierenden Gleichstrom, der von den Solarmodulen kommt, bevor dieser von der Endstufe in Wechselstrom umgewandelt wird.'
    },
    {
        term: 'Zyklenfestigkeit (Batterie)',
        definition: 'Gibt an, wie viele vollständige Lade- und Entladezyklen eine Batterie durchlaufen kann, bis ihre Speicherkapazität auf einen bestimmten Wert (meist 80% der Anfangskapazität) abgesunken ist. Eine hohe Zyklenfestigkeit ist ein entscheidendes Qualitätsmerkmal für die Lebensdauer eines Batteriespeichers.'
    }
];