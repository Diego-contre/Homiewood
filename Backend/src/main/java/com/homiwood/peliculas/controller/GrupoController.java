package com.homiwood.peliculas.controller;

import com.homiwood.peliculas.dto.CrearGrupoRequest;
import com.homiwood.peliculas.model.Grupo;
import com.homiwood.peliculas.model.GrupoMiembro;
import com.homiwood.peliculas.service.GrupoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grupos")
public class GrupoController {

    private final GrupoService grupoService;

    public GrupoController(GrupoService grupoService) {
        this.grupoService = grupoService;
    }

    @GetMapping
    public List<Grupo> listarGrupos() {
        return grupoService.listarGrupos();
    }

    @GetMapping("/{idGrupo}")
    public Grupo buscarGrupo(@PathVariable Long idGrupo) {
        return grupoService.buscarPorId(idGrupo);
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<GrupoMiembro> listarGruposDeUsuario(@PathVariable Long idUsuario) {
        return grupoService.listarGruposDeUsuario(idUsuario);
    }

    @PostMapping
    public ResponseEntity<Grupo> crearGrupo(@Valid @RequestBody CrearGrupoRequest request) {
        Grupo grupoCreado = grupoService.crearGrupo(request);
        return ResponseEntity.ok(grupoCreado);
    }

    @DeleteMapping("/{idGrupo}")
    public ResponseEntity<String> eliminarGrupo(@PathVariable Long idGrupo) {
        grupoService.eliminarGrupo(idGrupo);
        return ResponseEntity.ok("Grupo eliminado correctamente");
    }
}