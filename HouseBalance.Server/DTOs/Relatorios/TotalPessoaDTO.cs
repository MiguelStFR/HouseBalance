namespace HouseBalance.Server.DTOs.Relatorios
{
    public class TotalPessoaDTO
    {
        public int PessoaId { get; set; }
        public string Pessoa { get; set; } = "";
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo => TotalReceitas - TotalDespesas;
    }
}
