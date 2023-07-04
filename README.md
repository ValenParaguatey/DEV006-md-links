# Markdown Links

## Índice

* [1. Descripción del Proyecto](#1-descripción-del-proyecto)
* [2. Modo de uso](#2-modo-de-uso)
* [3. Estado del Proyecto](#3-estado-del-proyecto)
* [4. Planificación del Proyecto](#4-planificación-del-proyecto)
* [5. Consideraciones generales](#5-consideraciones-generales)
* [6. Objetivos de aprendizaje](#6-objetivos-de-aprendizaje)
* [7.Herramientas](#7-herramientas)

***

## 1. Descripción del Proyecto
md-Links consiste en la creación de una librería en JavaScript. Se construyó un programa ejecutándolo con la herramienta Node.js el cual permite leer archivos markdown y poder extraer los links para su validación. También se puede leer archivos que tengan extención .md dentro de un directorio. 
El proyecto está constituido por 7 pequeñas funciones las cuáles permiten: 
* Validar si una ruta es abosoluta o relativa, y en caso de ser relativa convertirla. 
* Verificar que la ruta exista.
* Comprobar si es un archivo o es un directorio.
* Poder leer el archivo con extensión .md. 
* Luego de leerlo, poder extraer los links del archivo.
* Otra función para recorrer un directorio y poder leer los archivos con extensión .md dentro de el. 
* Validar los links extraidos, utilizando la herramienta axios.

Luego de la creación de estas funciones, se construye la función principal md-Links que recibe 2 parámetros: la ruta que se va a evaluar, y un objeto con únicamente la propiedad validate, que determina si el usuario desea validar los links encontrados.

La función md-links debe retornar una promesa que se resuelve con un arreglo de objetos, donde cada objeto representa un link con la propiedades: href, text, file. Y se agrega la propiedad status cuando se deseen validar.

## 2. Modo de uso


## 3. Estado del proyecto
Actualmente el proyecto se encuentra con el funcionamiento completo para el ingreso de una ruta de archivo o directorio; poder retornar las propiedades establecidas de los links dentro de un archivo .md, las cuales son:
# con validate: false
* href: la URL encontrada.
* text: texto que aparece dentro del link.
* file: Ruta del archivo donde se encontró el link.
# con validate: true
* href: la URL encontrada.
* text: texto que aparece dentro del link.
* file: Ruta del archivo donde se encontró el link.
* status: código de respuesta a la petición HTTP.
* ok: mensaje en caso de éxito 'ok' y 'fail' en caso de fallo.

## 4. Planificación del proyecto
Para la organización de este proyecto utilicé la herramienta Trello, donde pude separar las actividades pendientes por Sprint. Enlistar las tareas pendientes, las que se econtraban en proceso de ejecución y las completadas.

* [Enlace directo a la herramienta de planificación](https://trello.com/b/fT7FgfpV/proyecto-md-links)

## 5. Consideraciones generales
* El proyecto se realizó de manera individual.
* El proyecto se encuentra desplegado en npm.
* El tiempo de entrega del proyecto fue de 3 semanas.

## 6. Objetivos de aprendizaje
 [ ✔️] **SÍ**     [ ❌]**NO**     

### JavaScript

- [ ✔️] **Diferenciar entre tipos de datos primitivos y no primitivos**
- [ ✔️] **Arrays (arreglos)**
- [ ✔️] **Objetos (key, value)**
- [ ✔️] **Variables (declaración, asignación, ámbito)**
- [ ✔️] **Uso de condicionales (if-else, lógica booleana)**
- [ ✔️] **Funciones (params, args, return)**
- [ ✔️] **Pruebas unitarias (unit tests)**
- [ ✔️] **Módulos de ECMAScript (ES Modules)**
- [ ✔️] **Uso de linter (ESLINT)**
- [ ✔️] **Uso de identificadores descriptivos (Nomenclatura y Semántica)**
- [ ✔️] **Uso de bucles/ciclos (while, for, for..of)**
- [ ✔️] **Pruebas asíncronas**
- [ ✔️] **Módulos de CommonJS**
- [ ❌] **Pruebas de compatibilidad en múltiples entornos de ejecución**
- [ ✔️] **Diferenciar entre expresiones (expressions) y sentencias (statements)**
- [ ✔️] **Callbacks**
- [ ✔️] **Promesas**

### CONTROL DE VERSIONES DE Git Y GitHub

- [ ✔️] **Git: Instalación y configuración**
- [ ✔️] **Git: Control de versiones con git (init, clone, add, commit, status, push, pull, remote)**
- [ ✔️] **Git: Integración de cambios entre ramas (branch, checkout, fetch, merge, reset, rebase, tag)**
- [ ✔️] **GitHub: Creación de cuenta y repos, configuración de llaves SSH**
- [ ✔️] **GitHub: Colaboración en Github (branches | forks | pull requests | code review | tags)**
- [ ❌] **GitHub: Organización en Github (projects | issues | labels | milestones | releases)**

### NODE.JS
- [ ✔️] **Instalar y usar módulos con npm**
- [ ✔️] **Configuaración de package.json**
- [ ✔️] **Configuaración de npm-scripts**
- [ ✔️] **process (env,argv,stdin-sdout-stderr,exit-code)**
- [ ✔️] **File system(fs, path)**

### HTTP
- [ ✔️] **Consulta o petición (request) y respuesta (response)**
- [ ✔️] **Códigos de status de HTTP**

