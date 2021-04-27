import { expect, assert } from "chai";
import axios, { AxiosResponse } from 'axios'
import * as prep from "./testPreparation"
import { testConfig } from './testConfig'


const originalEntity = {
    "id": "urn:ngsi-ld:Municipality:07337059",
    "type": "https://uri.geonet-mrn.de/mrn/Municipality",

    "name": [
        {
            "type": "Property",
            "value": "Oberotterbach"
        }
    ],
    "https://uri.geonet-mrn.de/mrn/municipalityCode": [
        {
            "type": "Property",
            "value": "07337059"
        }
    ],

    "@context": [
        "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context-v1.3.jsonld",
        "https://uri.geonet-mrn.de/mrn/mrn-context.jsonld"
    ]
}



const appendAttributesFragment = {
    "id": "urn:ngsi-ld:Municipality:07337059",
    "type": "https://uri.geonet-mrn.de/mrn/Municipality",

    "appendedAttribute": [
        {
            "type": "Property",
            "value": "appendedValue"
        }
    ],

    "@context": [
        "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context-v1.3.jsonld",
        "https://uri.geonet-mrn.de/mrn/mrn-context.jsonld"
    ]
}


describe('POST entities/{entityId}/attrs/', function () {

    before(async () => {
        await prep.deleteAllEntities()

        return new Promise<void>((resolve, reject) => {
            resolve()
        })
    })


    after(async () => {
        await prep.deleteAllEntities()

        return new Promise<void>((resolve, reject) => {
            resolve()
        })
    })





    it("should append the attributes provided in the uploaded NGSI-LD fragment to the entity specified by the URL path", async function () {

        const config = {
            headers: {
                "content-type": "application/ld+json"
            },
            auth: testConfig.auth
        }

        const entityUrl = testConfig.base_url + "entities/" + originalEntity.id



        //###################### BEGIN Step 1 ######################
        let createEntityResponse = await axios.post(testConfig.base_url + "entities/", originalEntity, config).catch((e) => {
            console.log(e)
        }) as AxiosResponse

        expect(createEntityResponse.status).equals(201)
        //###################### END Step 1 ######################



        //###################### BEGIN Step 2 ######################
        let appendAttributesResponse = await axios.post(entityUrl + /attrs/, appendAttributesFragment, config).catch((e) => {
            console.log(e)
        }) as AxiosResponse

        console.log(appendAttributesResponse.status)

        // TODO: 1 Why 204? When should we expect 207?
        expect(appendAttributesResponse.status).equals(204)
        //###################### END Step 2 ######################



        //###################### BEGIN Step 3 ######################

        const getModifiedEntityResponse = await axios.get(entityUrl)
    
        expect(getModifiedEntityResponse.status).equals(200)

        const modifiedEntity = getModifiedEntityResponse.data

        expect(modifiedEntity['appendedAttribute']).instanceOf(Object)
        //###################### END Step 3 ######################
    })
});