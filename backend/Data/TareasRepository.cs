using GestorTareas.Api.Models;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace GestorTareas.Api.Data;

/// <summary>Centraliza las operaciones de MongoDB y las consultas LINQ de tareas.</summary>
public sealed class TareasRepository
{
    private readonly IMongoCollection<Tarea> _tareas;

    public TareasRepository(IMongoClient mongoClient, IConfiguration configuration)
    {
        var databaseName = configuration["MongoDB:DatabaseName"]
            ?? throw new InvalidOperationException("MongoDB:DatabaseName is not configured.");
        var collectionName = configuration["MongoDB:CollectionName"]
            ?? throw new InvalidOperationException("MongoDB:CollectionName is not configured.");

        _tareas = mongoClient.GetDatabase(databaseName).GetCollection<Tarea>(collectionName);
    }

    public async Task<List<Tarea>> ObtenerTodasAsync(
        string? estado,
        string? busqueda,
        string ordenarPor,
        string direccion,
        CancellationToken cancellationToken)
    {
        // Los filtros y el orden se aplican antes de pedir los resultados a MongoDB.
        IQueryable<Tarea> consulta = _tareas.AsQueryable();

        if (!string.IsNullOrWhiteSpace(estado))
        {
            consulta = consulta.Where(tarea => tarea.Estado == estado);
        }

        if (!string.IsNullOrWhiteSpace(busqueda))
        {
            consulta = consulta.Where(tarea =>
                tarea.Titulo.Contains(busqueda) || tarea.Descripcion.Contains(busqueda));
        }

        var descendente = direccion.Equals("desc", StringComparison.OrdinalIgnoreCase);
        consulta = ordenarPor switch
        {
            "prioridad" when descendente => consulta.OrderByDescending(tarea => tarea.Prioridad),
            "prioridad" => consulta.OrderBy(tarea => tarea.Prioridad),
            "fechaLimite" when descendente => consulta.OrderByDescending(tarea => tarea.FechaLimite),
            "fechaLimite" => consulta.OrderBy(tarea => tarea.FechaLimite),
            _ => consulta.OrderBy(tarea => tarea.FechaLimite)
        };

        return await consulta.ToListAsync(cancellationToken);
    }

    public async Task<Tarea?> ObtenerPorIdAsync(string id, CancellationToken cancellationToken) =>
        await _tareas.Find(tarea => tarea.Id == id).FirstOrDefaultAsync(cancellationToken);

    /// <summary>Guarda una tarea y devuelve el documento con su identificador generado.</summary>
    public async Task<Tarea> CrearAsync(Tarea tarea, CancellationToken cancellationToken)
    {
        await _tareas.InsertOneAsync(tarea, cancellationToken: cancellationToken);
        return tarea;
    }

    public async Task<bool> ActualizarAsync(
        string id,
        Tarea tarea,
        CancellationToken cancellationToken)
    {
        tarea.Id = id;
        var resultado = await _tareas.ReplaceOneAsync(
            existente => existente.Id == id,
            tarea,
            cancellationToken: cancellationToken);

        return resultado.MatchedCount > 0;
    }

    public async Task<bool> EliminarAsync(string id, CancellationToken cancellationToken)
    {
        var resultado = await _tareas.DeleteOneAsync(
            tarea => tarea.Id == id,
            cancellationToken);

        return resultado.DeletedCount > 0;
    }
}
