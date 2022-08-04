const { exec } = require('child_process');
const { exit } = require('process');
const commit_note = process.argv[2];
const proc = exec(`npm run build && git add . && git commit -m '${commit_note}' && git push --force && firebase deploy`)
proc.on('spawn',()=>{setTimeout(()=>{exit(0)},30 *1000)})
proc.on('error', (error) => {
    console.log(error)
})