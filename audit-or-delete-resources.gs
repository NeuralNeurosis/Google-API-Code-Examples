var siteSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Required Fields For Automation")
var siteRange = siteSheet.getRange(2,1,28,15)

function deleteProperty(propertyId){
    var deleteProp = AnalyticsAdmin.Properties.remove(
     propertyId
    )
    Logger.log("Property Deleted: "+ deleteProp)
    return deleteProp
}

function deleteResources() {
  var sitesQuedforDeletion= [];
  var sitesSaved = [];
  siteRange.getValues().forEach(function(site){
   if(site[14]== "yes"){
   Logger.log("Property needs deleted for: "+ site[0] + " : Property ID: " + site[9])
   sitesQuedforDeletion.push(site[0]);
   var propertyIdFormatted = "properties/"+site[9];
  //  deleteProperty(propertyIdFormatted)
   Utilities.sleep(1000)
   }else if (site[14] == "no"){
   Logger.log("Do not Delete: "+ site[0] + " : Property ID: " + site[9])
   sitesSaved.push(site[0])
   }
  })
  Logger.log("To be deleted: "+sitesQuedforDeletion)
  Logger.log("To be saved: "+sitesSaved)
  Logger.log("Delete: " + sitesQuedforDeletion.length + " | Saved: "+ sitesSaved.length )


}

function audit(){
function listGTMAccounts() {
  // API for retrieving the list of all GTM accounts for the current user
    return TagManager.Accounts.list({
      fields: 'account(accountId,name)'
    }).account;
  }
  
function listContainers(accountId) {

   // API for retrieving the list of all containers based on the passed account ID
    return TagManager.Accounts.Containers.list(
      'accounts/' + accountId,
      {fields: 'container(path,name,containerId,publicId)'}
    ).container;
  }

// siteRange.getValues().forEach(function(site){


// })

}
