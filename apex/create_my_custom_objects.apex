final List<Account> accounts = [SELECT Id FROM Account];
final List<My_Custom_Object__c> objs = new List<My_Custom_Object__c>();
for (Account a : accounts) {
    final Double num = Math.floor(Math.random() * 10) + 1;
    for (Integer i=0; i<num; i++) {
        String randomValue = EncodingUtil.base64Encode(Crypto.generateAesKey(256));
        My_Custom_Object__c m = new My_Custom_Object__c();
        m.Account__c = a.Id;
        m.RandomValue__c = randomValue;
        objs.add(m);
    }
}
INSERT objs;