# Cordova SQlite storage helper
Helper tools for Cordova-sqlite-storage see: https://github.com/litehelpers/Cordova-sqlite-storage. 

This tool allows using SQLite storage for mobile devices or web browsers. Its mechanism automatically selects the way needed for open databases using cordova-sqlite-storage plugin or WebSQL implementation, depending on the platform.

## Installation
First, execute the default installation of Cordova-sqlite-storage plugin then add following scripts in your page:
```
<script type="text/javascript" src="js/DeviceInfo.js"></script>
<script type="text/javascript" src="js/SQLiteStorageHelper.js"></script>
```

## How to use (Methods)
* init(name, location)
```
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //Initialize after device is ready
        SQLiteStorageHelper.init("mydb.db", "default");
    }
```

Little trick checking a mobile device or web browser:
```
bindEvents: function ()
{
    if (DeviceInfo.isMobile) 
        document.addEventListener("deviceready", this.onDeviceReady, false);
     else 
        this.onDeviceReady(); //this is the browser
},
```

* getDb()
```
var db = SQLiteStorageHelper.getDb();
```

* onDbSuccess(msg)
```
SQLiteStorageHelper.onDbSuccess("executed");
```

*  onDbError(err)
```
SQLiteStorageHelper.onDbSuccess("error");
```

*  execute(sql, parameters, successCallBack, errorCallBack)
```
SQLiteStorageHelper.execute("SELECT name FROM sqlite_master WHERE type=? AND name NOT IN(?,?)", 
["table", "__WebKitDatabaseInfoTable__", "sqlite_sequence"],
function (tx, res) {
    for (var i = 0; i < res.rows.length; i++) 
        self.dropTable(res.rows[i].name);
});
```

*  executeTransaction(sql, parameters, successCallBack, errorCallBack)
```
SQLiteStorageHelper.execute("SELECT name FROM sqlite_master WHERE type=? AND name NOT IN(?,?)", 
["table", "__WebKitDatabaseInfoTable__", "sqlite_sequence"],
function (tx, res) {
    for (var i = 0; i < res.rows.length; i++) 
        self.dropTable(res.rows[i].name);
});
```

*  executeBatch(batch, successCallBack, errorCallBack)
```
SQLiteStorageHelper.executeBatch([Scripts1, Scripts1, ...]);
```

* getWhere(data)
```
var where = SQLiteStorageHelper.getWhere([{ col: "Col1", val: 1 }, { col: "Col2", val: 2 }, ...]);

Output Object
//values: Col1=? AND Col2=?
//parameters: [1, 2]
```

* select(obj)
```
SQLiteStorageHelper.insert({
    table: "MyTable",
    where: [{ col: "Col1", val: 1 }, { col: "Col2", val: 2 }, ...],
});
```

* update(obj)
```
SQLiteStorageHelper.insert({
    table: "MyTable",
    data: [{ col: "Col1", val: 1 }, { col: "Col2", val: 2 }, ...],
    where: [{ col: "Col1", val: 1 }, { col: "Col2", val: 2 }, ...],
});
```

* remove(obj)
```
SQLiteStorageHelper.remove({
    table: "MyTable",
    where: [{ col: "Col1", val: 1 }, { col: "Col2", val: 2 }, ...]
});
```

* insert(obj)
```
SQLiteStorageHelper.insert({
    table: "MyTable",
    data: [{ col: "Col1", val: 1 }, { col: "Col2", val: 2 }, ...]
});
```

* clearTable(table)
```
self.clearTable("myTable");
```

* dropTable(obj)
```
self.dropTable("myTable");
```

* clearDb()
```
 SQLiteStorageHelper.clearDb();
```

* dropDb()
```
 SQLiteStorageHelper.dropDb();
```

