package com.homiwood.peliculas.service;

import com.homiwood.peliculas.dto.CatalogoExternoResponse;
import com.homiwood.peliculas.dto.TmdbItemDto;
import com.homiwood.peliculas.dto.TmdbSearchResponse;
import com.homiwood.peliculas.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;

@Service
public class TmdbCatalogoService {

    private final RestClient restClient;
    private final String imageBaseUrl;

    public TmdbCatalogoService(
            @Value("${tmdb.base-url}") String baseUrl,
            @Value("${tmdb.token}") String token,
            @Value("${tmdb.image-base-url}") String imageBaseUrl
    ) {
        this.imageBaseUrl = imageBaseUrl;

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + token)
                .defaultHeader("accept", "application/json")
                .build();
    }

    public List<CatalogoExternoResponse> buscarPeliculasYSeries(String query) {

        if (query == null || query.isBlank()) {
            throw new BadRequestException("El parámetro query es obligatorio");
        }

        try {
            TmdbSearchResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search/multi")
                            .queryParam("query", query)
                            .queryParam("language", "es-CL")
                            .queryParam("page", 1)
                            .queryParam("include_adult", false)
                            .build()
                    )
                    .retrieve()
                    .body(TmdbSearchResponse.class);

            if (response == null || response.getResults() == null) {
                return List.of();
            }

            return response.getResults()
                    .stream()
                    .filter(item -> "movie".equals(item.getMediaType()) || "tv".equals(item.getMediaType()))
                    .map(this::mapearTmdb)
                    .toList();

        } catch (RestClientException e) {
            return List.of();
        }
    }

    private CatalogoExternoResponse mapearTmdb(TmdbItemDto item) {
        String tipoContenido = "movie".equals(item.getMediaType()) ? "PELICULA" : "SERIE";
        String posterUrl = item.getPosterPath() != null ? imageBaseUrl + item.getPosterPath() : null;

        return new CatalogoExternoResponse(
                "TMDB",
                String.valueOf(item.getId()),
                item.getTituloFinal(),
                tipoContenido,
                item.getOverview(),
                item.getFechaFinal(),
                obtenerAnio(item.getFechaFinal()),
                posterUrl,
                item.getOriginalLanguage(),
                item.getVoteAverage()
        );
    }

    private Integer obtenerAnio(String fecha) {
        if (fecha == null || fecha.length() < 4) {
            return null;
        }

        try {
            return Integer.parseInt(fecha.substring(0, 4));
        } catch (NumberFormatException e) {
            return null;
        }
    }
}