User u = [select Id FROM User where Name='API User' LIMIT 1];
PermissionSet ps = [SELECT Id FROM PermissionSet WHERE Name='My_Custom_Object_Access' LIMIT 1];
PermissionSetAssignment psa = new PermissionSetAssignment(PermissionSetId = ps.Id, AssigneeId = u.Id);
insert psa;
