# how work
- `POST` interact (CURD) with the database, `GET` display HTML content
-  every `POST` or `GET` route must include `exports.show()` to refresh the HTML content
-  `exports.parseReceivedData(req, callback)` parse the submitted content to specific formats so as to be dealt with `[callback]`
-  `exports.show` query records according to values of records, mainly `archived=?` to return corresponding data used in HTML page 
-  work flow: `submit form`-->`parse form data`-->`update database`-->`display HTML page`

# issues
- `database` must be created before running server
-  run `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'` on MySQL benckwork to solve `Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server;`

# NOTES
- learn how to construct HTML pages in HTTP repsonse
- learn how to display database contents in HTML pages
- learn how to connect HTML actions (request routes) with database CURD operations