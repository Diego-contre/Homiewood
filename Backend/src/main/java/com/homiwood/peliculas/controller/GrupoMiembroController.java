package com.homiwood.peliculas.controller;

import com.homiwood.peliculas.dto.AgregarMiembroGrupoRequest;
import com.homiwood.peliculas.model.GrupoMiembro;
import com.homiwood.peliculas.service.GrupoMiembroService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grupos")
public class GrupoMiembroController {

    private final GrupoMiembroService grupoMiembroService;

    public GrupoMiembroController(GrupoMiembroService grupoMiembroService) {
        this.grupoMiembroService = grupoMiembroService;
    }

    @GetMapping("/{idGrupo}/miembros")
    public List<GrupoMiembro> listarMiembros(@PathVariable Long idGrupo) {
        return grupoMiembroService.listarMiembros(idGrupo);
    }

    @GetMapping("/{idGrupo}/miembros/cantidad")
    public long contarMiembros(@PathVariable Long idGrupo) {
        return grupoMiembroService.contarMiembros(idGrupo);
    }

    @PostMapping("/{idGrupo}/miembros")
    public ResponseEntity<GrupoMiembro> agregarMiembro(
            @PathVariable Long idGrupo,
            @Valid @RequestBody AgregarMiembroGrupoRequest request
    ) {
        GrupoMiembro miembro = grupoMiembroService.agregarMiembro(idGrupo, request);
        return ResponseEntity.ok(miembro);
    }

    @DeleteMapping("/{idGrupo}/miembros/{idUsuario}")
    public ResponseEntity<String> eliminarMiembro(
            @PathVariable Long idGrupo,
            @PathVariable Long idUsuario
    ) {
        grupoMiembroService.eliminarMiembro(idGrupo, idUsuario);
        return ResponseEntity.ok("Miembro eliminado del grupo correctamente");
    }
}