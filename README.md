# Backend Taskify APP

## 📚 Índice

1. [Introducción](#introducción)
2. [Clona el repo](#clona-el-repo)
    - [Variables de entorno requeridas](#variables-de-entorno-requeridas)
3. [Funcionamiento](#funcionamiento)
    - [Explicación del app - server](#explicación-del-app---server)
4. [Middleware](#middleware)
5. [Dependencias](#dependencias)
6. [Dependencias de desarrollo](#dependencias-de-desarrollo)
7. [Contacto](#contacto)


## Introducción

Esta **aplicación Backend** cumple con el objetivo de ser el motor central de la app **Taskify**. App cuyo objetivo es el de simplificar tu día a día.
Dicha app fue desarrollada con el objetivo de cumplir con la prueba tecnica de coally.

## Clona el repo

La clonación del repositorio en tu entorno local es sencillo, tan simple como seguir los siguientes pasos:

1. Asegurarse de montar 2 bases de datos, una mongodb y otra mysql.
2. Crear las variables de entorno necesarias (en su archivo .env)
3. git clone https://github.com/ramedina98/backend_coally
4. npm install (para instalar todos los paquetes)
5. npm run start

### Variables de entorno requeridas

```javascript
    export const SERVER = {
        SERVER_PORT:process.env.SERVER_PORT_DEV,
        URI:process.env.MONGO_URI,
        JWT_KEY: process.env.JWT_SECRET_KEY,
        JWT_RE_TIME: process.env.JWT_TIME_REFRESH,
        JWT_TIME: process.env.JWT_TIME_SIGN,
        EHOST: process.env.PUBLIC_HOST,
        EUSER: process.env.PUBLIC_USER,
        EPASS: process.env.PUBLIC_PASS
    }
```

## Funcionamiento

El funcionamiento del backend de taskify es simple, pero robusto. Usando un patro service-controller-view (route) desarrollamos la API rest, la cual maneja los modulos de: /task, /user y /auth.

- El modulo auth se encarga de el inicio de sesión, el cierre de sesión, el registro de nuevos usuarios y la recuperación de contraseñas.

- El modulo user por otro lado, se encarga de obtener la información del usuario, poder actualizar dicha información y poder cambiar la contraseña del usuario, todo esto mediante la validación del token de sesion, el accessToken.

- El modulo task, es el encargado de gestioner el **CRUD** que le da funcionalidad al motor de esta aplicación, la gestion de tareas.

El backend maneja 2 bases de datos, ambas estan montadas en railway. Mietras los modulos user y auth usan una base de datos **MySQL**, el modulo task usa una base de datos **mongoDB**.

### Explicación del app - server

La aplicación utiliza Express.js como framework principal para manejar rutas, middlewares y solicitudes HTTP. Integra middlewares clave como express.json y express.urlencoded para procesar cuerpos de solicitudes JSON y formularios, cookie-parser para gestionar cookies, y cors con una configuración dinámica que permite solicitudes desde distintos orígenes. También incorpora **swagger-ui-express** para documentar y explorar la API desde el endpoint /docs. Se utiliza EJS como motor de plantillas para renderizar vistas dinámicas, mientras que los archivos estáticos se sirven desde la carpeta public. Todas las rutas están centralizadas en un archivo principal, y una ruta inicial (/) presenta una vista básica.

La ruta a la documentación de la API es la siguiente: [Documentación API](https://outstanding-spontaneity-production.up.railway.app/docs/)

```javascript
    //swagger middleware...
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

Por otro lado, el servidor está configurado para escuchar conexiones en el puerto definido en las variables de entorno o en el valor predeterminado especificado en la configuración del servidor de **Railway**, lo que garantiza flexibilidad en entornos de desarrollo y producción. La conexión a MongoDB se establece mediante la función connectDB() antes de iniciar el servidor, asegurando la disponibilidad de la base de datos. El servidor escucha en todas las interfaces de red ("0.0.0.0"), lo que lo hace accesible tanto desde la máquina local como desde otros dispositivos. Finalmente, un sistema de logging registra el estado del servidor al iniciarse, facilitando el monitoreo y la depuración.

**server.js**
```javascript
    import app from "./app.js";
    import { SERVER } from "./config/config.js";
    import connectDB from "./db/database.js";
    import logging from "./config/logging.js";

    const PORT =  process.env.PORT || SERVER.SERVER_PORT;

    // MongoDB connection...
    connectDB();

    app.listen(PORT, "0.0.0.0", () => {
        logging.info('----------------------------------------------');
        logging.info(`Server running on port http://localhost:${PORT}`);
        logging.info('----------------------------------------------');
    });
```

## Middleware

El server hace uso de varios Middlewares custom, los cuales son:

- routeNotFound: Middleware para detectar rutas incorrectas o no existentes

**middleware**
```javascript
    export const routeNotFound = (_req, res, _next) => {
        const error = new Error('Route not found');

        logging.error(error);

        return res.status(404).json({ error: error.message });
    };
```
**app:** Se usa hasta el final (despues del allRoutes(app)) para cachar si la ruta no existe.
```javaScript
    // this middleware helps us to send an error message if any route doesn't exist...
    app.use(routeNotFound);
```
- checkRevokedToken: Este middleware tiene el objetivo de interceptar cualquier token enviado desde el frontend (token de sesión), para proteger ciertas rutas.

**Uso**
```javascript
    authRouter.post('/logout/', checkRevokedToken, logoutController);
```

**Middleware**
```javascript
    const checkRevokedToken = async (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            logging.error('No token provided.');
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        try {
            // Verificar si el token está en la tabla de tokens revocados...
            const isRevoked = await checkIfTokenIsRevoked(token);
            if (isRevoked) {
                logging.warning('Sesión expirada.');
                res.status(403).json({ message: 'Sesión expirada.' });
                return;
            }

            // Decodificar el token para obtener la información del usuario...
            const decoded = jwt.verify(token, SERVER.JWT_KEY);
            req.user = decoded;

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                logging.warning('Sesión expirada.');
                return res.status(401).json({ message: 'Sesión expirada.' });
            } else if (error.name === 'JsonWebTokenError') {
                // Si el token es inválido o mal formado
                logging.error('Token inválido.');
                return res.status(403).json({ message: 'Token inválido.' });
            } else {
                // Manejo de cualquier otro error desconocido
                logging.error('Error al verificar el token:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
        }
    }
```

- loggingMiddleware: Este middleware intercepta la peticion HTTP, y indica en la consola el metodo y la ruta.

**middleware**
```javaScript
    export const loggingHandler = (req, res, next) => {
        logging.log(`Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.address}]`);

        res.on('finish', () => {
            logging.log(`Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.address}] - STATUS [${res.statusCode}]`);
        });

        next();
    };
```

**uso**
```javascript
    app.use(loggingHandler);
```

## Dependencias

- @prisma/client: Proporciona una interfaz para interactuar con bases de datos usando Prisma, un ORM que simplifica las operaciones con bases de datos relacionales y mejora la productividad.

- bcryptjs: Se utiliza para cifrar contraseñas y otros datos sensibles, asegurando su almacenamiento seguro y protegidos contra ataques de fuerza bruta.

- cookie-parser: Facilita el análisis de cookies en las solicitudes HTTP, permitiendo acceder y manejar información almacenada en ellas.

- cors: Gestiona las políticas de seguridad relacionadas con solicitudes de diferentes orígenes (CORS), habilitando el acceso controlado entre cliente y servidor.

- dotenv: Permite cargar variables de entorno desde un archivo .env, mejorando la gestión de configuraciones sensibles y específicas de entornos.

- ejs: Un motor de plantillas que permite generar vistas dinámicas en aplicaciones web al integrar datos directamente en HTML.

- express: Framework web minimalista para Node.js que facilita la creación de APIs y servidores robustos mediante su enfoque modular.

- express-validator: Proporciona un conjunto de herramientas para validar y sanitizar datos de entrada, asegurando integridad y seguridad en la aplicación.

- jsonwebtoken: Implementa la creación y validación de tokens JWT, usados para autenticar usuarios y mantener sesiones de forma segura.

- mongoose: Una biblioteca para interactuar con MongoDB, que simplifica la definición de esquemas y la realización de operaciones CRUD en bases de datos NoSQL.

- nodemailer: Permite enviar correos electrónicos directamente desde la aplicación, útil para funcionalidades como recuperación de contraseñas o notificaciones.

- prisma: Herramienta de modelado y migración de bases de datos que simplifica la integración con múltiples sistemas de bases de datos.

- swagger-jsdoc: Facilita la generación de documentación Swagger a partir de comentarios en el código, automatizando la descripción de la API.

- swagger-ui-express: Permite integrar una interfaz visual para explorar y probar endpoints de la API directamente desde el navegador.

## Dependencias de desarrollo

- nodemon: Una herramienta para reiniciar automáticamente el servidor durante el desarrollo cuando se detectan cambios en el código, mejorando la productividad.

## Contacto

### Ricardo Medina

- [LinkedIn](https://www.linkedin.com/in/ricardomedinamartin/)
- 📧 [Email](mailto:rmedinamartindelcampo@gmail.com)