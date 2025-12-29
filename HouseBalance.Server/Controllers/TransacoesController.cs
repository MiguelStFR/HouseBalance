using HouseBalance.Server.Data;
using HouseBalance.Server.DTOs.TransacoesController;
using HouseBalance.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HouseBalance.Server.Controllers
{
    [ApiController]
    [Route("api/transacoes")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public TransacoesController(AppDbContext db) => _db = db;

        [HttpPost]
        public IActionResult Create(TransacaoCreateRequest request)
        {
            Transacao transacao = new();

            try
            {
                transacao = new Transacao
                {
                    Descricao = request.Descricao,
                    Valor = request.Valor,
                    Tipo = request.Tipo,
                    PessoaId = request.PessoaId,
                    CategoriaId = request.CategoriaId
                };
            }
            catch(Exception ex)
            {
                return BadRequest("Dados inválidos: " + ex.Message);
            }

            string pessoaNome = "";
            string categoriaDescricao = "";
            try
            {
                var pessoa = _db.Pessoas.Find(transacao.PessoaId);
                if (pessoa == null) 
                    return BadRequest("Pessoa inexistente");

                // Menor só pode despesa
                if (pessoa.Idade < 18 && transacao.Tipo == "receita")
                    return BadRequest("Menores só podem registrar despesas");

                var categoria = _db.Categorias.Find(transacao.CategoriaId);
                if (categoria == null) 
                    return BadRequest("Categoria inexistente");

                // Compatibilidade com categoria
                if (categoria.Finalidade == "receita" && transacao.Tipo == "despesa")
                    return BadRequest("Categoria não aceita despesa");

                if (categoria.Finalidade == "despesa" && transacao.Tipo == "receita")
                    return BadRequest("Categoria não aceita receita");

                pessoaNome = pessoa.Nome;
                categoriaDescricao = categoria.Descricao;
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erro ao acessar o banco de dados: " + ex.Message);
            }

            if (transacao.Valor <= 0) 
                return BadRequest("Valor inválido");

            try
            {
                _db.Transacoes.Add(transacao);
                _db.SaveChanges();
            } 
            catch (Exception ex)
            {
                return StatusCode(500, "Erro ao salvar transação: " + ex.Message);
            }

            return CreatedAtAction(nameof(Create), new { id = transacao.Id }, new TransacaoResponse
            {
                Id = transacao.Id,
                Descricao = transacao.Descricao,
                Valor = transacao.Valor,
                Tipo = transacao.Tipo,
                Pessoa = pessoaNome,
                Categoria = categoriaDescricao
            });
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            List<TransacaoResponse> transacoes = [];

            try
            {
                transacoes = _db.Transacoes
                    .Include(t => t.Pessoa)
                    .Include(t => t.Categoria)
                    .Select(t => new TransacaoResponse
                    {
                        Id = t.Id,
                        Descricao = t.Descricao,
                        Valor = t.Valor,
                        Tipo = t.Tipo,
                        Pessoa = t.Pessoa.Nome,
                        Categoria = t.Categoria.Descricao
                    })
                    .ToList();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erro ao recuperar transações: " + ex.Message);
            }

            return Ok(transacoes);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                var transacao = _db.Transacoes.Find(id);

                if (transacao == null)
                    return NotFound("Transação não encontrada");

                _db.Transacoes.Remove(transacao);
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erro ao acessar o banco de dados: " + ex.Message);
            }

            return NoContent();
        }
    }
}
