using System.Collections.Generic;

namespace HouseBalance.Server.DTOs.Relatorios
{
    public class TotalGeralDTO<T>
    {
        public List<T> Itens { get; set; } = new();

        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo => TotalReceitas - TotalDespesas;
    }
}
