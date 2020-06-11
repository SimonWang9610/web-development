const fs = require('fs');
const path = require('path');

let args = process.argv.splice(2);
console.log(args);

let command = args.shift();
let taskDescription = args.join(' ');
console.log(taskDescription);

let file = path.join(process.cwd(), '/.tasks');

switch(command) {
    case 'list':
        console.log('list');
        break;
    case 'add':
        console.log('add');
        break;
    default:
        console.log('uaseg: ' + process.argv[0] + ' list|add [taskDescription] ');
}

