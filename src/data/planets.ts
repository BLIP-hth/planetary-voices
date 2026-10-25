import type { PlanetId } from './planetVisuals'

export interface PhysicalStats {
  diameterKm: number
  dayLength: string
  yearLength: string
  distanceFromSunAU: number
}

export interface PlanetFacts {
  id: PlanetId
  name: string
  tagline: string
  discoverer: string
  discoveryYear: string
  mythology: string
  impactOnEarth: string
  interestingFacts: string[]
  scientificAdvancements: string
  moonCount: number
  moonCountAsOf: string
  missionsVisited: number
  notableMissions: string[]
  physicalStats: PhysicalStats
  /** the single headline oddity that makes this world memorable */
  signatureFact: string
  /** "what it'd be like to be there": the sensory group */
  experience: {
    /** why its voice sounds the way it does (ties back to the audio) */
    sound: string
    /** what the sky overhead looks like */
    sky: string
    /** could you survive here: temperature, air, pressure */
    survival: string
    /** what a 70 kg person would weigh, from surface gravity */
    gravity: string
    /** size relative to Earth */
    size: string
  }
}

export const PLANETS: Record<PlanetId, PlanetFacts> = {
  sun: {
    id: 'sun',
    name: 'The Sun',
    tagline: 'The blazing star that anchors and powers everything.',
    discoverer:
      'Known to every culture in history. It was never truly discovered, only understood recently: that it is a star, one of hundreds of billions in our galaxy.',
    discoveryYear: 'Known to all of human history',
    mythology:
      'Almost every civilization placed a Sun deity at the center of its cosmology: Ra in Egypt, Helios and later Sol in the Greco-Roman world, Surya in Hindu tradition, Amaterasu in Japan, and Inti for the Inca. It was the ultimate giver of life, order, and time.',
    impactOnEarth:
      'The Sun is the source of virtually all energy on Earth, driving climate, weather, ocean currents, photosynthesis, and the food chain itself. Its gravity holds Earth in orbit, and solar storms can disrupt satellites, power grids, and radio communication.',
    interestingFacts: [
      'The Sun accounts for about 99.86% of all the mass in the solar system.',
      'It is so large that roughly 1.3 million Earths could fit inside it.',
      'Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.',
      'Its core reaches around 15 million °C, fusing 600 million tons of hydrogen into helium every second.',
      'The Sun is a middle-aged star, roughly 4.6 billion years old and about halfway through its life.',
    ],
    scientificAdvancements:
      'The element helium was discovered in the Sun\'s spectrum before it was ever found on Earth. Studying the Sun founded the fields of spectroscopy and helioseismology, and it remains our only star close enough to observe in fine detail, a natural laboratory for the fusion physics behind all stars.',
    moonCount: 8,
    moonCountAsOf: 'the eight planets that orbit it (plus dwarf planets, moons, asteroids, and comets)',
    missionsVisited: 6,
    notableMissions: [
      'Parker Solar Probe (2018-present): flying through the Sun\'s outer corona, closest ever',
      'SOHO (1995-present): ESA/NASA solar observatory, helioseismology and space weather',
      'Solar Dynamics Observatory (2010-present): continuous high-resolution imaging',
      'Solar Orbiter (ESA/NASA, 2020-present): first close-up views of the poles',
    ],
    physicalStats: { diameterKm: 1392700, dayLength: '~25-35 days (varies by latitude)', yearLength: 'N/A, the Sun is the center', distanceFromSunAU: 0 },
    signatureFact:
      'The Sun holds 99.86% of all the mass in the solar system. Every planet, moon, asteroid, and comet combined is barely a rounding error orbiting the rest.',
    experience: {
      sound:
        "Sound can't travel through the vacuum of space, so this is the Sun ‘ringing’ internally like a bell: real pressure waves resonating inside it, recorded by the SOHO observatory and sped up about 42,000 times so human ears can hear them.",
      sky: "You could never stand on the Sun, but from within its outer atmosphere the ‘sky’ would be a blinding, all-consuming white-hot glow of plasma: no blue, no stars, just light in every direction.",
      survival:
        'No. The visible surface is about 5,500°C and the core reaches 15 million°C. There is nothing solid to stand on, and anything approaching is vaporized long before arrival.',
      gravity:
        "Gravity at the Sun's surface is about 28 times Earth's, so a 70 kg (154 lb) person would ‘weigh’ nearly 2,000 kg, if they could exist there at all.",
      size: 'The Sun is about 109 times wider than Earth, and roughly 1.3 million Earths could fit inside it.',
    },
  },
  mercury: {
    id: 'mercury',
    name: 'Mercury',
    tagline: 'Smallest planet, scorched by day, frozen by night.',
    discoverer:
      'Known since antiquity. Visible to the naked eye, it has no single discoverer; Babylonian, Egyptian, Greek, and Chinese astronomers tracked it millennia ago.',
    discoveryYear: 'Known since antiquity',
    mythology:
      'Named by the Romans after the swift messenger god Mercury, because it is the fastest-moving planet across the sky. Babylonians called it Nabu, after their god of writing and wisdom. In Chinese, Korean, Japanese, and Vietnamese astronomy it is literally the "Water Star" (水星), tied to the water element in Five Phases philosophy; Hindu tradition names it Budha.',
    impactOnEarth:
      "Mercury's slightly anomalous orbit (its perihelion precesses 43 arcseconds per century more than Newtonian physics predicted) provided one of the first major confirmations of Einstein's general relativity. That same relativistic framework underlies the tiny clock corrections applied to GPS satellites, which keep global navigation accurate today.",
    interestingFacts: [
      'Mercury is the smallest planet in the solar system and the closest to the Sun.',
      'It takes only 88 Earth days to orbit the Sun, the shortest year of any planet.',
      'Despite being closest to the Sun, Mercury is not the hottest planet; Venus is.',
      "Mercury's iron core makes up about 85% of its radius, the largest core-to-size ratio of any planet.",
      "Its heavily cratered surface looks remarkably similar to Earth's Moon.",
    ],
    scientificAdvancements:
      "Mercury's orbital quirks helped confirm Einstein's general theory of relativity, one of the pillars of modern physics. MESSENGER's detailed mapping revealed water ice hiding in permanently shadowed polar craters, reshaping models of how rocky planets form so close to a star.",
    moonCount: 0,
    moonCountAsOf: 'confirmed zero moons, no new discoveries',
    missionsVisited: 3,
    notableMissions: [
      'Mariner 10 (1974-75): first flybys, mapped ~45% of the surface',
      'MESSENGER (2011-2015): first orbiter, mapped surface and found ice',
      'BepiColombo (ESA/JAXA): dual-orbiter, orbit insertion expected late 2026',
    ],
    physicalStats: { diameterKm: 4879, dayLength: '58.6 Earth days', yearLength: '88 Earth days', distanceFromSunAU: 0.39 },
    signatureFact:
      'Mercury is slowly shrinking: as its huge iron core cools and contracts, the entire planet has shrunk, wrinkling its crust into towering cliffs like a drying apple.',
    experience: {
      sound:
        'Mercury has almost no atmosphere, just a wisp of an exosphere, so there is no air to carry sound, and the surface would be utterly silent. This tone is a simulation evoking its scorched, airless stillness.',
      sky: "With virtually no atmosphere, Mercury's sky stays pitch black even at noon, and stars are visible in daytime. The Sun looks two to three times larger than it does from Earth.",
      survival:
        'No. Temperatures swing from about +430°C in sunlight to −180°C in shadow, the largest range of any planet, and there is no air to breathe.',
      gravity:
        "Mercury's gravity is about 38% of Earth's, so a 70 kg (154 lb) person would weigh only around 27 kg (59 lb).",
      size: "Mercury is the smallest planet, about 38% of Earth's diameter, only a little larger than our own Moon.",
    },
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    tagline: "Earth's twin in size, but a toxic inferno.",
    discoverer:
      'Known since antiquity. The brightest planet to the naked eye, it has no single discoverer; Babylonian, Egyptian, Greek, and Maya astronomers observed it thousands of years ago.',
    discoveryYear: 'Known since antiquity',
    mythology:
      'Named after the Roman goddess of love and beauty because it is the brightest planet in the night sky. Babylonians identified it with Ishtar, goddess of love and war. The Maya revered Venus above nearly every other celestial body, recording precise Venus tables in the Dresden Codex and linking it to the deity Kukulkan.',
    impactOnEarth:
      "Historic transits of Venus (including the 1769 expedition Captain Cook led to Tahiti) let astronomers calculate the Astronomical Unit via parallax, a foundational measurement for the scale of the solar system. Venus's runaway greenhouse effect, a scorching 470°C surface driven by a 96.5% CO2 atmosphere, serves as a key comparative case study in climate science, though Earth is not at risk of a Venus-like runaway.",
    interestingFacts: [
      'Venus is the hottest planet in the solar system, hot enough to melt lead at its surface.',
      'It spins backward (retrograde) compared to most planets, so the Sun rises in the west.',
      'A single day on Venus (243 Earth days) is longer than its entire year (225 Earth days).',
      'Its thick CO2 atmosphere creates a crushing surface pressure over 90 times that of Earth.',
      "Venus is the brightest natural object in Earth's night sky after the Moon.",
    ],
    scientificAdvancements:
      "Venus is the definitive real-world example of a runaway greenhouse effect, informing both Earth climate science and the search for habitable exoplanets. Soviet Venera landers pioneered engineering for probes that survive crushing pressure and extreme heat, while Magellan's radar mapping advanced techniques still used in planetary and Earth remote sensing.",
    moonCount: 0,
    moonCountAsOf: 'confirmed zero moons, no new discoveries',
    missionsVisited: 25,
    notableMissions: [
      'Venera program (USSR, 1961-1984): first probe to land on another planet',
      'Magellan (1990-1994): radar-mapped 98% of the surface',
      'Akatsuki (JAXA, 2015-present): studies climate and atmospheric dynamics',
      'DAVINCI (NASA, upcoming): first US atmospheric probe since 1978',
    ],
    physicalStats: { diameterKm: 12104, dayLength: '243 Earth days (retrograde)', yearLength: '225 Earth days', distanceFromSunAU: 0.72 },
    signatureFact:
      'A day on Venus is longer than its year: it spins so slowly, and backwards, that the Sun rises in the west and sets in the east.',
    experience: {
      sound:
        "This is a real signal from NASA's Parker Solar Probe, which skimmed past Venus in 2020 and picked up a natural radio emission from the planet's upper atmosphere. That data is what you are hearing, shifted into the audible range.",
      sky: "A permanent overcast of sulfuric-acid clouds means you'd never see the Sun or stars, just a dim, oppressive orange gloom filtering down through the haze.",
      survival:
        "No. It's the deadliest surface in the solar system: about 470°C (hot enough to melt lead), crushing pressure over 90 times Earth's, and clouds of sulfuric acid.",
      gravity:
        "Venus is nearly Earth's twin in gravity, about 90%, so a 70 kg (154 lb) person would weigh roughly 63 kg (139 lb).",
      size: "Venus is about 95% of Earth's diameter, making it the closest thing to Earth's twin in size.",
    },
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    tagline: 'The only known planet that harbors life.',
    discoverer:
      "Not 'discovered' in the traditional sense: it is humanity's home planet, known throughout human history and prehistory.",
    discoveryYear: 'Home planet',
    mythology:
      '"Earth" isn\'t named after a god; it comes from Old English/Germanic "eorþe," meaning ground or soil. The ancient Greeks personified the planet as Gaia, the primordial mother goddess from whom all life sprang. In Chinese Taoist five-element cosmology, Earth corresponds to "Tu" (土), one of five elements governing nature and direction.',
    impactOnEarth:
      "Earth's unusually large Moon stabilizes its axial tilt, moderating seasons and driving tides that likely shaped the evolution of early marine life. Studying Earth as a planet (its climate, magnetic field, and plate tectonics) directly underpins the weather forecasting, GPS, and climate science modern society relies on daily.",
    interestingFacts: [
      "Liquid water covers about 71% of Earth's surface, unique among known worlds.",
      "Earth's molten iron core generates a magnetic field that shields life from solar radiation.",
      'The Moon is gradually slowing Earth\'s rotation, lengthening the day by about 1.7 milliseconds per century.',
      'Earth is the densest planet in the solar system.',
      'Earth is the only planet in the solar system not named after a Greek or Roman deity.',
    ],
    scientificAdvancements:
      "Continuous satellite monitoring of Earth pioneered real-time tracking of climate change, ozone depletion, and ecosystem health. Techniques developed to study Earth's atmosphere and geology are now directly applied to interpret Mars, Venus, and exoplanets.",
    moonCount: 1,
    moonCountAsOf: "the Moon is Earth's only true natural satellite (transient 'quasi-moons' orbit the Sun, not Earth)",
    missionsVisited: 10,
    notableMissions: [
      'Landsat Program (1972-present): longest continuous Earth imagery record',
      'Terra (1999): flagship land, ocean, atmosphere observer',
      'ISS (1998-present): continuous human presence in orbit',
      'Copernicus Sentinel Program (ESA): continuous Earth-monitoring satellite fleet',
    ],
    physicalStats: { diameterKm: 12742, dayLength: '23.93 hours', yearLength: '365.25 days', distanceFromSunAU: 1.0 },
    signatureFact:
      'Earth remains the only place in the entire known universe where life has ever been found.',
    experience: {
      sound:
        "This is real data from NASA's Van Allen Probes. It is ‘chorus,’ the eerie rising whistles of plasma waves rippling through Earth's own magnetosphere, radio waves shifted into a range human ears can hear.",
      sky: 'Sunlight scattering through our nitrogen-oxygen air paints the daytime sky blue and turns sunsets red and orange, an effect unique to Earth’s particular atmosphere.',
      survival:
        'Yes, the only place you can, without a suit. An average of about 15°C, breathable air, liquid water, and a magnetic field shielding the surface from harmful radiation.',
      gravity:
        'Earth is the baseline: a 70 kg (154 lb) person weighs exactly 70 kg here, and every other world is compared to this.',
      size: "Earth is the reference point, about 12,742 km across, and the densest planet in the solar system.",
    },
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    tagline: 'The dusty red world humans dream of exploring.',
    discoverer: 'Known since antiquity by naked-eye observers across many ancient cultures; not discovered by any single person.',
    discoveryYear: 'Known since antiquity',
    mythology:
      'Named after Mars, the Roman god of war, because its rusty red color evoked blood and battle; the Greeks called the same planet Ares. Ancient Chinese astronomers called it Yinghuo (荧惑, "the flickering puzzler") for its reddish glow and unpredictable retrograde motion, seeing its appearances as omens of war.',
    impactOnEarth:
      "Mars has no direct physical effect on Earth, but its dried-up rivers, lakebeds, and stripped-away atmosphere give scientists a real-world comparison for studying how planets lose habitability. Its ongoing search for biosignatures also shapes how astrobiologists design life-detection instruments and planetary protection protocols.",
    interestingFacts: [
      'Mars hosts Olympus Mons, the largest volcano in the solar system, roughly three times the height of Mount Everest.',
      "Mars's atmosphere is about 100 times thinner than Earth's and is mostly carbon dioxide.",
      'A Martian day (a "sol") is about 24 hours 37 minutes, close to an Earth day.',
      'Its two moons, Phobos and Deimos, are small, irregularly shaped, and likely captured asteroids.',
      "Mars's red color comes from iron oxide (rust) coating its surface dust.",
    ],
    scientificAdvancements:
      'Mars exploration has revealed strong evidence of ancient rivers, lakes, and a once-thicker atmosphere, reshaping how scientists understand planetary habitability. Technologies developed for Mars rovers (sample caching, autonomous navigation, in-situ oxygen production) are directly informing plans for future human exploration.',
    moonCount: 2,
    moonCountAsOf: 'Phobos and Deimos, discovered by Asaph Hall in 1877; no additional moons found despite dedicated surveys',
    missionsVisited: 28,
    notableMissions: [
      'Perseverance (2021-present): rover, seeking ancient microbial life signs, flew Ingenuity helicopter',
      "Curiosity (2012-present): rover, studying Gale Crater's past habitability",
      "Tianwen-1 (2021): China's first orbiter-lander-rover Mars mission",
      'Viking 1 & 2 (1976): first successful landers, first life-detection experiments',
    ],
    physicalStats: { diameterKm: 6779, dayLength: '24.6 hours', yearLength: '687 Earth days', distanceFromSunAU: 1.52 },
    signatureFact:
      'Mars is home to Olympus Mons, the tallest volcano in the solar system, nearly three times the height of Mount Everest.',
    experience: {
      sound:
        "This is a real recording from Perseverance's microphone in 2021, among the first sounds ever captured on another planet. Mars's thin CO₂ air makes it faint and low-pitched; high tones barely travel at all.",
      sky: "Fine suspended dust tints the daytime sky a butterscotch pink-tan, and, remarkably, Martian sunsets glow blue, the reverse of Earth's.",
      survival:
        "Not unprotected. Around −60°C on average, with air 100 times thinner than Earth's and unbreathable, yet it's still the most survivable target for future human crews.",
      gravity:
        "Mars's gravity is about 38% of Earth's, so a 70 kg (154 lb) person would weigh only around 27 kg (59 lb), the same as on Mercury.",
      size: "Mars is about 53% of Earth's diameter, roughly half Earth's width, and the second-smallest planet.",
    },
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    tagline: "The solar system's giant guardian, swirling with ancient storms.",
    discoverer: 'Known since antiquity; visible to the naked eye, so no single discoverer.',
    discoveryYear: 'Known since antiquity',
    mythology:
      'Named for the Roman king of the gods, ruler of the sky and thunder, reflecting its status as the brightest and largest wandering star known to ancient observers. In Chinese astronomy it was called the "wood star" and also the "year star" because it takes roughly 12 years to circle the sky, a cycle that shaped the Chinese zodiac.',
    impactOnEarth:
      "Jupiter's immense gravity influences the orbits of comets and asteroids passing through the solar system, but its role as Earth's 'cosmic shield' is debated: simulations show it deflects some long-period comets away while nudging others onto Earth-crossing paths. Beyond this contested gravitational role, Jupiter has no direct measurable effect on Earth.",
    interestingFacts: [
      'Jupiter is more massive than all the other planets in the solar system combined.',
      'The Great Red Spot is a storm system, estimated at least ~190 years old (possibly far older), still slightly larger than Earth.',
      "Jupiter has the strongest planetary magnetic field in the solar system, about 20,000 times stronger than Earth's.",
      'Its moon Io is the most volcanically active body known in the solar system.',
      'Jupiter has a faint ring system, discovered by Voyager 1 in 1979.',
    ],
    scientificAdvancements:
      "Juno's precise gravity and magnetic field measurements revealed that Jupiter's core is larger and more diluted than models predicted, reshaping theories of gas giant formation. Jupiter's powerful radio emissions helped found the field of planetary radio astronomy, and its moon Europa, with a suspected subsurface ocean, is a leading target in the search for life.",
    moonCount: 115,
    moonCountAsOf: 'per IAU Minor Planet Center, a tally that keeps rising as small moons are confirmed',
    missionsVisited: 9,
    notableMissions: [
      'Pioneer 10 (1973): first flyby, measured radiation belts and atmosphere',
      'Galileo (1995-2003): first orbiter, dropped an atmospheric entry probe',
      'Juno (2016-present): orbiter mapping core, gravity, and magnetic field',
      "Europa Clipper (launched 2024, en route): will study Europa's ice shell and ocean",
    ],
    physicalStats: { diameterKm: 139822, dayLength: '9.9 hours', yearLength: '12 Earth years', distanceFromSunAU: 5.2 },
    signatureFact:
      'The Great Red Spot is a single storm wider than the entire Earth that has been raging for at least 190 years, and possibly far longer.',
    experience: {
      sound:
        "Jupiter has no solid surface, so this isn't literal sound: it's plasma and radio waves from the giant's magnetic field, detected by spacecraft like Voyager and Juno and shifted down into the range human ears can hear.",
      sky: "You could never stand here. You'd be surrounded by endless bands of racing clouds, continent-sized lightning, and storms, with four large moons and a faint ring overhead.",
      survival:
        'No. There is no surface to land on, pressure crushes anything descending, cloud tops sit near −145°C, and the surrounding radiation belts are lethal.',
      gravity:
        "At the cloud tops Jupiter's gravity is about 2.5 times Earth's, so a 70 kg (154 lb) person would feel like they weigh about 177 kg (390 lb).",
      size: 'Jupiter is about 11 times wider than Earth and more massive than all the other planets combined: roughly 1,300 Earths could fit inside it.',
    },
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    tagline: 'The ringed jewel of the solar system, girded by ice and rock.',
    discoverer: 'Known since antiquity; visible to the naked eye, so no single discoverer.',
    discoveryYear: 'Known since antiquity',
    mythology:
      'Named for the Roman god of agriculture and time, father of Jupiter, reflecting its slow, stately motion across the sky. In Vedic astrology it is Shani, the "slow mover," a stern deity linked to karma and discipline; in Chinese and Japanese astronomy it was the "earth star."',
    impactOnEarth:
      "Saturn's great distance and mass give it no meaningful direct physical or gravitational effect on Earth. Its influence has been primarily scientific and cultural: as one of the five naked-eye planets known since antiquity it shaped early astronomy and calendar systems, and Cassini has advanced understanding of ring dynamics, moon habitability, and planetary system formation.",
    interestingFacts: [
      'Saturn is the least dense planet in the solar system: it would float in a large enough ocean.',
      "Saturn's rings are made mostly of ice and rock fragments ranging from dust grains to house-sized chunks.",
      'Its moon Titan has a thick atmosphere and stable lakes of liquid methane, the only known body besides Earth with standing surface liquid.',
      "Saturn's north pole hosts a persistent hexagonal jet-stream pattern roughly 20,000 miles across.",
      'Equatorial winds can reach up to about 1,100 mph, among the fastest in the solar system.',
    ],
    scientificAdvancements:
      "Cassini's 13-year orbital mission (2004-2017) revealed geysers venting from a subsurface ocean on the moon Enceladus, making it a top candidate for extraterrestrial habitability, and delivered the most detailed data yet on ring structure and dynamics.",
    moonCount: 293,
    moonCountAsOf: 'per IAU Minor Planet Center, the most volatile count of any planet, revised upward repeatedly through 2026',
    missionsVisited: 4,
    notableMissions: [
      'Pioneer 11 (1979): first flyby, discovered the F ring and a new moon',
      'Voyager 1 & 2 (1980-81): first close imaging of rings and moons',
      'Cassini-Huygens (2004-2017): orbiter plus a probe landing on Titan',
    ],
    physicalStats: { diameterKm: 120536, dayLength: '10.7 hours', yearLength: '29.4 Earth years', distanceFromSunAU: 9.5 },
    signatureFact:
      'Saturn is so light for its size that it would float in water, the only planet less dense than water itself.',
    experience: {
      sound:
        "This is real data from Cassini: radio emissions from Saturn's auroras (known as Saturn Kilometric Radiation) converted into sound. The eerie whistles and tones aren't acoustic; they're the planet's magnetic field made audible.",
      sky: "From within the clouds you'd see a soft golden haze, but from the right vantage the rings would arc across the whole sky as a vast, luminous band of ice and rock.",
      survival:
        'No. There is no solid surface, cloud tops reach about −180°C, winds scream past far faster than any on Earth, and pressure soars with depth.',
      gravity:
        "Despite its size, Saturn's low density gives it gravity close to Earth's, about 107%, so a 70 kg (154 lb) person would weigh roughly 75 kg (165 lb).",
      size: "Saturn is about 9.5 times wider than Earth: around 760 Earths could fit inside it, yet it's the least dense planet of all.",
    },
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus',
    tagline: 'The ice giant tipped completely on its side.',
    discoverer: 'William Herschel, March 13, 1781, at first mistaken for a comet or star.',
    discoveryYear: '1781',
    mythology:
      'Named for Ouranos, the primordial Greek god of the sky: Uranus is the only planet with a Greek rather than Roman name, chosen to keep the mythological lineage consistent since Ouranos was father of Cronus (Saturn). In Chinese, Japanese, and Korean it is called the "Sky King Star," a direct translation of the same heavenly-ruler concept.',
    impactOnEarth:
      "Uranus is too distant for any measurable gravitational or tidal effect on Earth. Its real value is scientific: as the closest example of an 'ice giant,' and since most exoplanets discovered around other stars are Neptune- or Uranus-sized, studying its atmosphere directly informs how scientists interpret thousands of worlds beyond our solar system.",
    interestingFacts: [
      "Uranus's axial tilt is about 98 degrees, so it essentially rolls around the Sun on its side, likely from an ancient giant impact.",
      'It rotates in retrograde (backward relative to its orbit), a trait shared only with Venus among the planets.',
      'It has the coldest planetary atmosphere in the solar system, despite not being the farthest planet from the Sun.',
      'Uranus has 13 known faint rings, discovered in 1977 during a stellar occultation.',
      'It has been visited by only one spacecraft, Voyager 2, during a single flyby in January 1986.',
    ],
    scientificAdvancements:
      "The 1986 Voyager 2 flyby revealed Uranus's oddly tilted, off-center magnetic field, its ring system, and several small moons, reshaping models of how ice giants form. That data remains a key reference for interpreting the atmospheres of Uranus-sized exoplanets, one of the most common planet types found by modern telescopes.",
    moonCount: 29,
    moonCountAsOf: 'includes a 2025 JWST-imaged moon confirmed by the IAU in 2026, so some public NASA pages may still show 28',
    missionsVisited: 1,
    notableMissions: [
      'Voyager 2 (flyby, January 1986): the only spacecraft ever to visit Uranus; a dedicated Uranus Orbiter and Probe mission has been recommended but not yet launched',
    ],
    physicalStats: { diameterKm: 51118, dayLength: '17 hours', yearLength: '84 Earth years', distanceFromSunAU: 19.2 },
    signatureFact:
      'Uranus is tipped completely on its side, rolling around the Sun like a ball, so each pole spends 42 years in continuous sunlight followed by 42 years of darkness.',
    experience: {
      sound:
        'This is real data from Voyager 2, the only spacecraft ever to visit Uranus, back in 1986. Its instruments caught plasma waves around the tilted ice giant, shifted here into the range human ears can hear.',
      sky: 'Methane in the air absorbs red light, so everything is bathed in a featureless pale cyan. The distant Sun appears as a small, dim disk.',
      survival:
        'No. Uranus has the coldest atmosphere in the solar system at about −224°C, no surface to stand on, and unbreathable hydrogen, helium, and methane air.',
      gravity:
        "Uranus's gravity is actually slightly less than Earth's, about 89%, so a 70 kg (154 lb) person would weigh roughly 62 kg (137 lb).",
      size: 'Uranus is about 4 times wider than Earth: around 63 Earths could fit inside it.',
    },
  },
  neptune: {
    id: 'neptune',
    name: 'Neptune',
    tagline: 'The windswept blue giant found by math, not eyes.',
    discoverer:
      'Predicted mathematically by Urbain Le Verrier (and independently by John Couch Adams) from irregularities in Uranus\'s orbit; first observed telescopically by Johann Galle on September 23, 1846.',
    discoveryYear: '1846',
    mythology:
      'Named for Neptune, the Roman god of the sea, chosen for the planet\'s deep blue color as seen through telescopes. In Chinese, Japanese, and Korean it is called the "Sea King Star," directly translating the same sea-god association.',
    impactOnEarth:
      "Neptune is far too distant to exert any measurable gravitational, tidal, or climatic effect on Earth. Its scientific value lies in comparison: as the archetype 'ice giant,' its atmosphere is used as a proxy for understanding the sub-Neptune and Neptune-sized worlds that make up the largest known category of exoplanets.",
    interestingFacts: [
      'Neptune has the fastest winds in the solar system, with gusts measured by Voyager 2 reaching roughly 1,300 mph.',
      'It was the first planet found through mathematical prediction rather than direct observation, confirming Newtonian gravity on a solar-system scale.',
      'One Neptunian year equals about 165 Earth years: it completed its first full orbit since discovery only in 2011.',
      'Its largest moon, Triton, orbits backward and is thought to be a captured Kuiper Belt object.',
      'It has been visited by only one spacecraft, Voyager 2, during a single flyby in August 1989.',
    ],
    scientificAdvancements:
      "Neptune's discovery via calculation rather than observation was a landmark proof of predictive physics. The 1989 Voyager 2 flyby returned the only close-up data ever obtained on Neptune and Triton, and still underpins current models of ice-giant atmospheric dynamics and sub-Neptune exoplanets.",
    moonCount: 16,
    moonCountAsOf: 'confirmed since 2024 (S/2002 N5 and S/2021 N1), unchanged as of 2026',
    missionsVisited: 1,
    notableMissions: [
      'Voyager 2 (flyby, August 1989): the only spacecraft ever to visit Neptune; no other mission has returned since',
    ],
    physicalStats: { diameterKm: 49528, dayLength: '16 hours', yearLength: '165 Earth years', distanceFromSunAU: 30.1 },
    signatureFact:
      "Neptune was found by pure mathematics: predicted on paper from tiny wobbles in Uranus's orbit before anyone ever pointed a telescope at it.",
    experience: {
      sound:
        "This is real data from Voyager 2's 1989 flyby, the only visit Neptune has ever had. The spacecraft recorded plasma waves in the space around it, shifted into audible sound.",
      sky: 'Methane gives Neptune a deep azure-blue sky, but it is dim (sunlight is about 900 times weaker than on Earth), with bright white clouds streaking past at supersonic speed.',
      survival:
        'No. Temperatures sit around −214°C, there is no surface, and winds of up to 2,000 km/h make it the most violently weathered planet in the solar system.',
      gravity:
        "Neptune's gravity is a bit stronger than Earth's, about 114%, so a 70 kg (154 lb) person would weigh roughly 80 kg (176 lb).",
      size: 'Neptune is about 3.9 times wider than Earth, and roughly 57 Earths could fit inside it, making it the smallest of the four giant planets.',
    },
  },
}
