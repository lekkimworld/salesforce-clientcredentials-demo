# salesforce-clientcredentials-demo
Example of using the, with Winter 23, new `client_credentials` OAuth flow. The org created and credentials created can then be used with the new GraphQL API.

## Configure Initial Org ##
```
mkdir -p ./force-app/main/default/connectedApps
rm ./force-app/main/default/connectedApps/*.xml 2> /dev/null

sfdx force:org:create --setdefaultusername -f config/project-scratch-def.json
sfdx force:source:deploy -m PermissionSet,CustomObject,Role
ROLE_ID=`sfdx force:data:soql:query -q "select Id from UserRole where Name='Dummy'" --json | jq ".result.records[0].Id" -r`
sfdx force:data:record:update -s User -w "Name='User User'" -v "LanguageLocaleKey=en_US TimeZoneSidKey=Europe/Paris LocaleSidKey=da UserPreferencesUserDebugModePref=true UserPreferencesApexPagesDeveloperMode=true UserPermissionsInteractionUser=true UserPermissionsKnowledgeUser=true UserRoleId=$ROLE_ID" 
ORG_ID=`sfdx force:org:display --json | jq ".result.id" -r`
INSTANCE_URL=`sfdx force:org:display --json | jq ".result.instanceUrl" -r`

CLIENT_ID=demo_clientid_`echo $ORG_ID`_`date +%s`
CLIENT_SECRET=demo_clientsecret_`echo $ORG_ID`_`date +%s`
cat ./metadataTemplates/connectedApps/Demo.connectedApp-meta.xml \
    | sed "s|REPLACE_CLIENT_ID|$CLIENT_ID|" \
    | sed "s|REPLACE_CLIENT_SECRET|$CLIENT_SECRET|" \
    > force-app/main/default/connectedApps/Demo.connectedApp-meta.xml
sfdx force:source:deploy -m ConnectedApp
sfdx force:apex:execute -f apex/create_api_only_user.apex
sfdx force:data:tree:import -p data/Account-Contact-plan.json
sfdx force:user:permset:assign -n My_Custom_Object_Access
sfdx force:apex:execute -f apex/create_my_custom_objects.apex

rm ./.env
echo "SALESFORCE_CLIENT_ID=$CLIENT_ID" > ./.env
echo "SALESFORCE_CLIENT_SECRET=$CLIENT_SECRET" >> ./.env
echo "SALESFORCE_LOGIN_URL=$INSTANCE_URL" >> ./.env
```

## Allow My Custom Object Access to API User ##
If/when the API User needs access to the `My_Custom_Object__c` records you need to assign a permisission set but since `sfdx` cannot assign permission sets to others than a user you've authorized we do it with Apex.
```
sfdx force:apex:execute -f apex/assign_mycustomobject_access.apex
```
