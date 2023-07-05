const fs = require('fs');
const { default: axios } = require('axios');
const path = require('path');
const assert = require('assert');
const {
  validateRoute, existPath, fileOrDirectory, readFile, extractLinks, validateLinks, getMarkdownFiles
} = require('../index')
const {mdLinks} = require('../api');

describe('validateRoute function', ()=>{
  test('La función debería retornar la ruta si es absoluta', ()=>{
    const route = '/home/user/files';
    return validateRoute(route).then((result)=>{
      expect(result).toBe(route);
    });
  });
test('debería retornar la ruta transformada a absoluta si es una relativa',()=>{
  const route = '../files';
  const expectRoute = path.resolve(route);
  return validateRoute(route).then((result)=>{
    expect(result).toBe(expectRoute);
  });
});

});
//TEST PARA VERIFICAR SI LA RUTA EXISTE
describe('existPath function',()=>{
  test('La función debería resolverse con la ruta si esta existe', ()=>{
    const route = 'C:/dev006-md-links/DEV006-md-links/pruebas/prueba1.md'
    // fs.writeFileSync(route,'test');
    return existPath(route).then((result)=>{
      expect(result).toBe(route);
      // fs.unlinkSync(route);
    });
  });
  test('La función se devuelve con un mensaje de error si la ruta no existe',()=>{
    const route = './documentoInexistente.txt';
    return existPath(route).catch((error)=>{
      expect(error).toBe('No existe la ruta');
    });
  });
});

//TEST PARA VERIFICAR SI ES UN ARCHIVO O DIRECTORIO
describe('fileOrDirectory function',()=>{
 describe('isFile()', ()=>{
  test('debe retornar true si el archivo existe',()=>{
    return fileOrDirectory(__filename).then((result)=>{
      assert.strictEqual(result.tipo, 'archivo');
    });
  });
  test('Debe retornar un mensaje de error si el archivo no existe',()=>{
    return fileOrDirectory('non-existent-file').catch((error)=>{
      assert.strictEqual(error, 'Error al verificar el tipo de archivo');
    });
  });
 });
 describe('isDirectory()', ()=>{
  test('Debe retornar true si el directorio existe ',()=>{
    return fileOrDirectory(__dirname).then((result)=>{
      assert.strictEqual(result.tipo, 'directorio');
    });
  });
  test('Deberia retornar un mensaje de error si el directorio no existe', ()=>{
    return fileOrDirectory('non-existent-directory').catch((error)=>{
      assert.strictEqual(error, 'Error al verificar el tipo de archivo');
    });
  });
 });
});

//TEST PARA LEER ARCHIVO
describe('readFile()', ()=>{
test('Debería resolverse con el contenido del archivo cuando el archivo exista',(done)=>{
const route = './rutaArchivo.md';
const fileContent = 'archivo de prueba';
//Se crea un archivo temporal con contenido
fs.writeFileSync(route,fileContent);
readFile(route).then((result)=>{
  expect(result).toBe(fileContent);
  done();
})
.catch((err)=>{
  done.fail(err);
})
.finally(()=>{
  //Se elimina el archivo creado temporalmente
  fs.unlinkSync(route);
});
});
test('Debería retornar un mensaje de error cuando el archivo no existe',(done)=>{
const route = './rutaArchivoInexistente.md';
readFile(route).then(()=>{
  done.fail('Expected readFile to reject');
})
.catch((err)=>{
  expect(err).toBe('Error al leer archivo');
  done();
});
});
});

