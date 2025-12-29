namespace HouseBalance.Server.Models
{
    /// <summary>
    /// Representa uma movimentação financeira.
    /// Regras:
    /// - valor > 0
    /// - menores só despesas
    /// - tipo compatível com categoria
    /// </summary>
    public class Transacao
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = "";
        public decimal Valor { get; set; }
        public string Tipo { get; set; } = "";
        public int PessoaId { get; set; }
        public Pessoa? Pessoa { get; set; }
        public int CategoriaId { get; set; }
        public Categoria? Categoria { get; set; }
    }
}
