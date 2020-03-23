const fs = require('fs');

fs.readdir('./', (err, files) => {
  if(err){
    console.error(err);
  }else{
    for(let i=0;i<files.length;i++){
      if(files[i].length>"country.json".length  && files[i].startsWith("country")){
        fs.unlink(files[i], (err) => {
          if(err){
            console.log('err', err)
          }
        })
      }
    }
  }
})

// const country7 = require('./country7.json');
// let len = Object.keys(country7).length;
// console.log('len', len);