import * as rawSharingData from "./dummyData/datasharing.json";
import * as BMWjurisdictionData from "./dummyData/jurisdictionsBMW.json";
import * as IKEAjurisdictionData from "./dummyData/jurisdictionsIKEA.json";

export default function makeExampleData() {
    let exampleCompanies = [];

    let companyNames = [
        {
            name: "BMW",
            featured: true,
        },
        {
            name: "IKEA",
            featured: true,
        },
        {
            name: "PayPal",
            featured: true,
        },
        {
            name: "Microsoft",
            featured: false,
        },
        {
            name: "Apple",
            featured: false,
        },
        {
            name: "Bayer",
            featured: true,
        },
        {
            name: "Audi",
            featured: false,
        },
        {
            name: "VW",
            featured: true,
        },
        {
            name: "Mercedes",
            featured: false,
        },
        {
            name: "Henkel",
            featured: false,
        },
    ];

    // Methods
    const getCompanyDataSharing = (companyName) => {
        let companyData = [];

        rawSharingData.default.forEach((e) => {
            if (e[companyName] != "")
                companyData.push({
                    dataType: e["Data Type"],
                    value: e[companyName],
                });
        });
        return companyData;
    };

    /*
    const getJurisdictionValues = (jurisdictionData) => {
        let treeData = { name: "World", children: [] };
        jurisdictionData.forEach((e) => {
            let jCodeObj = treeData.children.find(
                (obj) => obj.name === e["Jurisdiction Code"]
            );
            if (jCodeObj !== undefined) {
                jCodeObj.value++;
            } else {
                treeData.children.push({
                    name: e["Jurisdiction Code"],
                    value: 1,
                    category: e["Jurisdiction Code"],
                });
            }
        });
        return treeData;
    };
    */

    // {name : world, children : [{jurisdictionCode : <code>, countries : [{countryCode : <code>, value : <value>},{},...]},..]}
    const getCountryValues = (jurisdictionData) => {
        let treeData = { name: "World", children: [] };
        jurisdictionData.default.forEach((e) => {
            let jCodeObj = treeData.children.find(
                (obj) => obj.name === e["Jurisdiction Code"]
            );
            if (jCodeObj !== undefined) {
                let cCodeObj = jCodeObj.children.find(
                    (obj) => obj.name === e["Country abbreviation"]
                );
                if (cCodeObj !== undefined) cCodeObj.value++;
                else
                    jCodeObj.children.push({
                        name: e["Country abbreviation"],
                        value: 1,
                        category: e["Jurisdiction Code"],
                    });
            } else {
                treeData.children.push({
                    name: e["Jurisdiction Code"],
                    children: [
                        {
                            name: e["Country abbreviation"],
                            value: 1,
                            category: e["Jurisdiction Code"],
                        },
                    ],
                });
            }
        });
        return treeData;
    };

    companyNames.forEach((company) => {
        exampleCompanies.push({
            name: company.name,
            featured: company.featured,
            location: {},
            structure: {},
            yearlyProfits: [],
            dataTypesShared: [],
            dataTypePackages: [],
            dataSharingPurposes: [],
            sharedWithCompanies: [],
        });
    });

    exampleCompanies[0].location = { city: "Munich", countryID: 1 };
    exampleCompanies[1].location = { city: "Delft", countryID: 2 };

    exampleCompanies[0].yearlyProfits = [
        {
            year: 2018,
            profits: [80, 90, 110, 90, 70, 70, 50, 30, 50, 40, 80, 110],
        },
        {
            year: 2019,
            profits: [110, 130, 100, 30, 30, 60, 50, 80, 100, 100, 110, 140],
        },
    ];
    exampleCompanies[1].yearlyProfits = [
        {
            year: 2018,
            profits: [80, 90, 110, 90, 70, 70, 50, 30, 50, 40, 80, 110],
        },
        {
            year: 2019,
            profits: [110, 130, 100, 30, 30, 60, 50, 80, 100, 120, 110, 140],
        },
    ];

    exampleCompanies[0].dataSharingPurposes = [
        { purpose: "purpose1", value: 677 },
        { purpose: "purpose2", value: 32 },
        { purpose: "purpose3", value: 9 },
        { purpose: "purpose4", value: 2 },
        { purpose: "purpose5", value: 2 },
        { purpose: "purpose6", value: 1 },
    ];

    exampleCompanies[1].dataSharingPurposes = [
        { purpose: "purpose1", value: 450 },
        { purpose: "purpose2", value: 230 },
        { purpose: "purpose3", value: 65 },
        { purpose: "purpose4", value: 23 },
        { purpose: "purpose5", value: 11 },
        { purpose: "purpose6", value: 1 },
    ];

    exampleCompanies[0].jurisdictions = getCountryValues(BMWjurisdictionData);
    exampleCompanies[1].jurisdictions = getCountryValues(IKEAjurisdictionData);

    exampleCompanies[0].dataTypesShared = getCompanyDataSharing("BMW**");
    exampleCompanies[1].dataTypesShared = getCompanyDataSharing("IKEA");

    exampleCompanies[0].sharedWithCompanies = BMWjurisdictionData.default;
    exampleCompanies[1].sharedWithCompanies = IKEAjurisdictionData.default;

    return exampleCompanies;
}
