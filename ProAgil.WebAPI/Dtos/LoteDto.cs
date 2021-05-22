using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class LoteDto
    {
        public int Id { get; set; }

        [Required (ErrorMessage = "{0} é obrigatório")]
        public string Nome { get; set; }

        [Required (ErrorMessage = "{0} é obrigatório")]
        public decimal Preco { get; set; }
        public string DataInicio { get; set; }
        public string DataFim { get; set; }

        [Required (ErrorMessage = "{0} é obrigatório")]
        [Range(5, 120000, ErrorMessage = "Quantidade deve ser entre 5 e 120000")]
        public int Quantidade { get; set; }
    }
}