const { json } = require('express');
const express = require('express');
const simpleGit = require("simple-git");
const git = simpleGit();
const path = require('path');
const dotenv = require('dotenv');

const app = express();

app.set('view engine', 'hbs'); 
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); 
dotenv.config({path: '.env'});

app.get('/', async (req, res) => {
    try {
        const repo = await git.remote();
        if (repo)
        {
            await git.pull('origin', 'master', {'--rebase': null});
        }
        else {
            await git.init().addRemote('origin', process.env.SERVER_PATH);
        }
        await git.checkout('master');
        const log = await git.log();
        const status = await git.status();
        console.log(log, status);
        // const commit_id = JSON.stringify(log.latest.hash);
        // const author_name = JSON.stringify(log.latest.author_name);
        // const date = JSON.stringify(log.latest.date);
        // const message = JSON.stringify(log.latest.message);
        // const author_name = JSON.stringify(log.latest.author_name);
        const mapp = log.all.map(x => 
            `<tr><td>${JSON.stringify(x.hash)}</td><td>${JSON.stringify(x.date)}</td><td>${JSON.stringify(x.message)}</td><td>${JSON.stringify(x.author_name)}</td></tr>`
        );
        // console.log(mapp);
        const maa = JSON.stringify(mapp);
        const ff = `<div class="content">
                    <h1>myproj repository</h1>
                    <h4>copy: ${process.env.SERVER_PATH}</h4>
                    <table>
                    <tr><th>Commit Id</th><th>Date</th><th>message</th><th>Commited by</th></tr>
                    ${maa}
                    </table> 
                    </div>`
        res.send(ff);
        
    } catch (error) {
        console.log(error);
    }
})
app.listen(5040, () => {console.log("server started...")});