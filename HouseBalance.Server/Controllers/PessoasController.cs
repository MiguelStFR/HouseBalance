using HouseBalance.Server.Data;
using HouseBalance.Server.DTOs.PessoasController;
using HouseBalance.Server.DTOs.Relatorios;
using HouseBalance.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace HouseBalance.Server.Controllers
{
    [ApiController]
    [Route("api/pessoas")]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _db;
        public PessoasController(AppDbContext db) => _db = db;

        [HttpPost]
        public IActionResult Create(PessoaCreateRequest request)
        {
            Pessoa pessoa = new();

            try
            {
                pessoa = new Pessoa
                {
                    Nome = request.Nome,
                    Idade = request.Idade
                };
            }catch (Exception ex)
            {
                return BadRequest("Dados inválidos: " + ex.Message);
            }

            if (request.Idade <= 0) 
                return BadRequest("Idade inválida");

            try
            {
                _db.Pessoas.Add(pessoa);
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erro ao criar pessoa: " + ex.Message);
            }

            return CreatedAtAction(nameof(Create), new { id = pessoa.Id }, new PessoaResponse
            {
                Id = pessoa.Id,
                Nome = pessoa.Nome,
                Idade = pessoa.Idade
            });
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            List<PessoaResponse> pessoas = [];

            try
            {
                pessoas = _db.Pessoas
                .Select(p => new PessoaResponse
                    {
                        Id = p.Id,
                        Nome = p.Nome,
                        Idade = p.Idade
                    })
                    .ToList();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erro ao obter pessoas: " + ex.Message);
            }

            return Ok(pessoas);
        }

        [HttpGet("totais")]
        public IActionResult GetTotaisPorPessoa()
        {
            TotalGeralDTO<TotalPessoaDTO> totalGeral;

            try
            {
                var pessoas = _db.Pessoas
                    .Select(p => new TotalPessoaDTO
                    {
                        PessoaId = p.Id,
                        Pessoa = p.Nome,
                        TotalReceitas = p.Transacoes
                            .Where(t => t.Tipo == "receita")
                            .Sum(t => (decimal?)t.Valor) ?? 0,
                        TotalDespesas = p.Transacoes
                            .Where(t => t.Tipo == "despesa")
                            .Sum(t => (decimal?)t.Valor) ?? 0
                    })
                    .ToList();

                totalGeral = new TotalGeralDTO<TotalPessoaDTO>
                {
                    Itens = pessoas,
                    TotalReceitas = pessoas.Sum(x => x.TotalReceitas),
                    TotalDespesas = pessoas.Sum(x => x.TotalDespesas)
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erro ao obter total por pessoa: " + ex.Message);
            }

            return Ok(totalGeral);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                var pessoa = _db.Pessoas.Find(id);
            
                if (pessoa == null) 
                    return NotFound();

                _db.Pessoas.Remove(pessoa);
                _db.SaveChanges();
            }
            catch(Exception ex)
            {
                return StatusCode(500, "Erro ao deletar pessoa: " + ex.Message);
            }

            return NoContent();
        }
    }
}
