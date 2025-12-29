namespace HouseBalance.Server.Models
{
    /// <summary>
    /// Representa uma pessoa cadastrada.
    /// Ao excluir, todas as transações dela são removidas.
    /// </summary>
    public class Pessoa
    {
        public int Id { get; set; }
        public string Nome { get; set; } = "";
        public int Idade { get; set; }

        public List<Transacao> Transacoes { get; set; } = new();
    }
}
