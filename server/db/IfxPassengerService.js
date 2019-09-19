/*
When LVARCHAR is declared (with no size specification) as the data type of a column in a database table,
the default maximum size is 2 KB (2048 bytes), but you can specify an explicit maximum length of up to 32,739 bytes.

DROP TABLE passengers;

-- truncate table passengers;

CREATE TABLE passengers (
 id  SERIAL,  name char(20) PRIMARY KEY, img LVARCHAR(32739) );


INSERT INTO passengers (name, img) VALUES ('Nickname-1', 'testing img-1');
select * from passengers;

DELETE FROM passengers WHERE id > 2;

*/


var dbobj = require('ifxnjs');
var fs = require('fs');
var path = require('path');


class IfxPassengerService {
    // if you need block scope thn declare with 'let' or 'const' else 'var'
    constructor() {
        this.Conn = undefined;
        this.ConnErr = undefined;
        this.ConnStr = undefined;
    }

    LoadConnStr() {
        if (this.ConnStr == undefined) {
            try {
                // See the SampleConfig.json to create MyConfig.json
                var MyConfig = JSON.parse(fs.readFileSync(
                    path.join(__dirname, '../MyConfig.json'), 'utf8')); // do Synchronously read only

                // this.ConnStr = "SERVER=ids0;DATABASE=db1;HOST=192.168.56.5;SERVICE=5550;UID=informix;PWD=xxxxx;"
                this.ConnStr = MyConfig.AllConns.Conn1.ConnStr;

                console.log("Connection String used for connection to Informix Server is ");
                console.log(this.ConnStr);
                console.log();
            }
            catch (e) {
                this.ConnStr = undefined;
                console.log(e);
                return (false);
            }
        }
    }

    DbConnect() {
        if (this.Conn == undefined) {

            // Get the connection string
            if (this.ConnStr == undefined) {
                this.LoadConnStr()
            }

            try {
                // Open the connection
                this.Conn = dbobj.openSync(this.ConnStr);
            }
            catch (e) {
                this.Conn = undefined;
                console.log(e);
                return (false);
            }

            console.log("DbConnect: Success ");
        }
        else {
            console.log("DbConnect: Already opened ");
        }
        return (true);
    }

    DbClose() {
        if (this.Conn == undefined) {
            this.Conn = "closed";
            console.log("DbClose: ");
            this.Conn = undefined;
        }
    }



    ////////////////////////////////////////////////////////////////////
    GetReq(ReqBody) {
        this.DbConnect();
        var passengers = this.Conn.querySync("SELECT name FROM passengers");
        return (passengers);
    }

    GetIdReq(id) {
        this.DbConnect();
        var passenger = this.Conn.querySync("SELECT name FROM passengers WHERE id = " + id);
        return (passenger);
    }

    PostReq(id, ReqBody) {
        this.DbConnect();

        // console.log( ReqBody );
        var sql = `INSERT INTO passengers (name, img) VALUES ('${ReqBody.name}', '${ReqBody.img1}')`;

        var rc = this.DirExec(false, sql);
        console.log('img.len = ' + ReqBody.img1.length);
        return (rc);
    }

    ExecMLsp(id, ReqBody) {
        this.DbConnect();

        // console.log( ReqBody );
        var sql = `execute function sqlPhotoCompare ( 2019, '${ReqBody.name}', '${ReqBody.img1}')`;
        var CompareRes = this.Conn.querySync( sql );
        let FirstRec = CompareRes[0];
        let res = JSON.parse( FirstRec[Object.keys(FirstRec)[0]] );

        console.log( "CompareRes : " + JSON.stringify(res) );
        return (res);
    }


    DelReq(id) {
        this.DbConnect();
        var sql = `DELETE FROM passengers WHERE ( id= ${id} )`;
        if( id == 0 ) {
            sql = `DELETE FROM passengers WHERE ( id>1 )`;
        }
        var rc = this.DirExec(false, sql);
        return (rc);
    }

    DirExec(IgnErr, sql) {
        var rc = true;
        try {
            var result = this.Conn.querySync(sql);
            console.log(sql.substring(0, 50));
        }
        catch (e) {
            console.log("--- " + sql);
            if (IgnErr == false) {
                rc = false;
                console.log(e);
                console.log();
            }
        }
        return (rc);
    }



}

module.exports = new IfxPassengerService();


