const fs = require('fs');
const {lstatSync} = require('fs');
const path = require('path');
const yargs = require('yargs');
const inquirer = require('inquirer');

var executionDir = process.cwd();

const args = yargs
    .positional('p', {
        describe: 'search_string',
        default: '',
    }).argv;

class Choice {
  constructor(path, fileName) {
      this.path = path;
      this.fileName = fileName;
  }
  get isDir() {
    return lstatSync(this.path).isDirectory();
}
}

const walk = async () => {
const list = fs.readdirSync(executionDir);
const items = list.map(fileName =>
  new Choice(path.resolve(executionDir, fileName), fileName));

const questions = [
    {
        name: 'Choice',
        type: 'list', 
        message: 'What do You want open?',
        choices: items.map(item => ({ name: item.fileName, value: item })),
},
];

  const item =  await inquirer.prompt(questions)
    .then(answer => answer.Choice);

    if (item.isDir) {
      executionDir = item.path;
        return  await walk();
    } else {
      const data = fs.readFile(item.path, 'utf-8', (err, data) => {
        if (err) console.log(err);
        if (args.p) {
          const regExp = new RegExp(args.p, 'igm');
          console.log(data.match(regExp));
      }
         else console.log(data);
    });
    }
  }

  walk();