namespace HouseBalance.Server.DTOs.TransacoesController
{
    public class TransacaoCreateRequest
    {
        public string Descricao { get; set; } = "";
        public decimal Valor { get; set; }
        public string Tipo { get; set; } = "";
        public int PessoaId { get; set; }
        public int CategoriaId { get; set; }
    }
}
