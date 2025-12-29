using HouseBalance.Server.Data;
using HouseBalance.Server.DTOs.CategoriasController;
using HouseBalance.Server.DTOs.Relatorios;
using HouseBalance.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HouseBalance.Server.Controllers
{
    [ApiController]
    [Route("api/categorias")]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _db;
        public CategoriasController(AppDbContext db) => _db = db;

        [HttpPost]
        public IActionResult Create(CategoriaCreateRequest request)
        {
            Categoria categoria = new();

            try
            {
                categoria = new Categoria
                {
                    Descricao = request.Descricao,
                    Finalidade = request.Finalidade
                };
            }
            catch (Exception ex)
            {
                return BadRequest("Dados inválidos: " + ex.Message);
            }

            if (string.IsNullOrWhiteSpace(categoria.Finalidade))
                return BadRequest("Finalidade obrigatória");

            try
            {
                _db.Categorias.Add(categoria);
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erro ao salvar a categoria: " + ex.Message);
            }

            return CreatedAtAction(nameof(Create), new { id = categoria.Id }, new CategoriaResponse
            {
                Id = categoria.Id,
                Descricao = categoria.Descricao,
                Finalidade = categoria.Finalidade
            });
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            List<CategoriaResponse> categorias = [];
            
            try
            {
                categorias = _db.Categorias.Select(c => new CategoriaResponse
                {
                    Id = c.Id,
                    Descricao = c.Descricao,
                    Finalidade = c.Finalidade
                }).ToList();
            }
            catch(Exception ex)
            {
                return StatusCode(500, "Erro ao recuperar categorias: " + ex.Message);
            }

            return Ok(categorias);
        }

        [HttpGet("totais")]
        public IActionResult GetTotaisPorCategoria()
        {
            TotalGeralDTO<TotalCategoriaDTO> totalGeral;

            try
            {
                var categorias = _db.Categorias
                    .Select(c => new TotalCategoriaDTO
                    {
                        CategoriaId = c.Id,
                        Categoria = c.Descricao,
                        TotalReceitas = c.Transacoes
                            .Where(t => t.Tipo == "receita")
                            .Sum(t => (decimal?)t.Valor) ?? 0,
                        TotalDespesas = c.Transacoes
                            .Where(t => t.Tipo == "despesa")
                            .Sum(t => (decimal?)t.Valor) ?? 0
                    })
                    .ToList();

                totalGeral = new TotalGeralDTO<TotalCategoriaDTO>
                {
                    Itens = categorias,
                    TotalReceitas = categorias.Sum(x => x.TotalReceitas),
                    TotalDespesas = categorias.Sum(x => x.TotalDespesas)
                };
            }
            catch(Exception ex)
            {
                return StatusCode(500, "Erro ao calcular totais por categoria: " + ex.Message);
            }

            return Ok(totalGeral);
        }


        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                var categoria = _db.Categorias
                    .Include(c => c.Transacoes)
                    .FirstOrDefault(c => c.Id == id);

                if (categoria == null)
                    return NotFound("Categoria não encontrada");

                if (categoria.Transacoes.Any())
                    return BadRequest("Não é possível excluir. Existem transações vinculadas.");

                _db.Categorias.Remove(categoria);
                _db.SaveChanges();
            }
            catch(Exception ex)
            {
                return StatusCode(500, "Erro ao excluir a categoria: " + ex.Message);
            }

            return NoContent();
        }
    }
}
