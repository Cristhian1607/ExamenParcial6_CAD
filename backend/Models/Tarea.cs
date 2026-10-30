using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GestorTareas.Api.Models;

/// <summary>Representa una tarea almacenada en la colección de MongoDB.</summary>
public sealed class Tarea
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("titulo")]
    public required string Titulo { get; set; }

    [BsonElement("descripcion")]
    public required string Descripcion { get; set; }

    [BsonElement("fechaLimite")]
    public DateTime FechaLimite { get; set; }

    [BsonElement("prioridad")]
    public int Prioridad { get; set; }

    [BsonElement("estado")]
    public required string Estado { get; set; }
}

/// <summary>Datos de entrada para crear o actualizar una tarea.</summary>
public sealed class TareaInput
{
    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Titulo { get; set; } = string.Empty;

    [Required]
    [StringLength(500, MinimumLength = 1)]
    public string Descripcion { get; set; } = string.Empty;

    [Required]
    public DateTime? FechaLimite { get; set; }

    [Range(1, 3)]
    public int Prioridad { get; set; }

    [Required]
    [RegularExpression("^(Pendiente|Completada)$")]
    public string Estado { get; set; } = "Pendiente";
}
