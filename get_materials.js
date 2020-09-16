const axios = require('axios');
const { compare } = require('bcrypt');
const cheerio = require('cheerio');

const my_url = 'https://recipe.rakuten.co.jp/recipe/1940022585/'

get_materials = (url)  => (new Promise((resolve, reject) =>
    axios(url)
        .then(res => {
            console.log("success");
            var names = [];
            var amounts = [];
            let $ = cheerio.load(res.data);
            $('.name')
                .each(function (i, e) {
                    let name = $(e).text();
                    names.push(name);
                });
            $('.amount')
                .each(function (i, e) {
                    let amount = $(e).text();
                    amounts.push(amount);
                });
            var materials = [];
            for (let i = 0; i < names.length; ++i) {
                materials.push({
                    "name": names[i],
                    "amount": amounts[i]
                });
            }
            // console.log({ "materials": materials });
            resolve ({ "materials": materials });
        })
        .catch(err => {
            console.log(err);
            reject (err);
        })
));


// test
get_materials(my_url)
    .then(res => {
        console.log("get_materials successfully work!");
        console.log(res);
    })
    .catch(err => {
        console.log("get_materials DO NOT work!");
        console.log(err);
    });




