using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }

        [Required (ErrorMessage = "Local é obrigatório")]
        [MinLength(3, ErrorMessage = "Local deve ter no mínimo 3 caracteres")]
        public string Local { get; set; }

        [Required (ErrorMessage = "Data do Evento é obrigatório")]
        public DateTime DataEvento { get; set; }

        [Required (ErrorMessage = "Tema é obrigatório")]
        public string Tema { get; set; }

        [Required (ErrorMessage = "Quantidade de Pessoas é obrigatório")]
        [Range(2, 120000, ErrorMessage = "Quantidade de Pessoas deve ser entre 2 e 120000")]
        public int QtdPessoas { get; set; }
        public string ImagemURL { get; set; }

        [Phone]
        public string Telefone { get; set; }

        [EmailAddress (ErrorMessage = "E-mail é inválido")]
        public string Email { get; set; }
        public List<LoteDto> Lotes { get; set; }
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}