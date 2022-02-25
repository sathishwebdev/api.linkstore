const { parser } = require('html-metadata-parser');

parser('https://www.youtube.com/watch?v=eSzNNYk7nVU').then(result=>{
   console.log(JSON.stringify(result, null, 3));
})

