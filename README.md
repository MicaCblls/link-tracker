# Link Tracker API

Este proyecto consiste en una API que permite enmascarar URLs, validar enlaces protegidos con contraseña y controlar la expiración y el conteo de visitas de cada enlace.

## Setup

```bash
$ pnpm install
```

## Como compilar y ejecutar el proyecto

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Deploy URL

- https://link-tracker-47ut.onrender.com


## Resources

- [NestJS Documentation](https://docs.nestjs.com)

## Endpoints

### POST `/create`
**Descripción**: Crea un nuevo link a partir de una URL válida.  
**Cuerpo de la petición (JSON)**:  
- `url` (string, requerido): URL de destino original.  
- `password` (string, opcional): Contraseña que se deberá pasar como query param en la redirección.  
- `expiration` (Date, opcional): Fecha de expiración para el link.  

**Ejemplo de petición**:

POST /create
Content-Type: application/json

```bash
{
  "url": "https://example.com",
  "password": "12345",
  "expiration": "2025-12-31"
}
```

**Ejemplo de respuesta (JSON)**:

```bash
{
  "target": "https://example.com",
  "link": "aBsJu",
  "valid": true
}
```

### GET `/l/:id`
**Descripción**: Redirige al URL original, siempre y cuando el link sea válido.  

**Parámetros**:  
- `:id`: Identificador corto del link.  
- `?password=...`: Query param opcional para validar la contraseña (si el link está protegido).  

**Proceso**:
1. Busca el link en la base de datos.
2. Verifica si `valid` es `true`.
3. Verifica si existe una fecha de expiración y si ya caducó.
4. Si tiene contraseña almacenada, compara con la contraseña provista en `?password`.
5. Incrementa el contador de visitas.
6. Redirige a la URL original.

**Ejemplo de solicitud**:
GET `/l/aBsJu?password=123`

**Comportamiento**:
- Retorna un **404 Not Found** si el link no existe, está inválido, expiró o si la contraseña es incorrecta.
- Redirige a la URL original en caso de éxito.

### GET `/l/:id/stats`

**Descripción**: Devuelve estadísticas del enlace.  

**Parámetros**:
- `:id`: Identificador corto del link.

**Respuesta (JSON)**:
```bash
{
  "link": "http://localhost:8080/l/aBsJu",
  "visitCount": 10
}
```

- `link`: El shortId del enlace.
- `visitCount`: Cantidad de veces que se redirigió correctamente.

### PUT /l/:id
**Descripción**: Invalida un link existente.  
**Parámetros**:
- `:id`: Identificador corto del link a invalidar.

**Proceso**:
1. Verifica que el link exista.
2. Actualiza el campo `valid` a `false`.

**Ejemplo de respuesta (JSON)**:
```bash
{
  "link": "http://localhost:8080/l/aBsJu",
  "valid": false
}
```

## Flujo de Uso
1. **Creación** (`POST /create`): Se envía la URL objetivo (y opcionalmente la contraseña y la fecha de expiración).
2. **Redirección** (`GET /l/:id`): Se visita el shortId. Si requiere contraseña, se pasa `?password=XXX`. El servicio valida, incrementa visitas y redirige.
3. **Estadísticas** (`GET /l/:id/stats`): Muestra cuántas veces se accedió al link.
4. **Invalidar** (`PUT /l/:id`): Cambia el estado del link a inválido para que no permita más redirecciones.

## Sobre la Contraseña
Si al momento de la creación se añade una `password`, el usuario debe proporcionar el mismo valor como query param en la llamada a la redirección:
GET `/l/aBsJu?password=12345`

Si la contraseña no coincide, o no se envía (y el link estaba protegido), se genera un error `404 Not Found`.

## Sobre la Expiración
Si se define `expiration` en la creación del link, cualquier intento de redirección luego de la fecha/hora establecida resultará en `404 Not Found`.

## Ejemplo de Flujo Completo

1. **Crear** un enlace corto:
POST /create
```bash
{
  "url": "https://fierastudio.com",
  "password": "123",
  "expiration": "2025-01-01"
}
```
Respuesta:
```bash
{
  "target": "https://fierastudio.com",
  "link": "http://localhost:8080/l/aBsJu",
  "valid": true
}
```

2. **Redirigir** (con contraseña):
GET `/l/aBsJu?password=123`
Redirige a la URL original si todo es correcto.

3. **Ver estadísticas**:
GET `/l/aBsJu/stats`
Respuesta:
```bash
{
  "link": "http://localhost:8080/l/aBsJu",
  "visitCount": 5
}
```

4. **Invalidar** el enlace:
PUT `/l/aBsJu`
Respuesta:
```bash
{
  "link": "http://localhost:8080/l/aBsJu",
  "valid": false
}
```

Con esto, el enlace dejará de funcionar en redirecciones futuras.

## Tecnologías Usadas
- **NestJS**: Framework para Node.js, basado en TypeScript.
- **Mongoose**: Para persistencia en MongoDB (opcional según tu implementación).
- **bcrypt**: Para hashear y validar la contraseña del enlace.
- **nanoid**: Para generar identificadores cortos y únicos.
