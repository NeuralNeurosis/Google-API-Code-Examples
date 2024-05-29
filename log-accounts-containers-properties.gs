/////  addon 
function buildRows(sheet,hierarchy,numColumns) {
    var range = sheet.getRange(2,1,hierarchy.length,numColumns);
    range.setValues(hierarchy);
  }
      
  function buildHeaders(sheet, headers) {
    var range = sheet.getRange(1,1,1,headers.length);
    range.setValues([headers]);
    range
    .setFontSize(11)
    .setFontWeight('bold')
  }

      
  function buildHeadersGTM() {
   var headers = ['GTM Container Name', 'GTM Public Container ID','GTM Server Container ID','GTM Account Name', 'GTM Account ID','GTM Container Path'];
  
// Name of the sheet
  var sheetName = 'GTM Containers List';
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var range = sheet.getRange(1,1,1,headers.length);
    range.setValues([headers]);
    range
    .setFontSize(11)
    .setFontColor('white')
    .setBackground('#073763')
    .setFontWeight('bold')
  }


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

function findMeasurementId(containerPath){
    var workspacePaths = [];
  var workspaceList = TagManager.Accounts.Containers.Workspaces.list(
    	// 'accounts/6210782304/containers/173946663',
      // 'accounts/6210786712/containers/173954260',
      containerPath,
      {fields: 'workspace(path,workspaceId,name)'}
    ).workspace
    // Logger.log(workspaceList)

    workspaceList.forEach(function(workspace){
        // Utilities.sleep(5000);
        return "placeholder"
        var variableList = [];
      if(workspace.name.includes('Default')){
        // Logger.log(workspace.path)
      variableList = TagManager.Accounts.Containers.Workspaces.Variables.list(
          workspace.path
      ).variable
      // Logger.log(variableList);

      if(!variableList){
          Logger.log("Variables do not exist")
      //  SpreadsheetApp.getUi().alert("Variables do not exist");
          return "No GA4 Measurement ID Variable"
      }else{
          variableList.forEach(function(variables){
          // Utilities.sleep(1000);
             if(variables.name.includes('GA4 Measurement ID')){
                Logger.log(variables.parameter[0].value)
                // SpreadsheetApp.getUi().alert(variables.parameter[0].value);
                return variables.parameter[0].value
             }else{
                // SpreadsheetApp.getUi().alert("No GA4 Measurement ID set");
                return "No GA4 Measurement ID set."
      }
      })
      }
     }})
}


function getContainers(accounts) {
      var accountsAndContainers = [];
    // For each container insert into an array:
     // the name of the relevant account, its name and its public ID (GTM-XXXXX)
      accounts.forEach(function(account) {
        Utilities.sleep(3000);
        var containerList = listContainers(account.accountId);
        if (!containerList) {
          accountsAndContainers.push([account.accountId, account.name, '', '' ]);
          return accountsAndContainers;
        }
        containerList.forEach(function(container) {
              Utilities.sleep(5000);
          // var measurementId = findMeasurementId(container.path)
          accountsAndContainers.push([
            container.name,
            container.publicId,
            container.containerId,
            account.name,
            account.accountId,
            container.path
          ]);
        });
      });
      return accountsAndContainers;
}
    
function getGTMAccounts() {
  var accountsList = listGTMAccounts();
  return getContainers(accountsList);
}
    
    
function buildSheetGTM() {
// Definition of the Spreadsheet header row
  var headers = ['GTM Container Name', 'GTM Public Container ID','GTM Private Container ID', 'GTM Account Name', 'GTM Account ID','GTM Container Path'];
  
// Name of the sheet
  var sheetName = 'GTM Containers List';
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var hierarchy;
  
// If the Spreadsheet does not have a sheet with the name defined above, create one
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
  } else {
  sheet.getRange(2,1,sheet.getLastRow(), sheet.getLastColumn()).setValue("")
  }
  
// Adds the header defined in the 'headers' variable to the Spreadsheet
  // buildHeaders(sheet, headers);
  var range = sheet.getRange(1,1,1,headers.length);
    range.setValues([headers]);
    range
    .setFontSize(11)
    .setFontColor('white')
    .setBackground('#073763')
    .setFontWeight('bold')
  
// Retrieve, in the 'hierarchy' variable, the entire GTM container hierarchy
hierarchy = getGTMAccounts();
      
// Add the data retrieved for each container to the Spreadsheet
  buildRows(sheet, hierarchy, headers.length);
  buildRunHistory("List GTM Containers")

}


