const fs = require('fs');
const path = require('path');
const https = require('https');
const { default: axios } = require('axios');

const route = process.argv[2];

const validateRoute= (route) => {
  return new Promise((resolve, reject)=>{
    if(path.isAbsolute(route)){
      resolve(route);
    }else {
      const routeTransform = path.resolve(route);
      resolve(routeTransform);
    }
  });
};

const existPath = (route)=> {
  return new Promise((resolve, reject)=>{
    if(fs.existsSync(route)){
      resolve(route);
    }else{
      reject('No existe la ruta')
    };
  });
};

const fileOrDirectory= (route)=> {
  return new Promise((resolve, reject)=>{
    fs.stat(route,(err,stats)=>{
      if(err){
        reject('Error al verificar el tipo de archivo')
      }else{
        if(stats.isFile()){
            resolve({route, tipo: 'archivo'});
        }else if(stats.isDirectory()){
          resolve({route, tipo: 'directorio'});
        }else{
          reject('Ruta inválida')
        };
      };
    });
  });
};

const readFile= (route)=> {
  return new Promise((resolve,reject)=>{
    fs.readFile(route,'utf-8',(err,data)=>{
      if(err){
        reject('Error al leer archivo');
      }else{
        resolve(data)
      }
    });
  });
};

const extractLinks= (content, route)=> {
const linkPattern = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;
const links = [];
let match;

while ((match = linkPattern.exec(content,route)) !== null) {
  links.push({
    href: match[2],
    text: match[1],
    file: route
  });
}

return links;
}

 const validateLinks= (links)=>{
  const promises = links.map((link)=>{
    return axios
    .get(link.href)
    .then((response)=>{
      if(response.status >= 200 && response.status < 300){
        return {
          href: link.href,
          text: link.text,
          file: link.file,
          status: response.status,
          ok: 'ok',
        };
      }else{
        return {
          href: link.href,
          text: link.text,
          file: link.file,
          status: response.status,
          ok: 'fail',
        };
      };
    });
  });
  return Promise.all(promises)
 }

 const getMarkdownFiles = (dir) => {
  const files = fs.readdirSync(dir);
  const markdownFiles = files.filter((file)=> path.extname(file)=== '.md');
  return markdownFiles.map((file)=> path.join(dir,file));
 };



module.exports={
  validateRoute, existPath, fileOrDirectory, readFile, extractLinks, validateLinks, getMarkdownFiles
}


