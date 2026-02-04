# Sistema de Mantenimiento de Clientes

Aplicación React para gestión de clientes desarrollada como prueba técnica.

## Tecnologías

- React JS 17 con componentes funcionales y hooks
- Context API para manejo de estado
- Axios para consumo de API REST
- React Router Dom para navegación
- Material UI para diseño responsive

## Instalación

```bash
npm install
npm start
```

La aplicación se ejecutará en `http://localhost:5010`

## API Base

```
https://pruebareactjs.test-class.com/Api/
```

## Funcionalidades

- Login con opción "Recuérdame"
- Registro de usuarios
- Listado de clientes con filtros y paginación (10, 20, 30 registros)
- Crear, editar y eliminar clientes (DELETE desactivado en API)
- Sidebar colapsable
- Diseño responsive

## Nota Importante sobre la API

Existe una inconsistencia entre la documentación original y la implementación real del servidor:

| Campo | Documentación | API Real (Swagger) |
|-------|---------------|-------------------|
| Teléfono celular | `telefonoCelular` | `celular` |
| Reseña personal | `resenaPersonal` | `resennaPersonal` |

El código está adaptado para usar los campos correctos según el Swagger:
`https://pruebareactjs.test-class.com/Api/swagger/index.html`

## Endpoints Utilizados

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/Authenticate/login` | POST | Iniciar sesión |
| `/api/Authenticate/register` | POST | Registrar usuario |
| `/api/Cliente/Listado` | POST | Buscar clientes |
| `/api/Cliente/Obtener/{id}` | GET | Obtener cliente |
| `/api/Cliente/Crear` | POST | Crear cliente |
| `/api/Cliente/Actualizar` | POST | Actualizar cliente |
| `/api/Intereses/Listado` | GET | Listar intereses |
