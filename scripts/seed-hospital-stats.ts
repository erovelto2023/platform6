/**
 * seed-hospital-stats.ts
 * 
 * seeds hospital summary statistics provided by the user from:
 * https://www.ahd.com/state_statistics.html
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { STATE_NAME_TO_ABBR } from "../lib/utils/state-mapping";

dotenv.config({ path: ".env.local" });

const RAW_DATA = `
AK - Alaska	11	1,301	49,782	269,333	$8,714,765
AL - Alabama	81	14,069	540,088	2,856,108	$87,578,169
AR - Arkansas	50	7,543	318,274	1,422,079	$38,085,995
AS - American Samoa	1	131	4,607	28,024	$68,160
AZ - Arizona	84	13,961	652,651	3,020,245	$120,870,314
CA - California	332	75,123	3,169,287	15,750,779	$778,481,876
CO - Colorado	60	8,840	411,826	1,946,086	$116,788,571
CT - Connecticut	33	8,266	346,436	1,841,032	$55,867,845
DC - Washington D.C.	7	2,072	79,626	568,551	$17,756,656
DE - Delaware	8	2,147	100,098	561,279	$13,041,368
FL - Florida	225	57,450	2,779,843	13,007,793	$576,142,869
GA - Georgia	110	22,695	971,071	5,350,259	$186,240,963
GU - Guam	3	351	13,678	93,291	$811,754
HI - Hawaii	14	2,493	95,429	585,816	$14,247,619
IA - Iowa	37	5,936	254,772	1,224,195	$35,720,769
ID - Idaho	18	2,650	129,016	541,254	$22,488,775
IL - Illinois	133	26,797	1,237,002	5,710,877	$208,246,539
IN - Indiana	101	15,080	659,426	3,212,074	$119,657,115
KS - Kansas	54	6,269	266,628	1,242,367	$55,665,865
KY - Kentucky	73	12,647	578,930	2,604,540	$94,218,691
LA - Louisiana	109	14,149	493,362	2,435,123	$86,442,823
MA - Massachusetts	69	15,121	698,482	3,755,325	$87,920,276
MD - Maryland	49	10,232	481,764	2,831,989	$23,394,847
ME - Maine	16	2,779	97,012	603,441	$17,782,991
MI - Michigan	101	21,359	963,841	4,690,267	$138,268,597
MN - Minnesota	54	10,271	470,213	2,327,889	$65,868,345
MO - Missouri	78	16,508	804,583	3,426,943	$111,430,634
MP - Northern Mariana Islands	1	74	3,458	14,732	$0
MS - Mississippi	65	8,904	277,866	1,451,165	$44,061,970
MT - Montana	14	2,082	80,466	389,066	$11,228,443
NC - North Carolina	111	23,547	1,066,291	5,726,517	$164,084,365
ND - North Dakota	9	1,786	74,189	374,277	$11,912,036
NE - Nebraska	28	4,299	174,218	886,998	$20,631,968
NH - New Hampshire	14	2,400	111,241	554,670	$23,341,258
NJ - New Jersey	75	19,823	877,258	4,500,933	$187,120,501
NM - New Mexico	33	3,761	170,135	812,445	$25,964,348
NV - Nevada	32	6,391	320,641	1,597,507	$81,425,747
NY - New York	179	55,232	2,130,687	12,349,324	$403,188,198
OH - Ohio	143	26,954	1,257,043	5,930,435	$221,808,477
OK - Oklahoma	89	9,708	407,792	1,927,676	$75,696,490
OR - Oregon	35	6,376	318,499	1,549,809	$45,704,982
PA - Pennsylvania	176	33,633	1,424,877	7,285,181	$315,190,098
PR - Puerto Rico	54	7,318	292,547	1,677,416	$5,675,706
RI - Rhode Island	11	2,422	98,555	506,924	$13,180,843
SC - South Carolina	67	11,409	536,588	2,607,314	$97,711,900
SD - South Dakota	22	2,701	93,070	428,507	$18,341,461
TN - Tennessee	96	18,332	820,188	4,163,916	$134,423,028
TX - Texas	371	60,057	2,849,978	13,924,318	$586,870,131
UT - Utah	37	4,906	229,436	976,999	$36,347,940
VA - Virginia	87	16,708	748,225	3,695,529	$132,133,722
VI - Virgin Islands	2	203	4,263	29,836	$292,222
VT - Vermont	7	463	37,661	214,410	$7,561,912
WA - Washington	60	10,752	544,209	2,799,679	$102,253,553
WI - Wisconsin	84	10,565	472,664	2,307,764	$89,121,762
WV - West Virginia	35	5,404	207,261	1,087,397	$33,051,028
WY - Wyoming	13	1,201	29,164	108,717	$3,956,585
`;

async function seed() {
    const MONGO_URI = process.env.MONGODB_URI;
    if (!MONGO_URI) {
        console.error("MONGODB_URI not set");
        process.exit(1);
    }

    const LocationSchema = new mongoose.Schema({
        name: String,
        slug: String,
        type: String,
        hospitalStats: {
            count: Number,
            staffedBeds: Number,
            totalDischarges: Number,
            patientDays: Number,
            grossRevenue: String,
        }
    });

    const Location = mongoose.models.Location || mongoose.model("Location", LocationSchema);

    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const slugify = (text: string) =>
        text.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    const lines = RAW_DATA.trim().split("\n");
    for (const line of lines) {
        const parts = line.split("\t");
        if (parts.length < 6) continue;

        const stateWithAbbr = parts[0].trim(); // "AK - Alaska"
        const count = parseInt(parts[1].replace(/,/g, ""));
        const beds = parseInt(parts[2].replace(/,/g, ""));
        const discharges = parseInt(parts[3].replace(/,/g, ""));
        const days = parseInt(parts[4].replace(/,/g, ""));
        const revenue = parts[5].trim();

        const stateName = stateWithAbbr.split(" - ")[1];
        if (!stateName) continue;

        const slug = slugify(stateName);
        console.log(`Updating ${stateName} (${slug})...`);

        await Location.updateOne(
            { slug, type: "state" },
            {
                $set: {
                    hospitalStats: {
                        count,
                        staffedBeds: beds,
                        totalDischarges: discharges,
                        patientDays: days,
                        grossRevenue: revenue
                    }
                }
            }
        );
    }

    console.log("Seed completed");
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