//TEST FUNCIÓN PARA EXTRAER LOS LINKS
describe('extractLinks',()=>{
  test('Debería extraer los links de un archivo markdown',()=>{
    const content=`
    link 1 
https://scene.zeplin.io/project/644fe2890586d025f6fdee45

![HU-3](https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%203.png?raw=true)
![HU-4](https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%204.png?raw=true)
![HU-5](https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%205.png?raw=true)
    
    `;
    const route = 'pruebas/prueba1.md';
    const expected = [
  {href: 'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%203.png?raw=true', text: 'HU-3', file: 'pruebas/prueba1.md'},
  {href:'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%204.png?raw=true', text: 'HU-4', file:'pruebas/prueba1.md' },
  {href: 'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%205.png?raw=true', text: 'HU-5', file:'pruebas/prueba1.md'}
  ];
  const pruebaActual = extractLinks(content,route);
  expect(pruebaActual).toEqual(expected);
  });
  test('Debería retornar un array vacío cuando no haya links en el contenido',()=>{
    const content = `
    archivo sin links.
    `;
    const route = 'pruebas/prueba3.md';
    const expected = [];

    const pruebaActual = extractLinks(content, route);
    expect(pruebaActual).toEqual(expected);
  });
});
//TEST FUNCIÓN PARA VALIDAR LINKS
describe('validateLinks function', ()=>{
  test('debería devolver una matriz de objetos de enlaces con las propiedades de validación',()=>{
    const links = [
      {href:'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%203.png?raw=true', text: 'HU-3', file: 'pruebas/prueba1.md'},
      {href:'https://invalid.com', text: 'Invalid', file: 'invalid.md'},
    ];
    //Mock axios.get para retornar respuestas falsas
    axios.get = jest.fn((url)=>{
      return Promise.resolve({
        status: url === 'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%203.png?raw=true' ? 200 : 404,

      });
    })
    return validateLinks(links).then((result)=>{
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('href','https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%203.png?raw=true');
      expect(result[0]).toHaveProperty('text', 'HU-3');
      expect(result[0]).toHaveProperty('file', 'pruebas/prueba1.md');
      expect(result[0]).toHaveProperty('status', 200);
      expect(result[0]).toHaveProperty('ok','ok');

      expect(result[1]).toHaveProperty('href','https://invalid.com');
      expect(result[1]).toHaveProperty('text', 'Invalid');
      expect(result[1]).toHaveProperty('file', 'invalid.md');
      expect(result[1]).toHaveProperty('status', 404);
      expect(result[1]).toHaveProperty('ok','fail');

    })
  })
})

//TEST PARA MDLINKS
describe('mdLinks function',()=>{
  test('Debería retornar un arreglo de objeto con los enlaces encontrados en un archivo .md con las propiedades sin validar',()=>{
    return mdLinks('C:/dev006-md-links/DEV006-md-links/pruebas/prueba1.md',{validate: false}).then((links)=>{
      assert.deepStrictEqual(links, 
        [
        {href:'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%203.png?raw=true', text: 'HU-3', file: 'C:/dev006-md-links/DEV006-md-links/pruebas/prueba1.md'},
        {href: 'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%204.png?raw=true', text: 'HU-4', file: 'C:/dev006-md-links/DEV006-md-links/pruebas/prueba1.md'},
        {href: 'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%205.png?raw=true', text: 'HU-5', file:'C:/dev006-md-links/DEV006-md-links/pruebas/prueba1.md'},
        ]);
    });
  });
  test('Debería retornar un mensaje de error si el archivo no es markdown',()=>{
    const expectedMessage = 'No es archivo .md';
    return mdLinks('C:/dev006-md-links/DEV006-md-links/pruebas/prueba3.js',{validate: false}).catch((error)=>{
      expect(error.message).toEqual(expectedMessage)
    });
  });
 test('Debería retornar un arreglo de objetos con los enlaces encontrados en archivos con extensión .md dentro de un directorio',()=>{
  const route = 'C:/dev006-md-links/DEV006-md-links/pruebas';
  const expectedResult = [
    {href:'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%203.png?raw=true', text: 'HU-3', file: 'C:/dev006-md-links/DEV006-md-links/pruebas'},
    {href: 'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%204.png?raw=true', text: 'HU-4', file: 'C:/dev006-md-links/DEV006-md-links/pruebas'},
    {href: 'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%205.png?raw=true', text: 'HU-5', file:'C:/dev006-md-links/DEV006-md-links/pruebas'},
    {href:'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/portada.png?raw=true', text: 'PORTADA', file: 'C:/dev006-md-links/DEV006-md-links/pruebas'},
    {href:'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%201.png?raw=true', text: 'HU-1', file:'C:/dev006-md-links/DEV006-md-links/pruebas'},
    {href: 'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%202.png?raw=true', text: 'HU-2', file:'C:/dev006-md-links/DEV006-md-links/pruebas'},
  ];
  return mdLinks(route, {validate:false}).then((links)=>{
    expect(links).toEqual(expect.arrayContaining(expectedResult))
  });
 });
 test('Debería retornar un arreglo de objeto con los enlaces encontrados en un archivo .md y la propiedad status para validar',()=>{
  return mdLinks('C:/dev006-md-links/DEV006-md-links/pruebas/prueba1.md',{validate: true}).then((links)=>{
   assert.deepStrictEqual(links,
    [
    {href:'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%203.png?raw=true', text: 'HU-3', file: 'C:/dev006-md-links/DEV006-md-links/pruebas/prueba1.md', status:200, ok:'ok'},
    {href: 'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%204.png?raw=true', text: 'HU-4', file: 'C:/dev006-md-links/DEV006-md-links/pruebas/prueba1.md', status:404, ok:'fail'},
    {href: 'https://github.com/ValenParaguatey/DEV006-social-network/blob/main/src/assets/readme/HU%205.png?raw=true', text: 'HU-5', file:'C:/dev006-md-links/DEV006-md-links/pruebas/prueba1.md', status:404, ok:'fail'},
    ]);
  })
 })
});