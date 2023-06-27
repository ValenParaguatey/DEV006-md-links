const { validateRoute, existPath, fileOrDirectory, readFile, extractLinks, validateLinks, getMarkdownFiles} = require('.');
const path = require('path');
const route = process.argv[2];

const mdLinks = (route, options = {validate: false}) => {
    return validateRoute(route) //validar si la ruta es absoluta
    .then((routeTransform)=> existPath(routeTransform))
    .then((routeTransform)=> fileOrDirectory(routeTransform))
    .then(({route,tipo})=>{
        if(tipo === 'archivo'){
            return readFile(route)
            .then((content)=> extractLinks(content,route))
            .then((links)=> options.validate ? validateLinks(links) : Promise.resolve(links)
            );
        }else if (tipo=== 'directorio'){
            return new Promise((resolve, reject)=>{
                const markdownFiles = getMarkdownFiles(route);
                const promises = markdownFiles.map((file)=>
                readFile(file)
                .then((content)=> extractLinks(content,file))
                .then((links)=> options.validate ? validateLinks(links) : Promise.resolve(links)
                )
                );
                Promise.all(promises)
                .then((results)=>{
                    const links = results.flat();
                    resolve(links);
                })
                .catch(reject);
            });
        }
    });
};


mdLinks(route,true).then((result)=>{
      console.log(result);
    }).catch((error)=>{
        console.log(error);
       })











// function mdLinks(route, options) {
//    return validateRoute(route)
//       .then(existPath)
//       .then(fileOrDirectory)
//       .then((resultado) => {
//         if (resultado.tipo === 'archivo') {
//           if (path.extname(route) === '.md') {
//             return readFile(resultado.route)
//               .then((content) => extractLinks(content)).then((links)=>{
//                   if (options && options.validate === 'true'){
//                     return validateLinks(links);
//                   }else {
//                     return links
//                   }
//               })
//               .catch((error) => {
//                 throw new Error(`Error al extraer los links: ${error}`);
//               });
//           } else {
//             throw new Error('No es archivo .md');
//           }
//         } else {
//           throw new Error('La ruta es un directorio');
//         }
//       });
//   };
  
//   mdLinks(route).then((result)=>{
//     console.log(result);
//   }).catch((error)=>{
//     console.log(error);
//   })
    
  