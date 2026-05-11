package com.homiwood.peliculas.controller;

import com.homiwood.peliculas.dto.CrearCalificacionRequest;
import com.homiwood.peliculas.model.Calificacion;
import com.homiwood.peliculas.service.CalificacionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calificaciones")
public class CalificacionController {

    private final CalificacionService calificacionService;

    public CalificacionController(CalificacionService calificacionService) {
        this.calificacionService = calificacionService;
    }

    @GetMapping
    public List<Calificacion> listarCalificaciones() {
        return calificacionService.listarCalificaciones();
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<Calificacion> listarPorUsuario(@PathVariable Long idUsuario) {
        return calificacionService.listarPorUsuario(idUsuario);
    }

    @GetMapping("/contenido/{idContenido}")
    public List<Calificacion> listarPorContenido(@PathVariable Long idContenido) {
        return calificacionService.listarPorContenido(idContenido);
    }

    @GetMapping("/contenido/{idContenido}/promedio")
    public Double obtenerPromedioContenido(@PathVariable Long idContenido) {
        return calificacionService.obtenerPromedioContenido(idContenido);
    }

    @PostMapping
    public ResponseEntity<Calificacion> crearCalificacion(@Valid @RequestBody CrearCalificacionRequest request) {
        Calificacion calificacionCreada = calificacionService.crearCalificacion(request);
        return ResponseEntity.ok(calificacionCreada);
    }

    @PutMapping("/{idCalificacion}")
    public ResponseEntity<Calificacion> actualizarCalificacion(
            @PathVariable Long idCalificacion,
            @Valid @RequestBody CrearCalificacionRequest request
    ) {
        Calificacion calificacionActualizada = calificacionService.actualizarCalificacion(idCalificacion, request);
        return ResponseEntity.ok(calificacionActualizada);
    }

    @DeleteMapping("/{idCalificacion}")
    public ResponseEntity<String> eliminarCalificacion(@PathVariable Long idCalificacion) {
        calificacionService.eliminarCalificacion(idCalificacion);
        return ResponseEntity.ok("Calificación eliminada correctamente");
    }
}