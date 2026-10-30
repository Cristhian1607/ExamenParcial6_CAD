using GestorTareas.Api.Data;
using GestorTareas.Api.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace GestorTareas.Api.Controllers;

[ApiController]
[Route("api/tareas")]
public sealed class TareasController(TareasRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Tarea>>> ObtenerTodas(
        [FromQuery] string? estado,
        [FromQuery] string? buscar,
        [FromQuery] string ordenarPor = "fechaLimite",
        [FromQuery] string direccion = "asc",
        CancellationToken cancellationToken = default)
    {
        if (estado is not null && estado is not ("Pendiente" or "Completada"))
        {
            return BadRequest(new { message = "estado debe ser Pendiente o Completada." });
        }

        if (ordenarPor is not ("fechaLimite" or "prioridad"))
        {
            return BadRequest(new { message = "ordenarPor debe ser fechaLimite o prioridad." });
        }

        if (direccion is not ("asc" or "desc"))
        {
            return BadRequest(new { message = "direccion debe ser asc o desc." });
        }

        var tareas = await repository.ObtenerTodasAsync(
            estado,
            buscar?.Trim(),
            ordenarPor,
            direccion,
            cancellationToken);

        return Ok(tareas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Tarea>> ObtenerPorId(
        string id,
        CancellationToken cancellationToken)
    {
        if (!ObjectId.TryParse(id, out _))
        {
            return BadRequest(new { message = "El identificador de tarea no es válido." });
        }

        var tarea = await repository.ObtenerPorIdAsync(id, cancellationToken);
        return tarea is null ? NotFound() : Ok(tarea);
    }

    [HttpPost]
    public async Task<ActionResult<Tarea>> Crear(
        [FromBody] TareaInput entrada,
        CancellationToken cancellationToken)
    {
        var tarea = CrearModelo(entrada);
        await repository.CrearAsync(tarea, cancellationToken);

        return CreatedAtAction(nameof(ObtenerPorId), new { id = tarea.Id }, tarea);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Actualizar(
        string id,
        [FromBody] TareaInput entrada,
        CancellationToken cancellationToken)
    {
        if (!ObjectId.TryParse(id, out _))
        {
            return BadRequest(new { message = "El identificador de tarea no es válido." });
        }

        var actualizado = await repository.ActualizarAsync(id, CrearModelo(entrada), cancellationToken);
        return actualizado ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Eliminar(string id, CancellationToken cancellationToken)
    {
        if (!ObjectId.TryParse(id, out _))
        {
            return BadRequest(new { message = "El identificador de tarea no es válido." });
        }

        var eliminado = await repository.EliminarAsync(id, cancellationToken);
        return eliminado ? NoContent() : NotFound();
    }

    private static Tarea CrearModelo(TareaInput entrada) => new()
    {
        Titulo = entrada.Titulo.Trim(),
        Descripcion = entrada.Descripcion.Trim(),
        FechaLimite = DateTime.SpecifyKind(entrada.FechaLimite!.Value, DateTimeKind.Utc),
        Prioridad = entrada.Prioridad,
        Estado = entrada.Estado
    };
}
