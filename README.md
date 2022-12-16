# salesforce-clientcredentials-demo
Example of using the, with Winter 23, new `client_credentials` OAuth flow. The org created and credentials created can then be used with the new GraphQL API.

## Configure Initial Org ##
```
mkdir -p ./force-app/main/default/connectedApps
rm ./force-app/main/default/connectedApps/*.xml 2> /dev/null

sfdx force:org:create --setdefaultusername -f config/project-scratch-def.json
sfdx force:data:record:update -s User -w "Name='User User'" -v "LanguageLocaleKey=en_US TimeZoneSidKey=Europe/Paris LocaleSidKey=da UserPreferencesUserDebugModePref=true UserPreferencesApexPagesDeveloperMode=true UserPermissionsInteractionUser=true UserPermissionsKnowledgeUser=true UserRoleId=$ROLE_ID" 
ORG_ID=`sfdx force:org:display --json | jq ".result.id" -r`
INSTANCE_URL=`sfdx force:org:display --json | jq ".result.instanceUrl" -r`

CLIENT_ID=demo_clientid_`echo $ORG_ID`_`date +%s`
CLIENT_SECRET=demo_clientsecret_`echo $ORG_ID`_`date +%s`
cat ./metadataTemplates/connectedApps/Demo.connectedApp-meta.xml \
    | sed "s|REPLACE_CLIENT_ID|$CLIENT_ID|" \
    | sed "s|REPLACE_CLIENT_SECRET|$CLIENT_SECRET|" \
    > force-app/main/default/connectedApps/Demo.connectedApp-meta.xml
sfdx force:source:deploy -m ConnectedApp,PermissionSet,CustomObject
sfdx force:apex:execute -f apex/create_api_only_user.apex
sfdx force:data:tree:import -p data/Account-Contact-plan.json
sfdx force:apex:execute -f apex/create_my_custom_objects.apex

rm ./.env
echo "SALESFORCE_CLIENT_ID=$CLIENT_ID" > ./.env
echo "SALESFORCE_CLIENT_SECRET=$CLIENT_SECRET" >> ./.env
echo "SALESFORCE_LOGIN_URL=$INSTANCE_URL" >> ./.env
```

## Allow My Custom Object Access to API User ##
```
sfdx force:apex:execute -f apex/assign_mycustomobject_access.apex
```