function listGA4Accounts() {
    return AnalyticsAdmin.Accounts.list({
        fields: 'accounts(name,displayName)'
      }).accounts;
}

function listProperties(accountId) {
    // API for retrieving the list of all properties based on the passed account ID
    var accountName = 'parent:'+accountId
     return AnalyticsAdmin.Properties.list({
       'filter': accountName,
       'fields': 'properties(name,displayName)'}
     ).properties;
}

function listPropertyStream(stream){
  // Logger.log(stream)
      var streamList = AnalyticsAdmin.Properties.DataStreams.list(
      //  webstream created in property below
      //  'properties/343538643'
      // webstream does not exist for the property below
      //  'properties/421012189',
      stream,
       {'fields' : 'dataStreams(webStreamData.measurementId)'}
     ).dataStreams;
     
    if(!streamList){
     Logger.log("No webstreams exist.")
     return "No webstreams exist"
    }else{
     Logger.log(streamList[0].webStreamData.measurementId)
     return streamList[0].webStreamData.measurementId
    }

    }
  

function getProperties(accountGA4) {
    var accountsAndProperties = [];
  // For each property insert into an array:
   // the name of the relevant account, its id and displayeName
    accountGA4.forEach(function(account) {
      Utilities.sleep(3000);
      var propertyList = listProperties(account.name);
      Logger.log("grabbing property list");
      if (!propertyList) {
        accountsAndProperties.push([accounts.accountId, accounts.name, '', '' ]);
        return accountsAndProperties;
      }
      propertyList.forEach(function(property) {
      var streamId = listPropertyStream(property.name);
      // Logger.log("grabbing property list" + streamId.name);
            Utilities.sleep(1000);    
        accountsAndProperties.push([
          property.displayName,
          property.name,
          account.displayName,
          account.name,
          // streamId.name,
          streamId
        ]);
      });
    });
    return accountsAndProperties;
}
 function getGA4Accounts() {
      var accountsList = listGA4Accounts();  var headers = ['GA4 Property Name', 'GA4 Property ID','GA4 Account Name', 'GA4 Account ID', 'GA4 MeasurementID' ];

      Logger.log("Accounts Grabbed")
      return getProperties(accountsList);
}

function buildSheetGA4() {
// Definition of the Spreadsheet header row
  var headers = ['GA4 Property Name', 'GA4 Property ID','GA4 Account Name', 'GA4 Account ID', 'GA4 MeasurementID' ];
  
// Name of the sheet
  var sheetName = 'GA4 Property List';
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var hierarchy;
      
// If the Spreadsheet does not have a sheet with the name defined above, create one
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
  } else {
  sheet.getRange(2,1,sheet.getLastRow(), sheet.getLastColumn()).setValue("")
  }



// Adds the header defined in the 'headers' variable to the Spreadsheet
// buildHeaders(sheet, headers);
// var range = sheet.getRange(1,1,1,headers.length);
//   range.setValues([headers]);
//   range
//   .setFontSize(11)
//   .setFontColor('white')
//   .setBackground('#b45f06')
//   .setFontWeight('bold')
  
// Retrieve, in the 'hierarchy' variable, the entire GA4 property hierarchy
  hierarchy = getGA4Accounts();
  
// Add the data retrieved for each container to the Spreadsheet
  buildRows(sheet, hierarchy, headers.length);
  buildRunHistory("List GA4 Properties")
}

function checkRow(workSheet){
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(workSheet);

  var value = sheet.getRange(1,1).getValue();
if (value=== ''){
  Logger.log("Value is empty "+ value);
}else if (value!= ''){
  Logger.log("Value is Not Empty "+ value);
}
}




function buildRunHistory(scriptRan){
var headers = ['User Email','Script Ran',Date];
var sheetName = 'Run History';
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
var userDeets = [];
var email = Session.getActiveUser().getEmail();
Logger.log(email)
var date = new Date()

sheet.appendRow([email,scriptRan, date])



}







function onOpen() {
// Create the custom menu in the Spreadsheet interface
  var menu = SpreadsheetApp.getUi().createAddonMenu();
  menu.addItem('List GTM Containers', 'buildSheetGTM');
  menu.addItem('List GA4 Properties', 'buildSheetGA4');
  // menu.addItem('Header GTM', 'buildHeadersGTM');
  menu.addToUi();
}
    
    
    
    
    