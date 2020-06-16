# Issues
- `express-basic-auth` replace `express.basicAuth`
- `/lib/api.js:6` callback for `authorizer` must be return `true` or `false`, which was fixed by changing the returned value `User.authenticate` to T/F instead of `new User` or `false`
- `/lib/entry.js:72` must guaranntee the results displayed in current page do not include `undefined`, otherwise would encounter exception: `can not read the property of 'undefined' object`

# futher works
- add `edit/delete` functions
- add `personal home page` module