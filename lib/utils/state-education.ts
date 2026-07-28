export interface EducationalInstitution {
  name: string;
  url: string;
  type: string;
}

export const US_STATE_EDUCATION: Record<string, EducationalInstitution[]> = {
  alabama: [
    { name: "University of Alabama", url: "https://www.ua.edu", type: "Public Flagship Research University" },
    { name: "Auburn University", url: "https://www.auburn.edu", type: "Public Land-Grant Research University" },
    { name: "University of Alabama at Birmingham (UAB)", url: "https://www.uab.edu", type: "Public Academic Health & Research Center" },
    { name: "Tuskegee University", url: "https://www.tuskegee.edu", type: "Private Historic HBCU University" },
    { name: "University of Alabama in Huntsville (UAH)", url: "https://www.uah.edu", type: "Public Space & Engineering Research University" },
    { name: "Samford University", url: "https://www.samford.edu", type: "Private Christian University" },
    { name: "Alabama State University", url: "https://www.alasu.edu", type: "Public HBCU University" },
    { name: "Alabama Community College System", url: "https://www.accs.edu", type: "Statewide Community College System" }
  ],
  alaska: [
    { name: "University of Alaska Anchorage", url: "https://www.uaa.alaska.edu", type: "Public Research University" },
    { name: "University of Alaska Fairbanks", url: "https://www.uaf.edu", type: "Public Land, Sea, and Space-Grant Flagship" },
    { name: "University of Alaska Southeast", url: "https://uas.alaska.edu", type: "Public Regional University" },
    { name: "Alaska Pacific University", url: "https://www.alaskapacific.edu", type: "Private Liberal Arts University" },
    { name: "Ilisaġvik College", url: "https://www.ilisagvik.edu", type: "Tribal Community College" }
  ],
  arizona: [
    { name: "Arizona State University (ASU)", url: "https://www.asu.edu", type: "Public Innovation & Research University" },
    { name: "University of Arizona", url: "https://www.arizona.edu", type: "Public Flagship Research University" },
    { name: "Northern Arizona University (NAU)", url: "https://nau.edu", type: "Public Research University" },
    { name: "Grand Canyon University (GCU)", url: "https://www.gcu.edu", type: "Private Christian University" },
    { name: "Maricopa Community Colleges", url: "https://www.maricopa.edu", type: "Community College System" },
    { name: "Prescott College", url: "https://www.prescott.edu", type: "Private Environmental Arts College" }
  ],
  arkansas: [
    { name: "University of Arkansas", url: "https://www.uark.edu", type: "Public Flagship Research University" },
    { name: "Arkansas State University", url: "https://www.astate.edu", type: "Public Research University" },
    { name: "University of Central Arkansas", url: "https://uca.edu", type: "Public University" },
    { name: "University of Arkansas for Medical Sciences (UAMS)", url: "https://www.uams.edu", type: "Public Academic Health Center" },
    { name: "Hendrix College", url: "https://www.hendrix.edu", type: "Private Liberal Arts College" },
    { name: "Arkansas Tech University", url: "https://www.atu.edu", type: "Public Technical University" }
  ],
  california: [
    { name: "University of California, Berkeley (UC Berkeley)", url: "https://www.berkeley.edu", type: "Public Flagship Research University" },
    { name: "Stanford University", url: "https://www.stanford.edu", type: "Private Research University" },
    { name: "University of California, Los Angeles (UCLA)", url: "https://www.ucla.edu", type: "Public Research University" },
    { name: "California Institute of Technology (Caltech)", url: "https://www.caltech.edu", type: "Private Science & Engineering Institute" },
    { name: "University of Southern California (USC)", url: "https://www.usc.edu", type: "Private Research University" },
    { name: "UC San Diego", url: "https://ucsd.edu", type: "Public STEM & Research University" },
    { name: "California State University (CSU System)", url: "https://www.calstate.edu", type: "Public State University System" },
    { name: "California Community Colleges System", url: "https://www.cccco.edu", type: "Community College Network" }
  ],
  colorado: [
    { name: "University of Colorado Boulder", url: "https://www.colorado.edu", type: "Public Flagship Research University" },
    { name: "Colorado State University", url: "https://www.colostate.edu", type: "Public Land-Grant University" },
    { name: "University of Denver (DU)", url: "https://www.du.edu", type: "Private Research University" },
    { name: "Colorado School of Mines", url: "https://www.mines.edu", type: "Public Engineering & Applied Science University" },
    { name: "United States Air Force Academy", url: "https://www.usafa.edu", type: "Federal Service Academy" },
    { name: "Colorado Community College System", url: "https://www.cccs.edu", type: "State Community College Network" }
  ],
  connecticut: [
    { name: "Yale University", url: "https://www.yale.edu", type: "Private Ivy League Research University" },
    { name: "University of Connecticut (UConn)", url: "https://uconn.edu", type: "Public Flagship Research University" },
    { name: "Wesleyan University", url: "https://www.wesleyan.edu", type: "Private Liberal Arts University" },
    { name: "Trinity College", url: "https://www.trincoll.edu", type: "Private Liberal Arts College" },
    { name: "Quinnipiac University", url: "https://www.qu.edu", type: "Private Research University" },
    { name: "Connecticut State Colleges & Universities", url: "https://www.ct.edu", type: "Public Higher Education System" }
  ],
  delaware: [
    { name: "University of Delaware", url: "https://www.udel.edu", type: "Public Flagship Research University" },
    { name: "Delaware State University", url: "https://www.desu.edu", type: "Public HBCU Land-Grant University" },
    { name: "Wilmington University", url: "https://www.wilmu.edu", type: "Private Doctoral Research University" },
    { name: "Delaware Technical Community College", url: "https://www.dtcc.edu", type: "Public Community College System" },
    { name: "Goldey-Beacom College", url: "https://www.gbc.edu", type: "Private Business College" },
    { name: "Delaware College of Art and Design", url: "https://www.dcad.edu", type: "Private Art & Design Academy" }
  ],
  florida: [
    { name: "University of Florida (UF)", url: "https://www.ufl.edu", type: "Public Flagship Research University" },
    { name: "Florida State University (FSU)", url: "https://www.fsu.edu", type: "Public Research University" },
    { name: "University of Miami (UM)", url: "https://welcome.miami.edu", type: "Private Research University" },
    { name: "University of Central Florida (UCF)", url: "https://www.ucf.edu", type: "Public Metropolitan Research University" },
    { name: "University of South Florida (USF)", url: "https://www.usf.edu", type: "Public Research University" },
    { name: "Florida A&M University (FAMU)", url: "https://www.famu.edu", type: "Public HBCU University" },
    { name: "Florida College System", url: "https://www.fldoe.org/schools/higher-ed/fl-college-system/", type: "Statewide College Network" }
  ],
  georgia: [
    { name: "Georgia Institute of Technology (Georgia Tech)", url: "https://www.gatech.edu", type: "Public Engineering & Research Institute" },
    { name: "University of Georgia (UGA)", url: "https://www.uga.edu", type: "Public Flagship Research University" },
    { name: "Emory University", url: "https://www.emory.edu", type: "Private Research University & Health Center" },
    { name: "Morehouse College", url: "https://www.morehouse.edu", type: "Private Historic Men's HBCU College" },
    { name: "Spelman College", url: "https://www.spelman.edu", type: "Private Historic Women's HBCU College" },
    { name: "Georgia State University", url: "https://www.gsu.edu", type: "Public Urban Research University" },
    { name: "Technical College System of Georgia", url: "https://www.tcsg.edu", type: "State Technical College Network" }
  ],
  hawaii: [
    { name: "University of Hawaiʻi at Mānoa", url: "https://manoa.hawaii.edu", type: "Public Flagship Research University" },
    { name: "Hawaiʻi Pacific University", url: "https://www.hpu.edu", type: "Private University" },
    { name: "Chaminade University of Honolulu", url: "https://chaminade.edu", type: "Private Marianist University" },
    { name: "University of Hawaiʻi Hilo", url: "https://hilo.hawaii.edu", type: "Public Comprehensive University" },
    { name: "University of Hawaiʻi Community Colleges", url: "https://uhcc.hawaii.edu", type: "State Community College Network" }
  ],
  idaho: [
    { name: "University of Idaho", url: "https://www.uidaho.edu", type: "Public Flagship Land-Grant University" },
    { name: "Boise State University", url: "https://www.boisestate.edu", type: "Public Metropolitan Research University" },
    { name: "Idaho State University", url: "https://www.isu.edu", type: "Public Health Professions & Research University" },
    { name: "Brigham Young University–Idaho", url: "https://www.byui.edu", type: "Private University" },
    { name: "College of Western Idaho", url: "https://cwi.edu", type: "Public Community College" }
  ],
  illinois: [
    { name: "University of Illinois Urbana-Champaign", url: "https://illinois.edu", type: "Public Flagship Research University" },
    { name: "University of Chicago", url: "https://www.uchicago.edu", type: "Private Research University" },
    { name: "Northwestern University", url: "https://www.northwestern.edu", type: "Private Research University" },
    { name: "University of Illinois Chicago (UIC)", url: "https://www.uic.edu", type: "Public Urban Academic Health Center" },
    { name: "Loyola University Chicago", url: "https://www.luc.edu", type: "Private Jesuit University" },
    { name: "Illinois State University", url: "https://illinoisstate.edu", type: "Public University" },
    { name: "Illinois Community College Board", url: "https://www.iccb.org", type: "Statewide Community College System" }
  ],
  indiana: [
    { name: "Indiana University Bloomington", url: "https://www.indiana.edu", type: "Public Flagship Research University" },
    { name: "Purdue University", url: "https://www.purdue.edu", type: "Public Engineering & Science Research University" },
    { name: "University of Notre Dame", url: "https://www.nd.edu", type: "Private Catholic Research University" },
    { name: "Indiana University–Purdue University Indianapolis (IUPUI)", url: "https://www.iupui.edu", type: "Public Urban Health & Science Campus" },
    { name: "Ball State University", url: "https://www.bsu.edu", type: "Public Research University" },
    { name: "Ivy Tech Community College", url: "https://www.ivytech.edu", type: "Statewide Community College System" }
  ],
  iowa: [
    { name: "University of Iowa", url: "https://uiowa.edu", type: "Public Flagship Medical & Liberal Arts University" },
    { name: "Iowa State University", url: "https://www.iastate.edu", type: "Public Land-Grant Science & Agriculture University" },
    { name: "University of Northern Iowa", url: "https://uni.edu", type: "Public University" },
    { name: "Drake University", url: "https://www.drake.edu", type: "Private University" },
    { name: "Grinnell College", url: "https://www.grinnell.edu", type: "Private Liberal Arts College" }
  ],
  kansas: [
    { name: "University of Kansas (KU)", url: "https://www.ku.edu", type: "Public Flagship Research University" },
    { name: "Kansas State University (K-State)", url: "https://www.k-state.edu", type: "Public Land-Grant University" },
    { name: "Wichita State University", url: "https://www.wichita.edu", type: "Public Aviation & Industry University" },
    { name: "University of Kansas Medical Center", url: "https://www.kumc.edu", type: "Public Academic Health Center" },
    { name: "Washburn University", url: "https://www.washburn.edu", type: "Public Municipal University" }
  ],
  kentucky: [
    { name: "University of Kentucky (UK)", url: "https://www.uky.edu", type: "Public Flagship Land-Grant University" },
    { name: "University of Louisville (UofL)", url: "https://louisville.edu", type: "Public Metropolitan Research University" },
    { name: "Western Kentucky University", url: "https://www.wku.edu", type: "Public University" },
    { name: "Berea College", url: "https://www.berea.edu", type: "Private Tuition-Free Work College" },
    { name: "Kentucky Community & Technical College System", url: "https://kctcs.edu", type: "State Technical & Community Network" }
  ],
  louisiana: [
    { name: "Louisiana State University (LSU)", url: "https://www.lsu.edu", type: "Public Flagship Research University" },
    { name: "Tulane University", url: "https://tulane.edu", type: "Private Research University" },
    { name: "University of Louisiana at Lafayette", url: "https://louisiana.edu", type: "Public Research University" },
    { name: "Xavier University of Louisiana", url: "https://www.xula.edu", type: "Private Catholic HBCU University" },
    { name: "Southern University System", url: "https://www.sus.edu", type: "HBCU University System" },
    { name: "Louisiana Tech University", url: "https://www.latech.edu", type: "Public Technological University" }
  ],
  maine: [
    { name: "University of Maine", url: "https://umaine.edu", type: "Public Flagship Land and Sea-Grant University" },
    { name: "Bowdoin College", url: "https://www.bowdoin.edu", type: "Private Liberal Arts College" },
    { name: "Bates College", url: "https://www.bates.edu", type: "Private Liberal Arts College" },
    { name: "Colby College", url: "https://www.colby.edu", type: "Private Liberal Arts College" },
    { name: "University of New England", url: "https://www.une.edu", type: "Private Health Sciences University" },
    { name: "Maine Community College System", url: "https://www.mccs.me.edu", type: "State Community College Network" }
  ],
  maryland: [
    { name: "Johns Hopkins University", url: "https://www.jhu.edu", type: "Private Premier Medicine & Research University" },
    { name: "University of Maryland, College Park", url: "https://umd.edu", type: "Public Flagship Research University" },
    { name: "University of Maryland, Baltimore County (UMBC)", url: "https://umbc.edu", type: "Public Honors & STEM University" },
    { name: "United States Naval Academy", url: "https://www.usna.edu", type: "Federal Military Service Academy" },
    { name: "Morgan State University", url: "https://www.morgan.edu", type: "Public Urban HBCU Research University" },
    { name: "Towson University", url: "https://www.towson.edu", type: "Public Regional University" }
  ],
  massachusetts: [
    { name: "Harvard University", url: "https://www.harvard.edu", type: "Private Ivy League Research University" },
    { name: "Massachusetts Institute of Technology (MIT)", url: "https://www.mit.edu", type: "Private Technology & Science Research Institute" },
    { name: "University of Massachusetts Amherst (UMass)", url: "https://www.umass.edu", type: "Public Flagship Research University" },
    { name: "Boston University (BU)", url: "https://www.bu.edu", type: "Private Research University" },
    { name: "Northeastern University", url: "https://www.northeastern.edu", type: "Private Cooperative Education University" },
    { name: "Tufts University", url: "https://www.tufts.edu", type: "Private Research University" },
    { name: "Boston College (BC)", url: "https://www.bc.edu", type: "Private Jesuit University" },
    { name: "Amherst College", url: "https://www.amherst.edu", type: "Private Liberal Arts College" }
  ],
  michigan: [
    { name: "University of Michigan, Ann Arbor", url: "https://umich.edu", type: "Public Flagship Research University" },
    { name: "Michigan State University (MSU)", url: "https://msu.edu", type: "Public Land-Grant Research University" },
    { name: "Wayne State University", url: "https://wayne.edu", type: "Public Urban Research University" },
    { name: "Michigan Technological University", url: "https://www.mtu.edu", type: "Public STEM Research University" },
    { name: "Western Michigan University", url: "https://wmich.edu", type: "Public Research University" },
    { name: "Grand Valley State University", url: "https://www.gvsu.edu", type: "Public University" }
  ],
  minnesota: [
    { name: "University of Minnesota Twin Cities", url: "https://twin-cities.umn.edu", type: "Public Flagship Research University" },
    { name: "Carleton College", url: "https://www.carleton.edu", type: "Private Liberal Arts College" },
    { name: "Macalester College", url: "https://www.macalester.edu", type: "Private Liberal Arts College" },
    { name: "St. Olaf College", url: "https://wp.stolaf.edu", type: "Private Liberal Arts College" },
    { name: "University of St. Thomas", url: "https://www.stthomas.edu", type: "Private Catholic University" },
    { name: "Minnesota State Colleges & Universities", url: "https://www.minnstate.edu", type: "Statewide Higher Education System" }
  ],
  mississippi: [
    { name: "University of Mississippi (Ole Miss)", url: "https://olemiss.edu", type: "Public Flagship Research University" },
    { name: "Mississippi State University", url: "https://www.msstate.edu", type: "Public Land-Grant Research University" },
    { name: "University of Southern Mississippi", url: "https://www.usm.edu", type: "Public Ocean & Materials Research University" },
    { name: "Jackson State University", url: "https://www.jsums.edu", type: "Public Urban HBCU University" },
    { name: "Alcorn State University", url: "https://www.alcorn.edu", type: "Public Historic HBCU University" }
  ],
  missouri: [
    { name: "Washington University in St. Louis (WashU)", url: "https://wustl.edu", type: "Private Research University" },
    { name: "University of Missouri (Mizzou)", url: "https://missouri.edu", type: "Public Flagship Research University" },
    { name: "Saint Louis University (SLU)", url: "https://www.slu.edu", type: "Private Jesuit University" },
    { name: "Missouri University of Science and Technology (Missouri S&T)", url: "https://www.mst.edu", type: "Public STEM University" },
    { name: "University of Missouri–Kansas City (UMKC)", url: "https://www.umkc.edu", type: "Public Urban Health Campus" }
  ],
  montana: [
    { name: "Montana State University", url: "https://www.montana.edu", type: "Public Flagship Land-Grant University" },
    { name: "University of Montana", url: "https://www.umt.edu", type: "Public Flagship Research University" },
    { name: "Montana Technological University", url: "https://www.mtech.edu", type: "Public Engineering & Mining College" },
    { name: "Carroll College", url: "https://www.carroll.edu", type: "Private Catholic Diocesan College" }
  ],
  nebraska: [
    { name: "University of Nebraska–Lincoln", url: "https://www.unl.edu", type: "Public Flagship Land-Grant University" },
    { name: "Creighton University", url: "https://www.creighton.edu", type: "Private Jesuit University & Medical Center" },
    { name: "University of Nebraska Medical Center", url: "https://www.unmc.edu", type: "Public Academic Health Center" },
    { name: "University of Nebraska Omaha", url: "https://www.unomaha.edu", type: "Public Metropolitan University" }
  ],
  nevada: [
    { name: "University of Nevada, Reno (UNR)", url: "https://www.unr.edu", type: "Public Land-Grant Research University" },
    { name: "University of Nevada, Las Vegas (UNLV)", url: "https://www.unlv.edu", type: "Public Metropolitan Research University" },
    { name: "Nevada State University", url: "https://nevadastate.edu", type: "Public Comprehensive University" },
    { name: "College of Southern Nevada", url: "https://www.csn.edu", type: "Public Community College System" }
  ],
  newhampshire: [
    { name: "Dartmouth College", url: "https://home.dartmouth.edu", type: "Private Ivy League Research University" },
    { name: "University of New Hampshire (UNH)", url: "https://www.unh.edu", type: "Public Flagship Land, Sea, and Space-Grant" },
    { name: "Southern New Hampshire University (SNHU)", url: "https://www.snhu.edu", type: "Private University System" },
    { name: "Plymouth State University", url: "https://www.plymouth.edu", type: "Public Regional University" }
  ],
  newjersey: [
    { name: "Princeton University", url: "https://www.princeton.edu", type: "Private Ivy League Research University" },
    { name: "Rutgers University–New Brunswick", url: "https://www.rutgers.edu", type: "Public Flagship Research University" },
    { name: "Stevens Institute of Technology", url: "https://www.stevens.edu", type: "Private Technological University" },
    { name: "Seton Hall University", url: "https://www.shu.edu", type: "Private Catholic University" },
    { name: "NJIT (New Jersey Institute of Technology)", url: "https://www.njit.edu", type: "Public STEM Research University" }
  ],
  newmexico: [
    { name: "University of New Mexico (UNM)", url: "https://www.unm.edu", type: "Public Flagship Research University" },
    { name: "New Mexico State University (NMSU)", url: "https://nmsu.edu", type: "Public Land and Space-Grant University" },
    { name: "New Mexico Institute of Mining and Technology", url: "https://www.nmt.edu", type: "Public Science & Engineering University" },
    { name: "St. John's College Santa Fe", url: "https://www.sjc.edu", type: "Private Great Books Liberal Arts College" }
  ],
  newyork: [
    { name: "Columbia University", url: "https://www.columbia.edu", type: "Private Ivy League Research University" },
    { name: "Cornell University", url: "https://www.cornell.edu", type: "Private Ivy League Land-Grant University" },
    { name: "New York University (NYU)", url: "https://www.nyu.edu", type: "Private Global Research University" },
    { name: "Stony Brook University (SUNY)", url: "https://www.stonybrook.edu", type: "Public SUNY Flagship Center" },
    { name: "University at Buffalo (SUNY)", url: "https://www.buffalo.edu", type: "Public SUNY Flagship Campus" },
    { name: "Syracuse University", url: "https://www.syracuse.edu", type: "Private Research University" },
    { name: "University of Rochester", url: "https://www.rochester.edu", type: "Private Research University" },
    { name: "CUNY System (City University of New York)", url: "https://www.cuny.edu", type: "Public Municipal University System" }
  ],
  northcarolina: [
    { name: "University of North Carolina at Chapel Hill (UNC)", url: "https://www.unc.edu", type: "Public Flagship Research University" },
    { name: "Duke University", url: "https://duke.edu", type: "Private Premier Research University" },
    { name: "North Carolina State University (NC State)", url: "https://www.ncsu.edu", type: "Public Engineering & Science University" },
    { name: "Wake Forest University", url: "https://www.wfu.edu", type: "Private Collegiate University" },
    { name: "North Carolina A&T State University", url: "https://www.ncat.edu", type: "Public Largest HBCU Research University" },
    { name: "Davidson College", url: "https://www.davidson.edu", type: "Private Liberal Arts College" }
  ],
  northdakota: [
    { name: "University of North Dakota (UND)", url: "https://und.edu", type: "Public Flagship Aviation & Research University" },
    { name: "North Dakota State University (NDSU)", url: "https://www.ndsu.edu", type: "Public Land-Grant Research University" },
    { name: "Minot State University", url: "https://www.minotstateu.edu", type: "Public Regional University" },
    { name: "University of Mary", url: "https://www.umary.edu", type: "Private Benedictine Catholic University" }
  ],
  ohio: [
    { name: "Ohio State University (OSU)", url: "https://www.osu.edu", type: "Public Flagship Research University" },
    { name: "Case Western Reserve University", url: "https://case.edu", type: "Private Biomedical & STEM University" },
    { name: "University of Cincinnati", url: "https://www.uc.edu", type: "Public Cooperative Education University" },
    { name: "Miami University (Ohio)", url: "https://www.miamioh.edu", type: "Public Liberal Arts & Research University" },
    { name: "Oberlin College", url: "https://www.oberlin.edu", type: "Private Liberal Arts & Conservatory" },
    { name: "Ohio University", url: "https://www.ohio.edu", type: "Public Research University" }
  ],
  oklahoma: [
    { name: "University of Oklahoma (OU)", url: "https://www.ou.edu", type: "Public Flagship Research University" },
    { name: "Oklahoma State University (OSU)", url: "https://go.okstate.edu", type: "Public Land-Grant Research University" },
    { name: "University of Tulsa", url: "https://utulsa.edu", type: "Private Energy & Engineering University" },
    { name: "Oklahoma City University", url: "https://www.okcu.edu", type: "Private University" }
  ],
  oregon: [
    { name: "University of Oregon (UO)", url: "https://www.uoregon.edu", type: "Public Flagship Research University" },
    { name: "Oregon State University (OSU)", url: "https://oregonstate.edu", type: "Public Land, Sea, Space, and Sun-Grant Flagship" },
    { name: "Portland State University", url: "https://www.pdx.edu", type: "Public Urban Research University" },
    { name: "Oregon Health & Science University (OHSU)", url: "https://www.ohsu.edu", type: "Public Academic Health & Research Center" },
    { name: "Reed College", url: "https://www.reed.edu", type: "Private Liberal Arts College" }
  ],
  pennsylvania: [
    { name: "University of Pennsylvania (Penn)", url: "https://www.upenn.edu", type: "Private Ivy League Research University" },
    { name: "Carnegie Mellon University (CMU)", url: "https://www.cmu.edu", type: "Private AI, Computer Science & Arts University" },
    { name: "Pennsylvania State University (Penn State)", url: "https://www.psu.edu", type: "Public Flagship Research University" },
    { name: "University of Pittsburgh (Pitt)", url: "https://www.pitt.edu", type: "Public Health & Science Research University" },
    { name: "Temple University", url: "https://www.temple.edu", type: "Public Urban Research University" },
    { name: "Villanova University", url: "https://www1.villanova.edu", type: "Private Augustinian Catholic University" },
    { name: "Swarthmore College", url: "https://www.swarthmore.edu", type: "Private Liberal Arts College" }
  ],
  rhodeisland: [
    { name: "Brown University", url: "https://www.brown.edu", type: "Private Ivy League Research University" },
    { name: "University of Rhode Island (URI)", url: "https://www.uri.edu", type: "Public Flagship Land & Sea-Grant University" },
    { name: "Rhode Island School of Design (RISD)", url: "https://www.risd.edu", type: "Private Fine Arts & Design College" },
    { name: "Providence College", url: "https://www.providence.edu", type: "Private Dominican Liberal Arts College" },
    { name: "Bryant University", url: "https://www.bryant.edu", type: "Private Business University" }
  ],
  southcarolina: [
    { name: "University of South Carolina (UofSC)", url: "https://sc.edu", type: "Public Flagship Research University" },
    { name: "Clemson University", url: "https://www.clemson.edu", type: "Public Land-Grant Science & Engineering University" },
    { name: "Medical University of South Carolina (MUSC)", url: "https://web.musc.edu", type: "Public Academic Health Center" },
    { name: "College of Charleston", url: "https://www.coc.edu", type: "Public Liberal Arts University" },
    { name: "Furman University", url: "https://www.furman.edu", type: "Private Liberal Arts University" }
  ],
  southdakota: [
    { name: "University of South Dakota (USD)", url: "https://www.usd.edu", type: "Public Flagship Medical & Liberal Arts University" },
    { name: "South Dakota State University (SDSU)", url: "https://www.sdstate.edu", type: "Public Land-Grant Research University" },
    { name: "South Dakota School of Mines and Technology", url: "https://www.sdsmt.edu", type: "Public STEM & Engineering University" },
    { name: "Augustana University", url: "https://www.augie.edu", type: "Private Lutheran Liberal Arts University" }
  ],
  tennessee: [
    { name: "Vanderbilt University", url: "https://www.vanderbilt.edu", type: "Private Research University & Medical Center" },
    { name: "University of Tennessee, Knoxville (UT)", url: "https://www.utk.edu", type: "Public Flagship Land-Grant University" },
    { name: "University of Memphis", url: "https://www.memphis.edu", type: "Public Metropolitan Research University" },
    { name: "Fisk University", url: "https://www.fisk.edu", type: "Private Historic HBCU University" },
    { name: "Belmont University", url: "https://www.belmont.edu", type: "Private Christian Music & Arts University" },
    { name: "Tennessee State University", url: "https://www.tnstate.edu", type: "Public Land-Grant HBCU University" }
  ],
  texas: [
    { name: "University of Texas at Austin (UT Austin)", url: "https://www.utexas.edu", type: "Public Flagship Research University" },
    { name: "Texas A&M University", url: "https://www.tamu.edu", type: "Public Land, Sea, and Space-Grant Research University" },
    { name: "Rice University", url: "https://www.rice.edu", type: "Private Research University" },
    { name: "University of Houston", url: "https://www.uh.edu", type: "Public Metropolitan Research University" },
    { name: "Southern Methodist University (SMU)", url: "https://www.smu.edu", type: "Private University" },
    { name: "Texas Tech University", url: "https://www.ttu.edu", type: "Public Research University" },
    { name: "Baylor University", url: "https://www.baylor.edu", type: "Private Research University" },
    { name: "Texas Christian University (TCU)", url: "https://www.tcu.edu", type: "Private University" }
  ],
  utah: [
    { name: "University of Utah (U of U)", url: "https://www.utah.edu", type: "Public Flagship Health & Research University" },
    { name: "Brigham Young University (BYU)", url: "https://www.byu.edu", type: "Private Research University" },
    { name: "Utah State University", url: "https://www.usu.edu", type: "Public Land and Space-Grant University" },
    { name: "Utah Valley University", url: "https://www.uvu.edu", type: "Public Regional University" },
    { name: "Weber State University", url: "https://www.weber.edu", type: "Public University" }
  ],
  vermont: [
    { name: "University of Vermont (UVM)", url: "https://www.uvm.edu", type: "Public Flagship Land-Grant Research University" },
    { name: "Middlebury College", url: "https://www.middlebury.edu", type: "Private Liberal Arts College" },
    { name: "Norwich University", url: "https://www.norwich.edu", type: "Private Military College" },
    { name: "Saint Michael's College", url: "https://www.smcvt.edu", type: "Private Catholic Liberal Arts College" }
  ],
  virginia: [
    { name: "University of Virginia (UVA)", url: "https://www.virginia.edu", type: "Public Flagship Research University" },
    { name: "Virginia Tech", url: "https://www.vt.edu", type: "Public Engineering & Land-Grant University" },
    { name: "William & Mary", url: "https://www.wm.edu", type: "Public Historic Research University" },
    { name: "George Mason University (GMU)", url: "https://www.gmu.edu", type: "Public Research University" },
    { name: "Virginia Commonwealth University (VCU)", url: "https://www.vcu.edu", type: "Public Urban Academic Health Center" },
    { name: "Hampton University", url: "https://www.hamptonu.edu", type: "Private Historic HBCU University" }
  ],
  washington: [
    { name: "University of Washington (UW)", url: "https://www.washington.edu", type: "Public Flagship Medical & Research University" },
    { name: "Washington State University (WSU)", url: "https://wsu.edu", type: "Public Land-Grant Research University" },
    { name: "Gonzaga University", url: "https://www.gonzaga.edu", type: "Private Jesuit University" },
    { name: "Seattle University", url: "https://www.seattleu.edu", type: "Private University" },
    { name: "Western Washington University", url: "https://www.wwu.edu", type: "Public University" }
  ],
  westvirginia: [
    { name: "West Virginia University (WVU)", url: "https://www.wvu.edu", type: "Public Flagship Land-Grant Research University" },
    { name: "Marshall University", url: "https://www.marshall.edu", type: "Public Research University" },
    { name: "West Virginia Wesleyan College", url: "https://www.wvwc.edu", type: "Private Liberal Arts College" },
    { name: "Shepherd University", url: "https://www.shepherd.edu", type: "Public Regional University" }
  ],
  wisconsin: [
    { name: "University of Wisconsin–Madison", url: "https://www.wisc.edu", type: "Public Flagship Research University" },
    { name: "Marquette University", url: "https://www.marquette.edu", type: "Private Jesuit University" },
    { name: "University of Wisconsin–Milwaukee", url: "https://uwm.edu", type: "Public Urban Research University" },
    { name: "Lawrence University", url: "https://www.lawrence.edu", type: "Private Liberal Arts College & Conservatory" },
    { name: "Milwaukee School of Engineering (MSOE)", url: "https://www.msoe.edu", type: "Private Engineering University" }
  ],
  wyoming: [
    { name: "University of Wyoming", url: "https://www.uwyo.edu", type: "Public Flagship Land-Grant Research University" },
    { name: "Casper College", url: "https://www.caspercollege.edu", type: "Public Community College" },
    { name: "Laramie County Community College", url: "https://lccc.wy.edu", type: "Public Community College" },
    { name: "Sheridan College", url: "https://www.sheridan.edu", type: "Public Community College" }
  ]
};

export function getStateEducation(stateSlugOrName: string): EducationalInstitution[] {
  const normalized = (stateSlugOrName || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z]/g, '');

  if (US_STATE_EDUCATION[normalized]) {
    return US_STATE_EDUCATION[normalized];
  }

  // Fallback defaults with valid search links if not found
  const nameClean = stateSlugOrName ? stateSlugOrName.charAt(0).toUpperCase() + stateSlugOrName.slice(1) : "State";
  return [
    { name: `University of ${nameClean}`, url: `https://www.google.com/search?q=${encodeURIComponent("University of " + nameClean)}`, type: "Public Flagship University" },
    { name: `${nameClean} State University`, url: `https://www.google.com/search?q=${encodeURIComponent(nameClean + " State University")}`, type: "Public Research University" },
    { name: `${nameClean} Community College System`, url: `https://www.google.com/search?q=${encodeURIComponent(nameClean + " community colleges")}`, type: "Community & Vocational College Network" }
  ];
}
