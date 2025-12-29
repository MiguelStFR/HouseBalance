namespace HouseBalance.Server.DTOs.TransacoesController
{
    public class TransacaoResponse
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = "";
        public decimal Valor { get; set; }
        public string Tipo { get; set; } = "";
        public string Pessoa { get; set; } = "";
        public string Categoria { get; set; } = "";
    }
}
