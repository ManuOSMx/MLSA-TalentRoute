# MLSA-TalentRoute
- Page: [MLSA-TalentRoute](https://manuos.codes/MLSA-TalentRoute)
- Proyecto Final: [MAPA](https://victorious-beach-080a92d0f.1.azurestaticapps.net/)

## Requisitos
- Azure: [Suscripción en Microsoft Azure](https://azure.microsoft.com/en-us/free/students) IMPORTANTE: Si eres estudiante, no coloques ninguna tarjeta de credito o débito.
- Sistema de Control de Versiones: [Instalar Git](https://git-scm.com/downloads)
- Editor de Texto: [Visual Studio Code](https://code.visualstudio.com/)

## Instrucciones

### Clonar el proyecto
Principalmente tienes que tener una cuenta en GitHub, si aún no la tienes, crea una en: [GitHub](https://github.com)

Para el clonado del proyecto, sigue los pasos:
1. En tu computadora, busca una carpeta vacía que será donde se encontrará el proyecto.
2. Abre la terminal de tu computadora en la ubicación de la carpeta vacía.
3. Coloca en la terminal:
```powershell
git clone https://github.com/ManuOSMx/MLSA-TalentRoute.git
```

### Crear Mapa en Azure
1. Ingresa a: [Portal Azure](https://portal.azure.com)
2. En la barra de busqueda que se encuentra en la parte superior, escribe: *Azure Maps Accounts*
3. ...

### Editar proyecto

### Git y GitHub
- ```git add .```
- ```git commit -m "Primer Commit"```
- ```git push -u origin main```
- ...

### Desplegar proyecto en Microsoft Azure
- En Visual Studio Code, instala la extensión 'Azure Static Web Apps'
- En Visual Studio Code, instala la extensión 'Azure Account'
-En Visual Studio Code, instala la extensión 'Azure Resources'
- En la carpeta del proyecto 'MLSA-TalentRoute' abren Visual Studio Code y aparece una nueva selección de Azure como en la siguiente imagen.

![alt text](https://github.com/ManuOSMx/MLSA-TalentRoute/blob/main/img/Paso1.png)

- Al darle clic al logo de 'Azure' nos pedira iniciar sesión a nuestra cuenta de Azure que utilizamos anteriormente

- Nos guiará como iniciar sesión en Azure y Visual Studio Code, reconocerá la cuenta automaticamente.

- Después agregaremos un recurso nuevo a utilizar, para ello daremos clic en el simbolo de '+' en la parte superior como en la siguiente imagen:

![alt text](https://github.com/ManuOSMx/MLSA-TalentRoute/blob/main/img/Paso2.png)

- Se desplegará un menu y seleccionaremos 'Create Static Web App', como en la siguiente imagen:

![alt text](https://github.com/ManuOSMx/MLSA-TalentRoute/blob/main/img/Paso3.png)

- A continuación nos guiará en una serie de pasos:

- 1. Nombre de la Static Web App
![alt text](https://github.com/ManuOSMx/MLSA-TalentRoute/blob/main/img/Paso4.png)

- 2. Región donde se encontrará la Static Web App (Escoge la más cercana a tu ubicación Geografica):

![alt text](https://github.com/ManuOSMx/MLSA-TalentRoute/blob/main/img/Paso5.png)

- 3. Configuaración de la Static Web App, en este caso será 'Custom':

![alt text](https://github.com/ManuOSMx/MLSA-TalentRoute/blob/main/img/Paso6.png)

- 4. Nos solicitará la ubicación de los archivos fuentes y colocaremos ```/src``, después para tener 'build' del proyecto nos lo pedirá solo damos 'Enter'

- 5. Estará en progeso el despliegue de la Static Web App y para observarlo podemos verlo en 'Actions Github', que podemos darle clic a la ventana emergente que nos manda.

![alt text](https://github.com/ManuOSMx/MLSA-TalentRoute/blob/main/img/Paso7.png)

- Para confirmar que la Static Web App si se encuentra desplegada, lo podemos observar en nuestra lista de recursoso como acontinuación:

![alt text](https://github.com/ManuOSMx/MLSA-TalentRoute/blob/main/img/Paso8.png)

Y con ello puedes hacer futuros cambios a la Statice Web App y automaticamente se realizarán las actualización al observar cambios, observarás que el Action de Github esta en progreso.


## Recursos
- [Azure Maps Samples](https://samples.azuremaps.com/?sample=)
- [Docs Microsoft - Routes](https://docs.microsoft.com/en-us/rest/api/maps/route/post-route-directions?tabs=HTTP#alternativeroutetype)

## Colaboradores 
- [Evelyn Arias](https://github.com/https://github.com/earias12)
- [Manuel Ortiz](https://github.com/ManuOSMX)
- [Mika Molina](https://github.com)
- [Orlando Guzman](https://github.com)