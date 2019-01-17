//********************************************************************************************************
//Script 		checkPBWRightOfWayConflicts
//
//Record Types:	Public Works Right of Way Management scripting
//
//Event: 		usually Fired at ACA and in PageFlow for these record types 
//
//Desc:			Find all open ROW records with conflicting work dates on same streets 
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//            Date        Name			Modification
//            01-16-2019  Chad			Created
//            01-16-2019  Chad                  Added in publicUser logic
//********************************************************************************************************
function checkPBWRightOfWayConflicts () {
// get the ASIT and attach GIS objectds based on their values!
	var tpbwRowAddresses;
	
	if (!publicUser) {
		var searchWorkStart = AInfo["Work Start Date"];
		var searchWorkEnd = AInfo["Work End Date"]
		tpbwRowAddresses = loadASITable4ACA("PBW_ROWADDRESS",cap);
	}
	else if ( publicUser && (typeof controlString == "undefined")) {
		var acaAinfo = new Array();
//		loadAppSpecific4ACA(acaAinfo, capId);
		loadAppSpecific4ACA(acaAinfo);
		var searchWorkStart = acaAinfo["Work Start Date"];
		var searchWorkEnd = acaAinfo["Work End Date"]
//		loadASITables4ACA(capId);
//		loadASITables4ACA();
		loadASITablesBefore();
		if (typeof(PBWROWADDRESS) == "object") {
			tpbwRowAddresses = PBWROWADDRESS;
		}
		else return false;
	}
	else return false;
	
	overLapRecs = [];
	
	if (tpbwRowAddresses && tpbwRowAddresses.length > 0) {
		for ( asitRow in tpbwRowAddresses ) {
			var asitStreetName = tpbwRowAddresses[asitRow]["Street Name"].toString().toUpperCase();
			var asitStreetStartCheck = tpbwRowAddresses[asitRow]["Start #"].toString().toUpperCase();
			var asitStreetEndCheck = tpbwRowAddresses[asitRow]["End #"].toString().toUpperCase();

			var thisRowRecList = getROWOverlapStreetRecords( searchWorkStart, searchWorkEnd, asitStreetName, asitStreetStartCheck, asitStreetEndCheck );

			overLapRecs = overLapRecs.concat(thisRowRecList);
		}
	}
	else { 
		logDebug("no PBW_ROWADDRESS table information exists on this record:"+capId);
	}

	var unqOverLapRecs = uniqArray(overLapRecs);
	if (unqOverLapRecs.length > 0) {
		var checkMsg = "<Font Color=RED>WARNING THERE ARE POTENTIALLY "+unqOverLapRecs.length+" OTHER PROJECTS THAT WILL CONFLICT WITH THIS WORK!"
						+"<br>OTHER project ids are:<br>     "+unqOverLapRecs.join("<br>     ")+"</Font Color>";
		comment(checkMsg);
	}
}
