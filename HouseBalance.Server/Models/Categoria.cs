namespace HouseBalance.Server.Models
{
    /// <summary>
    /// Categoria de transações.
    /// Finalidade restringe o uso.
    /// </summary>
    public class Categoria
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = "";
        public string Finalidade { get; set; } = "";
        public List<Transacao> Transacoes { get; set; } = [];
    }
}
