const fs = require('fs');

fs.readdir('./', (err, files) => {
  if(err){
    console.error(err);
  }else{
    for(let i=0;i<files.length;i++){
      
    }
  }
})