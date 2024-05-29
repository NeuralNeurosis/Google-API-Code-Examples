function userManagementGTM() {
  var daneEmail = "dane_nagy@example.com";
  var serviceEmail = "example@google.com";

var accountsGTM = TagManager.Accounts.list({
    fields:'account(accountId,name,path)'
  }).account
Logger.log(accountsGTM)

accountsGTM.forEach(function(account){
    Logger.log("Account: "+ account.name )

  if(account.name.includes("hvdsites")){

    Logger.log("Account includes hvdsites: "+ account.name )
 Utilities.sleep(5000);
    var containersGTM = TagManager.Accounts.Containers.list(
            account.path,
           {fields:'container(path,name,containerId,publicId)'}
          ).container

    var containerAccessList = []; 

    containersGTM.forEach(function(container){
        var conPerFormat ={
            "containerId":container.containerId,
            "permission":"publish"
            };
          containerAccessList.push(conPerFormat)
    })
 Logger.log(containerAccessList)
 Utilities.sleep(5000);
 
  var accountUser = TagManager.Accounts.User_permissions.create(
    { 
      "emailAddress": daneEmail,
      "accountAccess": {
          "permission": "admin"
      },
      "containerAccess":containerAccessList
    },
    account.path
  )
  Logger.log("User Created and permission granted for: "+ account.name )
  Logger.log( accountUser.accountAccess +"\n"+ accountUser.containerAccess )
  }
  })
Logger.log("Script Complete")
}

function userManagementGA() {

var accountsGA = AnalyticsAdmin.Accounts.list({
   fields: 'accounts(name,displayName)'
    }).accounts;
Logger.log(accountsGA)

accountsGA.forEach(function(account){
    Logger.log("Account: "+ account.name )
})
}

