export interface StateLegalAssoc {
  name: string;
  type: "Official State Bar Association" | "Trial Lawyers Association" | "Specialty Legal Society";
  city: string;
  url: string;
  description: string;
}

export const US_STATE_LEGAL: Record<string, StateLegalAssoc[]> = {
  alabama: [
    { name: "Alabama State Bar", type: "Official State Bar Association", city: "Montgomery", url: "https://www.alabar.org", description: "Official licensing and regulatory organization for all practicing attorneys in Alabama." },
    { name: "Alabama Association for Justice", type: "Trial Lawyers Association", city: "Montgomery", url: "https://www.alaaj.org", description: "Statewide trial lawyers organization advocating for civil justice and consumer rights." }
  ],
  alaska: [
    { name: "Alaska Bar Association", type: "Official State Bar Association", city: "Anchorage", url: "https://alaskabar.org", description: "Mandatory state bar regulating the legal profession and providing lawyer referral services." }
  ],
  arizona: [
    { name: "State Bar of Arizona", type: "Official State Bar Association", city: "Phoenix", url: "https://www.azbar.org", description: "Non-profit public service association serving over 18,500 active attorneys." },
    { name: "Arizona Association for Justice", type: "Trial Lawyers Association", city: "Phoenix", url: "https://www.azaj.org", description: "Association of trial attorneys dedicated to protecting consumer rights and legal access." }
  ],
  arkansas: [
    { name: "Arkansas Bar Association", type: "Official State Bar Association", city: "Little Rock", url: "https://www.arkbar.com", description: "Voluntary statewide bar association supporting judicial excellence and public legal education." }
  ],
  california: [
    { name: "The State Bar of California", type: "Official State Bar Association", city: "San Francisco / Los Angeles", url: "https://www.calbar.ca.gov", description: "Official administrative agency regulating licensing for over 250,000 California attorneys." },
    { name: "Consumer Attorneys of California (CAOC)", type: "Trial Lawyers Association", city: "Sacramento", url: "https://www.caoc.org", description: "Professional organization representing plaintiff attorneys fighting for consumer protection." }
  ],
  colorado: [
    { name: "Colorado Bar Association", type: "Official State Bar Association", city: "Denver", url: "https://www.cobar.org", description: "Voluntary professional association serving Colorado's legal community." },
    { name: "Colorado Trial Lawyers Association", type: "Trial Lawyers Association", city: "Denver", url: "https://www.ctla.org", description: "Advocating for individual rights, safety regulations, and trial practice excellence." }
  ],
  connecticut: [
    { name: "Connecticut Bar Association", type: "Official State Bar Association", city: "New Britain", url: "https://www.ctbar.org", description: "Premier legal organization serving attorneys, judges, and legal professionals." }
  ],
  delaware: [
    { name: "Delaware State Bar Association", type: "Official State Bar Association", city: "Wilmington", url: "https://www.dsba.org", description: "Professional legal organization in America's corporate law capital." }
  ],
  florida: [
    { name: "The Florida Bar", type: "Official State Bar Association", city: "Tallahassee", url: "https://www.floridabar.org", description: "Mandatory organization regulating over 110,000 licensed lawyers in Florida." },
    { name: "Florida Justice Association", type: "Trial Lawyers Association", city: "Tallahassee", url: "https://www.floridajusticeassociation.org", description: "Statewide trial lawyer association dedicated to protecting individual rights and access to courts." }
  ],
  georgia: [
    { name: "State Bar of Georgia", type: "Official State Bar Association", city: "Atlanta", url: "https://www.gabar.org", description: "Mandatory organization serving all Georgia licensed lawyers." },
    { name: "Georgia Trial Lawyers Association (GTLA)", type: "Trial Lawyers Association", city: "Atlanta", url: "https://www.gtla.org", description: "Promoting trial practice standards and individual constitutional rights." }
  ],
  hawaii: [
    { name: "Hawaii State Bar Association", type: "Official State Bar Association", city: "Honolulu", url: "https://hsba.org", description: "Mandatory bar organization regulating legal practices across Hawaii." }
  ],
  idaho: [
    { name: "Idaho State Bar", type: "Official State Bar Association", city: "Boise", url: "https://isb.idaho.gov", description: "Self-governing state agency administering bar admissions and licensing." }
  ],
  illinois: [
    { name: "Illinois State Bar Association", type: "Official State Bar Association", city: "Springfield / Chicago", url: "https://www.isba.org", description: "Voluntary state bar representing over 28,000 legal practitioners." },
    { name: "Illinois Trial Lawyers Association", type: "Trial Lawyers Association", city: "Springfield", url: "https://www.iltla.com", description: "Advocating for civil justice, injured victims, and consumer safety." }
  ],
  indiana: [
    { name: "Indiana State Bar Association", type: "Official State Bar Association", city: "Indianapolis", url: "https://www.inbar.org", description: "Indiana's largest legal network serving attorneys and judicial officers." }
  ],
  iowa: [
    { name: "The Iowa State Bar Association", type: "Official State Bar Association", city: "Des Moines", url: "https://www.iowabar.org", description: "Oldest voluntary state bar association in the United States." }
  ],
  kansas: [
    { name: "Kansas Bar Association", type: "Official State Bar Association", city: "Topeka", url: "https://www.ksbar.org", description: "Voluntary organization uniting attorneys, judges, and paralegals." }
  ],
  kentucky: [
    { name: "Kentucky Bar Association", type: "Official State Bar Association", city: "Frankfort", url: "https://www.kybar.org", description: "Mandatory state agency regulating over 18,000 Kentucky lawyers." }
  ],
  louisiana: [
    { name: "Louisiana State Bar Association", type: "Official State Bar Association", city: "New Orleans", url: "https://www.lsba.org", description: "Mandatory bar organization upholding civil law traditions in Louisiana." }
  ],
  maine: [
    { name: "Maine State Bar Association", type: "Official State Bar Association", city: "Augusta", url: "https://www.mainebar.org", description: "Voluntary statewide bar supporting high ethical standards and legal aid." }
  ],
  maryland: [
    { name: "Maryland State Bar Association", type: "Official State Bar Association", city: "Baltimore", url: "https://www.msba.org", description: "Voluntary legal network advancing law practice standards and public policy." }
  ],
  massachusetts: [
    { name: "Massachusetts Bar Association", type: "Official State Bar Association", city: "Boston", url: "https://www.massbar.org", description: "Statewide voluntary bar serving legal practitioners across New England." },
    { name: "Boston Bar Association", type: "Specialty Legal Society", city: "Boston", url: "https://www.bostonbar.org", description: "Historic legal network promoting judicial independence and legal access." }
  ],
  michigan: [
    { name: "State Bar of Michigan", type: "Official State Bar Association", city: "Lansing", url: "https://www.michbar.org", description: "Mandatory state organization regulating over 46,000 active Michigan lawyers." }
  ],
  minnesota: [
    { name: "Minnesota State Bar Association", type: "Official State Bar Association", city: "Minneapolis", url: "https://www.mnbar.org", description: "Voluntary association fostering justice and legal education." }
  ],
  mississippi: [
    { name: "The Mississippi Bar", type: "Official State Bar Association", city: "Jackson", url: "https://www.msbar.org", description: "Mandatory unified bar organization governing all Mississippi attorneys." }
  ],
  missouri: [
    { name: "The Missouri Bar", type: "Official State Bar Association", city: "Jefferson City", url: "https://mobar.org", description: "Official state bar regulating over 30,000 enrolled lawyers." }
  ],
  montana: [
    { name: "State Bar of Montana", type: "Official State Bar Association", city: "Helena", url: "https://www.montanabar.org", description: "Unified state bar licensing legal practitioners across Big Sky country." }
  ],
  nebraska: [
    { name: "Nebraska State Bar Association", type: "Official State Bar Association", city: "Lincoln", url: "https://www.nebar.com", description: "Mandatory bar organization enhancing public understanding of the legal system." }
  ],
  nevada: [
    { name: "State Bar of Nevada", type: "Official State Bar Association", city: "Las Vegas", url: "https://nvbar.org", description: "Mandatory organization governing licensed attorneys in Nevada." }
  ],
  "new-hampshire": [
    { name: "New Hampshire Bar Association", type: "Official State Bar Association", city: "Concord", url: "https://www.nhbar.org", description: "Unified state bar providing lawyer referral and public legal services." }
  ],
  "new-jersey": [
    { name: "New Jersey State Bar Association", type: "Official State Bar Association", city: "New Brunswick", url: "https://njsba.com", description: "Voluntary legal network supporting judicial excellence and attorney wellness." }
  ],
  "new-mexico": [
    { name: "State Bar of New Mexico", type: "Official State Bar Association", city: "Albuquerque", url: "https://www.sbnm.org", description: "Mandatory organization governing legal practitioners across New Mexico." }
  ],
  "new-york": [
    { name: "New York State Bar Association (NYSBA)", type: "Official State Bar Association", city: "Albany", url: "https://nysba.org", description: "Largest voluntary state bar association in the US representing 70,000 lawyers." },
    { name: "New York City Bar Association", type: "Specialty Legal Society", city: "New York City", url: "https://www.nycbar.org", description: "Historic voluntary bar promoting reform and international legal standards." }
  ],
  "north-carolina": [
    { name: "North Carolina State Bar", type: "Official State Bar Association", city: "Raleigh", url: "https://www.ncbar.gov", description: "Mandatory state agency regulating law practice and ethical standards." }
  ],
  "north-dakota": [
    { name: "State Bar Association of North Dakota", type: "Official State Bar Association", city: "Bismarck", url: "https://www.sband.org", description: "Official unified bar regulating legal practice across North Dakota." }
  ],
  ohio: [
    { name: "Ohio State Bar Association", type: "Official State Bar Association", city: "Columbus", url: "https://www.ohiobar.org", description: "Voluntary bar association serving over 28,000 Ohio legal professionals." }
  ],
  oklahoma: [
    { name: "Oklahoma Bar Association", type: "Official State Bar Association", city: "Oklahoma City", url: "https://www.okbar.org", description: "Mandatory bar organization licensing over 18,000 Oklahoma attorneys." }
  ],
  oregon: [
    { name: "Oregon State Bar", type: "Official State Bar Association", city: "Tigard / Portland", url: "https://www.osbar.org", description: "Mandatory state agency licensing lawyers and providing public legal aid." }
  ],
  pennsylvania: [
    { name: "Pennsylvania Bar Association", type: "Official State Bar Association", city: "Harrisburg", url: "https://www.pabar.org", description: "Voluntary organization supporting over 27,000 lawyer members." }
  ],
  "rhode-island": [
    { name: "Rhode Island Bar Association", type: "Official State Bar Association", city: "Providence", url: "https://ribar.com", description: "Unified state bar representing all practicing attorneys in Rhode Island." }
  ],
  "south-carolina": [
    { name: "South Carolina Bar", type: "Official State Bar Association", city: "Columbia", url: "https://www.scbar.org", description: "Mandatory state bar dedicated to public service and legal education." }
  ],
  "south-dakota": [
    { name: "State Bar of South Dakota", type: "Official State Bar Association", city: "Pierre", url: "https://www.statebarofsouthdakota.com", description: "Official administrative bar governing South Dakota attorneys." }
  ],
  tennessee: [
    { name: "Tennessee Bar Association", type: "Official State Bar Association", city: "Nashville", url: "https://www.tba.org", description: "Voluntary bar association serving Tennessee lawyers since 1881." }
  ],
  texas: [
    { name: "State Bar of Texas", type: "Official State Bar Association", city: "Austin", url: "https://www.texasbar.com", description: "Mandatory state agency regulating over 100,000 licensed Texas lawyers." },
    { name: "Texas Trial Lawyers Association (TTLA)", type: "Trial Lawyers Association", city: "Austin", url: "https://www.ttla.com", description: "Statewide trial attorney group championing civil justice and individual rights." }
  ],
  utah: [
    { name: "Utah State Bar", type: "Official State Bar Association", city: "Salt Lake City", url: "https://www.utahbar.org", description: "Mandatory organization licensing attorneys and protecting legal ethics." }
  ],
  vermont: [
    { name: "Vermont Bar Association", type: "Official State Bar Association", city: "Montpelier", url: "https://www.vtbar.org", description: "Voluntary state bar promoting justice and high legal standards." }
  ],
  virginia: [
    { name: "Virginia State Bar", type: "Official State Bar Association", city: "Richmond", url: "https://www.vsb.org", description: "Mandatory state agency regulating legal licensing for Virginia attorneys." }
  ],
  washington: [
    { name: "Washington State Bar Association", type: "Official State Bar Association", city: "Seattle", url: "https://www.wsba.org", description: "Mandatory organization licensing over 40,000 active Washington lawyers." }
  ],
  "west-virginia": [
    { name: "The West Virginia State Bar", type: "Official State Bar Association", city: "Charleston", url: "https://www.wvbar.org", description: "Mandatory unified bar regulating legal practice across West Virginia." }
  ],
  wisconsin: [
    { name: "State Bar of Wisconsin", type: "Official State Bar Association", city: "Madison", url: "https://www.wisbar.org", description: "Mandatory association serving over 25,000 lawyer members." }
  ],
  wyoming: [
    { name: "Wyoming State Bar", type: "Official State Bar Association", city: "Cheyenne", url: "https://www.wyomingbar.org", description: "Mandatory organization regulating legal licensing in Wyoming." }
  ]
};

export function getStateLegal(stateSlugOrName: string): StateLegalAssoc[] {
  const normalized = (stateSlugOrName || '').toLowerCase().trim().replace(/\s+/g, '-');
  return US_STATE_LEGAL[normalized] || [];
}
