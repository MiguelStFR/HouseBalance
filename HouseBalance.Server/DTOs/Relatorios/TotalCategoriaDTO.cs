namespace HouseBalance.Server.DTOs.Relatorios
{
    public class TotalCategoriaDTO
    {
        public int CategoriaId { get; set; }
        public string Categoria { get; set; } = "";
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo => TotalReceitas - TotalDespesas;
    }
}
