var SQLiteStorageHelper = (function ()
{
    var dbName = "";
    var dbLocation = "";

    var self;
    var db;

    var instanceDb = function ()
    {
        var instance;
        if (DeviceInfo.isMobile) {
            instance = window.sqlitePlugin.openDatabase({ name: dbName, location: dbLocation, androidLockWorkaround: 1 },
                self.onDbSuccess("Opening DB"),
                self.onDbError);
        } else {
            instance = window.openDatabase(dbName, "1.0", dbName, (2 * 1024 * 1024));
            if (instance) self.onDbSuccess("Opening DB");
            else self.onDbError({ message: "Can not create database WebSql" });
        }
        return instance;
    };

    return {
        init: function (name, location)
        {
            self = this;
            dbName = name || dbName;
            dbLocation = location || "default";
            db = instanceDb();
        },

        getDb: function () { return db; },

        onDbSuccess: function (msg)
        {
            msg = msg || "statement executed";
            console.log("*Success: " + msg);
            //alert("*Success: " + msg);
        },

        onDbError: function (err)
        {
            var msg = err.message || err;
            console.log("*Error: " + msg);
            //alert("*Error: " + msg);
        },

        execute: function (sql, parameters, successCallBack, errorCallBack)
        {
            if (!DeviceInfo.isMobile) {
                self.executeTransaction(sql, parameters, successCallBack, errorCallBack);
                return;
            }

            errorCallBack = errorCallBack || self.onDbError;

            successCallBack = successCallBack || function (tx, res)
            {
                self.onDbSuccess("sql: " + sql + ", params: [" + (parameters || "") + "]," + " rows selected: " + res.rows.length);
            };

            parameters = parameters || [];
            self.getDb().executeSql(sql, parameters, successCallBack, errorCallBack);
        },

        executeTransaction: function (sql, parameters, successCallBack, errorCallBack)
        {
            errorCallBack = errorCallBack || self.onDbError;

            successCallBack = successCallBack || function (tx, res)
            {
                self.onDbSuccess("sql: " + sql + ", params: [" + (parameters || "") + "]," + " rows selected: " + res.rows.length);
            };

            self.getDb().transaction(function (tx)
            {
                parameters = parameters || [];
                tx.executeSql(sql, parameters, successCallBack, errorCallBack);
            }, self.onDbError);
        },

        executeBatch: function (batch, successCallBack, error)
        {
            successCallBack = successCallBack || function () { self.onDbSuccess("batch executed [" + batch + "]"); };
            error = error || self.onDbError;

            if (!DeviceInfo.isMobile) {
                for (var i = 0; i < batch.length; i++) {
                    self.execute(batch[i]);
                }
                successCallBack();
                return;
            }

            self.getDb().sqlBatch(batch, successCallBack, error);
        },

        getWhere: function (data)
        {
            var where = { values: "", parameters: [] };

            if (data && data.length > 0) {
                for (var ii = 0; ii < data.length; ii++) {
                    where.values = data[ii].col + "=? AND";
                    where.parameters.push(data[ii].val);
                }
                where.values = where.values.substring(0, where.values.length - 4);
            }

            return where;
        },

        select: function (obj)
        {
            if (!obj) return;

            var where = self.getWhere(obj.where);
            var sql = "SELECT * FROM " + obj.table + (where.values.length > 0 ? " WHERE " + where.values : "");

            self.execute(sql, where.parameters, obj.success, obj.error);
        },

        update: function (obj)
        {
            if (!obj) return;

            if (obj.data.length === 0) {
                self.onDbError({ message: "error inserting" });
                return;
            }

            var values = "";
            var parameters = [];

            for (var i = 0; i < obj.data.length; i++) {
                values = obj.data[i].col + "=?,";
                parameters.push(obj.data[i].val);
            }
            values = values.substring(0, values.length - 1);

            var where = self.getWhere(obj.where);
            parameters = parameters.concat(where.parameters);

            var sql = "UPDATE " + obj.table + " SET " + values + (where.values.length > 0 ? " WHERE " + where.values : "");
            self.execute(sql, parameters);
        },

        remove: function (obj)
        {
            var where = self.getWhere(obj.where);
            var sql = "DELETE FROM " + obj.table + (where.values.length > 0 ? " WHERE " + where.values : "");
            return self.execute(sql, where.parameters);
        },

        insert: function (obj)
        {
            if (!obj) return;

            var columns = "";
            var values = "";
            var array = [];

            if (obj.data.length === 0) {
                self.onDbError({ message: "error inserting" });
                return;
            }

            for (var i = 0; i < obj.data.length; i++) {
                columns = obj.data[i].col + ",";
                values = "?,";
                array.push(obj.data[i].val);
            }

            columns = columns.substring(0, columns.length - 1);
            values = values.substring(0, values.length - 1);

            var sql = "INSERT INTO " + obj.table + "(" + columns + ") VALUES(" + values + ")";
            self.execute(sql, array);
        },

        clearTable: function (table)
        {
            self.remove({ table: "sqlite_sequence", where: [{ col: "name", val: table }] });
            self.remove({ table: table });
        },

        dropTable: function (table)
        {
            self.remove({ table: "sqlite_sequence", where: [{ col: "name", val: table }] });
            self.execute("DROP TABLE " + table, []);
        },

        clearDb: function ()
        {
            var array = ["table", "__WebKitDatabaseInfoTable__", "sqlite_sequence"];
            self.execute("SELECT name FROM sqlite_master WHERE type=? AND name NOT IN(?,?)",
                array,
                function (tx, res)
                {
                    for (var i = 0; i < res.rows.length; i++) {
                        self.clearTable(res.rows[i].name);
                    }
                });
        },

        dropDb: function ()
        {
            var array = ["table", "__WebKitDatabaseInfoTable__", "sqlite_sequence"];

            self.execute("SELECT name FROM sqlite_master WHERE type=? AND name NOT IN(?,?)",
                array,
                function (tx, res)
                {
                    for (var i = 0; i < res.rows.length; i++) {
                        self.dropTable(res.rows[i].name);
                    }
                });
        }
    }
})();
