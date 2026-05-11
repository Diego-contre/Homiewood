package com.homiwood.peliculas.controller;

import com.homiwood.peliculas.dto.CrearLikeListaRequest;
import com.homiwood.peliculas.model.LikeLista;
import com.homiwood.peliculas.service.LikeListaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LikeListaController {

    private final LikeListaService likeListaService;

    public LikeListaController(LikeListaService likeListaService) {
        this.likeListaService = likeListaService;
    }

    @PostMapping("/listas/{idLista}/likes")
    public ResponseEntity<LikeLista> darLike(
            @PathVariable Long idLista,
            @Valid @RequestBody CrearLikeListaRequest request
    ) {
        LikeLista likeCreado = likeListaService.darLike(idLista, request);
        return ResponseEntity.ok(likeCreado);
    }

    @DeleteMapping("/listas/{idLista}/likes/usuario/{idUsuario}")
    public ResponseEntity<String> quitarLike(
            @PathVariable Long idLista,
            @PathVariable Long idUsuario
    ) {
        likeListaService.quitarLike(idLista, idUsuario);
        return ResponseEntity.ok("Like eliminado correctamente");
    }

    @GetMapping("/listas/{idLista}/likes")
    public List<LikeLista> listarLikesDeLista(@PathVariable Long idLista) {
        return likeListaService.listarLikesDeLista(idLista);
    }

    @GetMapping("/listas/{idLista}/likes/cantidad")
    public long contarLikesDeLista(@PathVariable Long idLista) {
        return likeListaService.contarLikesDeLista(idLista);
    }

    @GetMapping("/usuarios/{idUsuario}/likes")
    public List<LikeLista> listarLikesDeUsuario(@PathVariable Long idUsuario) {
        return likeListaService.listarLikesDeUsuario(idUsuario);
    }
}