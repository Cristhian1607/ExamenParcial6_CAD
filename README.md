# Agenda clara — Parcial 1 de Programación 6

Aplicación web para administrar tareas personales con Angular, ASP.NET Core Web API, MongoDB Atlas y LINQ.

## Estructura

- `backend/`: API REST, validación, persistencia MongoDB y consultas LINQ.
- `frontend/`: interfaz Angular responsive y consumo de la API.
- `Informe/`: informe formal con estructura APA y espacio para evidencias reales.

## Requisitos

- .NET 10 SDK.
- Node.js 24 o compatible y npm.
- Un cluster gratuito de MongoDB Atlas.

## Configurar MongoDB Atlas

1. Crea una cuenta y un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. En **Database Access**, crea un usuario de base de datos con una contraseña propia.
3. En **Network Access**, permite tu IP pública actual.
4. Selecciona **Connect > Drivers > C#/.NET** y copia la cadena de conexión.
5. En PowerShell, define la variable local (no compartas ni subas el valor):

```powershell
$env:MongoDB__ConnectionString = "mongodb+srv://USUARIO:CLAVE@TU-CLUSTER.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
```

La base de datos `GestorTareas` y la colección `Tareas` se crearán cuando se guarde la primera tarea. La cadena no está almacenada en el código fuente.

## Ejecutar

Abre dos terminales en la carpeta raíz del proyecto.

Terminal 1 — API:

```powershell
dotnet run --project .\backend\backend.csproj
```

- API: `http://localhost:5175/api/tareas`
- Documentación interactiva Scalar: `http://localhost:5175/scalar/v1`
- Health check: `http://localhost:5175/health`

Terminal 2 — Angular:

```powershell
Set-Location .\frontend
npm install
npm start
```

Abre `http://localhost:4200`. El proxy de desarrollo reenvía `/api` al backend.

## API

| Método | Ruta | Acción |
|---|---|---|
| GET | `/api/tareas` | Lista tareas; admite `estado`, `buscar`, `ordenarPor` (`fechaLimite` o `prioridad`) y `direccion` (`asc` o `desc`). |
| GET | `/api/tareas/{id}` | Consulta una tarea por ObjectId. |
| POST | `/api/tareas` | Crea una tarea validada. |
| PUT | `/api/tareas/{id}` | Actualiza una tarea existente. |
| DELETE | `/api/tareas/{id}` | Elimina una tarea existente. |

Ejemplo de filtros:

```text
GET /api/tareas?estado=Pendiente&buscar=estudio&ordenarPor=prioridad&direccion=desc
```

## Pruebas y compilación

```powershell
dotnet build .\backend\backend.csproj
Set-Location .\frontend
npm run build
npm test -- --watch=false
```

## Entrega e informe

El informe formal se encuentra en [`Informe/Informe_Parcial1.html`](./Informe/Informe_Parcial1.html). Agrega las tres capturas auténticas descritas en el informe antes de entregar. Para generar PDF, abre el HTML en el navegador y selecciona **Imprimir > Guardar como PDF**.

## Repositorios guía

- [Tarea1Angular](https://github.com/Cristhian1607/Tarea1Angular)
- [SistemaVentasAC2P6CAD](https://github.com/Cristhian1607/SistemaVentasAC2P6CAD)
- [HRMongoApiRest](https://github.com/brav88/HRMongoApiRest)
- [LinqSamples](https://github.com/brav88/LinqSamples)
