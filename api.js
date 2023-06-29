const { validateRoute, existPath, fileOrDirectory, readFile, extractLinks, validateLinks, getMarkdownFiles} = require('.');
const path = require('path');
const route = process.argv[2];

const mdLinks = (route, options = {validate: false}) => {
    return validateRoute(route) //validar si la ruta es absoluta
    .then((routeTransform)=> existPath(routeTransform))
    .then((routeTransform)=> fileOrDirectory(routeTransform))
    .then(({route,tipo})=>{
        if(tipo === 'archivo'){
            if(path.extname(route) === '.md'){
                return readFile(route)
                .then((content)=> extractLinks(content,route))
                .then((links)=> options.validate ? validateLinks(links) : Promise.resolve(links)
                );
            }else {
                throw new Error('No es archivo .md');
                 }
            
        }else if (tipo=== 'directorio'){
            return new Promise((resolve, reject)=>{
                getMarkdownFiles(route)
                .then((markdownFiles)=>{
                    const promises = markdownFiles.map((file)=>
                    readFile(file)
                    .then((content)=> extractLinks(content, route))
                    .then((links)=>
                    options.validate? validateLinks(links):Promise.resolve(links)
                    )
                    );
                    Promise.all(promises)
                    .then((result)=>{
                        const links = result.flat();
                        resolve(links);
                    })
                    .catch(reject);
                })
                .catch(reject);
            });
        }
    });
};

mdLinks(route,{validate: true}).then((result)=>{
    console.log(result);
  }).catch((error)=>{
      console.log(error);
     })

module.exports = {mdLinks};














    
  