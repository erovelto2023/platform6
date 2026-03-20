import { NextResponse } from "next/server";
import { importArkansasHospitals, importCaliforniaHospitals, importColoradoHospitals, importConnecticutHospitals, importDelawareHospitals, importFloridaHospitals, importGeorgiaHospitals, importHawaiiHospitals, importIdahoHospitals, importIllinoisHospitals, importIndianaHospitals, importIowaHospitals, importKansasHospitals, importKentuckyHospitals, importLouisianaHospitals, importMaineHospitals, importMarylandHospitals, importMassachusettsHospitals, importMichiganHospitals, importMinnesotaHospitals, importMississippiHospitals } from "../../../lib/actions/import-hospital-data";

export async function POST(request: Request) {
    try {
        const { state, type } = await request.json();
        
        let result;
        if (state === 'arkansas') {
            result = await importArkansasHospitals();
        } else if (state === 'california') {
            result = await importCaliforniaHospitals();
        } else if (state === 'colorado') {
            result = await importColoradoHospitals();
        } else if (state === 'connecticut') {
            result = await importConnecticutHospitals();
        } else if (state === 'delaware') {
            result = await importDelawareHospitals();
        } else if (state === 'florida') {
            result = await importFloridaHospitals();
        } else if (state === 'georgia') {
            result = await importGeorgiaHospitals();
        } else if (state === 'hawaii') {
            result = await importHawaiiHospitals();
        } else if (state === 'idaho') {
            result = await importIdahoHospitals();
        } else if (state === 'illinois') {
            result = await importIllinoisHospitals();
        } else if (state === 'indiana') {
            result = await importIndianaHospitals();
        } else if (state === 'iowa') {
            result = await importIowaHospitals();
        } else if (state === 'kansas') {
            result = await importKansasHospitals();
        } else if (state === 'kentucky') {
            result = await importKentuckyHospitals();
        } else if (state === 'louisiana') {
            result = await importLouisianaHospitals();
        } else if (state === 'maine') {
            result = await importMaineHospitals();
        } else if (state === 'maryland') {
            result = await importMarylandHospitals();
        } else if (state === 'massachusetts') {
            result = await importMassachusettsHospitals();
        } else if (state === 'michigan') {
            result = await importMichiganHospitals();
        } else if (state === 'minnesota') {
            result = await importMinnesotaHospitals();
        } else if (state === 'mississippi') {
            result = await importMississippiHospitals();
        } else {
            return NextResponse.json({ 
                success: false, 
                error: "Invalid state. Only 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', and 'mississippi' are available" 
            }, { status: 400 });
        }
        
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error?.message || "Internal server error" 
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        message: "This API route is used to import hospital data. Send a POST request with { state: 'arkansas' }, { state: 'california' }, { state: 'colorado' }, { state: 'connecticut' }, { state: 'delaware' }, { state: 'florida' }, { state: 'georgia' }, { state: 'hawaii' }, { state: 'idaho' }, { state: 'illinois' }, { state: 'indiana' }, { state: 'iowa' }, { state: 'kansas' }, { state: 'kentucky' }, { state: 'louisiana' }, { state: 'maine' }, { state: 'maryland' }, { state: 'massachusetts' }, { state: 'michigan' }, { state: 'minnesota' }, or { state: 'mississippi' } to trigger the import.",
    });
}
