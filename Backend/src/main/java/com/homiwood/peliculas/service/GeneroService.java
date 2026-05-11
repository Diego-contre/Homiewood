package com.homiwood.peliculas.service;

import com.homiwood.peliculas.exception.BadRequestException;
import com.homiwood.peliculas.exception.DuplicateResourceException;
import com.homiwood.peliculas.exception.NotFoundException;
import com.homiwood.peliculas.model.Genero;
import com.homiwood.peliculas.repository.GeneroRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeneroService {

    private final GeneroRepository generoRepository;

    public GeneroService(GeneroRepository generoRepository) {
        this.generoRepository = generoRepository;
    }

    public List<Genero> listarGeneros() {
        return generoRepository.findAll();
    }

    public Genero buscarPorId(Long id) {
        return generoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Género no encontrado"));
    }

    public Genero crearGenero(Genero genero) {
        if (genero.getNombre() == null || genero.getNombre().isBlank()) {
            throw new BadRequestException("El nombre del género es obligatorio");
        }

        String nombreNormalizado = genero.getNombre().trim();

        if (generoRepository.existsByNombreIgnoreCase(nombreNormalizado)) {
            throw new DuplicateResourceException("El género ya existe");
        }

        genero.setNombre(nombreNormalizado);
        return generoRepository.save(genero);
    }

    public void eliminarGenero(Long id) {

        if (!generoRepository.existsById(id)) {
            throw new NotFoundException("Género no encontrado");
        }

        generoRepository.deleteById(id);
    }
}