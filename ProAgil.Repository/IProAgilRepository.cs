using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
         void Add<T>(T entity) where T : class;
         void Update<T>(T entity) where T : class;
         void Delete<T>(T entity) where T : class;
         Task<bool> SaveChangesAsync(); 

         //Eventos
         Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrantes);
         Task<Evento[]> GetAllEventoAsync(bool includePalestrantes);
         Task<Evento> GetEventoAsyncById(int EventoId, bool includePalestrantes);

         //Palestrantes
         Task<Palestrante[]> GetAllPalestrantesAsyncByName(string name, bool includeEventos);
         Task<Palestrante> GetPalestranteAsyncById(int PalestranteId, bool includeEventos);
    }
}